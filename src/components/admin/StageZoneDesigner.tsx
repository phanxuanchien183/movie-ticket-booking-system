'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Save,
  Palette,
  Eye,
  Music,
  Film,
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
} from 'lucide-react';

export interface ZoneConfig {
  id: string;
  name: string;
  color: string;
  price: number;
  capacity: number;
  type: 'seated' | 'standing';
  perks?: string;
  x?: number; // for positioning in visual editor
  y?: number;
  width?: number;
  height?: number;
}

export interface StageLayoutPreset {
  id: string;
  title: string;
  category: 'concert' | 'movie' | 'meeting';
  venueName: string;
  eventTime: string;
  stageType: 't-stage' | 'curved-screen' | 'arena-360' | 'end-stage';
  zones: ZoneConfig[];
}

export const INITIAL_PRESETS: StageLayoutPreset[] = [
  {
    id: 'sayhi-vec-2026',
    title: 'Tinh Hoa "Say Hi" Concert - Đêm 4',
    category: 'concert',
    venueName: 'Trung tâm Triển lãm Việt Nam (VEC)',
    eventTime: '19:00 - 23:00, 15 Tháng 11, 2026',
    stageType: 't-stage',
    zones: [
      { id: 'sky_lounge', name: 'SKY LOUNGE', color: '#38bdf8', price: 10000000, capacity: 50, type: 'seated', perks: 'Ghế Sofa VIP, Tiệc nhẹ, Quà lưu niệm' },
      { id: 'svip_a', name: 'SVIP A', color: '#06b6d4', price: 5000000, capacity: 120, type: 'seated', perks: 'Soundcheck, Lối vào ưu tiên' },
      { id: 'svip_b', name: 'SVIP B', color: '#06b6d4', price: 5000000, capacity: 120, type: 'seated', perks: 'Soundcheck, Lối vào ưu tiên' },
      { id: 'vip_a', name: 'VIP A', color: '#0891b2', price: 4000000, capacity: 200, type: 'seated', perks: 'Lightstick chính hãng' },
      { id: 'vip_b', name: 'VIP B', color: '#0891b2', price: 4000000, capacity: 200, type: 'seated', perks: 'Lightstick chính hãng' },
      { id: 'fanzone_a', name: 'FANZONE A', color: '#6366f1', price: 2500000, capacity: 600, type: 'standing', perks: 'Sát sàn diễn chính, Khán đài đứng' },
      { id: 'fanzone_b', name: 'FANZONE B', color: '#6366f1', price: 2500000, capacity: 600, type: 'standing', perks: 'Sát sàn diễn chính, Khán đài đứng' },
      { id: 'cat_1a', name: 'CAT 1A', color: '#a855f7', price: 2500000, capacity: 450, type: 'seated' },
      { id: 'cat_1b', name: 'CAT 1B', color: '#a855f7', price: 2500000, capacity: 450, type: 'seated' },
      { id: 'cat_2a', name: 'CAT 2A', color: '#581c87', price: 1800000, capacity: 500, type: 'seated' },
      { id: 'cat_2b', name: 'CAT 2B', color: '#581c87', price: 1800000, capacity: 500, type: 'seated' },
      { id: 'cat_3a', name: 'CAT 3A', color: '#9333ea', price: 1500000, capacity: 350, type: 'seated' },
      { id: 'cat_3b', name: 'CAT 3B', color: '#9333ea', price: 1500000, capacity: 350, type: 'seated' },
      { id: 'ga_1a', name: 'GA 1A', color: '#94a3b8', price: 1100000, capacity: 800, type: 'standing' },
      { id: 'ga_1b', name: 'GA 1B', color: '#94a3b8', price: 1100000, capacity: 800, type: 'standing' },
      { id: 'ga_2a', name: 'GA 2A', color: '#64748b', price: 800000, capacity: 1000, type: 'standing' },
      { id: 'ga_2b', name: 'GA 2B', color: '#64748b', price: 800000, capacity: 1000, type: 'standing' },
    ],
  },
  {
    id: 'cgv-imax-laser',
    title: 'Phòng Chiếu Rạp CGV Laser IMAX Starlight',
    category: 'movie',
    venueName: 'CGV Vincom Landmark 81',
    eventTime: 'Các suất chiếu liên tục hàng ngày',
    stageType: 'curved-screen',
    zones: [
      { id: 'standard', name: 'Ghế Tiêu Chuẩn', color: '#3b82f6', price: 110000, capacity: 120, type: 'seated' },
      { id: 'vip', name: 'Ghế VIP Trung Tâm', color: '#eab308', price: 140000, capacity: 80, type: 'seated' },
      { id: 'sweetbox', name: 'Ghế Đôi Sweetbox', color: '#ec4899', price: 260000, capacity: 20, type: 'seated' },
    ],
  },
  {
    id: 'fanmeeting-ncc',
    title: 'Fan Meeting Kim Seon Ho - Hội Trường NCC',
    category: 'meeting',
    venueName: 'Trung tâm Hội nghị Quốc gia NCC Hà Nội',
    eventTime: '18:00 - 21:00, 20 Tháng 12, 2026',
    stageType: 'end-stage',
    zones: [
      { id: 'vvip_stage', name: 'VVIP Gần Thần Tượng', color: '#f43f5e', price: 3200000, capacity: 150, type: 'seated', perks: 'Hi-touch, Photo 1:1, Poster ký tên' },
      { id: 'vip_zone', name: 'VIP Khán Phòng', color: '#06b6d4', price: 2200000, capacity: 400, type: 'seated', perks: 'Hi-touch, Card bo góc' },
      { id: 'cat1_zone', name: 'Khu CAT 1 Khán Đài', color: '#8b5cf6', price: 1200000, capacity: 600, type: 'seated' },
      { id: 'cat2_zone', name: 'Khu CAT 2 Khán Đài', color: '#64748b', price: 800000, capacity: 800, type: 'seated' },
    ],
  },
];

