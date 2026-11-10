'use client';

import React, { useRef, useEffect } from 'react';
import { Seat, SeatGeometricView } from '@/types';
import { X, Eye, Compass, Star, MapPin, Check } from 'lucide-react';

interface SeatViewModalProps {
  seat: (Seat & { view_metrics?: SeatGeometricView }) | null;
  movieTitle?: string;
  roomName?: string;
  onClose: () => void;
  onSelectSeat?: (seatId: string) => void;
  isSelected?: boolean;
}

export const SeatViewModal: React.FC<SeatViewModalProps> = ({
  seat,
  movieTitle = 'Phim Chiếu Rạp',
  roomName = 'Laser IMAX Starlight',
  onClose,
  onSelectSeat,
  isSelected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!seat || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const metrics = seat.view_metrics;

    const angle = metrics?.horizontal_angle || 0;
    const distance = metrics?.distance_to_screen || 7.0;

    // Nền phòng chiếu tối (Cinematic Dark)
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, height);

    // Lưới sàn rạp chiếu
    ctx.strokeStyle = '#1a2234';
    ctx.lineWidth = 1;

    const horizonY = height * 0.45;
    const vanishX = width / 2 - (angle / 45) * (width * 0.28);

    for (let x = -width; x <= width * 2; x += 45) {
      ctx.beginPath();
      ctx.moveTo(vanishX, horizonY);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = horizonY + 20; y < height; y += (y - horizonY) * 0.35 + 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Ánh sáng hắt từ màn hình
    const glow = ctx.createRadialGradient(
      vanishX,
      horizonY - 20,
      10,
      vanishX,
      horizonY - 20,
      width * 0.55
    );
    glow.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    glow.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
    glow.addColorStop(1, 'rgba(8, 12, 20, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Tỷ lệ màn hình cong
    const scaleFactor = Math.min(1.4, Math.max(0.7, 9.0 / distance));
    const screenW = width * 0.65 * scaleFactor;
    const screenH = height * 0.45 * scaleFactor;

    const screenCenterX = vanishX;
    const screenCenterY = horizonY - screenH * 0.4;

    const leftX = screenCenterX - screenW / 2;
    const rightX = screenCenterX + screenW / 2;
    const topY = screenCenterY - screenH / 2;
    const bottomY = screenCenterY + screenH / 2;

    // Vẽ Màn Hình Cong Cinema
    ctx.save();
    ctx.beginPath();
    const curveOffset = 18 * scaleFactor;
    ctx.moveTo(leftX, topY + curveOffset);
    ctx.quadraticCurveTo(screenCenterX, topY - curveOffset * 0.5, rightX, topY + curveOffset);
    ctx.lineTo(rightX, bottomY + curveOffset);
    ctx.quadraticCurveTo(screenCenterX, bottomY - curveOffset * 0.5, leftX, bottomY + curveOffset);
    ctx.closePath();

    ctx.fillStyle = '#0b1329';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    // Giả lập khung cảnh phim
    ctx.save();
    ctx.clip();
    const screenBg = ctx.createLinearGradient(leftX, topY, rightX, bottomY);
    screenBg.addColorStop(0, '#064e3b');
    screenBg.addColorStop(0.5, '#0f172a');
    screenBg.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = screenBg;
    ctx.fillRect(leftX, topY - 30, screenW, screenH + 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 8;
    ctx.fillText(movieTitle, screenCenterX, screenCenterY - 8);

    ctx.fillStyle = '#34d399';
    ctx.font = '12px sans-serif';
    ctx.fillText('TRẢI NGHIỆM ĐIỆN ẢNH CHÂN THỰC', screenCenterX, screenCenterY + 16);
    ctx.restore();

    // Hàng ghế phía trước
    ctx.fillStyle = '#060911';
    const frontRowY = height - 25;
    for (let fx = 25; fx < width; fx += 55) {
      ctx.beginPath();
      ctx.roundRect(fx, frontRowY, 45, 30, [8, 8, 0, 0]);
      ctx.fill();
    }
  }, [seat, movieTitle]);

  if (!seat) return null;
  const metrics = seat.view_metrics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-white text-base">Tầm Nhìn Từ Vị Trí Ghế</h3>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500 text-slate-950">
                  {seat.seat_id}
                </span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {seat.seat_type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {roomName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Canvas Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <canvas
              ref={canvasRef}
              width={720}
              height={320}
              className="w-full h-auto block"
            />
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-slate-300 border border-slate-800 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Góc nhìn mô phỏng từ ghế {seat.seat_id} tới màn chiếu</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-0.5">Khoảng cách tới màn hình</span>
              <span className="text-lg font-bold text-white">
                {metrics?.distance_to_screen || 0} <span className="text-xs text-slate-500 font-normal">mét</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-0.5">Độ lệch tâm</span>
              <span className="text-lg font-bold text-white">
                {metrics ? `${Math.abs(metrics.horizontal_angle)}°` : '0°'}
                <span className="text-xs text-slate-400 font-normal ml-1">
                  {metrics?.horizontal_angle === 0
                    ? '(Chính diện)'
                    : metrics && metrics.horizontal_angle > 0
                    ? '(Lệch phải)'
                    : '(Lệch trái)'}
                </span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-0.5">Đánh giá tầm nhìn</span>
              <span className="text-lg font-bold text-emerald-400 flex items-center justify-center space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{metrics?.rating?.score || 5}/5</span>
              </span>
            </div>
          </div>

          {/* Review card */}
          {metrics?.rating && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="font-bold text-sm text-white flex items-center space-x-2">
                <span>{metrics.rating.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {metrics.rating.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
          <span className="text-xs text-slate-400">
            Giá vé: <strong className="text-emerald-400 font-semibold">{seat.price?.toLocaleString('vi-VN')} đ</strong>
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Đóng
            </button>

            {onSelectSeat && (
              <button
                onClick={() => {
                  onSelectSeat(seat.seat_id);
                  onClose();
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                }`}
              >
                {isSelected ? 'Bỏ chọn ghế này' : 'Chọn ghế này ngay'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
