import { NextRequest, NextResponse } from 'next/server';
import { ReleaseSeatsSchema } from '@/schemas/seat';
import { seatLockService } from '@/services/seat-lock.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ReleaseSeatsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { showtime_id, seat_ids, user_id } = parsed.data;
    await seatLockService.releaseSeats(showtime_id, seat_ids, user_id);

    return NextResponse.json({
      success: true,
      message: 'Đã giải phóng ghế thành công',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
