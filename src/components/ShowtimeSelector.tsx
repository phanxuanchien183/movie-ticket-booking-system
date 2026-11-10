'use client';

import React from 'react';
import { Showtime } from '@/types';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

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
      <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
        Hiện tại chưa có suất chiếu cho phim này. Vui lòng chọn phim khác!
      </div>
    );
  }

  // Nhóm suất chiếu theo định dạng (IMAX Laser, 2D...)
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-extrabold text-white tracking-tight">
            Lịch Chiếu & Suất Chiếu
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Suất chiếu được cập nhật theo thời gian thực
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-xs text-slate-300 font-semibold border-b border-slate-800/80 pb-3">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showtimes[0]?.room?.room_name || 'Rạp 01 - Laser IMAX Starlight'}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Tầng 5, TTTM Starlight Plaza</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {showtimes.map((st) => {
            const isSelected = st.showtime_id === selectedShowtimeId;
            const startDate = new Date(st.start_time);
            const timeStr = startDate.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });

            return (
              <button
                key={st.showtime_id}
                onClick={() => onSelectShowtime(st)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-white tracking-tight">
                    {timeStr}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      st.format_type.includes('IMAX')
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {st.format_type.includes('IMAX') ? 'IMAX' : '2D'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{st.format_type}</span>
                  {st.is_weekend_or_holiday && (
                    <span className="text-[9px] text-rose-400 font-semibold">Cuối tuần</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
