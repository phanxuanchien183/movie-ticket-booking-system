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
  ChevronRight,
  Sliders,
  Monitor,
  Armchair,
} from 'lucide-react';

export interface ZoneConfig {
  id: string;
  name: string;
  color: string;
  price: number;
  capacity: number;
  type: 'seated' | 'standing';
  perks?: string;
  x?: number;
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
      { id: 'sky_lounge', name: 'SKY LOUNGE', color: '#7dd3fc', price: 10000000, capacity: 50, type: 'seated', perks: 'Ghế Sofa VIP, Tiệc nhẹ, Quà lưu niệm độc quyền' },
      { id: 'svip_a', name: 'SVIP A', color: '#38bdf8', price: 5000000, capacity: 120, type: 'seated', perks: 'Soundcheck, Lối vào ưu tiên' },
      { id: 'svip_b', name: 'SVIP B', color: '#38bdf8', price: 5000000, capacity: 120, type: 'seated', perks: 'Soundcheck, Lối vào ưu tiên' },
      { id: 'vip_a', name: 'VIP A', color: '#0284c7', price: 4000000, capacity: 200, type: 'seated', perks: 'Lightstick chính hãng phát sáng' },
      { id: 'vip_b', name: 'VIP B', color: '#0284c7', price: 4000000, capacity: 200, type: 'seated', perks: 'Lightstick chính hãng phát sáng' },
      { id: 'fanzone_a', name: 'FANZONE A', color: '#6366f1', price: 2500000, capacity: 600, type: 'standing', perks: 'Sát sàn diễn chính, Khán đài đứng' },
      { id: 'fanzone_b', name: 'FANZONE B', color: '#6366f1', price: 2500000, capacity: 600, type: 'standing', perks: 'Sát sàn diễn chính, Khán đài đứng' },
      { id: 'cat_1a', name: 'CAT 1A', color: '#8b5cf6', price: 2500000, capacity: 450, type: 'seated' },
      { id: 'cat_1b', name: 'CAT 1B', color: '#8b5cf6', price: 2500000, capacity: 450, type: 'seated' },
      { id: 'cat_2a', name: 'CAT 2A', color: '#6b21a8', price: 1800000, capacity: 500, type: 'seated' },
      { id: 'cat_2b', name: 'CAT 2B', color: '#6b21a8', price: 1800000, capacity: 500, type: 'seated' },
      { id: 'cat_3a', name: 'CAT 3A', color: '#9333ea', price: 1500000, capacity: 350, type: 'seated' },
      { id: 'cat_3b', name: 'CAT 3B', color: '#9333ea', price: 1500000, capacity: 350, type: 'seated' },
      { id: 'ga_1a', name: 'GA 1A', color: '#64748b', price: 1100000, capacity: 800, type: 'standing' },
      { id: 'ga_1b', name: 'GA 1B', color: '#64748b', price: 1100000, capacity: 800, type: 'standing' },
      { id: 'ga_2a', name: 'GA 2A', color: '#475569', price: 800000, capacity: 1000, type: 'standing' },
      { id: 'ga_2b', name: 'GA 2B', color: '#475569', price: 800000, capacity: 1000, type: 'standing' },
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
      { id: 'standard', name: 'Ghế Tiêu Chuẩn', color: '#3b82f6', price: 110000, capacity: 120, type: 'seated', perks: 'Ghế bọc nỉ tiêu chuẩn CGV' },
      { id: 'vip', name: 'Ghế VIP Trung Tâm', color: '#eab308', price: 140000, capacity: 80, type: 'seated', perks: 'Tầm nhìn trực diện màn hình cong IMAX' },
      { id: 'sweetbox', name: 'Ghế Đôi Sweetbox', color: '#ec4899', price: 260000, capacity: 20, type: 'seated', perks: 'Ghế sofa đôi vách ngăn riêng tư' },
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
  '#7dd3fc', // Sky
  '#38bdf8', // Cyan
  '#0284c7', // Deep Cyan
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#6b21a8', // Deep Purple
  '#9333ea', // Bright Purple
  '#f43f5e', // Rose
  '#eab308', // Gold
  '#ec4899', // Pink
  '#64748b', // Slate
  '#475569', // Dark Slate
  '#00b14f', // Ticketbox Green
];

interface StageZoneDesignerProps {
  onSaveLayout?: (preset: StageLayoutPreset) => void;
}

