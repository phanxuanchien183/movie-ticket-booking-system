import { db } from '@/lib/db';
import { Promotion } from '@/types';

export interface PromotionValidationResult {
  valid: boolean;
  promotion?: Promotion;
  discountAmount: number;
  finalAmount: number;
  errorCode?:
    | 'PROMO_NOT_FOUND'
    | 'PROMO_EXPIRED'
    | 'PROMO_NOT_STARTED'
    | 'USAGE_LIMIT_EXCEEDED'
    | 'MIN_ORDER_NOT_MET'
    | 'INVALID_BANK_PAYMENT_METHOD';
  message: string;
}

export const promotionService = {
  /**
   * Xác thực mã giảm giá và áp dụng ràng buộc thanh toán ngân hàng nghiêm ngặt
   */
  async validate(
    code: string,
    totalAmount: number,
    paymentMethod?: string
  ): Promise<PromotionValidationResult> {
    const promo = await db.getPromotionByCode(code);

    if (!promo) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: totalAmount,
        errorCode: 'PROMO_NOT_FOUND',
        message: `Mã giảm giá "${code}" không tồn tại trong hệ thống.`,
      };
    }

    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);

    if (now < startDate) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: totalAmount,
        errorCode: 'PROMO_NOT_STARTED',
        message: `Chương trình khuyến mãi "${promo.title}" chưa bắt đầu.`,
      };
    }

    if (now > endDate) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: totalAmount,
        errorCode: 'PROMO_EXPIRED',
        message: `Mã giảm giá đã hết hạn sử dụng.`,
      };
    }

    if (promo.used_count >= promo.usage_limit) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: totalAmount,
        errorCode: 'USAGE_LIMIT_EXCEEDED',
        message: `Mã giảm giá đã hết số lượt sử dụng tối đa (${promo.usage_limit} lượt).`,
      };
    }

    if (totalAmount < promo.min_order_value) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: totalAmount,
        errorCode: 'MIN_ORDER_NOT_MET',
        message: `Đơn hàng tối thiểu để áp dụng mã là ${promo.min_order_value.toLocaleString('vi-VN')} VNĐ.`,
      };
    }

    // ==========================================
    // BANK BINDING CHECK (RÀNG BUỘC NGÂN HÀNG)
    // ==========================================
    if (promo.bank_code) {
      if (!paymentMethod) {
        return {
          valid: false,
          discountAmount: 0,
          finalAmount: totalAmount,
          errorCode: 'INVALID_BANK_PAYMENT_METHOD',
          message: `Mã giảm giá yêu cầu chọn phương thức thanh toán của ngân hàng ${promo.bank_code}.`,
        };
      }

      const methodUpper = paymentMethod.toUpperCase();
      const bankCodeUpper = promo.bank_code.toUpperCase();

      if (!methodUpper.includes(bankCodeUpper)) {
        return {
          valid: false,
          discountAmount: 0,
          finalAmount: totalAmount,
          errorCode: 'INVALID_BANK_PAYMENT_METHOD',
          message: `Mã giảm giá "${promo.code}" chỉ áp dụng cho hình thức thanh toán qua ngân hàng ${promo.bank_code} (VD: ${promo.bank_code}_CREDIT, ${promo.bank_code}_QR). Phương thức hiện tại "${paymentMethod}" không hợp lệ.`,
        };
      }
    }

    // Tính toán số tiền giảm
    let discount = 0;
    if (promo.discount_type === 'Percentage') {
      discount = totalAmount * (promo.discount_value / 100);
      if (promo.max_discount_amount && discount > promo.max_discount_amount) {
        discount = promo.max_discount_amount;
      }
    } else if (promo.discount_type === 'FixedAmount') {
      discount = Math.min(promo.discount_value, totalAmount);
    }

    discount = Math.round(discount);
    const finalAmount = Math.max(0, totalAmount - discount);

    return {
      valid: true,
      promotion: promo,
      discountAmount: discount,
      finalAmount,
      message: `Áp dụng thành công "${promo.title}". Bạn được giảm ${discount.toLocaleString('vi-VN')} VNĐ!`,
    };
  },
};
