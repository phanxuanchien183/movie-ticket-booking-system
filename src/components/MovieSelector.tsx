'use client';

import React from 'react';
import { Movie } from '@/types';
import { Clock, Play, Tag, Star } from 'lucide-react';

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Phim Đang Chiếu & Hot Nhất</span>
          <span className="text-xs bg-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/30">
            {movies.length} Phim
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {movies.map((movie) => {
          const isSelected = movie.movie_id === selectedMovieId;

          return (
            <div
              key={movie.movie_id}
              onClick={() => onSelectMovie(movie)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/50 bg-slate-900/90'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              {/* Poster Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Age Rating Badge */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/90 text-slate-950 shadow-md">
                  {movie.age_rating || 'P'}
                </div>

                {/* Status Badge */}
                {movie.status === 'NowShowing' ? (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/90 text-white shadow-md">
                    Đang Chiếu
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/90 text-white shadow-md">
                    Sắp Chiếu
                  </div>
                )}

                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-rose-950/40 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/50 animate-pulse">
                      <Play className="w-6 h-6 ml-0.5 fill-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Movie Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                  {movie.title}
                </h3>

                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{movie.duration_minutes} phút</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 line-clamp-1">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    <span>{movie.genre?.split(',')[0]}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {movie.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
