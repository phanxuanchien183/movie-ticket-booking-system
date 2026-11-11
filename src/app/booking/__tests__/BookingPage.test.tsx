import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import BookingPage from '../[showtimeId]/page';

const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  useParams: () => ({ showtimeId: '1' }),
}));

describe('BookingPage Route Component (/booking/[showtimeId])', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockShowtime = {
    showtime_id: 1,
    movie_id: 1,
    room_id: 1,
    start_time: '2026-11-11T19:30:00',
    end_time: '2026-11-11T22:15:00',
    format_type: 'CGV IMAX Laser 2D',
    is_weekend_or_holiday: false,
    movie: {
      event_id: 1,
      movie_id: 1,
      title: 'Dune: Hành Tinh Cát 2',
      category: 'movie',
      category_label: 'Phim Chiếu Rạp',
      duration_minutes: 166,
      poster_url: 'https://images.unsplash.com/photo-2.jpg',
      price_from: 110000,
    },
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
  };

  const mockSeats = [
    {
      seat_id: 'R1-A01',
      room_id: 1,
      row_name: 'A',
      seat_number: 1,
      seat_type: 'Standard',
      coord_x: 1.4,
      coord_y: 4.5,
      coord_z: 0,
      price: 90000,
      status: 'available',
    },
    {
      seat_id: 'R1-A02',
      room_id: 1,
      row_name: 'A',
      seat_number: 2,
      seat_type: 'Standard',
      coord_x: 2.3,
      coord_y: 4.5,
      coord_z: 0,
      price: 90000,
      status: 'available',
    },
  ];

  it('Tải dữ liệu suất chiếu và sơ đồ ghế, hỗ trợ router back về màn hình chi tiết sự kiện', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/showtimes/1/seats')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: { seats: mockSeats } }),
        });
      }
      if (url.includes('/api/showtimes/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockShowtime }),
        });
      }
      return Promise.reject(new Error('URL không hỗ trợ'));
    }) as any;

    render(<BookingPage />);

    // Đợi tải xong sơ đồ ghế
    await waitFor(() => {
      expect(screen.getByText('Dune: Hành Tinh Cát 2')).toBeDefined();
    });

    // Kiểm tra nút quay lại màn hình chi tiết gọi router.push('/movies/1')
    const backBtn = screen.getByText('Quay lại thông tin sự kiện');
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith('/movies/1');
  });
});
