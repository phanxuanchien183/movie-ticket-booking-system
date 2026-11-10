'use client';

import React, { useState } from 'react';
import { EntertainmentEvent } from '@/types';
import { Clock, Star, MapPin, Search, Music, Film, Users, Sparkles, CheckCircle } from 'lucide-react';

interface MovieSelectorProps {
  movies: EntertainmentEvent[];
  selectedMovieId: number;
  onSelectMovie: (movie: EntertainmentEvent) => void;
}

export const MovieSelector: React.FC<MovieSelectorProps> = ({
  movies,
  selectedMovieId,
  onSelectMovie,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'movie' | 'concert' | 'meeting'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tất Cả Sự Kiện', icon: Sparkles },
    { id: 'concert', label: 'Concert & Đại Nhạc Hội', icon: Music },
    { id: 'movie', label: 'Vé Xem Phim Cụm Rạp', icon: Film },
    { id: 'meeting', label: 'Fan Meeting & Sự Kiện', icon: Users },
  ];

  const filteredEvents = movies.filter((item) => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.venue_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.artists && item.artists.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter (Ticketbox Header Bar) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Sự Kiện & Phim Nổi Bật</span>
          </h2>
          <p className="text-xs text-slate-400">
            Đặt vé xem phim cụm rạp CGV, Lotte và đại nhạc hội, fan meeting tại các nhà thi đấu
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên sự kiện, ca sĩ, rạp..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredEvents.map((event) => {
          const isSelected = event.event_id === selectedMovieId;
          const isConcert = event.category === 'concert' || event.category === 'meeting';

          return (
            <div
              key={event.event_id}
              onClick={() => onSelectMovie(event)}
              className={`group cursor-pointer rounded-2xl overflow-hidden bg-slate-900/60 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-slate-900 shadow-xl shadow-emerald-950/20'
                  : 'border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              {/* Event Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                <img
                  src={event.poster_url}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Category Label Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isConcert
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {event.category_label}
                  </span>
                  {event.status === 'SellingFast' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/90 text-slate-950">
                      Đang Sốt Vé
                    </span>
                  )}
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[11px] font-bold flex items-center space-x-1 shadow-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Đang chọn</span>
                  </div>
                )}
              </div>

              {/* Event Information */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                    {event.title}
                  </h3>

                  {event.artists && (
                    <div className="text-[11px] text-amber-300/90 line-clamp-1 font-medium">
                      🎤 {event.artists}
                    </div>
                  )}

                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1 font-medium text-slate-300">{event.venue_name}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {event.event_dates}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Giá từ</span>
                    <span className="text-emerald-400 font-extrabold text-sm">
                      {(event.price_from ?? 95000).toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-extrabold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isSelected ? 'Đang Xem Suất' : 'Đặt Vé Ngay'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="col-span-full p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            Không tìm thấy sự kiện hoặc phim nào phù hợp với từ khóa "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
