'use client';

import React from 'react';
import { EntertainmentEvent, Showtime, Seat, SeatGeometricView } from '@/types';
import { SeatMap } from './SeatMap';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Film,
  Music,
  ShieldCheck,
  RefreshCw,
  Ticket,
  ChevronRight,
} from 'lucide-react';

interface SeatWithView extends Seat {
  view_metrics?: SeatGeometricView;
}

interface SeatSelectionViewProps {
  event: EntertainmentEvent;
  showtime: Showtime;
  seats: SeatWithView[];
  selectedSeatIds: string[];
  currentUserId: string;
  lockTimeRemaining?: number | null;
  onToggleSeat: (seat: SeatWithView) => void;
  onOpenSeatView: (seat: SeatWithView) => void;
  onRefreshSeats: () => void;
  onBackToDetail: () => void;
  onOpenCheckout: () => void;
}

export const SeatSelectionView: React.FC<SeatSelectionViewProps> = ({
  event,
  showtime,
  seats,
  selectedSeatIds,
  currentUserId,
  lockTimeRemaining,
  onToggleSeat,
  onOpenSeatView,
  onRefreshSeats,
  onBackToDetail,
  onOpenCheckout,
}) => {
  const isConcert = Boolean(
    showtime.room?.is_concert_stage ||
      event.category === 'concert' ||
      event.category === 'meeting'
  );

  const selectedSeatsList = seats.filter((s) => selectedSeatIds.includes(s.seat_id));
  const totalAmount = selectedSeatsList.reduce((sum, s) => sum + (s.price || 90000), 0);

  const formattedTime = new Date(showtime.start_time).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDetail}
            className="flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Quay lại thông tin sự kiện</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">/</span>

          <span className="text-xs text-slate-400 hidden sm:inline font-medium">
            {isConcert ? 'Chọn vị trí khán đài' : 'Chọn ghế rạp chiếu'}
          </span>
        </div>

        <button
          onClick={onRefreshSeats}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Làm mới ghế</span>
        </button>
      </div>

      {/* Summary Event Banner Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
            <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {showtime.format_type}
              </span>
              <span className="text-xs text-slate-400 truncate">
                {showtime.room?.room_name || event.venue_name}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-white truncate mt-0.5">
              {event.title}
            </h2>

            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center space-x-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formattedTime}</span>
              </span>
              <span>•</span>
              <span className="truncate">{event.venue_name}</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Khóa ghế thời gian thực 300s chống double-booking</span>
        </div>
      </div>

      {/* MAIN SEAT MAP CANVAS CONTAINER */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl">
        <SeatMap
          seats={seats}
          selectedSeatIds={selectedSeatIds}
          currentUserId={currentUserId}
          onToggleSeat={onToggleSeat}
          onOpenSeatView={onOpenSeatView}
          lockTimeRemaining={lockTimeRemaining}
          isConcert={isConcert}
        />
      </div>

      {/* FLOATING BOTTOM CTA BAR */}
      {selectedSeatIds.length > 0 && (
        <div className="sticky bottom-0 z-40 p-4 backdrop-blur-md bg-[#090d15]/95 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-200 rounded-2xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-base">
                {selectedSeatIds.length}
              </div>
              <div>
                <div className="text-xs text-slate-400">
                  Đã chọn {selectedSeatIds.length} vé • {selectedSeatsList.map((s) => s.seat_id).join(', ')}
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>

            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>Tiến Hành Thanh Toán</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

