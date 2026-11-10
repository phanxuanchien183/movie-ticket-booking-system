import { NextRequest, NextResponse } from 'next/server';
import { CheckoutSchema } from '@/schemas/booking';
import { db } from '@/lib/db';
import { promotionService } from '@/services/promotion.service';
import { seatLockService } from '@/services/seat-lock.service';
import { Booking } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu đơn hàng không hợp lệ' },
        { status: 400 }
      );
    }

    const {
      showtime_id,
      seat_ids,
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      promo_code,
      payment_method,
    } = parsed.data;

    // 1. Kiểm tra suất chiếu
    const showtime = await db.getShowtimeById(showtime_id);
    if (!showtime) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy suất chiếu' }, { status: 404 });
    }

    // 2. Lấy giá ghế
    const roomSeats = await db.getSeatsByRoom(showtime.room_id);
    const pricingRules = await db.getPricingRules();
    const isWeekend = showtime.is_weekend_or_holiday;

    const priceMap = new Map<string, number>();
    for (const rule of pricingRules) {
      if (rule.is_weekend === isWeekend) {
        priceMap.set(rule.seat_type, Number(rule.price));
      }
    }

    const seatDetails: { seat_id: string; price: number; type: string }[] = [];
    let totalAmount = 0;

    for (const seatId of seat_ids) {
      const seatObj = roomSeats.find((s) => s.seat_id === seatId);
      if (!seatObj) {
        return NextResponse.json({ success: false, error: `Ghế ${seatId} không tồn tại trong phòng chiếu` }, { status: 400 });
      }
      const price = priceMap.get(seatObj.seat_type) || 90000;
      seatDetails.push({ seat_id: seatId, price, type: seatObj.seat_type });
      totalAmount += price;
    }

    // 3. Xử lý mã giảm giá (nếu có)
    let discountAmount = 0;
    let finalAmount = totalAmount;
    let appliedPromoId: number | null = null;

    if (promo_code && promo_code.trim()) {
      const promoResult = await promotionService.validate(
        promo_code.trim(),
        totalAmount,
        payment_method
      );

      if (!promoResult.valid) {
        return NextResponse.json(
          {
            success: false,
            error: promoResult.message,
            error_code: promoResult.errorCode,
          },
          { status: 400 }
        );
      }

      discountAmount = promoResult.discountAmount;
      finalAmount = promoResult.finalAmount;
      appliedPromoId = promoResult.promotion?.promo_id || null;
    }

    // 4. Tạo mã đơn hàng duy nhất & QR code
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const bookingId = `BK-${Date.now().toString().slice(-6)}-${randomHex}`;
    const qrCode = `TICKET:${bookingId}:ST${showtime_id}:${seat_ids.join(',')}`;

    const newBooking: Booking = {
      booking_id: bookingId,
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      showtime_id,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      promo_id: appliedPromoId,
      promo_code: promo_code || null,
      payment_method,
      payment_status: 'Paid',
      qr_code: qrCode,
      created_at: new Date().toISOString(),
      movie_title: showtime.movie?.title,
      room_name: showtime.room?.room_name,
      start_time: showtime.start_time,
    };

    // 5. Lưu đơn hàng vào DB qua Transaction
    await db.createBooking(
      newBooking,
      seatDetails.map((s) => ({ seat_id: s.seat_id, price: s.price }))
    );

    // 6. Xóa Redis lock sau khi thanh toán thành công
    await seatLockService.releaseSeats(showtime_id, seat_ids, user_id);

    return NextResponse.json({
      success: true,
      message: 'Đặt vé và thanh toán thành công!',
      data: {
        booking: newBooking,
        seats: seatDetails,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