export const StageZoneDesigner: React.FC<StageZoneDesignerProps> = ({ onSaveLayout }) => {
  // Requirement 8: Chia ra 2 mục con: Sơ đồ Concert/Meeting và Sơ đồ Phòng phim
  const [subCategory, setSubCategory] = useState<'concert' | 'movie'>('concert');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sayhi-vec-2026');
  const [presets, setPresets] = useState<StageLayoutPreset[]>(INITIAL_PRESETS);
  const [activeZoneId, setActiveZoneId] = useState<string>('sky_lounge');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Cinema rows configuration state (Cho mục con 2: Rạp phim)
  const [cinemaRows, setCinemaRows] = useState([
    { rowName: 'A', seatCount: 12, seatType: 'standard' },
    { rowName: 'B', seatCount: 12, seatType: 'standard' },
    { rowName: 'C', seatCount: 12, seatType: 'standard' },
    { rowName: 'D', seatCount: 14, seatType: 'vip' },
    { rowName: 'E', seatCount: 14, seatType: 'vip' },
    { rowName: 'F', seatCount: 14, seatType: 'vip' },
    { rowName: 'G', seatCount: 12, seatType: 'standard' },
    { rowName: 'H', seatCount: 6, seatType: 'sweetbox' },
  ]);

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
      alert('Sơ đồ phải có tối thiểu 1 hạng vé!');
      return;
    }

    setPresets((prev) =>
      prev.map((p) => {
        if (p.id !== currentPreset.id) return p;
        const newZones = p.zones.filter((z) => z.id !== idToDelete);
        return {
          ...p,
          zones: newZones,
        };
      })
    );

    const remaining = currentPreset.zones.filter((z) => z.id !== idToDelete);
    if (remaining.length > 0) {
      setActiveZoneId(remaining[0].id);
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

  // Filter presets based on active sub-category
  const filteredPresets = presets.filter((p) => {
    if (subCategory === 'movie') return p.category === 'movie';
    return p.category === 'concert' || p.category === 'meeting';
  });

  return (
    <div className="space-y-6">
      {/* SECTION TITLE & DESCRIPTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#00b14f]" />
            <span>Trình Thiết Kế Sơ Đồ Khán Đài & Hạng Vé Sự Kiện</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hệ thống phân bổ sơ đồ ghế, khán đài và cấu hình loại vé tương ứng cho Concert, Nhà thi đấu & Cụm rạp chiếu phim
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddZone}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1a2233] hover:bg-[#232d42] text-[#00b14f] border border-[#00b14f]/40 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Phân Khu</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#00b14f] hover:bg-[#009643] text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Sơ Đồ</span>
          </button>
        </div>
      </div>

      {/* REQUIREMENT 8: CHIA THÀNH 2 MỤC CON */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-1.5 rounded-2xl bg-[#0f1420] border border-[#1e2638]">
        <button
          type="button"
          onClick={() => {
            setSubCategory('concert');
            const concertP = presets.find((p) => p.category === 'concert' || p.category === 'meeting');
            if (concertP) {
              setSelectedPresetId(concertP.id);
              if (concertP.zones.length > 0) setActiveZoneId(concertP.zones[0].id);
            }
          }}
          className={`flex-1 w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            subCategory === 'concert'
              ? 'bg-[#00b14f] text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>MỤC 1: SƠ ĐỒ CONCERT, FAN MEETING & NHÀ THI ĐẤU</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSubCategory('movie');
            const cinemaP = presets.find((p) => p.category === 'movie');
            if (cinemaP) {
              setSelectedPresetId(cinemaP.id);
              if (cinemaP.zones.length > 0) setActiveZoneId(cinemaP.zones[0].id);
            }
          }}
          className={`flex-1 w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            subCategory === 'movie'
              ? 'bg-[#e71a0f] text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>MỤC 2: SƠ ĐỒ PHÒNG CHIẾU PHIM (CỤM RẠP CGV, LOTTE, BHD)</span>
        </button>
      </div>

      {/* PRESETS LIST OF SELECTED SUB-CATEGORY */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#121620] border border-[#1e2638]">
        <span className="text-xs font-bold text-slate-400 mr-2">Mẫu thiết lập sơ đồ:</span>
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          const Icon =
            preset.category === 'concert' ? Music : preset.category === 'movie' ? Film : Users;

          return (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetId(preset.id);
                if (preset.category === 'movie') setSubCategory('movie');
                else setSubCategory('concert');
                if (preset.zones.length > 0) {
                  setActiveZoneId(preset.zones[0].id);
                }
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? preset.category === 'movie'
                    ? 'bg-[#e71a0f] text-white shadow-md'
                    : 'bg-[#00b14f] text-white shadow-md'
                  : 'bg-[#0b0e14] text-slate-400 hover:text-white hover:bg-slate-800 border border-[#1e2638]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{preset.title}</span>
            </button>
          );
        })}
      </div>

      {/* Save Success Alert */}
      {savedSuccessMsg && (
        <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00b14f] shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* MAIN WORKSPACE: 2 COLUMNS (VISUAL INTERACTIVE MAP + CONFIG PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: VISUAL INTERACTIVE MAP CANVAS (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col bg-[#0b0e14] rounded-2xl border border-[#1e2638] overflow-hidden shadow-2xl">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between p-3.5 border-b border-[#1e2638] bg-[#121620] text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white">Bản Đồ Trực Quan Có Thể Chỉnh Sửa Trực Tiếp</span>
              <span className="text-[10px] bg-[#1c2333] px-2 py-0.5 rounded text-emerald-400 font-mono font-bold">
                {currentPreset.stageType.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                className="w-7 h-7 rounded-lg bg-[#1a2233] hover:bg-[#232d42] text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center text-slate-300">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(140, prev + 10))}
                className="w-7 h-7 rounded-lg bg-[#1a2233] hover:bg-[#232d42] text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="w-7 h-7 rounded-lg bg-[#1a2233] hover:bg-[#232d42] text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Khôi phục 100%"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* INTERACTIVE CANVAS CONTENT (Konva.js Container Architecture) */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto min-h-[560px] bg-[#07090e]">
            <div
              className="konvajs-content"
              role="presentation"
              style={{
                position: 'relative',
                userSelect: 'none',
                width: '100%',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <div className="w-full max-w-[760px] mx-auto transition-transform duration-200 space-y-4">
              {/* CANVAS SUB-CATEGORY 1: CONCERT T-STAGE */}
              {subCategory === 'concert' ? (
                <div className="space-y-4 select-none">
                  {/* SÂN KHẤU CHÍNH */}
                  <div className="space-y-2">
                    <div className="relative mx-auto w-3/4 max-w-md h-16 rounded-xl bg-slate-300 border-2 border-slate-100 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] text-slate-900 font-black text-xl tracking-[0.3em]">
                      STAGE
                    </div>

                    <div className="relative flex justify-center">
                      <div className="w-16 h-28 bg-slate-300 border-x-2 border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        STAGE
                      </div>
                    </div>

                    <div className="relative mx-auto w-4/5 max-w-lg h-9 rounded-lg bg-slate-300 border-2 border-slate-100 flex items-center justify-center text-slate-900 font-black text-xs tracking-widest">
                      STAGE
                    </div>
                  </div>

                  {/* INTERACTIVE ZONES ON CANVAS (Click to edit directly) */}
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-12 gap-2.5 items-stretch">
                      {/* Left Wings (CAT 3A, CAT 2A, GA 2A, GA 1A) */}
                      <div className="col-span-3 grid grid-cols-2 gap-2">
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
                                    ? 'border-white ring-2 ring-white/60 shadow-xl scale-105 z-10'
                                    : 'border-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className="font-black text-white text-xs">{z.name}</span>
                                <span className="text-[10px] text-white/90 font-mono mt-0.5">
                                  {(z.price / 1000000).toFixed(1)}M
                                </span>
                              </div>
                            );
                          })}
                        </div>

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
                                    ? 'border-white ring-2 ring-white/60 shadow-xl scale-105 z-10'
                                    : 'border-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className="font-black text-white text-xs">{z.name}</span>
                                <span className="text-[10px] text-white/90 font-mono mt-0.5">
                                  {(z.price / 1000000).toFixed(1)}M
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Center Wings (FANZONE A, FANZONE B) */}
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

                      {/* Right Wings (GA 1B, GA 2B, CAT 2B, CAT 3B) */}
                      <div className="col-span-3 grid grid-cols-2 gap-2">
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
                                    ? 'border-white ring-2 ring-white/60 shadow-xl scale-105 z-10'
                                    : 'border-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className="font-black text-white text-xs">{z.name}</span>
                                <span className="text-[10px] text-white/90 font-mono mt-0.5">
                                  {(z.price / 1000000).toFixed(1)}M
                                </span>
                              </div>
                            );
                          })}
                        </div>

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
                                    ? 'border-white ring-2 ring-white/60 shadow-xl scale-105 z-10'
                                    : 'border-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className="font-black text-white text-xs">{z.name}</span>
                                <span className="text-[10px] text-white/90 font-mono mt-0.5">
                                  {(z.price / 1000000).toFixed(1)}M
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Lower VIP, SVIP, SKY LOUNGE Bar */}
                    <div className="grid grid-cols-12 gap-2 pt-2">
                      {['vip_a', 'svip_a', 'sky_lounge', 'svip_b', 'vip_b'].map((id) => {
                        const z = currentPreset.zones.find((item) => item.id === id);
                        if (!z) return null;
                        const isSelected = z.id === activeZone.id;
                        const isSky = id === 'sky_lounge';

                        return (
                          <div
                            key={z.id}
                            onClick={() => setActiveZoneId(z.id)}
                            style={{ backgroundColor: z.color + (isSelected ? 'ee' : 'aa') }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-center items-center text-center ${
                              isSky ? 'col-span-4' : 'col-span-2'
                            } ${
                              isSelected
                                ? 'border-white ring-2 ring-white/60 shadow-xl scale-105 z-10'
                                : 'border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <span className="font-black text-white text-xs">{z.name}</span>
                            <span className="text-[11px] text-white/90 font-mono mt-0.5">
                              {z.price.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* CAT 1A & CAT 1B Bottom Row */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {['cat_1a', 'cat_1b'].map((id) => {
                        const z = currentPreset.zones.find((item) => item.id === id);
                        if (!z) return null;
                        const isSelected = z.id === activeZone.id;

                        return (
                          <div
                            key={z.id}
                            onClick={() => setActiveZoneId(z.id)}
                            style={{ backgroundColor: z.color + (isSelected ? 'dd' : '99') }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between px-6 ${
                              isSelected
                                ? 'border-white ring-2 ring-white/60 shadow-xl scale-105 z-10'
                                : 'border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <span className="font-black text-white text-sm">{z.name}</span>
                            <span className="text-xs text-white/90 font-mono font-bold">
                              {z.price.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Added Zones Render Area */}
                    {currentPreset.zones
                      .filter(
                        (z) =>
                          ![
                            'sky_lounge',
                            'svip_a',
                            'svip_b',
                            'vip_a',
                            'vip_b',
                            'fanzone_a',
                            'fanzone_b',
                            'cat_1a',
                            'cat_1b',
                            'cat_2a',
                            'cat_2b',
                            'cat_3a',
                            'cat_3b',
                            'ga_1a',
                            'ga_1b',
                            'ga_2a',
                            'ga_2b',
                          ].includes(z.id)
                      )
                      .map((customZone) => {
                        const isSelected = customZone.id === activeZone.id;
                        return (
                          <div
                            key={customZone.id}
                            onClick={() => setActiveZoneId(customZone.id)}
                            style={{ backgroundColor: customZone.color + (isSelected ? 'dd' : '99') }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between px-5 ${
                              isSelected
                                ? 'border-white ring-2 ring-white/60 shadow-xl scale-105 z-10'
                                : 'border-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-white" />
                              <span className="font-black text-white text-sm">{customZone.name}</span>
                            </div>
                            <span className="text-xs text-white font-mono font-bold">
                              {customZone.price.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                /* CANVAS SUB-CATEGORY 2: CINEMA ROOM (RẠP CGV, LOTTE, BHD) */
                <div className="space-y-6 select-none">
                  {/* Curved Screen */}
                  <div className="space-y-2 text-center pb-2">
                    <div className="h-3 rounded-full bg-gradient-to-r from-transparent via-[#00b14f] to-transparent shadow-[0_0_35px_#00b14f] mx-auto max-w-lg" />
                    <div className="text-xs font-black tracking-[0.35em] text-emerald-400 uppercase">
                      Màn Hình Cong Laser IMAX
                    </div>
                  </div>

                  {/* Cinema Seat Rows Grid */}
                  <div className="space-y-2.5 max-w-xl mx-auto pt-2">
                    {cinemaRows.map((row) => (
                      <div key={row.rowName} className="flex items-center justify-between space-x-3">
                        <span className="w-6 text-center font-black text-xs text-slate-400 font-mono">
                          {row.rowName}
                        </span>

                        <div className="flex-1 flex items-center justify-center space-x-1.5 flex-wrap gap-y-1">
                          {Array.from({ length: row.seatCount }).map((_, seatIdx) => (
                            <div
                              key={seatIdx}
                              onClick={() => {
                                // Toggle active zone based on seat type
                                const matchZone = currentPreset.zones.find((z) => z.id === row.seatType);
                                if (matchZone) setActiveZoneId(matchZone.id);
                              }}
                              className={`w-6 h-6 rounded text-[9px] font-bold font-mono flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
                                row.seatType === 'vip'
                                  ? 'bg-[#eab308] text-slate-950 font-black'
                                  : row.seatType === 'sweetbox'
                                  ? 'bg-[#ec4899] text-white'
                                  : 'bg-[#3b82f6] text-white'
                              }`}
                              title={`Hàng ${row.rowName} - Ghế ${seatIdx + 1} (${row.seatType.toUpperCase()})`}
                            >
                              {seatIdx + 1}
                            </div>
                          ))}
                        </div>

                        <span className="w-6 text-center font-black text-xs text-slate-400 font-mono">
                          {row.rowName}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Cinema Seat Type Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#1e2638] text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-[#3b82f6]" />
                      <span className="font-bold text-slate-300">Ghế Tiêu Chuẩn (110.000 đ)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-[#eab308]" />
                      <span className="font-bold text-slate-300">Ghế VIP Trung Tâm (140.000 đ)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-[#ec4899]" />
                      <span className="font-bold text-slate-300">Ghế Đôi Sweetbox (260.000 đ)</span>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE ZONE CONFIGURATION & PRICING (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active Zone Editor Card */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-[#00b14f]" />
                <h3 className="font-extrabold text-sm text-white">Chỉnh Sửa Phân Khu &amp; Hạng Vé</h3>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteZone(activeZone.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-bold cursor-pointer"
                title="Xóa phân khu này"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>

            {/* Zone Name Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tên Hạng Vé / Phân Khu
              </label>
              <input
                type="text"
                value={activeZone.name}
                onChange={(e) => handleUpdateActiveZone('name', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-sm text-white font-bold focus:outline-none focus:border-[#00b14f]"
              />
            </div>

            {/* Price & Capacity Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Giá Vé (VNĐ)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={activeZone.price}
                  onChange={(e) => handleUpdateActiveZone('price', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-sm font-mono font-bold text-[#00b14f] focus:outline-none focus:border-[#00b14f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sức Chứa Vé
                </label>
                <input
                  type="number"
                  value={activeZone.capacity}
                  onChange={(e) => handleUpdateActiveZone('capacity', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00b14f]"
                />
              </div>
            </div>

            {/* Standing vs Seated Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Hình Thức Vé
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateActiveZone('type', 'seated')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeZone.type === 'seated'
                      ? 'bg-[#00b14f] text-white shadow-md'
                      : 'bg-[#0b0e14] text-slate-400 hover:text-white border border-[#1e2638]'
                  }`}
                >
                  Ghế Ngồi (Seated)
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateActiveZone('type', 'standing')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeZone.type === 'standing'
                      ? 'bg-[#00b14f] text-white shadow-md'
                      : 'bg-[#0b0e14] text-slate-400 hover:text-white border border-[#1e2638]'
                  }`}
                >
                  Vé Đứng (Standing)
                </button>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Màu Sắc Đại Diện Trên Sơ Đồ
              </label>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleUpdateActiveZone('color', c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-lg transition-transform cursor-pointer ${
                      activeZone.color === c
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121620] scale-110'
                        : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Perks & Benefits Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quyền Lợi &amp; Quà Tặng (Perks)
              </label>
              <textarea
                rows={2}
                value={activeZone.perks || ''}
                onChange={(e) => handleUpdateActiveZone('perks', e.target.value)}
                placeholder="VD: 01 vòng tay phát sáng, 01 Photocard ngẫu nhiên, Lối vào ưu tiên..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-xs text-slate-200 focus:outline-none focus:border-[#00b14f] resize-none"
              />
            </div>
          </div>

          {/* Zones Summary List Card */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-2.5">
              <h3 className="font-extrabold text-sm text-white">Danh Sách {currentPreset.zones.length} Hạng Vé</h3>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                Tổng: {currentPreset.zones.reduce((sum, z) => sum + z.capacity, 0).toLocaleString()} vé
              </span>
            </div>

            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {currentPreset.zones.map((zone) => {
                const isSelected = zone.id === activeZone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => setActiveZoneId(zone.id)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1c2333] border border-[#00b14f]/50'
                        : 'bg-[#0b0e14]/60 hover:bg-[#1a2233] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded shrink-0"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="font-bold text-xs text-white truncate max-w-[140px]">
                        {zone.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#00b14f]">
                        {zone.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
