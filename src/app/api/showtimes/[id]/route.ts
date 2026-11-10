import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    return NextResponse.json({ success: true, data: showtime });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

