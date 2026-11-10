import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const movieId = Number(id);

    if (isNaN(movieId)) {
      return NextResponse.json({ success: false, error: 'ID sự kiện không hợp lệ' }, { status: 400 });
    }

    const movies = await db.getMovies();
    const movie = movies.find((m) => m.event_id === movieId || m.movie_id === movieId);
    if (!movie) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy sự kiện' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: movie });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

