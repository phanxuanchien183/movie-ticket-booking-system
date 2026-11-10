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

  it('Hiển thị danh sách các chi nhánh rạp và cho phép chọn chi nhánh trước khi chọn giờ chiếu', () => {
    const handleProceed = vi.fn();
    const handleSelectShowtime = vi.fn();

    const multiBranchShowtimes: Showtime[] = [
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
      {
        showtime_id: 11,
        movie_id: 1,
        room_id: 5,
        start_time: '2026-11-11T18:15:00',
        end_time: '2026-11-11T21:00:00',
        format_type: '2D Phụ đề',
        is_weekend_or_holiday: false,
        room: {
          room_id: 5,
          room_name: 'Phòng Chiếu Cinema 03',
          total_rows: 8,
          seats_per_row: 12,
          screen_width: 13,
          screen_height: 6.8,
          distance_to_row_a: 4.2,
          venue: {
            venue_id: 6,
            venue_name: 'CGV Hùng Vương Plaza',
            brand_name: 'CGV Cinemas',
            venue_type: 'cinema_chain',
            city: 'TP. Hồ Chí Minh',
            address: 'Tầng 7, Hùng Vương Plaza, Quận 5',
          },
        },
      },
      {
        showtime_id: 14,
        movie_id: 1,
        room_id: 7,
        start_time: '2026-11-11T20:00:00',
        end_time: '2026-11-11T22:30:00',
        format_type: 'Lotte SuperFlex 2D',
        is_weekend_or_holiday: false,
        room: {
          room_id: 7,
          room_name: 'Phòng Chiếu SuperFlex 01',
          total_rows: 8,
          seats_per_row: 12,
          screen_width: 13.5,
          screen_height: 7,
          distance_to_row_a: 4.3,
          venue: {
            venue_id: 5,
            venue_name: 'Lotte Cinema Nowzone',
            brand_name: 'Lotte Cinema',
            venue_type: 'cinema_chain',
            city: 'TP. Hồ Chí Minh',
            address: 'Tầng 5, TTTM Nowzone, Quận 1',
          },
        },
      },
    ];

    render(
      <EventDetailView
        event={mockMovie}
        showtimes={multiBranchShowtimes}
        selectedShowtime={multiBranchShowtimes[0]}
        onSelectShowtime={handleSelectShowtime}
        onProceedToSeats={handleProceed}
        onBackToHome={vi.fn()}
      />
    );

    // Xác nhận phần chọn chi nhánh trước chỗ chọn giờ có mặt
    expect(screen.getByText(/2\. Chọn Chi Nhánh Rạp Gần Bạn/i)).toBeDefined();
    expect(screen.getAllByText('CGV Vincom Landmark 81').length).toBeGreaterThan(0);
    expect(screen.getByText('CGV Hùng Vương Plaza')).toBeDefined();
    expect(screen.getByText('Lotte Cinema Nowzone')).toBeDefined();

    // Click chuyển sang chi nhánh CGV Hùng Vương Plaza
    const hungVuongBranchCard = screen.getByText('CGV Hùng Vương Plaza');
    fireEvent.click(hungVuongBranchCard);

    // Đã gọi đổi suất chiếu sang suất thuộc CGV Hùng Vương Plaza
    expect(handleSelectShowtime).toHaveBeenCalledWith(multiBranchShowtimes[1]);
  });

  it('Lọc các chi nhánh rạp theo thương hiệu rạp (CGV, Lotte)', () => {
    const multiBranchShowtimes: Showtime[] = [
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
      {
        showtime_id: 14,
        movie_id: 1,
        room_id: 7,
        start_time: '2026-11-11T20:00:00',
        end_time: '2026-11-11T22:30:00',
        format_type: 'Lotte SuperFlex 2D',
        is_weekend_or_holiday: false,
        room: {
          room_id: 7,
          room_name: 'Phòng Chiếu SuperFlex 01',
          total_rows: 8,
          seats_per_row: 12,
          screen_width: 13.5,
          screen_height: 7,
          distance_to_row_a: 4.3,
          venue: {
            venue_id: 5,
            venue_name: 'Lotte Cinema Nowzone',
            brand_name: 'Lotte Cinema',
            venue_type: 'cinema_chain',
            city: 'TP. Hồ Chí Minh',
            address: 'Tầng 5, TTTM Nowzone, Quận 1',
          },
        },
      },
    ];

    render(
      <EventDetailView
        event={mockMovie}
        showtimes={multiBranchShowtimes}
        selectedShowtime={multiBranchShowtimes[0]}
        onSelectShowtime={vi.fn()}
        onProceedToSeats={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    // Bấm chọn tab thương hiệu Lotte Cinema
    const lotteBrandBtn = screen.getByRole('button', { name: /Lotte Cinema/i });
    fireEvent.click(lotteBrandBtn);

    // Xác nhận chi nhánh Lotte Cinema Nowzone vẫn hiển thị
    expect(screen.getByText('Lotte Cinema Nowzone')).toBeDefined();
    // CGV Landmark 81 trong danh sách chi nhánh (h4) bị lọc ẩn đi
    expect(screen.queryByRole('heading', { name: 'CGV Vincom Landmark 81' })).toBeNull();
  });
});

