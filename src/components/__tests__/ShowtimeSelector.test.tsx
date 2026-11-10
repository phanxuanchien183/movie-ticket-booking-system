import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ShowtimeSelector } from '../ShowtimeSelector';
import { Showtime } from '@/types';

describe('ShowtimeSelector Component', () => {
  const mockShowtimes: Showtime[] = [
    {
      showtime_id: 101,
      movie_id: 1,
      room_id: 1,
      start_time: '2026-11-11T19:30:00',
      end_time: '2026-11-11T22:15:00',
      format_type: 'IMAX Laser 2D',
      is_weekend_or_holiday: false,
      room: {
        room_id: 1,
        room_name: 'Rạp 01 - Laser IMAX Starlight',
        total_rows: 8,
        seats_per_row: 12,
        screen_width: 12,
        screen_height: 6.5,
        distance_to_row_a: 4.5,
      },
    },
    {
      showtime_id: 102,
      movie_id: 1,
      room_id: 1,
      start_time: '2026-11-11T22:45:00',
      end_time: '2026-11-12T01:30:00',
      format_type: '2D Phụ đề',
      is_weekend_or_holiday: true,
    },
  ];

  it('Hiển thị danh sách các khung giờ suất chiếu', () => {
    const handleSelect = vi.fn();
    render(
      <ShowtimeSelector
        showtimes={mockShowtimes}
        selectedShowtimeId={101}
        onSelectShowtime={handleSelect}
      />
    );

    expect(screen.getByText('Lịch Chiếu & Suất Chiếu')).toBeDefined();
    expect(screen.getByText('19:30')).toBeDefined();
    expect(screen.getByText('22:45')).toBeDefined();
    expect(screen.getByText('IMAX Laser 2D')).toBeDefined();
  });

  it('Bấm vào một suất chiếu gọi callback onSelectShowtime với đúng dữ liệu', () => {
    const handleSelect = vi.fn();
    render(
      <ShowtimeSelector
        showtimes={mockShowtimes}
        selectedShowtimeId={101}
        onSelectShowtime={handleSelect}
      />
    );

    const buttonShowtime2 = screen.getByText('22:45').closest('button');
    expect(buttonShowtime2).toBeDefined();
    fireEvent.click(buttonShowtime2!);

    expect(handleSelect).toHaveBeenCalledWith(mockShowtimes[1]);
  });
});

