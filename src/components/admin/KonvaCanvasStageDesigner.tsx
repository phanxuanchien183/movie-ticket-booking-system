'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Save,
  Palette,
  Eye,
  Music,
  Users,
  CheckCircle2,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Tag,
  DollarSign,
  Maximize2,
  Ticket,
  Move,
  Copy,
  Sliders,
  Info,
} from 'lucide-react';

export interface StageZoneItem {
  id: string;
  name: string;
  color: string;
  price: number;
  capacity: number;
  type: 'seated' | 'standing';
  perks?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ConcertStagePreset {
  id: string;
  title: string;
  venueName: string;
  environment: 'indoor' | 'outdoor';
  eventTime: string;
  stageShape: 't-stage' | 'catwalk' | 'arena-360' | 'end-stage';
  zones: StageZoneItem[];
}

export const INITIAL_CONCERT_PRESETS: ConcertStagePreset[] = [
  {
    id: 'sayhi-vec-2026',
    title: 'Tinh Hoa "Say Hi" Concert - Đêm 4',
    venueName: 'Trung tâm Triển lãm Việt Nam (VEC)',
    environment: 'indoor',
    eventTime: '19:00 - 23:00, 15 Tháng 11, 2026',
    stageShape: 't-stage',
    zones: [
      { id: 'sky_lounge', name: 'SKY LOUNGE', color: '#7dd3fc', price: 10000000, capacity: 50, type: 'seated', perks: 'Ghế Sofa VIP, Tiệc nhẹ, Quà độc quyền', x: 260, y: 390, w: 180, h: 45 },
      { id: 'svip_a', name: 'SVIP A', color: '#38bdf8', price: 5000000, capacity: 120, type: 'seated', perks: 'Soundcheck, Lối vào ưu tiên', x: 200, y: 390, w: 50, h: 45 },
      { id: 'svip_b', name: 'SVIP B', color: '#38bdf8', price: 5000000, capacity: 120, type: 'seated', perks: 'Soundcheck, Lối vào ưu tiên', x: 450, y: 390, w: 50, h: 45 },
      { id: 'vip_a', name: 'VIP A', color: '#0284c7', price: 4000000, capacity: 200, type: 'seated', perks: 'Lightstick chính hãng phát sáng', x: 140, y: 390, w: 50, h: 45 },
      { id: 'vip_b', name: 'VIP B', color: '#0284c7', price: 4000000, capacity: 200, type: 'seated', perks: 'Lightstick chính hãng phát sáng', x: 510, y: 390, w: 50, h: 45 },
      { id: 'fanzone_a', name: 'FANZONE A', color: '#6366f1', price: 2500000, capacity: 600, type: 'standing', perks: 'Sát sàn diễn chính, Khán đài đứng', x: 200, y: 220, w: 130, h: 100 },
      { id: 'fanzone_b', name: 'FANZONE B', color: '#6366f1', price: 2500000, capacity: 600, type: 'standing', perks: 'Sát sàn diễn chính, Khán đài đứng', x: 370, y: 220, w: 130, h: 100 },
      { id: 'cat_1a', name: 'CAT 1A', color: '#8b5cf6', price: 2500000, capacity: 450, type: 'seated', perks: 'Ghế ngồi trung tâm đối diện sân khấu', x: 80, y: 450, w: 220, h: 50 },
      { id: 'cat_1b', name: 'CAT 1B', color: '#8b5cf6', price: 2500000, capacity: 450, type: 'seated', perks: 'Ghế ngồi trung tâm đối diện sân khấu', x: 400, y: 450, w: 220, h: 50 },
      { id: 'cat_2a', name: 'CAT 2A', color: '#6b21a8', price: 1800000, capacity: 500, type: 'seated', perks: 'Ghế ngồi cánh trái', x: 20, y: 260, w: 60, h: 110 },
      { id: 'cat_2b', name: 'CAT 2B', color: '#6b21a8', price: 1800000, capacity: 500, type: 'seated', perks: 'Ghế ngồi cánh phải', x: 620, y: 260, w: 60, h: 110 },
      { id: 'cat_3a', name: 'CAT 3A', color: '#9333ea', price: 1500000, capacity: 350, type: 'seated', perks: 'Khán đài tầng cao cánh trái', x: 20, y: 190, w: 60, h: 60 },
      { id: 'cat_3b', name: 'CAT 3B', color: '#9333ea', price: 1500000, capacity: 350, type: 'seated', perks: 'Khán đài tầng cao cánh phải', x: 620, y: 190, w: 60, h: 60 },
      { id: 'ga_1a', name: 'GA 1A', color: '#64748b', price: 1100000, capacity: 800, type: 'standing', perks: 'Khu đứng GA 1A', x: 145, y: 190, w: 45, h: 180 },
      { id: 'ga_1b', name: 'GA 1B', color: '#64748b', price: 1100000, capacity: 800, type: 'standing', perks: 'Khu đứng GA 1B', x: 510, y: 190, w: 45, h: 180 },
      { id: 'ga_2a', name: 'GA 2A', color: '#475569', price: 800000, capacity: 1000, type: 'standing', perks: 'Khu đứng GA 2A ngoài cùng', x: 90, y: 190, w: 45, h: 180 },
      { id: 'ga_2b', name: 'GA 2B', color: '#475569', price: 800000, capacity: 1000, type: 'standing', perks: 'Khu đứng GA 2B ngoài cùng', x: 565, y: 190, w: 45, h: 180 },
      { id: 'foh', name: 'FOH', color: '#334155', price: 0, capacity: 20, type: 'seated', perks: 'Bàn kỹ thuật âm thanh & ánh sáng', x: 320, y: 460, w: 60, h: 30 },
    ],
  },
  {
    id: 'kpop-arena-tour',
    title: 'K-Pop World Tour Arena 2026',
    venueName: 'Sân Vận Động Quốc Gia Mỹ Đình',
    environment: 'outdoor',
    eventTime: '18:30 - 22:30, 28 Tháng 12, 2026',
    stageShape: 'catwalk',
    zones: [
      { id: 'vip_floor', name: 'VIP FLOOR MTR', color: '#f43f5e', price: 6500000, capacity: 800, type: 'standing', perks: 'Soundcheck, Photocard set', x: 230, y: 220, w: 240, h: 120 },
      { id: 'cat_1_west', name: 'CAT 1 TÂY A', color: '#06b6d4', price: 3500000, capacity: 1500, type: 'seated', perks: 'Khán đài A có mái che', x: 50, y: 200, w: 120, h: 160 },
      { id: 'cat_1_east', name: 'CAT 1 ĐÔNG B', color: '#06b6d4', price: 3500000, capacity: 1500, type: 'seated', perks: 'Khán đài B có mái che', x: 530, y: 200, w: 120, h: 160 },
      { id: 'ga_grass', name: 'GA MẶT CỎ SÂN VẬN ĐỘNG', color: '#10b981', price: 1200000, capacity: 5000, type: 'standing', perks: 'Khu đứng tự do mặt sân', x: 180, y: 380, w: 340, h: 90 },
    ],
  },
];

const PALETTE = [
  '#7dd3fc', '#38bdf8', '#0284c7', '#6366f1', '#8b5cf6',
  '#a855f7', '#6b21a8', '#9333ea', '#f43f5e', '#eab308',
  '#ec4899', '#64748b', '#475569', '#00b14f', '#10b981',
];

export const KonvaCanvasStageDesigner: React.FC = () => {
  const [presets, setPresets] = useState<ConcertStagePreset[]>(INITIAL_CONCERT_PRESETS);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sayhi-vec-2026');
  const [activeZoneId, setActiveZoneId] = useState<string>('sky_lounge');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [notification, setNotification] = useState<string | null>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragZoneId, setDragZoneId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // References to the 3 Konva-like canvas layers matching user's uploaded DevTools image
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const interactiveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const CANVAS_WIDTH = 700;
  const CANVAS_HEIGHT = 520;

  const currentPreset = presets.find((p) => p.id === selectedPresetId) || presets[0];
  const activeZone = currentPreset.zones.find((z) => z.id === activeZoneId) || currentPreset.zones[0];

  // Helper to notify
  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Redraw Layer 1: Background & Grid
  const renderBackground = useCallback(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dark stadium floor background
    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle arena grid
    ctx.strokeStyle = '#141a27';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Boundary perimeter with dashes
    ctx.strokeStyle = '#222d42';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);
    ctx.setLineDash([]);

    // Measurement & North/Stage Direction marker
    ctx.fillStyle = '#475569';
    ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
    ctx.fillText('◄ HƯỚNG SÂN KHẤU CHÍNH (NORTH STAGE) ►', CANVAS_WIDTH / 2 - 130, 20);
    ctx.fillText(`${currentPreset.venueName} • [${currentPreset.environment.toUpperCase()}]`, 20, CANVAS_HEIGHT - 16);
  }, [CANVAS_WIDTH, CANVAS_HEIGHT, currentPreset]);

  // Redraw Layer 2: Stage & Zones
  const renderStage = useCallback(() => {
    const canvas = stageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Main Stage Structure
    ctx.save();
    // 1. Main Stage Top
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(200, 35, 300, 50, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STAGE', 350, 60);

    // 2. Runway / Catwalk T-Stage
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.fillRect(330, 85, 40, 120);
    ctx.strokeRect(330, 85, 40, 120);

    // 3. Sub-stage / B-Stage
    ctx.beginPath();
    ctx.roundRect(230, 140, 240, 30, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('STAGE', 350, 155);

    // Side Stage Wings
    ctx.fillStyle = '#334155';
    ctx.fillRect(130, 50, 45, 30);
    ctx.fillRect(525, 50, 45, 30);
    ctx.restore();

    // Draw Zones
    currentPreset.zones.forEach((zone) => {
      const isSelected = zone.id === activeZoneId;

      ctx.save();
      // Zone fill
      ctx.fillStyle = zone.color + (isSelected ? 'ee' : 'aa');
      ctx.strokeStyle = isSelected ? '#ffffff' : '#1e293b';
      ctx.lineWidth = isSelected ? 3 : 1;

      // Glow effect for selected zone
      if (isSelected) {
        ctx.shadowColor = zone.color;
        ctx.shadowBlur = 12;
      }

      ctx.beginPath();
      ctx.roundRect(zone.x, zone.y, zone.w, zone.h, 6);
      ctx.fill();
      ctx.stroke();

      // Zone label
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${zone.w < 60 ? '9px' : '11px'} sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(zone.name, zone.x + zone.w / 2, zone.y + zone.h / 2 - (zone.h > 40 ? 6 : 0));

      // Zone Price or Type if height allows
      if (zone.h > 40 && zone.price > 0) {
        ctx.font = '9px ui-monospace, SFMono-Regular, monospace';
        ctx.fillStyle = '#f1f5f9';
        const priceText = `${(zone.price / 1000000).toFixed(1)}M`;
        ctx.fillText(priceText, zone.x + zone.w / 2, zone.y + zone.h / 2 + 8);
      }

      ctx.restore();
    });
  }, [CANVAS_WIDTH, CANVAS_HEIGHT, currentPreset, activeZoneId]);

  // Redraw Layer 3: Interactive Selection / Drag Indicators
  const renderInteractive = useCallback(() => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (activeZone) {
      ctx.save();
      // Draw 4 corner handles for active zone
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#00b14f';
      ctx.lineWidth = 2;

      const handles = [
        { x: activeZone.x, y: activeZone.y },
        { x: activeZone.x + activeZone.w, y: activeZone.y },
        { x: activeZone.x, y: activeZone.y + activeZone.h },
        { x: activeZone.x + activeZone.w, y: activeZone.y + activeZone.h },
      ];

      handles.forEach((h) => {
        ctx.beginPath();
        ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Dimension badge above zone
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(activeZone.x, activeZone.y - 18, 120, 16);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(`X:${activeZone.x} Y:${activeZone.y} | ${activeZone.w}x${activeZone.h}px`, activeZone.x + 4, activeZone.y - 6);
      ctx.restore();
    }
  }, [CANVAS_WIDTH, CANVAS_HEIGHT, activeZone]);

  // Trigger render on state change
  useEffect(() => {
    renderBackground();
    renderStage();
    renderInteractive();
  }, [renderBackground, renderStage, renderInteractive]);

  // Mouse hit test & drag logic
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = zoomLevel / 100;
    const clickX = (e.clientX - rect.left) / scale;
    const clickY = (e.clientY - rect.top) / scale;

    // Check hit on zones (reverse to hit top zone first)
    const hitZone = [...currentPreset.zones].reverse().find((z) => {
      return clickX >= z.x && clickX <= z.x + z.w && clickY >= z.y && clickY <= z.y + z.h;
    });

    if (hitZone) {
      setActiveZoneId(hitZone.id);
      setIsDragging(true);
      setDragZoneId(hitZone.id);
      setDragOffset({
        x: clickX - hitZone.x,
        y: clickY - hitZone.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragZoneId) return;
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = zoomLevel / 100;
    const currentX = (e.clientX - rect.left) / scale;
    const currentY = (e.clientY - rect.top) / scale;

    const newX = Math.round(Math.max(10, Math.min(CANVAS_WIDTH - 60, currentX - dragOffset.x)));
    const newY = Math.round(Math.max(10, Math.min(CANVAS_HEIGHT - 40, currentY - dragOffset.y)));

    setPresets((prev) =>
      prev.map((preset) => {
        if (preset.id !== selectedPresetId) return preset;
        return {
          ...preset,
          zones: preset.zones.map((z) => {
            if (z.id !== dragZoneId) return z;
            return { ...z, x: newX, y: newY };
          }),
        };
      })
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragZoneId(null);
  };

  // CRUD for zones
  const handleUpdateActiveZone = (key: keyof StageZoneItem, val: any) => {
    setPresets((prev) =>
      prev.map((preset) => {
        if (preset.id !== selectedPresetId) return preset;
        return {
          ...preset,
          zones: preset.zones.map((z) => {
            if (z.id !== activeZoneId) return z;
            return { ...z, [key]: val };
          }),
        };
      })
    );
  };

  const handleAddZone = () => {
    const newId = `zone_${Date.now()}`;
    const newZone: StageZoneItem = {
      id: newId,
      name: `Hạng Vé Mới ${currentPreset.zones.length + 1}`,
      color: PALETTE[currentPreset.zones.length % PALETTE.length],
      price: 1500000,
      capacity: 300,
      type: 'seated',
      perks: 'Quyền lợi tiêu chuẩn khán phòng',
      x: 250,
      y: 280,
      w: 120,
      h: 50,
    };

    setPresets((prev) =>
      prev.map((preset) => {
        if (preset.id !== selectedPresetId) return preset;
        return {
          ...preset,
          zones: [...preset.zones, newZone],
        };
      })
    );
    setActiveZoneId(newId);
    showNotice(`Đã thêm phân khu mới: ${newZone.name}`);
  };

  const handleDeleteZone = (idToDelete: string) => {
    if (currentPreset.zones.length <= 1) {
      alert('Sơ đồ phải có ít nhất 1 phân khu!');
      return;
    }
    setPresets((prev) =>
      prev.map((preset) => {
        if (preset.id !== selectedPresetId) return preset;
        const remaining = preset.zones.filter((z) => z.id !== idToDelete);
        return { ...preset, zones: remaining };
      })
    );
    const nextZone = currentPreset.zones.find((z) => z.id !== idToDelete);
    if (nextZone) setActiveZoneId(nextZone.id);
    showNotice('Đã xóa phân khu khỏi sơ đồ');
  };

  const handleSave = () => {
    showNotice(`Đã lưu thiết lập sơ đồ khán đài cho "${currentPreset.title}" vào hệ thống`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#00b14f] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              A.4 THIẾT KẾ SƠ ĐỒ SÂN KHẤU (CANVAS ĐA TẦNG KONVA.JS)
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">
            Trình Biên Tập Bản Đồ Khán Đài Sân Khấu Trực Quan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mô hình cấu trúc Konva Canvas nhiều lớp (`konvajs-content`) hỗ trợ kéo thả phân khu, định giá vé và sức chứa.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddZone}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1a2233] hover:bg-[#232d42] border border-[#2a364f] text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#00b14f]" />
            <span>Thêm Phân Khu</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#00b14f] hover:bg-[#009643] text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu Sơ Đồ</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#121620] border border-[#1e2638]">
        <span className="text-xs font-bold text-slate-400 mr-2">Chọn sự kiện đại nhạc hội:</span>
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetId(preset.id);
                if (preset.zones.length > 0) setActiveZoneId(preset.zones[0].id);
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#00b14f] text-white shadow-md'
                  : 'bg-[#0b0e14] text-slate-400 hover:text-white border border-[#1e2638]'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>{preset.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                {preset.environment === 'indoor' ? 'Trong nhà' : 'Ngoài trời'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notice */}
      {notification && (
        <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#00b14f] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Workspace 2 Columns: Canvas Container + Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Konva.js Canvas Container (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#0b0e14] rounded-2xl border border-[#1e2638] overflow-hidden shadow-2xl">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between p-3.5 border-b border-[#1e2638] bg-[#121620] text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white">Sơ Đồ Canvas Konva Tương Tác</span>
              <span className="text-[10px] bg-[#1c2333] px-2 py-0.5 rounded text-emerald-400 font-mono font-bold">
                KÉO THẢ CHUỘT TRỰC TIẾP
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                className="w-7 h-7 rounded-lg bg-[#1a2233] hover:bg-[#232d42] text-slate-300 flex items-center justify-center cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center text-slate-300">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                className="w-7 h-7 rounded-lg bg-[#1a2233] hover:bg-[#232d42] text-slate-300 flex items-center justify-center cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="w-7 h-7 rounded-lg bg-[#1a2233] hover:bg-[#232d42] text-slate-300 flex items-center justify-center cursor-pointer"
                title="Khôi phục 100%"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Konva Content Container (matching user reference attachment) */}
          <div className="flex-1 p-4 flex flex-col items-center justify-center overflow-auto min-h-[560px] bg-[#07090e]">
            <div
              ref={containerRef}
              className="konvajs-content"
              role="presentation"
              style={{
                position: 'relative',
                userSelect: 'none',
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {/* Layer 1: Background Canvas */}
              <canvas
                ref={bgCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{
                  padding: '0px',
                  margin: '0px',
                  border: '0px',
                  background: 'transparent',
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  width: `${CANVAS_WIDTH}px`,
                  height: `${CANVAS_HEIGHT}px`,
                  display: 'block',
                }}
              />

              {/* Layer 2: Stage & Zones Canvas */}
              <canvas
                ref={stageCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{
                  padding: '0px',
                  margin: '0px',
                  border: '0px',
                  background: 'transparent',
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  width: `${CANVAS_WIDTH}px`,
                  height: `${CANVAS_HEIGHT}px`,
                  display: 'block',
                }}
              />

              {/* Layer 3: Interactive Events Canvas */}
              <canvas
                ref={interactiveCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  padding: '0px',
                  margin: '0px',
                  border: '0px',
                  background: 'transparent',
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  width: `${CANVAS_WIDTH}px`,
                  height: `${CANVAS_HEIGHT}px`,
                  display: 'block',
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
              />
            </div>
          </div>

          {/* Canvas Footer Legend */}
          <div className="p-3 bg-[#121620] border-t border-[#1e2638] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Move className="w-3.5 h-3.5 text-[#00b14f]" />
              <span>Nhấn giữ chuột vào bất kỳ phân khu nào để di chuyển vị trí trên sàn diễn.</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span>Tổng số khu: <strong className="text-white">{currentPreset.zones.length}</strong></span>
              <span>Tổng sức chứa: <strong className="text-white">{currentPreset.zones.reduce((s, z) => s + z.capacity, 0).toLocaleString()} khán giả</strong></span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Zone Properties Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeZone ? (
            <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-4 h-4 rounded-full border border-white/50 shrink-0 shadow"
                    style={{ backgroundColor: activeZone.color }}
                  />
                  <div>
                    <h3 className="text-sm font-black text-white">Chỉnh Sửa Phân Khu</h3>
                    <p className="text-[10px] font-mono text-slate-400">ID: {activeZone.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteZone(activeZone.id)}
                  className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors"
                  title="Xóa phân khu này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Tên Hạng Vé / Phân Khu</label>
                  <input
                    type="text"
                    value={activeZone.name}
                    onChange={(e) => handleUpdateActiveZone('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white font-bold focus:outline-none focus:border-[#00b14f]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Giá Vé (VNĐ)</label>
                    <input
                      type="number"
                      step={50000}
                      value={activeZone.price}
                      onChange={(e) => handleUpdateActiveZone('price', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white font-mono font-bold focus:outline-none focus:border-[#00b14f]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Sức Chứa (Khán Giả)</label>
                    <input
                      type="number"
                      step={10}
                      value={activeZone.capacity}
                      onChange={(e) => handleUpdateActiveZone('capacity', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white font-mono font-bold focus:outline-none focus:border-[#00b14f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Phân Loại Vé</label>
                    <select
                      value={activeZone.type}
                      onChange={(e) => handleUpdateActiveZone('type', e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white font-bold focus:outline-none focus:border-[#00b14f]"
                    >
                      <option value="seated">Ghế Ngồi (Seated)</option>
                      <option value="standing">Vé Đứng (Standing / Fanzone)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Kích Thước (Rộng x Cao)</label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        value={activeZone.w}
                        onChange={(e) => handleUpdateActiveZone('w', Number(e.target.value))}
                        className="w-1/2 px-2 py-2 rounded-lg bg-[#0b0e14] border border-[#1e2638] text-white font-mono text-center"
                      />
                      <span className="text-slate-500">×</span>
                      <input
                        type="number"
                        value={activeZone.h}
                        onChange={(e) => handleUpdateActiveZone('h', Number(e.target.value))}
                        className="w-1/2 px-2 py-2 rounded-lg bg-[#0b0e14] border border-[#1e2638] text-white font-mono text-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Màu Sắc Khu Vực</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleUpdateActiveZone('color', c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-lg transition-transform ${
                          activeZone.color === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-80 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Đặc Quyền / Quà Tặng Đính Kèm</label>
                  <textarea
                    rows={2}
                    value={activeZone.perks || ''}
                    onChange={(e) => handleUpdateActiveZone('perks', e.target.value)}
                    placeholder="Soundcheck, Photocard, Lối vào ưu tiên..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white text-xs focus:outline-none focus:border-[#00b14f]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#121620] border border-[#1e2638] text-center text-slate-400 text-xs">
              Nhấp vào một phân khu trên sơ đồ để bắt đầu chỉnh sửa.
            </div>
          )}

          {/* Quick Zone List */}
          <div className="p-4 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-2">
            <span className="text-xs font-black text-slate-300 block uppercase tracking-wider">
              Danh Sách Phân Khu Hiện Tại ({currentPreset.zones.length})
            </span>
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {currentPreset.zones.map((z) => (
                <div
                  key={z.id}
                  onClick={() => setActiveZoneId(z.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    z.id === activeZoneId
                      ? 'bg-[#1a2233] border-[#00b14f] text-white shadow-md'
                      : 'bg-[#0b0e14] border-[#1e2638] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
                    <span className="font-bold">{z.name}</span>
                  </div>
                  <div className="font-mono text-slate-400 text-[11px]">
                    {z.price > 0 ? `${z.price.toLocaleString('vi-VN')} đ` : 'Kỹ thuật FOH'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
