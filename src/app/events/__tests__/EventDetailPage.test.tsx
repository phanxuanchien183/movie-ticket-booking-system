import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import EventDetailPage from '../[id]/page';

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  }),
  useParams: () => ({ id: '101' }),
}));

describe('EventDetailPage Route Component (/events/[id])', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockConcert = {
    event_id: 101,
    movie_id: 101,
    title: 'Tinh Hoa "Say Hi" Concert - Đêm 4',
    category: 'concert',
    category_label: 'Live Concert',
    artists: 'Anh Trai Say Hi',
    duration_minutes: 240,
    poster_url: 'https://images.unsplash.com/photo-2.jpg',
    genre: 'Pop, EDM',
    age_rating: 'T16',
    description: 'Đại nhạc hội bùng nổ của các anh trai Say Hi.',
    status: 'SellingFast',
    venue_name: 'Trung tâm Triển lãm Việt Nam (VEC)',
    venue_address: 'Cổ Loa, Đông Anh, Hà Nội',
    city: 'Hà Nội',
    price_from: 800000,
    event_dates: '19:00 - 23:00, 15 Tháng 11, 2026',
    rating_score: '5.0/5',
  };

  const mockShowtimes = [
    {
      showtime_id: 101,
      movie_id: 101,
      room_id: 12,
      start_time: '2026-11-15T19:00:00',
      end_time: '2026-11-15T23:00:00',
      format_type: 'Mega Arena VEC',
      room: {
        room_id: 12,
        room_name: 'Mega Arena VEC - Sân Khấu Chữ T 360°',
        venue: {
          venue_id: 12,
          venue_name: 'Trung tâm Triển lãm Việt Nam (VEC)',
          city: 'Hà Nội',
          address: 'Cổ Loa, Đông Anh, Hà Nội',
        },
      },
    },
  ];

  it('Tải dữ liệu concert từ router params và hiển thị thông tin sự kiện Ticketbox', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/movies/101')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockConcert }),
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
      expect(screen.getAllByText('Tinh Hoa "Say Hi" Concert - Đêm 4').length).toBeGreaterThan(0);
    });

    expect(screen.getByText('Thông tin vé & Các hạng vé mở bán')).toBeDefined();

    // Click nút quay lại trang chủ -> kiểm tra gọi router.push('/')
    const backBtn = screen.getByText('Quay lại trang chủ');
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith('/');

    // Click nút Mua vé ngay -> kiểm tra gọi router.push('/booking/101')
    const proceedBtn = screen.getAllByText('Mua vé ngay')[0];
    fireEvent.click(proceedBtn);
    expect(mockPush).toHaveBeenCalledWith('/booking/101');
  });

  it('Tự động chuyển hướng về /movies/[id] nếu sự kiện được truy cập là phim chiếu rạp', async () => {
    const mockMovie = {
      event_id: 1,
      movie_id: 1,
      title: 'Dune: Hành Tinh Cát 2',
      category: 'movie',
    };

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockMovie }),
      })
    ) as any;

    render(<EventDetailPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/movies/101');
    });
  });
});
