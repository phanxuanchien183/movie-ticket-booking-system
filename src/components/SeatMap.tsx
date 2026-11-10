'use client';

import React, { useState, useEffect } from 'react';
import { Seat, SeatGeometricView } from '@/types';
import { Eye, Lock, Check, Clock } from 'lucide-react';

interface SeatWithView extends Seat {
  view_metrics?: SeatGeometricView;
}

interface SeatMapProps {
  seats: SeatWithView[];
  selectedSeatIds: string[];
  currentUserId: string;
  onToggleSeat: (seat: SeatWithView) => void;
  onOpenSeatView: (seat: SeatWithView) => void;
  lockTimeRemaining?: number | null; // seconds
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatIds,
  currentUserId,
  onToggleSeat,
  onOpenSeatView,
  lockTimeRemaining,
}) => {
  // Nhóm ghế theo từng hàng
  const rowsMap = new Map<string, SeatWithView[]>();
  seats.forEach((seat) => {
    if (!rowsMap.has(seat.row_name)) {
      rowsMap.set(seat.row_name, []);
    }
    rowsMap.get(seat.row_name)!.push(seat);
  });

  const rowNames = Array.from(rowsMap.keys()).sort();

  // Đếm thời gian giữ vé
  const [timer, setTimer] = useState<number | null>(lockTimeRemaining || null);

  useEffect(() => {
    if (lockTimeRemaining !== undefined) {
      setTimer(lockTimeRemaining);
    }
  }, [lockTimeRemaining]);

  useEffect(() => {
    if (timer === null || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // State xem chi tiết ghế khi click
  const [hoveredSeat, setHoveredSeat] = useState<SeatWithView | null>(null);

  return (
    <div className="space-y-6">
      {/* Timer Bar (Ticketbox Style) */}
      {selectedSeatIds.length > 0 && timer !== null && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              Ghế đang được giữ tạm thời. Vui lòng hoàn tất đặt vé trong:
            </span>
          </div>
          <span className="text-base sm:text-lg font-mono font-black text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
            {formatTimer(timer)}
          </span>
        </div>
      )}

      {/* Screen Visualizer */}
      <div className="relative pt-4 pb-6 text-center">
        <div className="relative mx-auto max-w-xl">
          {/* Curved Screen */}
          <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_25px_#10b981] mx-6" />
          <div className="mt-2 text-[11px] font-bold tracking-[0.3em] text-slate-400 uppercase">
            Màn Hình Chiếu
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none blur-lg" />
        </div>
      </div>

      {/* Seat Grid Layout */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[640px] max-w-3xl mx-auto space-y-2.5 px-4">
          {rowNames.map((rowName) => {
            const rowSeats = rowsMap.get(rowName)!;
            rowSeats.sort((a, b) => a.seat_number - b.seat_number);

            return (
              <div key={rowName} className="flex items-center justify-center space-x-2">
                {/* Row Header Left */}
                <span className="w-5 text-xs font-bold text-slate-500 text-center">
                  {rowName}
                </span>

                {/* Seats in Row */}
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.seat_id);
                    const isBooked = seat.status === 'booked';
                    // Ghế đang bị người dùng khác giữ chỗ
                    const isLockedByOther =
                      seat.status === 'locked' && seat.locked_by_user !== currentUserId;
                    const isSweetbox = seat.seat_type === 'Sweetbox';
                    const isVIP = seat.seat_type === 'VIP';

                    // Seat Styling (Ticketbox style)
                    let seatColorClass = 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-750';
                    if (isBooked) {
                      seatColorClass = 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-30';
                    } else if (isLockedByOther) {
                      seatColorClass = 'bg-amber-950/70 text-amber-400 border-amber-600/70 cursor-not-allowed opacity-90';
                    } else if (isSelected) {
                      seatColorClass =
                        'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/30 scale-105';
                    } else if (isSweetbox) {
                      seatColorClass =
                        'bg-pink-950/40 text-pink-300 border-pink-700/60 hover:border-pink-500';
                    } else if (isVIP) {
                      seatColorClass =
                        'bg-amber-950/30 text-amber-300 border-amber-700/60 hover:border-amber-500';
                    }

                    return (
                      <div key={seat.seat_id} className="relative group">
                        <button
                          disabled={isBooked || isLockedByOther}
                          onClick={() => {
                            if (!isBooked && !isLockedByOther) {
                              onToggleSeat(seat);
                            }
                          }}
                          onMouseEnter={() => setHoveredSeat(seat)}
                          className={`relative transition-all duration-150 rounded-lg text-xs font-semibold flex items-center justify-center border ${seatColorClass} ${
                            isSweetbox ? 'w-14 sm:w-16 h-8' : 'w-7 sm:w-8 h-8'
                          }`}
                          title={
                            isBooked
                              ? `Ghế ${seat.seat_id} (Đã bán)`
                              : isLockedByOther
                              ? `Ghế ${seat.seat_id} (Đang có người giữ chỗ)`
                              : `Ghế ${seat.seat_id} • ${seat.seat_type} • ${seat.price?.toLocaleString('vi-VN')} đ`
                          }
                        >
                          {isBooked ? (
                            '✕'
                          ) : isLockedByOther ? (
                            <Lock className="w-3 h-3 text-amber-400" />
                          ) : isSelected ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            seat.seat_number
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Row Header Right */}
                <span className="w-5 text-xs font-bold text-slate-500 text-center">
                  {rowName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Seat Details & Quick View Action Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 gap-3">
        {hoveredSeat ? (
          <div className="flex items-center space-x-3">
            <span className="font-bold text-white text-sm">
              Ghế {hoveredSeat.seat_id}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {hoveredSeat.seat_type}
            </span>
            <span className="text-emerald-400 font-semibold">
              {hoveredSeat.price?.toLocaleString('vi-VN')} đ
            </span>
            {hoveredSeat.status === 'locked' && hoveredSeat.locked_by_user !== currentUserId && (
              <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Đang có người giữ chỗ
              </span>
            )}
            {hoveredSeat.status === 'booked' && (
              <span className="text-slate-500">Đã bán</span>
            )}
          </div>
        ) : (
          <span>Di chuột hoặc chạm vào ghế để xem chi tiết giá và loại ghế</span>
        )}

        {hoveredSeat && (
          <button
            onClick={() => onOpenSeatView(hoveredSeat)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xem góc nhìn từ ghế {hoveredSeat.seat_id}</span>
          </button>
        )}
      </div>

      {/* Legend & Price Guide */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300">
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-600" />
          <span>Ghế Thường</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-amber-950/40 border border-amber-600/60" />
          <span>Ghế VIP</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-5 h-3.5 rounded bg-pink-950/40 border border-pink-700/60" />
          <span>Ghế Đôi</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-400" />
          <span className="text-emerald-400 font-semibold">Đang chọn</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-amber-950/70 border border-amber-500/60 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
          </div>
          <span className="text-amber-300">Đang giữ chỗ</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-slate-900/60 border border-slate-800 opacity-40 flex items-center justify-center text-[9px]">
            ✕
          </div>
          <span className="text-slate-500">Đã bán</span>
        </div>
      </div>
    </div>
  );
};
