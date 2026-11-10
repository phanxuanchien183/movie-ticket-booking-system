'use client';

import React, { useRef, useEffect } from 'react';
import { Seat, SeatGeometricView } from '@/types';
import { X, Eye, Compass, Maximize2, ShieldCheck, Star, Info } from 'lucide-react';

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

    // Xóa nền rạp chiếu phim (Cinema darkroom)
    ctx.fillStyle = '#06080e';
    ctx.fillRect(0, 0, width, height);

    // Vẽ lưới sàn rạp chiếu (Perspective floor grid)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    const horizonY = height * 0.45;
    const vanishX = width / 2 - (angle / 45) * (width * 0.3); // Vanishing point lệch theo góc nhìn của ghế

    for (let x = -width; x <= width * 2; x += 40) {
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

    // Ánh sáng hắt từ màn hình chiếu (Screen Ambient Light)
    const glow = ctx.createRadialGradient(
      vanishX,
      horizonY - 20,
      10,
      vanishX,
      horizonY - 20,
      width * 0.55
    );
    glow.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
    glow.addColorStop(0.4, 'rgba(56, 189, 248, 0.15)');
    glow.addColorStop(1, 'rgba(6, 8, 14, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Tính toán kích thước màn hình cong theo khoảng cách ghế
    // Ghế càng gần màn hình -> Màn hình càng to
    const scaleFactor = Math.min(1.5, Math.max(0.65, 9.0 / distance));
    const screenW = width * 0.65 * scaleFactor;
    const screenH = height * 0.45 * scaleFactor;

    // Tọa độ màn hình cong (Arc Screen)
    const screenCenterX = vanishX;
    const screenCenterY = horizonY - screenH * 0.4;

    const leftX = screenCenterX - screenW / 2;
    const rightX = screenCenterX + screenW / 2;
    const topY = screenCenterY - screenH / 2;
    const bottomY = screenCenterY + screenH / 2;

    // Vẽ Màn Hình Cong (Curved Cinema Screen)
    ctx.save();
    ctx.beginPath();

    // Cung trên của màn hình cong
    const curveOffset = 18 * scaleFactor;
    ctx.moveTo(leftX, topY + curveOffset);
    ctx.quadraticCurveTo(screenCenterX, topY - curveOffset * 0.5, rightX, topY + curveOffset);
    // Cạnh phải
    ctx.lineTo(rightX, bottomY + curveOffset);
    // Cung dưới
    ctx.quadraticCurveTo(screenCenterX, bottomY - curveOffset * 0.5, leftX, bottomY + curveOffset);
    ctx.closePath();

    // Đổ màu viền màn hình phát sáng
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // Giả lập khung hình chiếu phim bên trong màn hình
    ctx.save();
    ctx.clip(); // Clip theo hình cong màn hình

    // Background khung cảnh phim
    const screenBg = ctx.createLinearGradient(leftX, topY, rightX, bottomY);
    screenBg.addColorStop(0, '#1e1b4b');
    screenBg.addColorStop(0.5, '#431407');
    screenBg.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = screenBg;
    ctx.fillRect(leftX, topY - 30, screenW, screenH + 60);

    // Tiêu đề phim chiếu
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 8;
    ctx.fillText(movieTitle, screenCenterX, screenCenterY - 10);

    ctx.fillStyle = '#f43f5e';
    ctx.font = '12px sans-serif';
    ctx.fillText('CINEMA EXPERIENCE PREVIEW', screenCenterX, screenCenterY + 15);
    ctx.restore();

    // Vẽ ghế phía trước (Silhouettes of front rows for cinematic depth)
    ctx.fillStyle = '#090d16';
    const frontRowY = height - 25;
    for (let fx = 20; fx < width; fx += 55) {
      ctx.beginPath();
      ctx.roundRect(fx, frontRowY, 45, 30, [10, 10, 0, 0]);
      ctx.fill();
    }
  }, [seat, movieTitle]);

  if (!seat) return null;

  const metrics = seat.view_metrics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-lg">Mô Phỏng Tầm Nhìn Ghế</h3>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-rose-500 text-white shadow-md">
                  {seat.seat_id}
                </span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Hàng {seat.row_name} - Số {seat.seat_number} ({seat.seat_type})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {roomName} • Tọa độ X: {seat.coord_x}m | Y: {seat.coord_y}m | Z: {seat.coord_z}m
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Canvas Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
            <canvas
              ref={canvasRef}
              width={760}
              height={340}
              className="w-full h-auto block"
            />
            {/* Viewport Overlay Info */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-slate-300 border border-slate-800 flex items-center space-x-2">
              <Compass className="w-3.5 h-3.5 text-rose-400" />
              <span>Góc nhìn mô phỏng từ ghế {seat.seat_id}</span>
            </div>
          </div>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Khoảng cách màn hình</span>
              <span className="text-xl font-bold text-white">
                {metrics?.distance_to_screen || 0}{' '}
                <span className="text-xs text-slate-400 font-normal">mét</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Góc lệch ngang</span>
              <span className="text-xl font-bold text-white">
                {metrics?.horizontal_angle !== undefined
                  ? `${Math.abs(metrics.horizontal_angle)}°`
                  : '0°'}{' '}
                <span className="text-xs text-slate-400 font-normal">
                  {metrics?.horizontal_angle === 0
                    ? '(Chính diện)'
                    : metrics && metrics.horizontal_angle > 0
                    ? '(Lệch phải)'
                    : '(Lệch trái)'}
                </span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Góc ngước màn hình</span>
              <span className="text-xl font-bold text-white">
                {metrics?.vertical_angle || 0}°
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Độ cân đối tỉ lệ</span>
              <span className="text-xl font-bold text-emerald-400">
                {metrics ? Math.round(metrics.distortion_ratio * 100) : 100}%
              </span>
            </div>
          </div>

          {/* Qualitative Evaluation Card */}
          {metrics?.rating && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/20 via-slate-900 to-indigo-950/20 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white text-sm">
                    {metrics.rating.title}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(metrics.rating.score)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-1">
                    {metrics.rating.score}/5
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {metrics.rating.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Thuật toán hình học lượng giác Seat View Engine</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Đóng
            </button>

            {onSelectSeat && (
              <button
                onClick={() => {
                  onSelectSeat(seat.seat_id);
                  onClose();
                }}
                className={`px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-rose-400 hover:bg-slate-700'
                    : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-rose-500/25 hover:brightness-110'
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
