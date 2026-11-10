'use client';

import React from 'react';
import { Booking } from '@/types';
import { CheckCircle2, QrCode, Printer, Download, Film, Calendar, MapPin, Ticket } from 'lucide-react';

interface TicketSuccessModalProps {
  booking: Booking | null;
  seats: { seat_id: string; price: number }[];
  onClose: () => void;
}

export const TicketSuccessModal: React.FC<TicketSuccessModalProps> = ({
  booking,
  seats,
  onClose,
}) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center text-white space-y-1">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-black">Đặt Vé Xem Phim Thành Công!</h3>
          <p className="text-xs text-emerald-100">
            Mã đơn hàng: <span className="font-mono font-bold">{booking.booking_id}</span>
          </p>
        </div>

        {/* Ticket Body Card */}
        <div className="p-6 space-y-6">
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-inner">
            {/* Header info */}
            <div>
              <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Vé Điện Tử / E-Ticket
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                {booking.movie_title || 'Dune: Hành Tinh Cát - Phần Hai'}
              </h4>
            </div>

            {/* Grid Details */}
            <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-800/80 py-3">
              <div>
                <span className="text-slate-500 block">Rạp chiếu:</span>
                <span className="text-white font-medium flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{booking.room_name || 'Rạp 01 - IMAX Starlight'}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Suất chiếu:</span>
                <span className="text-white font-medium flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {booking.start_time
                      ? new Date(booking.start_time).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'Hôm nay, 19:30'}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Số ghế:</span>
                <span className="text-rose-400 font-bold text-sm tracking-wide">
                  {seats.map((s) => s.seat_id).join(', ')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Thanh toán qua:</span>
                <span className="text-slate-300 font-medium">{booking.payment_method}</span>
              </div>
            </div>

            {/* QR Code Simulation */}
            <div className="p-4 bg-white rounded-xl flex items-center justify-between text-slate-950">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Mã Quét Vào Rạp
                </div>
                <div className="text-[11px] font-mono text-slate-500 break-all max-w-[220px]">
                  {booking.qr_code || booking.booking_id}
                </div>
              </div>

              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center p-1 shrink-0">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
            </div>

            {/* Customer & Pricing */}
            <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
              <span>Người nhận: {booking.customer_name}</span>
              <span className="text-base font-bold text-emerald-400">
                {booking.final_amount.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>In Vé</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Đặt Thêm Vé Khác</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
