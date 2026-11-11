import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import MovieDetailPage from '../[id]/page';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
  }),
}));

describe('MovieDetailPage Route Component (/movies/[id])', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockMovie = {
    movie_id: 1,
    event_id: 1,
    title: 'Dune: Hành Tinh Cát 2',
    category: 'movie',
    category_label: 'Phim Chiếu Rạp',
    duration_minutes: 166,
    poster_url: 'https://images.unsplash.com/photo-1.jpg',
    description: 'Hành trình trả thù và bảo vệ tương lai Arrakis của Paul Atreides.',
    price_from: 90000,
    rating_score: '4.9/5 Khán Giả',
    rating_imdb: '8.6/10 IMDb',
    status: 'NowShowing',
    venue_name: 'CGV Vincom Landmark 81',
    venue_address: 'Bình Thạnh, TP.HCM',
    city: 'TP. Hồ Chí Minh',
  };

  const mockShowtimes = [
    {
      showtime_id: 1,
      movie_id: 1,
      room_id: 1,
      start_time: '2026-11-15T20:00:00',
      end_time: '2026-11-15T22:45:00',
      format_type: 'Laser IMAX',
      room: {
        room_id: 1,
        room_name: 'Phòng 01 - Laser IMAX',
        venue: {
          venue_id: 1,
          venue_name: 'CGV Vincom Landmark 81',
          brand_name: 'CGV',
          city: 'TP.HCM',
        },
      },
    },
  ];

  it('Tải dữ liệu phim từ router /movies/[id] và hiển thị giao diện chi tiết rạp chiếu', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/movies/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockMovie }),
        });
      }

      if (url.includes('/api/showtimes')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockShowtimes }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      });
    });

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Tóm tắt nội dung phim')).toBeDefined();
      expect(
        screen.getByText('Hành trình trả thù và bảo vệ tương lai Arrakis của Paul Atreides.')
      ).toBeDefined();
    });

    // Chờ nút mua vé / vào sơ đồ ghế xuất hiện và click
    await waitFor(() => {
      expect(screen.getByText('Vào Sơ Đồ Rạp & Chọn Ghế Ngồi')).toBeDefined();
    });

    const proceedBtn = screen.getByText('Vào Sơ Đồ Rạp & Chọn Ghế Ngồi');
    fireEvent.click(proceedBtn);
    expect(mockPush).toHaveBeenCalledWith('/booking/1');
  });

  it('Tự động chuyển hướng sang /events/[id] nếu sự kiện được truy cập là concert', async () => {
    const concertData = {
      event_id: 101,
      movie_id: 101,
      title: 'Say Hi Concert',
      category: 'concert',
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: concertData }),
      })
    );

    render(<MovieDetailPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/events/1');
    });
  });
});
