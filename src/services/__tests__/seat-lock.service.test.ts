import { describe, it, expect, beforeEach } from 'vitest';
import { seatLockService } from '../seat-lock.service';
import { memoryLockManager } from '@/lib/redis';

describe('SeatLockService (High-Concurrency Seat Locking)', () => {
  const showtimeId = 999;
  const userA = 'guest_user_A';
  const userB = 'guest_user_B';

  beforeEach(() => {
    // Dọn dẹp key test
    memoryLockManager.delete(seatLockService.getLockKey(showtimeId, 'TEST-A01'));
    memoryLockManager.delete(seatLockService.getLockKey(showtimeId, 'TEST-A02'));
    memoryLockManager.delete(seatLockService.getLockKey(showtimeId, 'TEST-A03'));
  });

  it('Người dùng A khóa ghế thành công trong 5 phút (300s)', async () => {
    const result = await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userA);
    expect(result.success).toBe(true);
    expect(result.lockedSeats).toContain('TEST-A01');

    const locks = await seatLockService.getLockedSeats(showtimeId);
    expect(locks.has('TEST-A01')).toBe(true);
    expect(locks.get('TEST-A01')?.userId).toBe(userA);
    expect(locks.get('TEST-A01')?.expiresInSeconds).toBeGreaterThan(0);
  });

  it('Người dùng B chọn cùng ghế đã bị A giữ -> Bị từ chối ngay lập tức', async () => {
    // A khóa ghế trước
    await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userA);

    // B cố tình chọn ghế TEST-A01
    const resultB = await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userB);
    expect(resultB.success).toBe(false);
    expect(resultB.failedSeat).toBe('TEST-A01');
    expect(resultB.message).toContain('đang được người khác giữ chỗ');
  });

  it('Cùng người dùng A re-lock ghế của chính mình -> Được phép và gia hạn TTL', async () => {
    await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userA);
    const resultA2 = await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userA);
    expect(resultA2.success).toBe(true);
    expect(resultA2.lockedSeats).toContain('TEST-A01');
  });

  it('Người dùng A hủy chọn ghế -> Ghế trở lại tự do cho người B chọn', async () => {
    await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userA);
    await seatLockService.releaseSeats(showtimeId, ['TEST-A01'], userA);

    const locks = await seatLockService.getLockedSeats(showtimeId);
    expect(locks.has('TEST-A01')).toBe(false);

    // Giờ B có thể khóa được
    const resultB = await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userB);
    expect(resultB.success).toBe(true);
  });

  it('Cơ chế Rollback theo lô: Nếu 1 ghế trong lô bị tranh chấp, rollback tất cả ghế đã chọn trước đó', async () => {
    // Ghế A02 đã bị B giữ
    await seatLockService.lockSeats(showtimeId, ['TEST-A02'], userB);

    // A cố tình đặt cả A01 và A02
    const resultA = await seatLockService.lockSeats(showtimeId, ['TEST-A01', 'TEST-A02'], userA);
    expect(resultA.success).toBe(false);
    expect(resultA.failedSeat).toBe('TEST-A02');

    // Ghế A01 phải được rollback giải phóng
    const locks = await seatLockService.getLockedSeats(showtimeId);
    expect(locks.has('TEST-A01')).toBe(false);
  });

  it('verifyLockOwnership phát hiện chính xác khi ghế bị người khác cướp sau khi hết hạn TTL', async () => {
    // A khóa ghế A01
    await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userA);

    // Xác minh A vẫn giữ ghế -> valid
    const checkA = await seatLockService.verifyLockOwnership(showtimeId, ['TEST-A01'], userA);
    expect(checkA.valid).toBe(true);

    // Giả lập key của A bị hết hạn và B khóa ghế A01
    memoryLockManager.delete(seatLockService.getLockKey(showtimeId, 'TEST-A01'));
    await seatLockService.lockSeats(showtimeId, ['TEST-A01'], userB);

    // Lúc này A cố checkout -> verify phát hiện không còn thuộc sở hữu của A
    const checkAFailed = await seatLockService.verifyLockOwnership(showtimeId, ['TEST-A01'], userA);
    expect(checkAFailed.valid).toBe(false);
    expect(checkAFailed.invalidSeat).toBe('TEST-A01');
  });
});

