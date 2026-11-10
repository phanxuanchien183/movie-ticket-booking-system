import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SeatSelectionView } from '../SeatSelectionView';
import { EntertainmentEvent, Showtime, Seat } from '@/types';

describe('SeatSelectionView Component (Dedicated Seat & Stage Map Selection Screen)', () => {
  const mockEvent: EntertainmentEvent = {
    event_id: 101,
    movie_id: 101,
    title: 'Anh Trai Say Hi Live Concert 2026',
    category: 'concert',
    category_label: 'Live Concert',
    duration_minutes: 210,
    poster_url: 'https://images.unsplash.com/photo-1.jpg',
    status: 'SellingFast',
    venue_name: 'Nhà Thi Đấu Quân Khu 7',
    venue_address: '202 Hoàng Văn Thụ, Q. Phú Nhuận',
    city: 'TP.HCM',
    price_from: 800000,
    event_dates: '19:30 • 15/11/2026',
  };

  const mockShowtime: Showtime = {
    showtime_id: 101,
    movie_id: 101,
    room_id: 2,
    start_time: '2026-11-15T19:30:00',
    end_time: '2026-11-15T23:00:00',
    format_type: 'Live Arena 360°',
    is_weekend_or_holiday: true,
    room: {
      room_id: 2,
      room_name: 'Sân Khấu Chính - Nhà Thi Đấu QK7',
      total_rows: 8,
      seats_per_row: 12,
      screen_width: 16,
      screen_height: 8,
      distance_to_row_a: 4.5,
      is_concert_stage: true,
    },
  };

  const mockSeats: Seat[] = [
    {
      seat_id: 'R2-A01',
      room_id: 2,
      row_name: 'A',
      seat_number: 1,
      seat_type: 'VVIP_Stage',
      coord_x: 1.0,
      coord_y: 4.5,
      coord_z: 0.0,
      status: 'available',
      price: 2500000,
    },
  ];

  it('Render tóm tắt sự kiện, sơ đồ sân khấu và nút quay lại', () => {
    const handleBack = vi.fn();
    const handleOpenCheckout = vi.fn();

    render(
      <SeatSelectionView
        event={mockEvent}
        showtime={mockShowtime}
        seats={mockSeats}
        selectedSeatIds={['R2-A01']}
        currentUserId="guest_test"
        onToggleSeat={vi.fn()}
        onOpenSeatView={vi.fn()}
        onRefreshSeats={vi.fn()}
        onBackToDetail={handleBack}
        onOpenCheckout={handleOpenCheckout}
      />
    );

    expect(screen.getByText('Quay lại thông tin sự kiện')).toBeDefined();
    expect(screen.getAllByText('Anh Trai Say Hi Live Concert 2026').length).toBeGreaterThan(0);
    expect(screen.getByText('Tiến Hành Thanh Toán')).toBeDefined();

    // Click nút quay lại
    const backBtn = screen.getByText('Quay lại thông tin sự kiện');
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalled();

    // Click thanh toán
    const checkoutBtn = screen.getByText('Tiến Hành Thanh Toán');
    fireEvent.click(checkoutBtn);
    expect(handleOpenCheckout).toHaveBeenCalled();
  });
});
