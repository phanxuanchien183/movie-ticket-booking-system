import { describe, it, expect } from 'vitest';
import { promotionService } from '../promotion.service';

describe('PromotionService (Bank Binding & Discount Logic)', () => {
  it('Mã ACB50: Thanh toán đúng thẻ ACB_CREDIT -> Áp dụng thành công giảm 50%', async () => {
    const result = await promotionService.validate('ACB50', 200000, 'ACB_CREDIT');
    expect(result.valid).toBe(true);
    // 50% của 200k là 100k (bằng trần max_discount_amount 100k)
    expect(result.discountAmount).toBe(100000);
    expect(result.finalAmount).toBe(100000);
  });

  it('Mã ACB50: Thanh toán qua MOMO_WALLET -> Bị từ chối INVALID_BANK_PAYMENT_METHOD', async () => {
    const result = await promotionService.validate('ACB50', 200000, 'MOMO_WALLET');
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe('INVALID_BANK_PAYMENT_METHOD');
    expect(result.discountAmount).toBe(0);
    expect(result.finalAmount).toBe(200000);
    expect(result.message).toContain('ACB');
  });

  it('Mã ACB50: Thanh toán qua ACB_QR -> Hợp lệ', async () => {
    const result = await promotionService.validate('ACB50', 160000, 'ACB_QR');
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(80000); // 50% của 160k
    expect(result.finalAmount).toBe(80000);
  });

  it('Mã ACB50: Chặn trần tối đa 100.000 VNĐ khi đơn hàng lớn', async () => {
    const result = await promotionService.validate('ACB50', 500000, 'ACB_CREDIT');
    expect(result.valid).toBe(true);
    // 50% của 500k là 250k nhưng bị chặn trần max 100k
    expect(result.discountAmount).toBe(100000);
    expect(result.finalAmount).toBe(400000);
  });

  it('Đơn hàng không đạt giá trị tối thiểu (min_order_value) -> Bị từ chối MIN_ORDER_NOT_MET', async () => {
    // ACB50 yêu cầu đơn tối thiểu 150.000 VNĐ
    const result = await promotionService.validate('ACB50', 100000, 'ACB_CREDIT');
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe('MIN_ORDER_NOT_MET');
  });

  it('Mã không tồn tại trong hệ thống -> Báo lỗi PROMO_NOT_FOUND', async () => {
    const result = await promotionService.validate('MA_KHONG_TON_TAI_999', 200000);
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe('PROMO_NOT_FOUND');
  });

  it('Mã CINEMA20 không ràng buộc ngân hàng -> Dùng được với mọi cổng thanh toán', async () => {
    const resMomo = await promotionService.validate('CINEMA20', 200000, 'MOMO_WALLET');
    expect(resMomo.valid).toBe(true);
    expect(resMomo.discountAmount).toBe(40000); // 20% của 200k

    const resVnpay = await promotionService.validate('CINEMA20', 200000, 'VNPAY_QR');
    expect(resVnpay.valid).toBe(true);
  });
});
