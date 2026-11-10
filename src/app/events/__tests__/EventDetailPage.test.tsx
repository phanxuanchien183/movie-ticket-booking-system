import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import EventDetailPage from '../[id]/page';

const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  useParams: () => ({ id: '1' }),
}));

describe('EventDetailPage Route Component (/events/[id])', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockMovie = {
    event_id: 1,
    movie_id: 1,
    title: 'Dune: Hành Tinh Cát 2',
    category: 'movie',
    category_label: 'Phim Chiếu Rạp',
    artists: 'Timothée Chalamet, Zendaya',
    duration_minutes: 166,
    poster_url: 'https://images.unsplash.com/photo-2.jpg',
    genre: 'Khoa học viễn tưởng',
    age_rating: 'T16',
    description: 'Cuộc chiến giành quyền kiểm soát Arrakis.',
    status: 'NowShowing',
    venue_name: 'CGV Vincom Landmark 81',
    venue_address: 'Bình Thạnh, TP.HCM',
    city: 'TP. Hồ Chí Minh',
    price_from: 110000,
    event_dates: 'Hằng ngày',
    rating_score: '4.9/5',
    director: 'Denis Villeneuve',
  };

  const mockShowtimes = [
    {
      showtime_id: 1,
      movie_id: 1,
      room_id: 1,
      start_time: '2026-11-11T19:30:00',
      end_time: '2026-11-11T22:15:00',
      format_type: 'CGV IMAX Laser 2D',
      is_weekend_or_holiday: false,
      room: {
        room_id: 1,
        room_name: 'Phòng Chiếu IMAX 01',
        total_rows: 8,
        seats_per_row: 12,
        screen_width: 14,
        screen_height: 7.5,
        distance_to_row_a: 4.5,
        venue: {
          venue_id: 1,
          venue_name: 'CGV Vincom Landmark 81',
          brand_name: 'CGV Cinemas',
          venue_type: 'cinema_chain',
          city: 'TP. Hồ Chí Minh',
          address: 'Tầng B1, TTTM Vincom Landmark 81',
        },
      },
    },
  ];

  it('Tải dữ liệu từ router params và hiển thị thông tin sự kiện', async () => {
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
      return Promise.reject(new Error('URL không hỗ trợ'));
    }) as any;

    render(<EventDetailPage />);

    // Đợi tải xong
    await waitFor(() => {
      expect(screen.getByText('Dune: Hành Tinh Cát 2')).toBeDefined();
    });

    expect(screen.getByText(/2\. Chọn Chi Nhánh Rạp Gần Bạn/i)).toBeDefined();

    // Click nút quay lại trang chủ -> kiểm tra gọi router.push('/')
    const backBtn = screen.getByText('Quay lại trang chủ');
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith('/');

    // Click nút vào sơ đồ rạp & chọn ghế -> kiểm tra gọi router.push('/booking/1')
    const proceedBtn = screen.getByText('Vào Sơ Đồ Rạp & Chọn Ghế Ngồi');
    fireEvent.click(proceedBtn);
    expect(mockPush).toHaveBeenCalledWith('/booking/1');
  });
});
