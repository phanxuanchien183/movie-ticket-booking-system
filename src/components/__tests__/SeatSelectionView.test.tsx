import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SeatSelectionView } from '../SeatSelectionView';
import { EntertainmentEvent, Showtime, Seat } from '@/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

describe('SeatSelectionView Component (Dedicated Seat & Stage Map Selection Screen)', () => {
  const mockConcertEvent: EntertainmentEvent = {
    event_id: 101,
    movie_id: 101,
    title: 'Tinh Hà "Say Hi" Concert - Đêm 4',
    category: 'concert',
    category_label: 'Live Concert',
    duration_minutes: 240,
    poster_url: 'https://images.unsplash.com/photo-1.jpg',
    status: 'SellingFast',
    venue_name: 'Trung tâm triển lãm Việt Nam (VEC)',
    venue_address: 'Cổ Loa, Đông Anh, Hà Nội',
    city: 'Hà Nội',
    price_from: 800000,
    event_dates: '19:00 - 23:00, 15 Tháng 11, 2026',
  };

  const mockConcertShowtime: Showtime = {
    showtime_id: 101,
    movie_id: 101,
    room_id: 12,
    start_time: '2026-11-15T19:00:00',
    end_time: '2026-11-15T23:00:00',
    format_type: 'Mega Arena VEC',
    is_weekend_or_holiday: true,
    room: {
      room_id: 12,
      room_name: 'Mega Arena VEC - Sân Khấu Chữ T 360°',
      total_rows: 10,
      seats_per_row: 20,
      screen_width: 30,
      screen_height: 12,
      distance_to_row_a: 5,
      is_concert_stage: true,
    },
  };

  const mockCinemaEvent: EntertainmentEvent = {
    event_id: 1,
    movie_id: 1,
    title: 'Dune: Hành Tinh Cát 2',
    category: 'movie',
    category_label: 'Phim Chiếu Rạp',
    duration_minutes: 166,
    poster_url: 'https://images.unsplash.com/photo-2.jpg',
    status: 'SellingFast',
    venue_name: 'CGV Vincom Landmark 81',
    venue_address: '772 Điện Biên Phủ, Q. Bình Thạnh',
    city: 'TP.HCM',
    price_from: 90000,
    event_dates: '20:00 • 15/11/2026',
  };

  const mockCinemaShowtime: Showtime = {
    showtime_id: 1,
    movie_id: 1,
    room_id: 1,
    start_time: '2026-11-15T20:00:00',
    end_time: '2026-11-15T22:45:00',
    format_type: 'IMAX Laser 3D',
    is_weekend_or_holiday: false,
    room: {
      room_id: 1,
      room_name: 'Phòng Chiếu IMAX 01',
      total_rows: 8,
      seats_per_row: 12,
      screen_width: 22,
      screen_height: 12,
      distance_to_row_a: 4.5,
      is_concert_stage: false,
    },
  };

  const mockCinemaSeats: Seat[] = [
    {
      seat_id: 'R1-F06',
      room_id: 1,
      row_name: 'F',
      seat_number: 6,
      seat_type: 'VIP',
      coord_x: 0.0,
      coord_y: 8.5,
      coord_z: 1.2,
      status: 'available',
      price: 150000,
    },
  ];

  it('Render sơ đồ concert Ticketbox (Hình 3) với khu vực STAGE, danh sách giá vé và nút trở về', () => {
    const handleBack = vi.fn();

    render(
      <SeatSelectionView
        event={mockConcertEvent}
        showtime={mockConcertShowtime}
        seats={[]}
        selectedSeatIds={[]}
        currentUserId="guest_test"
        onToggleSeat={vi.fn()}
        onOpenSeatView={vi.fn()}
        onRefreshSeats={vi.fn()}
        onBackToDetail={handleBack}
        onOpenCheckout={vi.fn()}
      />
    );

    expect(screen.getByText('Trở về')).toBeDefined();
    expect(screen.getByText('Chọn khu vực')).toBeDefined();
    expect(screen.getByText('Bấm vào khu vực để chọn vé')).toBeDefined();
    expect(screen.getAllByText('STAGE').length).toBeGreaterThan(0);
    expect(screen.getByText('Giá vé')).toBeDefined();
    expect(screen.getByText('Vui lòng chọn vé »')).toBeDefined();

    // Click nút Trở về
    const backBtn = screen.getByText('Trở về');
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalled();
  });

  it('Render sơ đồ rạp chiếu phim với danh sách ghế và nút thanh toán', () => {
    const handleBack = vi.fn();
    const handleCheckout = vi.fn();

    render(
      <SeatSelectionView
        event={mockCinemaEvent}
        showtime={mockCinemaShowtime}
        seats={mockCinemaSeats}
        selectedSeatIds={['R1-F06']}
        currentUserId="guest_test"
        onToggleSeat={vi.fn()}
        onOpenSeatView={vi.fn()}
        onRefreshSeats={vi.fn()}
        onBackToDetail={handleBack}
        onOpenCheckout={handleCheckout}
      />
    );

    expect(screen.getByText('Quay lại thông tin sự kiện')).toBeDefined();
    expect(screen.getByText('Chọn ghế rạp chiếu')).toBeDefined();
    expect(screen.getByText('Tiến Hành Thanh Toán')).toBeDefined();

    // Click nút thanh toán
    const checkoutBtn = screen.getByText('Tiến Hành Thanh Toán');
    fireEvent.click(checkoutBtn);
    expect(handleCheckout).toHaveBeenCalled();
  });
});
