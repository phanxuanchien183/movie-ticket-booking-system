import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SeatMap } from '../SeatMap';
import { Seat } from '@/types';

describe('SeatMap Component (Seat Statuses & Selection)', () => {
  const mockSeats: Seat[] = [
    {
      seat_id: 'R1-A01',
      room_id: 1,
      row_name: 'A',
      seat_number: 1,
      seat_type: 'Standard',
      coord_x: 1.0,
      coord_y: 4.5,
      coord_z: 0.0,
      status: 'available',
      price: 90000,
    },
    {
      seat_id: 'R1-A02',
      room_id: 1,
      row_name: 'A',
      seat_number: 2,
      seat_type: 'Standard',
      coord_x: 1.8,
      coord_y: 4.5,
      coord_z: 0.0,
      status: 'locked',
      locked_by_user: 'other_guest_999', // người khác đang khóa
      price: 90000,
    },
    {
      seat_id: 'R1-A03',
      room_id: 1,
      row_name: 'A',
      seat_number: 3,
      seat_type: 'Standard',
      coord_x: 2.6,
      coord_y: 4.5,
      coord_z: 0.0,
      status: 'booked', // đã bán
      price: 90000,
    },
  ];

  it('Ghế khả dụng (available) có thể click chọn', () => {
    const handleToggle = vi.fn();
    const handleOpenView = vi.fn();

    render(
      <SeatMap
        seats={mockSeats}
        selectedSeatIds={[]}
        currentUserId="my_guest_session"
        onToggleSeat={handleToggle}
        onOpenSeatView={handleOpenView}
      />
    );

    const seat1 = screen.getByText('1').closest('button');
    expect(seat1).toBeDefined();
    expect(seat1?.disabled).toBe(false);

    fireEvent.click(seat1!);
    expect(handleToggle).toHaveBeenCalledWith(mockSeats[0]);
  });

  it('Ghế đang có người khác giữ chỗ (locked) hoặc đã bán (booked) sẽ bị disabled', () => {
    const handleToggle = vi.fn();
    const handleOpenView = vi.fn();

    render(
      <SeatMap
        seats={mockSeats}
        selectedSeatIds={[]}
        currentUserId="my_guest_session"
        onToggleSeat={handleToggle}
        onOpenSeatView={handleOpenView}
      />
    );

    // Ghế A03 đã bán (status: booked)
    const bookedSeat = screen.getByTitle('Ghế R1-A03 (Đã bán)');
    expect(bookedSeat).toBeDefined();
    expect((bookedSeat as HTMLButtonElement).disabled).toBe(true);

    // Ghế A02 đang bị người khác giữ (status: locked)
    const lockedSeat = screen.getByTitle('Ghế R1-A02 (Đang có người giữ chỗ)');
    expect(lockedSeat).toBeDefined();
    expect((lockedSeat as HTMLButtonElement).disabled).toBe(true);

    // Click vào ghế đã bán không gọi handler
    fireEvent.click(bookedSeat);
    expect(handleToggle).not.toHaveBeenCalled();
  });

  it('Hiển thị sân khấu hòa nhạc khi isConcert = true và màn hình rạp khi isConcert = false', () => {
    const handleToggle = vi.fn();
    const handleOpenView = vi.fn();

    const { rerender } = render(
      <SeatMap
        seats={mockSeats}
        selectedSeatIds={[]}
        currentUserId="test_guest"
        isConcert={true}
        onToggleSeat={handleToggle}
        onOpenSeatView={handleOpenView}
      />
    );

    expect(screen.getByText('★ SÂN KHẤU CHÍNH (MAIN STAGE) ★')).toBeDefined();

    rerender(
      <SeatMap
        seats={mockSeats}
        selectedSeatIds={[]}
        currentUserId="test_guest"
        isConcert={false}
        onToggleSeat={handleToggle}
        onOpenSeatView={handleOpenView}
      />
    );

    expect(screen.getByText('Màn Hình Chiếu Rạp')).toBeDefined();
  });
});
