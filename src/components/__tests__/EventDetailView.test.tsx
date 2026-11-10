import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { EventDetailView } from '../EventDetailView';
import { EntertainmentEvent, Showtime } from '@/types';

describe('EventDetailView Component (Dedicated Event Intro & Ticket Classes Screen)', () => {
  const mockConcert: EntertainmentEvent = {
    event_id: 101,
    movie_id: 101,
    title: 'Anh Trai Say Hi Live Concert 2026',
    category: 'concert',
    category_label: 'Live Concert',
    artists: 'HIEUTHUHAI, Anh Tú, Isaac',
    duration_minutes: 210,
    poster_url: 'https://images.unsplash.com/photo-1.jpg',
    genre: 'Pop, EDM',
    age_rating: 'P',
    description: 'Đại nhạc hội bùng nổ cùng các anh trai.',
    status: 'SellingFast',
    venue_name: 'Nhà Thi Đấu Quân Khu 7',
    venue_address: '202 Hoàng Văn Thụ, Q. Phú Nhuận',
    city: 'TP.HCM',
    price_from: 800000,
    event_dates: '19:30 • 15/11/2026',
    rating_score: '4.9/5',
    ticket_tiers: [
      { name: 'SKY LOUNGE', price: 10000000, color: '#38bdf8', type: 'seated', perks: 'Sofa VIP' },
      { name: 'FANZONE TRUNG TÂM', price: 2500000, color: '#6366f1', type: 'standing' },
    ],
  };

  const mockMovie: EntertainmentEvent = {
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
    city: 'TP.HCM',
    price_from: 110000,
    event_dates: 'Hằng ngày',
    rating_score: '4.9/5 Khán Giả',
    rating_imdb: '8.6/10 IMDb',
    director: 'Denis Villeneuve',
  };

  const mockShowtimes: Showtime[] = [
    {
      showtime_id: 1,
      movie_id: 1,
      room_id: 1,
      start_time: '2026-11-11T18:30:00',
      end_time: '2026-11-11T21:16:00',
      format_type: 'Laser IMAX 2D',
      is_weekend_or_holiday: false,
      room: {
        room_id: 1,
        room_name: 'Phòng Chiếu IMAX Laser 01',
        total_rows: 8,
        seats_per_row: 12,
        screen_width: 14,
        screen_height: 7.5,
        distance_to_row_a: 4.5,
      },
    },
  ];

  it('Render thông tin concert với bảng hạng vé và nút tiếp tục chọn vị trí sân khấu', () => {
    const handleProceed = vi.fn();
    const handleBack = vi.fn();

    render(
      <EventDetailView
        event={mockConcert}
        showtimes={[]}
        selectedShowtime={null}
        onSelectShowtime={vi.fn()}
        onProceedToSeats={handleProceed}
        onBackToHome={handleBack}
      />
    );

    expect(screen.getByText('Anh Trai Say Hi Live Concert 2026')).toBeDefined();
    expect(screen.getByText('Bảng Các Loại Vé & Quyền Lợi Khán Đài')).toBeDefined();
    expect(screen.getByText('SKY LOUNGE')).toBeDefined();
    expect(screen.getByText('FANZONE TRUNG TÂM')).toBeDefined();

    // Click nút vào sơ đồ khán đài
    const proceedBtn = screen.getByText('Vào Sơ Đồ Khán Đài Sân Khấu');
    fireEvent.click(proceedBtn);
    expect(handleProceed).toHaveBeenCalled();
  });

  it('Render thông tin phim với trailer, điểm đánh giá và chọn khung giờ suất chiếu', () => {
    const handleProceed = vi.fn();
    const handleSelectShowtime = vi.fn();

    render(
      <EventDetailView
        event={mockMovie}
        showtimes={mockShowtimes}
        selectedShowtime={mockShowtimes[0]}
        onSelectShowtime={handleSelectShowtime}
        onProceedToSeats={handleProceed}
        onBackToHome={vi.fn()}
      />
    );

    expect(screen.getByText('Dune: Hành Tinh Cát 2')).toBeDefined();
    expect(screen.getByText('4.9/5 Khán Giả')).toBeDefined();
    expect(screen.getByText('8.6/10 IMDb')).toBeDefined();
    expect(screen.getByText('Denis Villeneuve')).toBeDefined();
    expect(screen.getByText('Laser IMAX 2D')).toBeDefined();

    // Click nút vào sơ đồ rạp
    const proceedBtn = screen.getByText('Vào Sơ Đồ Rạp & Chọn Ghế Ngồi');
    fireEvent.click(proceedBtn);
    expect(handleProceed).toHaveBeenCalled();
  });
});
