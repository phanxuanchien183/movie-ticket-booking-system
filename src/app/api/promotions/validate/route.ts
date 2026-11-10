import { NextRequest, NextResponse } from 'next/server';
import { ValidatePromoSchema } from '@/schemas/promotion';
import { promotionService } from '@/services/promotion.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ValidatePromoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { code, total_amount, payment_method } = parsed.data;
    const result = await promotionService.validate(code, total_amount, payment_method);

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          error_code: result.errorCode,
          message: result.message,
          data: {
            discount_amount: 0,
            final_amount: total_amount,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        promotion: result.promotion,
        discount_amount: result.discountAmount,
        final_amount: result.finalAmount,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
