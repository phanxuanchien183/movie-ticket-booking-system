import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seatLockService } from '@/services/seat-lock.service';
import { calculateSeatView } from '@/lib/seat-view-engine';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const showtimeId = Number(id);

    if (isNaN(showtimeId)) {
      return NextResponse.json({ success: false, error: 'ID suất chiếu không hợp lệ' }, { status: 400 });
    }

    const showtime = await db.getShowtimeById(showtimeId);
    if (!showtime) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy suất chiếu' }, { status: 404 });
    }

    // Lấy thông tin phòng và danh sách ghế
    const room = showtime.room || {
      room_id: showtime.room_id,
      room_name: 'Phòng chiếu tiêu chuẩn',
      total_rows: 8,
      seats_per_row: 12,
      screen_width: 12.0,
      screen_height: 6.5,
      distance_to_row_a: 4.5,
    };

    const seats = await db.getSeatsByRoom(showtime.room_id);
    const bookedSeatIds = await db.getBookedSeatIds(showtimeId);
    const lockedSeatsMap = await seatLockService.getLockedSeats(showtimeId);
    const pricingRules = await db.getPricingRules();

    // Map giá theo loại ghế và cuối tuần
    const isWeekend = showtime.is_weekend_or_holiday;
    const priceMap = new Map<string, number>();
    for (const rule of pricingRules) {
      if (rule.is_weekend === isWeekend) {
        priceMap.set(rule.seat_type, Number(rule.price));
      }
    }

    // Gộp trạng thái và bổ sung Seat View Engine
    const enrichedSeats = seats.map((seat) => {
      let status: 'available' | 'locked' | 'booked' = 'available';
      let lockedByUser: string | null = null;
      let lockExpiresIn: number | null = null;

      if (bookedSeatIds.includes(seat.seat_id)) {
        status = 'booked';
      } else if (lockedSeatsMap.has(seat.seat_id)) {
        status = 'locked';
        const lockInfo = lockedSeatsMap.get(seat.seat_id)!;
        lockedByUser = lockInfo.userId;
        lockExpiresIn = lockInfo.expiresInSeconds;
      }

      const price = priceMap.get(seat.seat_type) || 90000;
      const viewMetrics = calculateSeatView(
        seat.seat_id,
        seat.coord_x,
        seat.coord_y,
        seat.coord_z,
        room.screen_width,
        room.screen_height
      );

      return {
        ...seat,
        status,
        locked_by_user: lockedByUser,
        lock_expires_in: lockExpiresIn,
        price,
        view_metrics: viewMetrics,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        showtime,
        room,
        seats: enrichedSeats,
        total_seats: enrichedSeats.length,
        available_count: enrichedSeats.filter((s) => s.status === 'available').length,
        locked_count: enrichedSeats.filter((s) => s.status === 'locked').length,
        booked_count: enrichedSeats.filter((s) => s.status === 'booked').length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
