'use client';

import React, { useState } from 'react';
import { Movie } from '@/types';
import { Clock, Star, Play, CheckCircle } from 'lucide-react';

interface MovieSelectorProps {
  movies: Movie[];
  selectedMovieId: number;
  onSelectMovie: (movie: Movie) => void;
}

export const MovieSelector: React.FC<MovieSelectorProps> = ({
  movies,
  selectedMovieId,
  onSelectMovie,
}) => {
  const [filterGenre, setFilterGenre] = useState<string>('all');

  const genres = [
    { id: 'all', label: 'Tất Cả Phim' },
    { id: 'Khoa học', label: 'Khoa Học Viễn Tưởng' },
    { id: 'Hành động', label: 'Hành Động' },
    { id: 'Tâm lý', label: 'Tâm Lý - Tình Cảm' },
  ];

  const filteredMovies = filterGenre === 'all'
    ? movies
    : movies.filter((m) => m.genre?.toLowerCase().includes(filterGenre.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Phim Đang Chiếu Tại Rạp</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Chọn phim yêu thích để xem lịch chiếu và chọn ghế ngồi phù hợp
          </p>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setFilterGenre(g.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterGenre === g.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {filteredMovies.map((movie) => {
          const isSelected = movie.movie_id === selectedMovieId;

          return (
            <div
              key={movie.movie_id}
              onClick={() => onSelectMovie(movie)}
              className={`group cursor-pointer rounded-2xl overflow-hidden bg-slate-900/60 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-slate-900 shadow-xl shadow-emerald-950/20'
                  : 'border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Age Rating Badge */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-black bg-amber-500 text-slate-950 shadow-md">
                  {movie.age_rating || 'P'}
                </span>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[11px] font-bold flex items-center space-x-1 shadow-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Đang chọn</span>
                  </div>
                )}
              </div>

              {/* Movie Info */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{movie.duration_minutes} phút</span>
                    </span>
                    <span>•</span>
                    <span className="line-clamp-1">{movie.genre?.split(',')[0]}</span>
                  </div>
                </div>

                <button
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isSelected ? 'Đang Xem Lịch Chiếu' : 'Chọn Phim Này'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
