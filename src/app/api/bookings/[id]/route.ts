import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const booking = await db.getBookingById(id);

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy thông tin đơn vé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
