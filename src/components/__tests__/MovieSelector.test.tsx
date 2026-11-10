import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MovieSelector } from '../MovieSelector';
import { EntertainmentEvent } from '@/types';

describe('MovieSelector Component', () => {
  const mockEvents: EntertainmentEvent[] = [
    {
      event_id: 1,
      title: 'Dune: Hành Tinh Cát - Phần Hai',
      category: 'movie',
      category_label: 'Phim Rạp',
      duration_minutes: 166,
      poster_url: 'https://images.unsplash.com/photo-1.jpg',
      genre: 'Khoa học viễn tưởng',
      age_rating: 'T16',
      status: 'NowShowing',
      venue_name: 'CGV Vincom Landmark 81',
      venue_address: 'Bình Thạnh, TP.HCM',
      city: 'TP. Hồ Chí Minh',
      price_from: 110000,
      event_dates: 'Hôm nay & Cả tuần',
    },
    {
      event_id: 2,
      title: 'Anh Trai Say Hi Live Concert 2024 - Đêm 3',
      category: 'concert',
      category_label: 'Live Concert',
      artists: '30 Anh Trai, JustaTee',
      duration_minutes: 240,
      poster_url: 'https://images.unsplash.com/photo-2.jpg',
      genre: 'Âm nhạc, Live Performance',
      age_rating: 'T13',
      status: 'SellingFast',
      venue_name: 'Sân vận động Quốc gia Mỹ Đình',
      venue_address: 'Nam Từ Liêm, Hà Nội',
      city: 'Hà Nội',
      price_from: 550000,
      event_dates: '07/12/2024 - 19:30',
    },
    {
      event_id: 3,
      title: 'Fan Meeting Kim Seon Ho - Love in Saigon',
      category: 'meeting',
      category_label: 'Fan Meeting',
      artists: 'Kim Seon Ho',
      duration_minutes: 150,
      poster_url: 'https://images.unsplash.com/photo-3.jpg',
      genre: 'Giao lưu thần tượng',
      age_rating: 'T13',
      status: 'SellingFast',
      venue_name: 'Nhà thi đấu Phú Thọ',
      venue_address: 'Quận 11, TP.HCM',
      city: 'TP. Hồ Chí Minh',
      price_from: 800000,
      event_dates: '15/12/2024 - 18:00',
    },
  ];

  it('Render danh sách sự kiện và phim nổi bật', () => {
    const handleSelect = vi.fn();
    render(
      <MovieSelector
        movies={mockEvents}
        selectedMovieId={1}
        onSelectMovie={handleSelect}
      />
    );

    expect(screen.getByText('Sự Kiện & Phim Nổi Bật')).toBeDefined();
    expect(screen.getByText('Dune: Hành Tinh Cát - Phần Hai')).toBeDefined();
    expect(screen.getByText('Anh Trai Say Hi Live Concert 2024 - Đêm 3')).toBeDefined();
    expect(screen.getByText('Fan Meeting Kim Seon Ho - Love in Saigon')).toBeDefined();
  });

  it('Lọc sự kiện theo danh mục Concert & Đại Nhạc Hội', () => {
    const handleSelect = vi.fn();
    render(
      <MovieSelector
        movies={mockEvents}
        selectedMovieId={1}
        onSelectMovie={handleSelect}
      />
    );

    const concertTab = screen.getByText('Concert & Đại Nhạc Hội');
    fireEvent.click(concertTab);

    // Concert phải hiển thị, Phim rạp không hiển thị
    expect(screen.getByText('Anh Trai Say Hi Live Concert 2024 - Đêm 3')).toBeDefined();
    expect(screen.queryByText('Dune: Hành Tinh Cát - Phần Hai')).toBeNull();
  });

  it('Tìm kiếm sự kiện theo từ khóa', () => {
    const handleSelect = vi.fn();
    render(
      <MovieSelector
        movies={mockEvents}
        selectedMovieId={1}
        onSelectMovie={handleSelect}
      />
    );

    const searchInput = screen.getByPlaceholderText('Tìm theo tên sự kiện, ca sĩ, rạp...');
    fireEvent.change(searchInput, { target: { value: 'Mỹ Đình' } });

    expect(screen.getByText('Anh Trai Say Hi Live Concert 2024 - Đêm 3')).toBeDefined();
    expect(screen.queryByText('Dune: Hành Tinh Cát - Phần Hai')).toBeNull();
    expect(screen.queryByText('Fan Meeting Kim Seon Ho - Love in Saigon')).toBeNull();
  });

  it('Click vào sự kiện gọi onSelectMovie với sự kiện tương ứng', () => {
    const handleSelect = vi.fn();
    render(
      <MovieSelector
        movies={mockEvents}
        selectedMovieId={1}
        onSelectMovie={handleSelect}
      />
    );

    const concertCard = screen.getByText('Anh Trai Say Hi Live Concert 2024 - Đêm 3').closest('div[class*="group"]');
    expect(concertCard).toBeDefined();
    fireEvent.click(concertCard!);

    expect(handleSelect).toHaveBeenCalledWith(mockEvents[1]);
  });
});
