'use client';

import React from 'react';
import { Showtime } from '@/types';
import { Calendar, Monitor, Sparkles } from 'lucide-react';

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  selectedShowtimeId: number | null;
  onSelectShowtime: (showtime: Showtime) => void;
}

export const ShowtimeSelector: React.FC<ShowtimeSelectorProps> = ({
  showtimes,
  selectedShowtimeId,
  onSelectShowtime,
}) => {
  if (showtimes.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
        Hiện chưa có lịch chiếu cho phim này. Vui lòng chọn phim khác!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-bold text-white">Chọn Suất Chiếu Phù Hợp</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {showtimes.map((st) => {
          const isSelected = st.showtime_id === selectedShowtimeId;
          const startDate = new Date(st.start_time);
          const timeStr = startDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          const dateStr = startDate.toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
          });

          return (
            <button
              key={st.showtime_id}
              onClick={() => onSelectShowtime(st)}
              className={`p-4 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/30'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {timeStr}
                  </span>
                  <div className="text-xs text-slate-400 font-medium capitalize">
                    {dateStr}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    st.format_type.includes('IMAX')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {st.format_type}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Monitor className="w-3.5 h-3.5 text-slate-500" />
                  <span className="line-clamp-1">{st.room?.room_name || 'Rạp 01'}</span>
                </span>
                {st.is_weekend_or_holiday && (
                  <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-medium">
                    Cuối tuần
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
