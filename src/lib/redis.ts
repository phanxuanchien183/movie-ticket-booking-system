import Redis from 'ioredis';

let redisClient: Redis | null = null;
let isRedisAvailable = false;

// Khởi tạo Redis client nếu cấu hình REDIS_URL hoặc REDIS_HOST
export function getRedisClient(): Redis | null {
  if (redisClient) return isRedisAvailable ? redisClient : null;

  const redisUrl = process.env.REDIS_URL;
  const host = process.env.REDIS_HOST || '127.0.0.1';
  const port = Number(process.env.REDIS_PORT || 6379);
  const password = process.env.REDIS_PASSWORD || undefined;

  try {
    const client = redisUrl
      ? new Redis(redisUrl, { maxRetriesPerRequest: 1, enableOfflineQueue: false })
      : new Redis({
          host,
          port,
          password,
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
          connectTimeout: 1000,
        });

    client.on('connect', () => {
      isRedisAvailable = true;
      console.log('[Redis] Kết nối thành công tới Redis Server');
    });

    client.on('error', (err) => {
      isRedisAvailable = false;
      // Tránh in log spam khi không chạy Redis
    });

    redisClient = client;
    return client;
  } catch (e) {
    isRedisAvailable = false;
    return null;
  }
}

// ========================================================
// IN-MEMORY TTL LOCK STORE (Tự động kích hoạt khi không có Redis)
// ========================================================

interface MemoryLockEntry {
  userId: number;
  expiresAt: number; // timestamp ms
}

class InMemoryLockManager {
  private locks: Map<string, MemoryLockEntry> = new Map();

  constructor() {
    // Dọn dẹp key hết hạn mỗi 5 giây
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.locks.entries()) {
        if (entry.expiresAt <= now) {
          this.locks.delete(key);
        }
      }
    }, 5000);
  }

  // Tương đương SET key value NX EX ttlSeconds
  setNX(key: string, userId: number, ttlSeconds: number): boolean {
    const now = Date.now();
    const existing = this.locks.get(key);

    if (existing && existing.expiresAt > now) {
      if (existing.userId === userId) {
        // Cùng user thì gia hạn
        this.locks.set(key, { userId, expiresAt: now + ttlSeconds * 1000 });
        return true;
      }
      return false; // Đã bị user khác khóa
    }

    this.locks.set(key, { userId, expiresAt: now + ttlSeconds * 1000 });
    return true;
  }

  get(key: string): { userId: number; ttl: number } | null {
    const now = Date.now();
    const existing = this.locks.get(key);
    if (!existing || existing.expiresAt <= now) {
      if (existing) this.locks.delete(key);
      return null;
    }
    return {
      userId: existing.userId,
      ttl: Math.max(0, Math.ceil((existing.expiresAt - now) / 1000)),
    };
  }

  delete(key: string, userId?: number): boolean {
    const existing = this.locks.get(key);
    if (!existing) return true;
    if (userId && existing.userId !== userId) return false;
    this.locks.delete(key);
    return true;
  }

  getAllByPrefix(prefix: string): Map<string, { userId: number; ttl: number }> {
    const now = Date.now();
    const result = new Map<string, { userId: number; ttl: number }>();
    for (const [k, v] of this.locks.entries()) {
      if (k.startsWith(prefix) && v.expiresAt > now) {
        result.set(k, {
          userId: v.userId,
          ttl: Math.max(0, Math.ceil((v.expiresAt - now) / 1000)),
        });
      }
    }
    return result;
  }
}

export const memoryLockManager = new InMemoryLockManager();
