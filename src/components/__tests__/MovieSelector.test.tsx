import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MovieSelector } from '../MovieSelector';
import { Movie } from '@/types';

describe('MovieSelector Component', () => {
  const mockMovies: Movie[] = [
    {
      movie_id: 1,
      title: 'Dune: Hành Tinh Cát - Phần Hai',
      duration_minutes: 166,
      poster_url: 'https://images.unsplash.com/photo-1.jpg',
      genre: 'Khoa học viễn tưởng, Hành động',
      age_rating: 'T16',
      status: 'NowShowing',
    },
    {
      movie_id: 2,
      title: 'Mai - Trấn Thành Film',
      duration_minutes: 131,
      poster_url: 'https://images.unsplash.com/photo-2.jpg',
      genre: 'Tâm lý, Tình cảm',
      age_rating: 'T18',
      status: 'NowShowing',
    },
  ];

  it('Render danh sách phim đang chiếu', () => {
    const handleSelect = vi.fn();
    render(
      <MovieSelector
        movies={mockMovies}
        selectedMovieId={1}
        onSelectMovie={handleSelect}
      />
    );

    expect(screen.getByText('Phim Đang Chiếu Tại Rạp')).toBeDefined();
    expect(screen.getByText('Dune: Hành Tinh Cát - Phần Hai')).toBeDefined();
    expect(screen.getByText('Mai - Trấn Thành Film')).toBeDefined();
  });

  it('Click vào phim gọi onSelectMovie với phim tương ứng', () => {
    const handleSelect = vi.fn();
    render(
      <MovieSelector
        movies={mockMovies}
        selectedMovieId={1}
        onSelectMovie={handleSelect}
      />
    );

    const movieMai = screen.getByText('Mai - Trấn Thành Film').closest('div');
    expect(movieMai).toBeDefined();
    fireEvent.click(movieMai!);

    expect(handleSelect).toHaveBeenCalledWith(mockMovies[1]);
  });
});
