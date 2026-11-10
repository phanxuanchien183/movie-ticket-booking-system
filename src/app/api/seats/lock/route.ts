import { NextRequest, NextResponse } from 'next/server';
import { LockSeatsSchema } from '@/schemas/seat';
import { seatLockService } from '@/services/seat-lock.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LockSeatsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { showtime_id, seat_ids, user_id } = parsed.data;

    const result = await seatLockService.lockSeats(showtime_id, seat_ids, user_id);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          failed_seat: result.failedSeat,
        },
        { status: 409 } // Conflict
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã khóa ${result.lockedSeats.length} ghế thành công trong 5 phút`,
      data: {
        showtime_id,
        locked_seats: result.lockedSeats,
        user_id,
        ttl_seconds: 300,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