const PRESET_COLORS = [
  '#38bdf8', // Sky / Cyan
  '#06b6d4', // Teal
  '#0891b2', // Deep Teal
  '#6366f1', // Indigo / Fanzone
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#581c87', // Dark Purple
  '#9333ea', // Bright Purple
  '#f43f5e', // Rose
  '#eab308', // Amber / Gold
  '#ec4899', // Pink Sweetbox
  '#94a3b8', // Slate GA
  '#64748b', // Dark Slate
];

interface StageZoneDesignerProps {
  onSaveLayout?: (preset: StageLayoutPreset) => void;
}

export const StageZoneDesigner: React.FC<StageZoneDesignerProps> = ({ onSaveLayout }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sayhi-vec-2026');
  const [presets, setPresets] = useState<StageLayoutPreset[]>(INITIAL_PRESETS);
  const [activeZoneId, setActiveZoneId] = useState<string>('sky_lounge');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const currentPreset = presets.find((p) => p.id === selectedPresetId) || presets[0];
  const activeZone = currentPreset.zones.find((z) => z.id === activeZoneId) || currentPreset.zones[0];

  // Update a property of the active zone
  const handleUpdateActiveZone = (key: keyof ZoneConfig, value: any) => {
    setPresets((prevPresets) =>
      prevPresets.map((preset) => {
        if (preset.id !== currentPreset.id) return preset;
        return {
          ...preset,
          zones: preset.zones.map((zone) => {
            if (zone.id !== activeZone.id) return zone;
            return { ...zone, [key]: value };
          }),
        };
      })
    );
  };

  // Add new ticket zone
  const handleAddZone = () => {
    const newId = `zone_${Date.now()}`;
    const newZone: ZoneConfig = {
      id: newId,
      name: `Hạng Vé Mới ${currentPreset.zones.length + 1}`,
      color: PRESET_COLORS[currentPreset.zones.length % PRESET_COLORS.length],
      price: 1500000,
      capacity: 300,
      type: 'seated',
      perks: 'Vé vào cổng tiêu chuẩn',
    };

    setPresets((prev) =>
      prev.map((p) => {
        if (p.id !== currentPreset.id) return p;
        return {
          ...p,
          zones: [...p.zones, newZone],
        };
      })
    );
    setActiveZoneId(newId);
  };

  // Delete a zone
  const handleDeleteZone = (idToDelete: string) => {
    if (currentPreset.zones.length <= 1) {
      alert('Sơ đồ phải có ít nhất 1 phân khu vé!');
      return;
    }
    setPresets((prev) =>
      prev.map((p) => {
        if (p.id !== currentPreset.id) return p;
        const filtered = p.zones.filter((z) => z.id !== idToDelete);
        return {
          ...p,
          zones: filtered,
        };
      })
    );
    if (activeZoneId === idToDelete) {
      const remaining = currentPreset.zones.filter((z) => z.id !== idToDelete);
      if (remaining.length > 0) {
        setActiveZoneId(remaining[0].id);
      }
    }
  };

  // Save layout handler
  const handleSave = () => {
    if (onSaveLayout) {
      onSaveLayout(currentPreset);
    }
    setSavedSuccessMsg(`Đã lưu thiết lập sơ đồ và bảng giá vé "${currentPreset.title}" thành công!`);
    setTimeout(() => {
      setSavedSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Presets Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-rose-500" />
            <span>Trình Thiết Kế Sơ Đồ Khán Đài & Hạng Vé Sự Kiện</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tùy biến cấu trúc sân khấu, phân khu Fanzone/Khán đài và phân bổ loại vé cho Concert, Cụm rạp & Fan Meeting
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            const Icon =
              preset.category === 'concert' ? Music : preset.category === 'movie' ? Film : Users;

            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPresetId(preset.id);
                  if (preset.zones.length > 0) {
                    setActiveZoneId(preset.zones[0].id);
                  }
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px] sm:max-w-none">{preset.title}</span>
              </button>
            );
          })}

          <button
            onClick={handleAddZone}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Phân Khu</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Sơ Đồ</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {savedSuccessMsg && (
        <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Main Workspace (2 Columns like Ticketbox) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Stage & Zone Map Viewer (Col 8) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          {/* Viewer Toolbar */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-900/60 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-200">Bản Đồ Khán Đài Trực Quan</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                {currentPreset.stageType.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center text-slate-300">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(140, prev + 10))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                title="Khôi phục 100%"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Stage & Zone Canvas */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto min-h-[540px] bg-[#070b12]">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-[760px] transition-transform duration-200 space-y-4"
            >
              {/* Header inside canvas */}
              <div className="text-center pb-2">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block">
                  Chọn khu vực
                </span>
                <span className="text-[11px] text-slate-500">
                  Bấm vào khu vực để xem chi tiết và cấu hình giá vé
                </span>
              </div>

              {/* STAGE AREA (T-Stage or Curved Screen) */}
              {currentPreset.stageType === 't-stage' ? (
                <div className="space-y-2">
                  {/* Main Stage Top */}
                  <div className="relative mx-auto w-3/4 max-w-md h-16 rounded-xl bg-slate-400/80 border-2 border-slate-300 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.15)] text-slate-950 font-black text-xl tracking-[0.25em]">
                    STAGE
                  </div>

                  {/* Runway Stage T-Shape connecting downwards */}
                  <div className="relative flex justify-center">
                    <div className="w-16 h-28 bg-slate-400/80 border-x-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-900 uppercase tracking-widest writing-mode-vertical">
                      RUNWAY
                    </div>
                  </div>

                  {/* Secondary Stage */}
                  <div className="relative mx-auto w-4/5 max-w-lg h-9 rounded-lg bg-slate-400/80 border-2 border-slate-300 flex items-center justify-center text-slate-950 font-black text-xs tracking-widest">
                    STAGE
                  </div>
                </div>
              ) : currentPreset.stageType === 'curved-screen' ? (
                <div className="space-y-2 text-center pb-4">
                  <div className="h-3 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_30px_#10b981] mx-auto max-w-md" />
                  <div className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">
                    Màn Hình Cong Laser IMAX
                  </div>
                </div>
              ) : (
                <div className="mx-auto w-3/4 max-w-md h-12 rounded-xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-sm tracking-widest">
                  SÂN KHẤU TRUNG TÂM HỘI NGHỊ
                </div>
              )}

              {/* ZONES GRID & BLOCKS (Visual replica of Ticketbox Layout) */}
              <div className="space-y-3 pt-2">
                {/* Mid Tier Zones: Left Wings, Center Fanzones, Right Wings */}
                <div className="grid grid-cols-12 gap-2.5 items-stretch">
                  {/* Left Column (CAT 3A, CAT 2A, GA 2A, GA 1A) */}
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {/* CAT 3A & CAT 2A */}
                    <div className="flex flex-col space-y-2">
                      {['cat_3a', 'cat_2a'].map((id) => {
                        const z = currentPreset.zones.find((item) => item.id === id);
                        if (!z) return null;
                        const isSelected = z.id === activeZone.id;
                        return (
                          <div
                            key={z.id}
                            onClick={() => setActiveZoneId(z.id)}
                            style={{ backgroundColor: z.color + (isSelected ? 'dd' : '99') }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-center items-center text-center ${
                              isSelected
                                ? 'border-white ring-2 ring-white/60 shadow-lg scale-105 z-10'
                                : 'border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <span className="font-black text-white text-xs">{z.name}</span>
                            <span className="text-[10px] text-white/80 font-mono mt-0.5">
                              {(z.price / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* GA 2A & GA 1A */}
                    <div className="flex flex-col space-y-2">
                      {['ga_2a', 'ga_1a'].map((id) => {
                        const z = currentPreset.zones.find((item) => item.id === id);
                        if (!z) return null;
                        const isSelected = z.id === activeZone.id;
                        return (
                          <div
                            key={z.id}
                            onClick={() => setActiveZoneId(z.id)}
                            style={{ backgroundColor: z.color + (isSelected ? 'dd' : '99') }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-center items-center text-center flex-1 ${
                              isSelected
                                ? 'border-white ring-2 ring-white/60 shadow-lg scale-105 z-10'
                                : 'border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <span className="font-black text-white text-xs">{z.name}</span>
                            <span className="text-[10px] text-white/80 font-mono mt-0.5">
                              {(z.price / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Center Fanzone Area (FANZONE A, FANZONE B) */}
                  <div className="col-span-6 grid grid-cols-2 gap-3">
                    {['fanzone_a', 'fanzone_b'].map((id) => {
                      const z = currentPreset.zones.find((item) => item.id === id);
                      if (!z) return null;
                      const isSelected = z.id === activeZone.id;
                      return (
                        <div
                          key={z.id}
                          onClick={() => setActiveZoneId(z.id)}
                          style={{ backgroundColor: z.color + (isSelected ? 'ee' : 'aa') }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-center items-center text-center min-h-[90px] ${
                            isSelected
                              ? 'border-white ring-2 ring-white/60 shadow-xl scale-105 z-10'
                              : 'border-slate-800 hover:border-slate-400'
                          }`}
                        >
                          <span className="font-black text-white text-sm">{z.name}</span>
                          <span className="text-xs text-white/90 font-mono mt-1">
                            {z.price.toLocaleString('vi-VN')} đ
                          </span>
                          <span className="text-[10px] bg-black/40 text-white/80 px-2 py-0.5 rounded-full mt-1.5 font-medium">
                            {z.capacity} Vé Đứng
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column (GA 1B, GA 2B, CAT 2B, CAT 3B) */}
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {/* GA 1B & GA 2B */}
                    <div className="flex flex-col space-y-2">
                      {['ga_1b', 'ga_2b'].map((id) => {
                        const z = currentPreset.zones.find((item) => item.id === id);
                        if (!z) return null;
                        const isSelected = z.id === activeZone.id;
                        return (
                          <div
                            key={z.id}
                            onClick={() => setActiveZoneId(z.id)}
                            style={{ backgroundColor: z.color + (isSelected ? 'dd' : '99') }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-center items-center text-center flex-1 ${
                              isSelected
                                ? 'border-white ring-2 ring-white/60 shadow-lg scale-105 z-10'
                                : 'border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <span className="font-black text-white text-xs">{z.name}</span>
                            <span className="text-[10px] text-white/80 font-mono mt-0.5">
                              {(z.price / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* CAT 3B & CAT 2B */}
                    <div className="flex flex-col space-y-2">
                      {['cat_3b', 'cat_2b'].map((id) => {
                        const z = currentPreset.zones.find((item) => item.id === id);
                        if (!z) return null;
                        const isSelected = z.id === activeZone.id;
                        return (
                          <div
                            key={z.id}
                            onClick={() => setActiveZoneId(z.id)}
                            style={{ backgroundColor: z.color + (isSelected ? 'dd' : '99') }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-center items-center text-center ${
                              isSelected
                                ? 'border-white ring-2 ring-white/60 shadow-lg scale-105 z-10'
                                : 'border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <span className="font-black text-white text-xs">{z.name}</span>
                            <span className="text-[10px] text-white/80 font-mono mt-0.5">
                              {(z.price / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* VIP Front Row & Sky Lounge (VIP A, SVIP A, SKY LOUNGE, SVIP B, VIP B) */}
                <div className="grid grid-cols-12 gap-2.5 items-stretch pt-1">
                  {/* VIP A */}
                  <div className="col-span-2">
                    {(() => {
                      const z = currentPreset.zones.find((item) => item.id === 'vip_a');
                      if (!z) return null;
                      const isSelected = z.id === activeZone.id;
                      return (
                        <div
                          onClick={() => setActiveZoneId(z.id)}
                          style={{ backgroundColor: z.color + (isSelected ? 'ee' : 'aa') }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-center h-full flex flex-col justify-center ${
                            isSelected ? 'border-white ring-2 ring-white/60 shadow-lg scale-105' : 'border-slate-800'
                          }`}
                        >
                          <span className="font-black text-white text-xs">{z.name}</span>
                          <span className="text-[10px] text-white/90 font-mono mt-0.5">
                            {(z.price / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* SVIP A */}
                  <div className="col-span-2">
                    {(() => {
                      const z = currentPreset.zones.find((item) => item.id === 'svip_a');
                      if (!z) return null;
                      const isSelected = z.id === activeZone.id;
                      return (
                        <div
                          onClick={() => setActiveZoneId(z.id)}
                          style={{ backgroundColor: z.color + (isSelected ? 'ee' : 'aa') }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-center h-full flex flex-col justify-center ${
                            isSelected ? 'border-white ring-2 ring-white/60 shadow-lg scale-105' : 'border-slate-800'
                          }`}
                        >
                          <span className="font-black text-white text-xs">{z.name}</span>
                          <span className="text-[10px] text-white/90 font-mono mt-0.5">
                            {(z.price / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* SKY LOUNGE (Center Grand Zone) */}
                  <div className="col-span-4">
                    {(() => {
                      const z = currentPreset.zones.find((item) => item.id === 'sky_lounge');
                      if (!z) return null;
                      const isSelected = z.id === activeZone.id;
                      return (
                        <div
                          onClick={() => setActiveZoneId(z.id)}
                          style={{ backgroundColor: z.color + (isSelected ? 'ff' : 'bb') }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all text-center h-full flex flex-col justify-center ${
                            isSelected
                              ? 'border-white ring-2 ring-white shadow-xl scale-105 z-10'
                              : 'border-slate-800 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                            <span className="font-black text-slate-950 text-xs sm:text-sm">
                              {z.name}
                            </span>
                          </div>
                          <span className="text-xs text-slate-900 font-extrabold font-mono mt-0.5">
                            {z.price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* SVIP B */}
                  <div className="col-span-2">
                    {(() => {
                      const z = currentPreset.zones.find((item) => item.id === 'svip_b');
                      if (!z) return null;
                      const isSelected = z.id === activeZone.id;
                      return (
                        <div
                          onClick={() => setActiveZoneId(z.id)}
                          style={{ backgroundColor: z.color + (isSelected ? 'ee' : 'aa') }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-center h-full flex flex-col justify-center ${
                            isSelected ? 'border-white ring-2 ring-white/60 shadow-lg scale-105' : 'border-slate-800'
                          }`}
                        >
                          <span className="font-black text-white text-xs">{z.name}</span>
                          <span className="text-[10px] text-white/90 font-mono mt-0.5">
                            {(z.price / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* VIP B */}
                  <div className="col-span-2">
                    {(() => {
                      const z = currentPreset.zones.find((item) => item.id === 'vip_b');
                      if (!z) return null;
                      const isSelected = z.id === activeZone.id;
                      return (
                        <div
                          onClick={() => setActiveZoneId(z.id)}
                          style={{ backgroundColor: z.color + (isSelected ? 'ee' : 'aa') }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-center h-full flex flex-col justify-center ${
                            isSelected ? 'border-white ring-2 ring-white/60 shadow-lg scale-105' : 'border-slate-800'
                          }`}
                        >
                          <span className="font-black text-white text-xs">{z.name}</span>
                          <span className="text-[10px] text-white/90 font-mono mt-0.5">
                            {(z.price / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Bottom Row (CAT 1A, FOH Booth, CAT 1B) */}
                <div className="grid grid-cols-12 gap-3 pt-1">
                  <div className="col-span-5">
                    {(() => {
                      const z = currentPreset.zones.find((item) => item.id === 'cat_1a');
                      if (!z) return null;
                      const isSelected = z.id === activeZone.id;
                      return (
                        <div
                          onClick={() => setActiveZoneId(z.id)}
                          style={{ backgroundColor: z.color + (isSelected ? 'ee' : 'aa') }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                            isSelected ? 'border-white ring-2 ring-white/60 shadow-lg scale-105' : 'border-slate-800'
                          }`}
                        >
                          <span className="font-black text-white text-xs">{z.name}</span>
                          <span className="text-[10px] text-white/90 font-mono ml-2">
                            {z.price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* FOH Sound & Lighting Booth */}
                  <div className="col-span-2 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    FOH
                  </div>

                  <div className="col-span-5">
                    {(() => {
                      const z = currentPreset.zones.find((item) => item.id === 'cat_1b');
                      if (!z) return null;
                      const isSelected = z.id === activeZone.id;
                      return (
                        <div
                          onClick={() => setActiveZoneId(z.id)}
                          style={{ backgroundColor: z.color + (isSelected ? 'ee' : 'aa') }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                            isSelected ? 'border-white ring-2 ring-white/60 shadow-lg scale-105' : 'border-slate-800'
                          }`}
                        >
                          <span className="font-black text-white text-xs">{z.name}</span>
                          <span className="text-[10px] text-white/90 font-mono ml-2">
                            {z.price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Classes Price Card & Zone Configurator (Col 4 - Ticketbox Style) */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          {/* Ticketbox Right Panel Header Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="font-extrabold text-white text-base leading-snug">
              {currentPreset.title}
            </h3>
            <div className="text-xs text-slate-400 space-y-1">
              <div>⏰ {currentPreset.eventTime}</div>
              <div>📍 {currentPreset.venueName}</div>
            </div>
          </div>

          {/* Ticket Classes List (Ticketbox Price Sidebar replica) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bảng Giá Vé & Phân Khu ({currentPreset.zones.length})
              </span>
              <button
                onClick={handleAddZone}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {currentPreset.zones.map((zone) => {
                const isSelected = zone.id === activeZone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setActiveZoneId(zone.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {/* Color dot */}
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-200 block truncate">
                          {zone.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {zone.type === 'standing' ? 'Vé Đứng (Standing)' : 'Ghế Ngồi (Seated)'} • {zone.capacity} vé
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">
                        {zone.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Zone Detail Editor */}
          {activeZone && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: activeZone.color }}
                  />
                  <h4 className="font-bold text-white text-xs uppercase">
                    Cấu Hình: {activeZone.name}
                  </h4>
                </div>

                <button
                  onClick={() => handleDeleteZone(activeZone.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                  title="Xóa phân khu này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Tên Hạng Vé / Phân Khu:</label>
                  <input
                    type="text"
                    value={activeZone.name}
                    onChange={(e) => handleUpdateActiveZone('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Giá Vé (VNĐ):</label>
                    <input
                      type="number"
                      step={50000}
                      value={activeZone.price}
                      onChange={(e) => handleUpdateActiveZone('price', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-extrabold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Sức Chứa (Số Vé):</label>
                    <input
                      type="number"
                      value={activeZone.capacity}
                      onChange={(e) => handleUpdateActiveZone('capacity', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1.5">Màu Sắc Nhận Diện Sơ Đồ:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => handleUpdateActiveZone('color', hex)}
                        style={{ backgroundColor: hex }}
                        className={`w-6 h-6 rounded-lg transition-transform ${
                          activeZone.color === hex
                            ? 'ring-2 ring-white scale-110 shadow-md'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Loại Vé Khán Đài:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateActiveZone('type', 'seated')}
                      className={`py-1.5 rounded-lg font-bold border transition-all ${
                        activeZone.type === 'seated'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      Ghế Ngồi (Seated)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateActiveZone('type', 'standing')}
                      className={`py-1.5 rounded-lg font-bold border transition-all ${
                        activeZone.type === 'standing'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      Đứng Tự Do (GA)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Quyền Lợi Kèm Theo:</label>
                  <input
                    type="text"
                    value={activeZone.perks || ''}
                    placeholder="Soundcheck, quà lưu niệm, check-in riêng..."
                    onChange={(e) => handleUpdateActiveZone('perks', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

