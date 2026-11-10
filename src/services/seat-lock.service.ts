import { getRedisClient, memoryLockManager } from '@/lib/redis';
import { db } from '@/lib/db';

const LOCK_TTL_SECONDS = 300; // 5 phút

// Lua script giải phóng khóa nguyên tử (Atomic Check-and-Del chống race-condition)
const LUA_RELEASE_LOCK = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`;

export const seatLockService = {
  getLockKey(showtimeId: number, seatId: string): string {
    return `lock:showtime:${showtimeId}:seat:${seatId}`;
  },

  /**
   * Kiểm tra người dùng có còn giữ khóa hợp lệ trước khi checkout (Chống cướp ghế khi hết hạn 300s)
   */
  async verifyLockOwnership(
    showtimeId: number,
    seatIds: string[],
    userId: string
  ): Promise<{ valid: boolean; invalidSeat?: string }> {
    const redis = getRedisClient();
    if (redis) {
      try {
        for (const seatId of seatIds) {
          const key = this.getLockKey(showtimeId, seatId);
          const owner = await redis.get(key);
          if (owner && owner !== userId.toString()) {
            return { valid: false, invalidSeat: seatId };
          }
        }
        return { valid: true };
      } catch (e) {
        console.warn('[Redis] Lỗi verify lock ownership, fallback memory', e);
      }
    }

    for (const seatId of seatIds) {
      const key = this.getLockKey(showtimeId, seatId);
      const entry = memoryLockManager.get(key);
      if (entry && entry.userId !== userId.toString()) {
        return { valid: false, invalidSeat: seatId };
      }
    }

    return { valid: true };
  },

  /**
   * Khóa danh sách ghế qua Redis (hoặc Memory Fallback)
   * Sử dụng SET key value NX EX 300
   */
  async lockSeats(
    showtimeId: number,
    seatIds: string[],
    userId: string
  ): Promise<{ success: boolean; lockedSeats: string[]; failedSeat?: string; message?: string }> {
    // 1. Kiểm tra ghế đã bán trong DB chưa
    const bookedSeats = await db.getBookedSeatIds(showtimeId);
    for (const seatId of seatIds) {
      if (bookedSeats.includes(seatId)) {
        return {
          success: false,
          lockedSeats: [],
          failedSeat: seatId,
          message: `Ghế ${seatId} đã được bán, không thể chọn.`,
        };
      }
    }

    const redis = getRedisClient();
    const successfullyLocked: string[] = [];

    if (redis) {
      try {
        for (const seatId of seatIds) {
          const key = this.getLockKey(showtimeId, seatId);
          // SET key userId NX EX 300
          const res = await redis.set(key, userId.toString(), 'EX', LOCK_TTL_SECONDS, 'NX');

          if (res === 'OK') {
            successfullyLocked.push(seatId);
          } else {
            // Kiểm tra xem có phải chính user này đang giữ ghế không
            const currentOwner = await redis.get(key);
            if (currentOwner === userId.toString()) {
              // Refresh TTL 300s
              await redis.expire(key, LOCK_TTL_SECONDS);
              successfullyLocked.push(seatId);
            } else {
              // Bị tranh chấp -> Rollback các ghế đã lock trong đợt này
              for (const locked of successfullyLocked) {
                await redis.del(this.getLockKey(showtimeId, locked));
              }
              return {
                success: false,
                lockedSeats: [],
                failedSeat: seatId,
                message: `Ghế ${seatId} đang được người khác giữ chỗ. Vui lòng chọn ghế khác!`,
              };
            }
          }
        }

        return {
          success: true,
          lockedSeats: successfullyLocked,
        };
      } catch (err) {
        console.warn('[Redis] Lỗi Redis, chuyển sang Memory Fallback', err);
      }
    }

    // In-memory fallback
    for (const seatId of seatIds) {
      const key = this.getLockKey(showtimeId, seatId);
      const ok = memoryLockManager.setNX(key, userId, LOCK_TTL_SECONDS);
      if (ok) {
        successfullyLocked.push(seatId);
      } else {
        // Rollback
        for (const locked of successfullyLocked) {
          memoryLockManager.delete(this.getLockKey(showtimeId, locked), userId);
        }
        return {
          success: false,
          lockedSeats: [],
          failedSeat: seatId,
          message: `Ghế ${seatId} đang được người khác giữ chỗ. Vui lòng chọn ghế khác!`,
        };
      }
    }

    return {
      success: true,
      lockedSeats: successfullyLocked,
    };
  },

  /**
   * Giải phóng ghế đã khóa bằng Atomic Lua Script
   */
  async releaseSeats(showtimeId: number, seatIds: string[], userId: string): Promise<void> {
    const redis = getRedisClient();
    if (redis) {
      try {
        for (const seatId of seatIds) {
          const key = this.getLockKey(showtimeId, seatId);
          // Thực thi Lua Script nguyên tử: chỉ xóa nếu key đúng thuộc về userId
          await redis.eval(LUA_RELEASE_LOCK, 1, key, userId.toString());
        }
        return;
      } catch (e) {
        console.warn('[Redis] Lỗi giải phóng ghế Redis qua Lua Script', e);
      }
    }

    for (const seatId of seatIds) {
      const key = this.getLockKey(showtimeId, seatId);
      memoryLockManager.delete(key, userId.toString());
    }
  },

  /**
   * Lấy danh sách toàn bộ ghế đang bị khóa của suất chiếu bằng non-blocking SCAN
   */
  async getLockedSeats(
    showtimeId: number
  ): Promise<Map<string, { userId: string; expiresInSeconds: number }>> {
    const result = new Map<string, { userId: string; expiresInSeconds: number }>();
    const redis = getRedisClient();

    if (redis) {
      try {
        const pattern = `lock:showtime:${showtimeId}:seat:*`;
        // Sử dụng non-blocking SCAN thay vì blocking KEYS để bảo vệ hiệu năng Redis
        let cursor = '0';
        const keys: string[] = [];
        do {
          const [nextCursor, matchedKeys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
          cursor = nextCursor;
          keys.push(...matchedKeys);
        } while (cursor !== '0');

        for (const key of keys) {
          const seatId = key.split(':seat:')[1];
          const userId = await redis.get(key);
          const ttl = await redis.ttl(key);
          if (userId && ttl > 0) {
            result.set(seatId, {
              userId: userId,
              expiresInSeconds: ttl,
            });
          }
        }
        return result;
      } catch (e) {
        console.warn('[Redis] Lỗi lấy locked seats, dùng memory', e);
      }
    }

    const prefix = `lock:showtime:${showtimeId}:seat:`;
    const memLocks = memoryLockManager.getAllByPrefix(prefix);
    for (const [key, val] of memLocks.entries()) {
      const seatId = key.split(':seat:')[1];
      result.set(seatId, {
        userId: val.userId,
        expiresInSeconds: val.ttl,
      });
    }

    return result;
  },
};
