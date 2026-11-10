'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EntertainmentEvent, Showtime, Seat, SeatGeometricView } from '@/types';
import { SeatMap } from './SeatMap';
import { TicketboxStageMap, TICKETBOX_ZONES, StageZone } from './TicketboxStageMap';
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
  event?: EntertainmentEvent;
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
  const router = useRouter();
  const currentEvent = event || showtime.movie;
  const isConcert = Boolean(
    showtime.room?.is_concert_stage ||
      currentEvent?.category === 'concert' ||
      currentEvent?.category === 'meeting'
  );

  // Concert zone selection state
  const [selectedZone, setSelectedZone] = useState<StageZone | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(0);

  const selectedSeatsList = seats.filter((s) => selectedSeatIds.includes(s.seat_id));
  const totalAmount = selectedSeatsList.reduce((sum, s) => sum + (s.price || 90000), 0);

  const formattedTime = new Date(showtime.start_time).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // ==========================================
  // FLOW 1: TICKETBOX CONCERT STAGE MAP (HÌNH 3 & 4)
  // ==========================================
  if (isConcert) {
    const handleProceedToConcertCheckout = (zone: StageZone, qty: number) => {
      router.push(`/booking/${showtime.showtime_id}/checkout?zone=${zone.id}&qty=${qty}`);
    };

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Top Header matching Hình 3 */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <button
            type="button"
            onClick={onBackToDetail}
            className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-white hover:text-emerald-400 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Trở về</span>
          </button>

          <div className="text-center">
            <div className="text-[#00b14f] font-black text-xs sm:text-sm uppercase tracking-wide">
              Chọn khu vực
            </div>
            <div className="text-slate-400 text-[11px] sm:text-xs">
              Bấm vào khu vực để chọn vé
            </div>
          </div>

          <div className="w-16" />
        </div>

        {/* Grid: 3 cols Map + 1 col Sidebar matching Hình 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
          {/* Main Stage Map (Hình 3 & 4) */}
          <div className="lg:col-span-3 min-h-[580px] rounded-2xl overflow-hidden shadow-2xl">
            <TicketboxStageMap
              selectedZone={selectedZone}
              ticketQuantity={ticketQuantity}
              onSelectZone={(zone, qty) => {
                setSelectedZone(zone);
                setTicketQuantity(qty);
              }}
              onProceedToCheckout={handleProceedToConcertCheckout}
              onClearSelection={() => {
                setSelectedZone(null);
                setTicketQuantity(0);
              }}
            />
          </div>

          {/* Right Sidebar matching Hình 3 */}
          <div className="bg-[#181c24] rounded-2xl p-5 border border-slate-800/80 space-y-4 shadow-xl text-white">
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                {currentEvent?.title || 'Tinh Hà "Say Hi" Concert - Đêm 4'}
              </h3>

              <div className="flex items-center space-x-2 text-xs text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{currentEvent?.event_dates || '19:00 - 23:00, 15 Tháng 11, 2026'}</span>
              </div>

              <div className="flex items-start space-x-2 text-xs text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {currentEvent?.venue_name || showtime.room?.venue?.venue_name || 'Trung tâm triển lãm Việt Nam (VEC)'}
                </span>
              </div>
            </div>

            {/* Price list legend */}
            <div className="pt-3 border-t border-slate-700/60 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Giá vé</span>
              <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1 text-xs">
                {TICKETBOX_ZONES.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={() => {
                      if (!zone.is_sold_out) {
                        setSelectedZone(zone);
                        setTicketQuantity(1);
                      }
                    }}
                    className={`flex items-center justify-between py-1.5 px-2 rounded-lg transition-all ${
                      zone.is_sold_out
                        ? 'opacity-50 cursor-not-allowed'
                        : selectedZone?.id === zone.id
                        ? 'bg-emerald-500/20 border border-emerald-500/50 cursor-pointer'
                        : 'hover:bg-slate-800/60 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-4 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="font-bold text-slate-200">{zone.name}</span>
                    </div>

                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-slate-300 font-bold">
                        {zone.price.toLocaleString('vi-VN')} đ
                      </span>
                      {zone.is_sold_out && (
                        <span className="text-[10px] text-rose-400 font-bold bg-rose-500/15 px-1.5 py-0.5 rounded">
                          Hết vé
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="pt-3 border-t border-slate-700/60">
              {selectedZone && ticketQuantity > 0 ? (
                <button
                  type="button"
                  onClick={() => handleProceedToConcertCheckout(selectedZone, ticketQuantity)}
                  className="w-full py-3.5 rounded-xl bg-[#00b14f] hover:bg-[#009643] text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Tiếp tục ({(selectedZone.price * ticketQuantity).toLocaleString('vi-VN')} đ) »</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 rounded-xl bg-slate-700/70 text-slate-400 font-extrabold text-sm flex items-center justify-center cursor-not-allowed"
                >
                  <span>Vui lòng chọn vé »</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // FLOW 2: CINEMA MOVIE SEAT SELECTION
  // ==========================================
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
            Chọn ghế rạp chiếu
          </span>
        </div>

        {onRefreshSeats && (
          <button
            onClick={onRefreshSeats}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Làm mới ghế</span>
          </button>
        )}
      </div>

      {/* Summary Event Banner Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
            <img
              src={currentEvent?.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800'}
              alt={currentEvent?.title || 'Phim'}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {showtime.format_type}
              </span>
              <span className="text-xs text-slate-400 truncate">
                {showtime.room?.room_name || currentEvent?.venue_name || showtime.room?.venue?.venue_name}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-white truncate mt-0.5">
              {currentEvent?.title || 'Sự Kiện Đặt Vé'}
            </h2>

            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center space-x-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formattedTime}</span>
              </span>
              <span>•</span>
              <span className="truncate">
                {currentEvent?.venue_name || showtime.room?.venue?.venue_name || 'Hệ thống rạp'}
              </span>
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
          isConcert={false}
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
