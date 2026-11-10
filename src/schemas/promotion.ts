import { z } from 'zod';

export const ValidatePromoSchema = z.object({
  code: z.string().trim().min(1, 'Vui lòng nhập mã giảm giá'),
  total_amount: z.number().positive('Tổng tiền phải lớn hơn 0'),
  payment_method: z.string().optional(),
});

export type ValidatePromoInput = z.infer<typeof ValidatePromoSchema>;
