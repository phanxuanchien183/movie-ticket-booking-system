import { z } from 'zod';

export const LockSeatsSchema = z.object({
  showtime_id: z.number().int().positive('ID suất chiếu không hợp lệ'),
  seat_ids: z.array(z.string().min(1)).min(1, 'Vui lòng chọn ít nhất 1 ghế'),
  user_id: z.number().int().positive('ID người dùng không hợp lệ').default(1),
});

export const ReleaseSeatsSchema = z.object({
  showtime_id: z.number().int().positive('ID suất chiếu không hợp lệ'),
  seat_ids: z.array(z.string().min(1)).min(1, 'Vui lòng chọn ít nhất 1 ghế'),
  user_id: z.number().int().positive().default(1),
});

export type LockSeatsInput = z.infer<typeof LockSeatsSchema>;
export type ReleaseSeatsInput = z.infer<typeof ReleaseSeatsSchema>;
