import { z } from 'zod';

export const LockSeatsSchema = z.object({
  showtime_id: z.number().int().positive('ID suất chiếu không hợp lệ'),
  seat_ids: z.array(z.string().min(1)).min(1, 'Vui lòng chọn ít nhất 1 ghế'),
  user_id: z.string().min(1, 'Mã phiên người dùng không hợp lệ'),
});

export const ReleaseSeatsSchema = z.object({
  showtime_id: z.number().int().positive('ID suất chiếu không hợp lệ'),
  seat_ids: z.array(z.string().min(1)).min(1, 'Vui lòng chọn ít nhất 1 ghế'),
  user_id: z.string().min(1, 'Mã phiên người dùng không hợp lệ'),
});

export type LockSeatsInput = z.infer<typeof LockSeatsSchema>;
export type ReleaseSeatsInput = z.infer<typeof ReleaseSeatsSchema>;
