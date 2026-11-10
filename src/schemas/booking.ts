import { z } from 'zod';

export const CheckoutSchema = z.object({
  showtime_id: z.number().int().positive('ID suất chiếu không hợp lệ'),
  seat_ids: z.array(z.string().min(1)).min(1, 'Cần chọn ít nhất 1 ghế để thanh toán'),
  user_id: z.number().int().positive().default(1),
  customer_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  customer_email: z.string().email('Email không đúng định dạng'),
  customer_phone: z.string().min(8, 'Số điện thoại không hợp lệ'),
  promo_code: z.string().optional(),
  payment_method: z.string().min(1, 'Vui lòng chọn phương thức thanh toán'),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
