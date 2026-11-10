'use client';

import React, { useState, useEffect } from 'react';
import { Seat, SeatGeometricView } from '@/types';
import { Eye, Lock, Check, Clock, AlertTriangle, Sparkles } from 'lucide-react';

interface SeatWithView extends Seat {
  view_metrics?: SeatGeometricView;
}

interface SeatMapProps {
  seats: SeatWithView[];
  selectedSeatIds: string[];
  currentUserId: number;
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

  // Đếm số phút:giây giữ chỗ
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

  // State click popover cho ghế
  const [activeSeatPopup, setActiveSeatPopup] = useState<SeatWithView | null>(null);

  return (
    <div className="space-y-6">
      {/* Timer Bar (Hiển thị khi đang giữ ghế) */}
      {selectedSeatIds.length > 0 && timer !== null && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold">
              Ghế đang được Redis giữ chỗ độc quyền trong:
            </span>
          </div>
          <div className="text-lg font-black tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/40">
            {formatTimer(timer)}
          </div>
        </div>
      )}

      {/* Screen Visualizer */}
      <div className="relative pt-6 pb-8 text-center">
        <div className="relative mx-auto max-w-2xl">
          {/* Curved glowing screen bar */}
          <div className="h-2.5 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_30px_#f43f5e] mx-8" />
          <div className="mt-2 text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
            Màn Hình Chiếu (Screen)
          </div>
          {/* Light projection beam */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none blur-xl" />
        </div>
      </div>

      {/* Seat Grid Layout */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[680px] max-w-4xl mx-auto space-y-3 px-4">
          {rowNames.map((rowName) => {
            const rowSeats = rowsMap.get(rowName)!;
            rowSeats.sort((a, b) => a.seat_number - b.seat_number);

            return (
              <div key={rowName} className="flex items-center justify-center space-x-2">
                {/* Row Header Left */}
                <span className="w-6 text-xs font-bold text-slate-400 text-center">
                  {rowName}
                </span>

                {/* Seats in Row */}
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.seat_id);
                    const isBooked = seat.status === 'booked';
                    const isLockedByOther =
                      seat.status === 'locked' && seat.locked_by_user !== currentUserId;
                    const isSweetbox = seat.seat_type === 'Sweetbox';
                    const isVIP = seat.seat_type === 'VIP';

                    // Seat Styling
                    let seatColorClass = 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500';
                    if (isBooked) {
                      seatColorClass = 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-40';
                    } else if (isLockedByOther) {
                      seatColorClass = 'bg-amber-950/40 text-amber-400 border-amber-600/50 cursor-not-allowed';
                    } else if (isSelected) {
                      seatColorClass =
                        'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/30 scale-105';
                    } else if (isSweetbox) {
                      seatColorClass =
                        'bg-pink-950/40 text-pink-300 border-pink-700/60 hover:border-pink-500 hover:bg-pink-900/40';
                    } else if (isVIP) {
                      seatColorClass =
                        'bg-amber-950/30 text-amber-300 border-amber-700/60 hover:border-amber-500 hover:bg-amber-900/30';
                    }

                    return (
                      <div key={seat.seat_id} className="relative group">
                        <button
                          disabled={isBooked || isLockedByOther}
                          onClick={() => {
                            if (!isBooked && !isLockedByOther) {
                              setActiveSeatPopup(seat);
                            }
                          }}
                          className={`relative transition-all rounded-lg text-xs font-semibold flex items-center justify-center border ${seatColorClass} ${
                            isSweetbox ? 'w-16 h-8' : 'w-8 sm:w-9 h-8'
                          }`}
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
                <span className="w-6 text-xs font-bold text-slate-400 text-center">
                  {rowName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Selection & Perspective Action Popup Modal */}
      {activeSeatPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xl font-bold text-white">Ghế {activeSeatPopup.seat_id}</h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300">
                    {activeSeatPopup.seat_type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Giá vé: {activeSeatPopup.price?.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>

              <button
                onClick={() => setActiveSeatPopup(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics preview */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block">Khoảng cách:</span>
                <span className="text-white font-medium">
                  {activeSeatPopup.view_metrics?.distance_to_screen || 0}m
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Góc lệch:</span>
                <span className="text-white font-medium">
                  {activeSeatPopup.view_metrics?.horizontal_angle || 0}°
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  onToggleSeat(activeSeatPopup);
                  setActiveSeatPopup(null);
                }}
                className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                  selectedSeatIds.includes(activeSeatPopup.seat_id)
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                    : 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                }`}
              >
                <span>
                  {selectedSeatIds.includes(activeSeatPopup.seat_id)
                    ? 'Bỏ chọn ghế này'
                    : '✓ Chọn ghế này (Khóa Redis)'}
                </span>
              </button>

              <button
                onClick={() => {
                  const s = activeSeatPopup;
                  setActiveSeatPopup(null);
                  onOpenSeatView(s);
                }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition-all"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Xem góc nhìn mô phỏng</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend & Price Guide */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-slate-800 border border-slate-600" />
          <span>Thường (90k-110k)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-amber-950/40 border border-amber-600/60" />
          <span>VIP (120k-140k)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-4 rounded bg-pink-950/40 border border-pink-700/60" />
          <span>Sweetbox Đôi (220k-260k)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400" />
          <span>Đang chọn</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-amber-950/40 border border-amber-500/60 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
          </div>
          <span>Đang giữ chỗ</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-slate-900/60 border border-slate-800 opacity-50 flex items-center justify-center text-[10px]">
            ✕
          </div>
          <span>Đã bán</span>
        </div>
      </div>
    </div>
  );
};
