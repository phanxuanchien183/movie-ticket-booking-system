'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Eye,
  RotateCw,
  Compass,
  Maximize2,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Move,
  Film,
  Armchair,
  Volume2,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { calculateSeatView } from '@/lib/seat-view-engine';

interface CinemaSeatViewSimulatorProps {
  initialSeatId?: string;
}

export const CinemaSeatViewSimulator: React.FC<CinemaSeatViewSimulatorProps> = ({
  initialSeatId = 'R1-E07',
}) => {
  const [selectedSeatId, setSelectedSeatId] = useState<string>(initialSeatId);
  const [selectedRoom, setSelectedRoom] = useState<string>('room_01_imax');

  // Camera Pan-Tilt Look-Around angles (in degrees)
  const [yaw, setYaw] = useState<number>(0);       // -180 (look back left) to +180 (look back right)
  const [pitch, setPitch] = useState<number>(0);   // -45 (look down to floor) to +45 (look up to ceiling/Dolby)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; initialYaw: number; initialPitch: number }>({
    x: 0,
    y: 0,
    initialYaw: 0,
    initialPitch: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Seat Rows configuration (A through H)
  const rows = [
    { name: 'A', type: 'standard', price: 110000, seatsCount: 14 },
    { name: 'B', type: 'standard', price: 110000, seatsCount: 14 },
    { name: 'C', type: 'standard', price: 110000, seatsCount: 14 },
    { name: 'D', type: 'vip', price: 140000, seatsCount: 14 },
    { name: 'E', type: 'vip', price: 140000, seatsCount: 14 },
    { name: 'F', type: 'vip', price: 140000, seatsCount: 14 },
    { name: 'G', type: 'standard', price: 110000, seatsCount: 14 },
    { name: 'H', type: 'sweetbox', price: 260000, seatsCount: 6 },
  ];

  // Parse seat row and number from ID
  const parts = selectedSeatId.replace('R1-', '').match(/([A-H])(\d+)/);
  const currentRow = parts ? parts[1] : 'E';
  const currentSeatNum = parts ? parseInt(parts[2], 10) : 7;

  // Calculate geometric sightline using the shared engine
  const rowIndex = currentRow.charCodeAt(0) - 65; // A=0, B=1, ...
  const distanceToScreen = 5.0 + rowIndex * 1.1; // Row A is 5m, each row +1.1m
  const lateralOffset = (currentSeatNum - 7.5) * 0.6; // center is 0m
  const elevation = 1.0 + rowIndex * 0.35; // stepped stadium elevation

  // Calculate THX/SMPTE metrics
  const horizontalAngleDeg = Math.round(Math.atan2(lateralOffset, distanceToScreen) * (180 / Math.PI));
  const verticalAngleDeg = Math.round(Math.atan2(4.5 - elevation, distanceToScreen) * (180 / Math.PI));
  const distortionPercent = Math.min(100, Math.round((Math.abs(horizontalAngleDeg) / 45) * 100));

  // Visual score rating
  let viewScore = 95 - Math.abs(horizontalAngleDeg) * 1.2 - Math.max(0, verticalAngleDeg - 25) * 1.5;
  if (currentRow >= 'D' && currentRow <= 'F') viewScore += 10; // Sweet spot VIP
  viewScore = Math.max(50, Math.min(99, Math.round(viewScore)));

  // Mouse Look-Around Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialYaw: yaw,
      initialPitch: pitch,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Sensitivity: 0.3 degrees per pixel
    const sensitivity = 0.35;
    let newYaw = dragStartRef.current.initialYaw + dx * sensitivity;
    let newPitch = dragStartRef.current.initialPitch - dy * sensitivity;

    // Clamping
    if (newYaw > 180) newYaw -= 360;
    if (newYaw < -180) newYaw += 360;
    newPitch = Math.max(-40, Math.min(40, newPitch));

    setYaw(Math.round(newYaw));
    setPitch(Math.round(newPitch));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Render 360° Panoramic Pan-Tilt Cinema Canvas
  const renderCinemaCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Auditorium Environment (Dark Cinema Space)
    ctx.fillStyle = '#080b11';
    ctx.fillRect(0, 0, width, height);

    // Camera view center offset by Yaw & Pitch
    // 1 degree yaw ≈ width / 70 pixels
    const cx = width / 2 - (yaw / 60) * (width * 0.85) - lateralOffset * 15;
    const cy = height / 2 + (pitch / 40) * (height * 0.6) + (elevation - 2) * 12;

    // 2. Ceiling & Dolby Atmos Overhead Lighting
    const ceilingGrad = ctx.createLinearGradient(0, 0, 0, height * 0.4);
    ceilingGrad.addColorStop(0, '#05070a');
    ceilingGrad.addColorStop(1, '#0e1420');
    ctx.fillStyle = ceilingGrad;
    ctx.fillRect(0, 0, width, Math.max(0, cy - 80));

    // Ceiling Downlights
    for (let i = -3; i <= 3; i++) {
      const lx = cx + i * 160;
      const ly = cy - 140;
      if (lx > -50 && lx < width + 50 && ly > 10) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(lx, ly, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Cinema Floor Carpet (with ambient glow reflection from screen)
    const floorGrad = ctx.createLinearGradient(0, cy + 90, 0, height);
    floorGrad.addColorStop(0, '#0a0d14');
    floorGrad.addColorStop(0.5, '#121824');
    floorGrad.addColorStop(1, '#07090e');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, Math.max(0, cy + 90), width, height);

    // 4. Sidewalls & Acoustic Baffles with LED strips
    // Left Wall
    const leftWallX = cx - 380;
    if (leftWallX > -200) {
      ctx.fillStyle = '#0b0f17';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.max(0, leftWallX), Math.max(0, cy - 90));
      ctx.lineTo(Math.max(0, leftWallX), Math.min(height, cy + 90));
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Blue acoustic LED strip
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(Math.max(0, leftWallX), Math.max(0, cy - 90));
      ctx.lineTo(Math.max(0, leftWallX), Math.min(height, cy + 90));
      ctx.stroke();

      // Green Emergency Exit Light
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(Math.max(10, leftWallX - 45), cy - 20, 32, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('EXIT', Math.max(16, leftWallX - 40), cy - 9);
    }

    // Right Wall
    const rightWallX = cx + 380;
    if (rightWallX < width + 200) {
      ctx.fillStyle = '#0b0f17';
      ctx.beginPath();
      ctx.moveTo(width, 0);
      ctx.lineTo(Math.min(width, rightWallX), Math.max(0, cy - 90));
      ctx.lineTo(Math.min(width, rightWallX), Math.min(height, cy + 90));
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Blue acoustic LED strip
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(Math.min(width, rightWallX), Math.max(0, cy - 90));
      ctx.lineTo(Math.min(width, rightWallX), Math.min(height, cy + 90));
      ctx.stroke();
    }

    // 5. The Curved Laser IMAX Screen
    // Size scales inversely with distance to screen
    const screenScale = Math.max(0.45, Math.min(1.35, 12.0 / distanceToScreen));
    const screenW = 540 * screenScale;
    const screenH = 260 * screenScale;
    const screenX = cx - screenW / 2;
    const screenY = cy - screenH / 2;

    // Draw Screen Glow Reflection onto auditorium floor
    const screenGlow = ctx.createRadialGradient(
      cx,
      cy + screenH / 2 + 10,
      10,
      cx,
      cy + screenH / 2 + 30,
      screenW / 1.5
    );
    screenGlow.addColorStop(0, 'rgba(234, 179, 8, 0.25)');
    screenGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.1)');
    screenGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = screenGlow;
    ctx.fillRect(cx - screenW, cy + screenH / 2 - 20, screenW * 2, screenH);

    // Curved Screen Outer Frame (Silver / Matte Black)
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    // Render IMAX curved arc
    ctx.moveTo(screenX, screenY);
    ctx.quadraticCurveTo(cx, screenY - 14 * screenScale, screenX + screenW, screenY);
    ctx.lineTo(screenX + screenW, screenY + screenH);
    ctx.quadraticCurveTo(cx, screenY + screenH + 14 * screenScale, screenX, screenY + screenH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Screen Content / Movie Preview Frame
    const screenContentGrad = ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY + screenH);
    screenContentGrad.addColorStop(0, '#1e1b4b');
    screenContentGrad.addColorStop(0.3, '#312e81');
    screenContentGrad.addColorStop(0.7, '#1e293b');
    screenContentGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = screenContentGrad;
    ctx.fill();

    // Movie Title / Visual Content simulation
    ctx.fillStyle = '#f8fafc';
    ctx.font = `bold ${Math.round(20 * screenScale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('DUNE: HÀNH TINH CÁT - PHẦN HAI', cx, cy - 20 * screenScale);

    ctx.fillStyle = '#38bdf8';
    ctx.font = `${Math.round(11 * screenScale)}px ui-monospace, SFMono-Regular, monospace`;
    ctx.fillText('FORMAT: LASER IMAX 4K • DOLBY ATMOS 64 CHANNELS', cx, cy + 12 * screenScale);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = `${Math.round(9 * screenScale)}px sans-serif`;
    ctx.fillText('Tỷ lệ khung hình: 1.90:1 Mở rộng chuẩn IMAX', cx, cy + 32 * screenScale);

    // Curved Screen Border Highlight
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 6. Front Row Seats Silhouettes (Rows in front of the viewer)
    const rowsInFront = rowIndex; // Number of rows ahead
    for (let r = 0; r < rowsInFront; r++) {
      const frontRowDist = (rowIndex - r);
      const rowY = height - frontRowDist * 35 + (pitch / 40) * 30;
      const headrestW = 34 + (rowsInFront - r) * 3;
      const headrestH = 26 + (rowsInFront - r) * 2;

      for (let s = -4; s <= 4; s++) {
        const hx = width / 2 + s * (headrestW + 8) - (yaw / 60) * 80;
        if (hx > -40 && hx < width + 40 && rowY < height + 40) {
          ctx.fillStyle = '#0d131f';
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(hx - headrestW / 2, rowY, headrestW, headrestH, 6);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    // 7. Reticle / Crosshair Indicator when looking around
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 12, height / 2);
    ctx.lineTo(width / 2 + 12, height / 2);
    ctx.moveTo(width / 2, height / 2 - 12);
    ctx.lineTo(width / 2, height / 2 + 12);
    ctx.stroke();
    ctx.restore();
  }, [canvasRef, yaw, pitch, lateralOffset, distanceToScreen, elevation, rowIndex]);

  useEffect(() => {
    renderCinemaCanvas();
  }, [renderCinemaCanvas]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e71a0f] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              B.6 GÓC SEAT VIEW KHI CHỌN GHẾ (THAO TÁC CHUỘT NHÌN XUNG QUANH 360°)
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">
            Mô Phỏng Trực Quan Góc Nhìn Thực Tế Từ Vị Trí Ghế Ngồi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nhấp chọn ghế bất kỳ trên sơ đồ, sau đó rê chuột trực tiếp trên khung chiếu để xoay góc nhìn 360° kiểm tra màn hình cong, âm thanh vòm và độ ngẩng cổ.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-xs font-bold text-white focus:outline-none focus:border-red-500"
          >
            <option value="room_01_imax">Phòng 01 - Laser IMAX Starlight (Màn 22m)</option>
            <option value="room_02_gold">Phòng 02 - Gold Class Sofa VIP</option>
            <option value="room_03_4dx">Phòng 03 - 4DX Dynamic Motion</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas 360° (7 cols) + Seat Selection Matrix (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 360° Mouse Look-Around Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#0b0e14] rounded-2xl border border-[#1e2638] overflow-hidden shadow-2xl">
          {/* Canvas Toolbar & Camera Status */}
          <div className="flex items-center justify-between p-3.5 border-b border-[#1e2638] bg-[#121620] text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#e71a0f]" />
              <span className="font-extrabold text-white">Góc Nhìn Thực Tế:</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#1a2233] text-emerald-400 border border-emerald-500/30">
                Ghế {selectedSeatId}
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => { setYaw(0); setPitch(0); }}
                className="px-2 py-1 rounded bg-[#1a2233] hover:bg-[#232d42] text-[11px] font-bold text-slate-300 border border-[#2a364f] transition-colors"
                title="Quay về chính diện màn hình"
              >
                Chính diện 0°
              </button>
              <button
                onClick={() => { setYaw(-45); setPitch(5); }}
                className="px-2 py-1 rounded bg-[#1a2233] hover:bg-[#232d42] text-[11px] font-bold text-slate-300 border border-[#2a364f] transition-colors"
                title="Nhìn sang khán giả cánh trái"
              >
                Trái -45°
              </button>
              <button
                onClick={() => { setYaw(45); setPitch(5); }}
                className="px-2 py-1 rounded bg-[#1a2233] hover:bg-[#232d42] text-[11px] font-bold text-slate-300 border border-[#2a364f] transition-colors"
                title="Nhìn sang khán giả cánh phải"
              >
                Phải +45°
              </button>
              <button
                onClick={() => { setYaw(0); setPitch(28); }}
                className="px-2 py-1 rounded bg-[#1a2233] hover:bg-[#232d42] text-[11px] font-bold text-slate-300 border border-[#2a364f] transition-colors"
                title="Ngẩng nhìn loa trần Dolby Atmos"
              >
                Loa Trần +28°
              </button>
            </div>
          </div>

          {/* Interactive Mouse Drag Canvas Container */}
          <div className="relative flex items-center justify-center bg-[#07090e] p-2">
            <canvas
              ref={canvasRef}
              width={680}
              height={420}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`w-full max-w-[680px] h-[400px] rounded-xl border border-[#1e2638] ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            />

            {/* Mouse Drag Instruction Pill */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700 text-[11px] text-slate-300 pointer-events-none">
              <Move className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Nhấn giữ chuột &amp; kéo rê để xoay nhìn 360°</span>
            </div>

            {/* Live Camera Yaw / Pitch HUD */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-black/75 border border-slate-800 text-[10px] font-mono text-slate-300 pointer-events-none">
              <Compass className="w-3 h-3 text-[#38bdf8]" />
              <span>Yaw: {yaw}°</span>
              <span>•</span>
              <span>Pitch: {pitch}°</span>
            </div>
          </div>

          {/* Optical Metrics HUD (THX / SMPTE Standards) */}
          <div className="p-4 bg-[#121620] border-t border-[#1e2638] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
              <span className="text-[10px] text-slate-400 block">Khoảng Cách Màn Hình</span>
              <span className="text-base font-black text-white font-mono">{distanceToScreen.toFixed(1)}m</span>
              <span className="text-[10px] text-slate-500 block">Dãy {currentRow} tới IMAX Screen</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
              <span className="text-[10px] text-slate-400 block">Góc Lệch Tâm Ngang</span>
              <span className={`text-base font-black font-mono ${Math.abs(horizontalAngleDeg) <= 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {horizontalAngleDeg > 0 ? `+${horizontalAngleDeg}°` : `${horizontalAngleDeg}°`}
              </span>
              <span className="text-[10px] text-slate-500 block">Chuẩn SMPTE: ±30°</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
              <span className="text-[10px] text-slate-400 block">Góc Ngẩng Cổ (Vertical)</span>
              <span className={`text-base font-black font-mono ${verticalAngleDeg <= 25 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {verticalAngleDeg}°
              </span>
              <span className="text-[10px] text-slate-500 block">Chuẩn THX: &lt;= 35°</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
              <span className="text-[10px] text-slate-400 block">Chỉ Số Trải Nghiệm</span>
              <span className="text-base font-black text-emerald-400 font-mono">{viewScore}/100</span>
              <span className="text-[10px] text-emerald-500/90 block font-bold">
                {viewScore >= 90 ? '★ Golden Seat' : viewScore >= 75 ? 'Tốt Chuẩn Rạp' : 'Hạn Chế Nhẹ'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Seat Selection Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
              <div>
                <h3 className="text-sm font-black text-white">Chọn Ghế Trên Sơ Đồ Phòng Rạp</h3>
                <p className="text-[10px] text-slate-400">
                  Nhấp vào ghế để đổi vị trí camera seat view lập tức
                </p>
              </div>
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold">
                PHÒNG 01 - 104 GHẾ
              </span>
            </div>

            {/* Screen representation */}
            <div className="py-2 text-center">
              <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1 block">
                Màn Hình Cong Laser IMAX
              </span>
            </div>

            {/* Seat Matrix */}
            <div className="space-y-1.5 overflow-x-auto py-1">
              {rows.map((row) => (
                <div key={row.name} className="flex items-center justify-center space-x-1">
                  <span className="w-4 text-[10px] font-mono font-bold text-slate-400 text-center">
                    {row.name}
                  </span>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: row.seatsCount }, (_, i) => {
                      const seatNum = i + 1;
                      const seatId = `R1-${row.name}${seatNum < 10 ? '0' : ''}${seatNum}`;
                      const isSelected = selectedSeatId === seatId;

                      let colorClass = 'bg-[#1a2233] text-slate-300 hover:border-slate-400';
                      if (row.type === 'vip') {
                        colorClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/30';
                      } else if (row.type === 'sweetbox') {
                        colorClass = 'bg-pink-500/15 text-pink-300 border-pink-500/30 hover:bg-pink-500/30';
                      }

                      if (isSelected) {
                        colorClass = 'bg-[#e71a0f] text-white border-white ring-2 ring-white/50 shadow-lg scale-110 z-10';
                      }

                      return (
                        <React.Fragment key={seatId}>
                          {/* Aisle gap after seat 4 and seat 10 for normal rows */}
                          {row.type !== 'sweetbox' && (seatNum === 5 || seatNum === 11) && (
                            <div className="w-2" />
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSeatId(seatId);
                              setYaw(0);
                              setPitch(0);
                            }}
                            className={`w-6 h-6 rounded text-[9px] font-mono font-bold border transition-all flex items-center justify-center cursor-pointer ${colorClass}`}
                            title={`Ghế ${seatId} (${row.type.toUpperCase()})`}
                          >
                            {seatNum}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <span className="w-4 text-[10px] font-mono font-bold text-slate-400 text-center">
                    {row.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Seat Types Legend */}
            <div className="pt-2 border-t border-[#1e2638] flex items-center justify-center space-x-4 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-[#1a2233] border border-slate-600" />
                <span>Tiêu chuẩn (110k)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" />
                <span>VIP (140k)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-pink-500/20 border border-pink-500/50" />
                <span>Sweetbox (260k)</span>
              </div>
            </div>
          </div>

          {/* Seat details card */}
          <div className="p-4 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Thông Tin Ghế Đang Kiểm Tra:</span>
              <span className="px-2 py-0.5 rounded text-xs font-black bg-[#e71a0f] text-white">
                {selectedSeatId}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Hàng ghế / Vị trí:</span>
                <span className="font-bold text-white">Hàng {currentRow} • Số {currentSeatNum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Loại ghế:</span>
                <span className="font-bold text-amber-400 uppercase">
                  {currentRow >= 'D' && currentRow <= 'F' ? 'Ghế VIP Trục Trung Tâm' : currentRow === 'H' ? 'Ghế Đôi Sweetbox' : 'Ghế Tiêu Chuẩn'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tầm nhìn theo mô phỏng:</span>
                <span className="font-bold text-emerald-400">
                  {Math.abs(horizontalAngleDeg) <= 10 ? 'Trực diện hoàn hảo, không che khuất' : 'Góc nhìn nghiêng nhẹ, đạt chuẩn'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
