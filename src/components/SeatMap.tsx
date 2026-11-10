'use client';

import React, { useState, useEffect } from 'react';
import { Seat, SeatGeometricView } from '@/types';
import { Eye, Lock, Check, Clock, Music, Monitor } from 'lucide-react';

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
  isConcert?: boolean;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatIds,
  currentUserId,
  onToggleSeat,
  onOpenSeatView,
  lockTimeRemaining,
  isConcert = false,
}) => {
  const rowsMap = new Map<string, SeatWithView[]>();
  seats.forEach((seat) => {
    if (!rowsMap.has(seat.row_name)) {
      rowsMap.set(seat.row_name, []);
    }
    rowsMap.get(seat.row_name)!.push(seat);
  });

  const rowNames = Array.from(rowsMap.keys()).sort();

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

  const [hoveredSeat, setHoveredSeat] = useState<SeatWithView | null>(null);
  const [actionModalSeat, setActionModalSeat] = useState<SeatWithView | null>(null);

  return (
    <div className="space-y-6">
      {/* Timer Bar (Ticketbox Style) */}
      {selectedSeatIds.length > 0 && timer !== null && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              Vé đang được giữ độc quyền cho bạn. Vui lòng hoàn tất trong:
            </span>
          </div>
          <span className="text-base sm:text-lg font-mono font-black text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
            {formatTimer(timer)}
          </span>
        </div>
      )}

      {/* Stage / Screen Representation */}
      <div className="relative pt-4 pb-6 text-center">
        <div className="relative mx-auto max-w-xl">
          {isConcert ? (
            <div>
              {/* Concert Main Stage */}
              <div className="h-4 rounded-xl bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 shadow-[0_0_30px_#f43f5e] mx-4 flex items-center justify-center text-[10px] font-black text-slate-950 uppercase tracking-widest">
                ★ SÂN KHẤU CHÍNH (MAIN STAGE) ★
              </div>
              <div className="mt-2 text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Nhà Thi Đấu / Khán Đài Sân Khấu
              </div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-rose-500/15 to-transparent pointer-events-none blur-xl" />
            </div>
          ) : (
            <div>
              {/* Cinema Curved Screen */}
              <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_25px_#10b981] mx-6" />
              <div className="mt-2 text-[11px] font-bold tracking-[0.3em] text-slate-400 uppercase">
                Màn Hình Chiếu Rạp
              </div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none blur-lg" />
            </div>
          )}
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
                <span className="w-5 text-xs font-bold text-slate-500 text-center">
                  {rowName}
                </span>

                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.seat_id);
                    const isBooked = seat.status === 'booked';
                    const isLockedByOther =
                      seat.status === 'locked' && seat.locked_by_user !== currentUserId;
                    const isSweetbox = seat.seat_type === 'Sweetbox';
                    const isVVIP = seat.seat_type === 'VVIP_Stage';
                    const isVIP = seat.seat_type === 'VIP';
                    const isCAT1 = seat.seat_type === 'CAT1';

                    let seatColorClass = 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500';
                    if (isBooked) {
                      seatColorClass = 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-30';
                    } else if (isLockedByOther) {
                      seatColorClass = 'bg-amber-950/70 text-amber-400 border-amber-600/70 cursor-not-allowed';
                    } else if (isSelected) {
                      seatColorClass =
                        'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/30 scale-105';
                    } else if (isVVIP) {
                      seatColorClass =
                        'bg-rose-950/50 text-rose-300 border-rose-600/70 hover:border-rose-400';
                    } else if (isVIP) {
                      seatColorClass =
                        'bg-amber-950/40 text-amber-300 border-amber-700/60 hover:border-amber-500';
                    } else if (isCAT1) {
                      seatColorClass =
                        'bg-indigo-950/40 text-indigo-300 border-indigo-700/60 hover:border-indigo-500';
                    } else if (isSweetbox) {
                      seatColorClass =
                        'bg-pink-950/40 text-pink-300 border-pink-700/60 hover:border-pink-500';
                    }

                    return (
                      <div key={seat.seat_id} className="relative group">
                        <button
                          disabled={isBooked || isLockedByOther}
                          onClick={() => {
                            if (!isBooked && !isLockedByOther) {
                              setActionModalSeat(seat);
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
                              : `Ghế ${seat.seat_id} • ${seat.zone_name || seat.seat_type} • ${seat.price?.toLocaleString('vi-VN')} đ`
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

                <span className="w-5 text-xs font-bold text-slate-500 text-center">
                  {rowName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Seat Details & Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 gap-3">
        {hoveredSeat ? (
          <div className="flex items-center space-x-3">
            <span className="font-bold text-white text-sm">
              {hoveredSeat.seat_id}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              {hoveredSeat.zone_name || hoveredSeat.seat_type}
            </span>
            <span className="text-emerald-400 font-bold text-sm">
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
          <span>Di chuột hoặc chạm vào vị trí ghế để xem khu vực và giá vé</span>
        )}

        {hoveredSeat && (
          <button
            onClick={() => onOpenSeatView(hoveredSeat)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xem góc nhìn tới {isConcert ? 'Sân khấu' : 'Màn chiếu'}</span>
          </button>
        )}
      </div>

      {/* Legend & Price Guide */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300">
        {isConcert ? (
          <>
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded bg-rose-950/60 border border-rose-600/80" />
              <span>VVIP Sân Khấu</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded bg-amber-950/40 border border-amber-600/60" />
              <span>VIP Trung Tâm</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded bg-indigo-950/40 border border-indigo-700/60" />
              <span>Khán Đài CAT 1</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-600" />
              <span>Khán Đài CAT 2</span>
            </div>
          </>
        ) : (
          <>
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
              <span>Ghế Đôi Sweetbox</span>
            </div>
          </>
        )}

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

      {/* Seat Action Popup (2 Options: Chọn vị trí này / Xem góc nhìn View 3D) */}
      {actionModalSeat && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActionModalSeat(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700/80 p-5 shadow-2xl shadow-black/90 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-base">
                  {actionModalSeat.row_name}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    Ghế {actionModalSeat.seat_id}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hàng {actionModalSeat.row_name} • Ghế số {actionModalSeat.seat_number}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActionModalSeat(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
                title="Đóng popup"
              >
                ✕
              </button>
            </div>

            {/* Thông tin chi tiết ghế */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phân hạng ghế:</span>
                <span className="font-bold text-slate-200">
                  {actionModalSeat.zone_name || actionModalSeat.seat_type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Giá vé:</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {actionModalSeat.price?.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tầm nhìn:</span>
                <span className="text-slate-300 font-medium">
                  {isConcert ? 'Hướng sân khấu chính' : 'Màn hình trung tâm'}
                </span>
              </div>
            </div>

            {/* 2 Lựa chọn chính (2 Options) */}
            <div className="space-y-2.5 pt-1">
              {/* Option 1: Chọn vị trí này */}
              <button
                onClick={() => {
                  const target = actionModalSeat;
                  setActionModalSeat(null);
                  onToggleSeat(target);
                }}
                className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                  selectedSeatIds.includes(actionModalSeat.seat_id)
                    ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {selectedSeatIds.includes(actionModalSeat.seat_id)
                    ? 'Bỏ chọn vị trí này'
                    : 'Chọn vị trí này'}
                </span>
              </button>

              {/* Option 2: Xem góc nhìn 3D */}
              <button
                onClick={() => {
                  const target = actionModalSeat;
                  setActionModalSeat(null);
                  onOpenSeatView(target);
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 hover:border-emerald-500/40 text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition-all"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Xem góc nhìn tới {isConcert ? 'Sân khấu' : 'Màn chiếu'} (3D View)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
