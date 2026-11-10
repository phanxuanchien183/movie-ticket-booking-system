import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const movieIdParam = searchParams.get('movieId');
    const movieId = movieIdParam ? Number(movieIdParam) : undefined;
    const venueIdParam = searchParams.get('venueId');
    const venueId = venueIdParam ? Number(venueIdParam) : undefined;

    const showtimes = await db.getShowtimes(movieId, venueId);
    return NextResponse.json({ success: true, data: showtimes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
