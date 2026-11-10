'use client';

import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, X, Info, Check, AlertCircle } from 'lucide-react';

export interface StageZone {
  id: string;
  name: string;
  code: string;
  price: number;
  color: string;
  type: 'standing' | 'seated';
  is_sold_out?: boolean;
  age_limit?: string;
  perks?: string[];
  // SVG coordinates
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TICKETBOX_ZONES: StageZone[] = [
  // Fanzone inside T-stage wings
  {
    id: 'FANZONE_A',
    name: 'FANZONE A',
    code: 'FANZONE_A',
    price: 2500000,
    color: '#6366f1',
    type: 'standing',
    is_sold_out: true,
    age_limit: 'KHU VỰC DÀNH CHO NGƯỜI THAM DỰ TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé vào cổng khu vực FANZONE A (đứng)', 'Sát sàn diễn chính chữ T', '01 vòng tay phát sáng chính hãng'],
    x: 310,
    y: 150,
    width: 120,
    height: 140,
  },
  {
    id: 'FANZONE_B',
    name: 'FANZONE B',
    code: 'FANZONE_B',
    price: 2500000,
    color: '#6366f1',
    type: 'standing',
    is_sold_out: false,
    age_limit: 'KHU VỰC DÀNH CHO NGƯỜI THAM DỰ TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé vào cổng khu vực FANZONE B (đứng)', 'Sát sàn diễn chính chữ T', '01 vòng tay phát sáng chính hãng'],
    x: 570,
    y: 150,
    width: 120,
    height: 140,
  },

  // Outer Left Wing
  {
    id: 'GA_1A',
    name: 'GA 1A',
    code: 'GA_1A',
    price: 1100000,
    color: '#64748b',
    type: 'standing',
    is_sold_out: true,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé vào cổng GA 1A (đứng)', '01 vòng tay sự kiện'],
    x: 205,
    y: 140,
    width: 90,
    height: 220,
  },
  {
    id: 'GA_2A',
    name: 'GA 2A',
    code: 'GA_2A',
    price: 800000,
    color: '#475569',
    type: 'standing',
    is_sold_out: false,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé vào cổng GA 2A (đứng)', '01 vòng tay sự kiện'],
    x: 105,
    y: 140,
    width: 85,
    height: 220,
  },
  {
    id: 'CAT_3A',
    name: 'CAT 3A',
    code: 'CAT_3A',
    price: 1500000,
    color: '#9333ea',
    type: 'seated',
    is_sold_out: true,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé khán đài CAT 3A (ngồi)', '01 vòng tay sự kiện'],
    x: 10,
    y: 140,
    width: 80,
    height: 90,
  },
  {
    id: 'CAT_2A',
    name: 'CAT 2A',
    code: 'CAT_2A',
    price: 1800000,
    color: '#6b21a8',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'KHU VỰC DÀNH CHO NGƯỜI THAM DỰ TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé vào cổng khu vực CAT 2A (ngồi)', 'Quà tặng nhận tại sự kiện: 01 vòng tay, 01 Photocard ngẫu nhiên'],
    x: 10,
    y: 245,
    width: 80,
    height: 195,
  },

  // Outer Right Wing
  {
    id: 'GA_1B',
    name: 'GA 1B',
    code: 'GA_1B',
    price: 1100000,
    color: '#64748b',
    type: 'standing',
    is_sold_out: false,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé vào cổng GA 1B (đứng)', '01 vòng tay sự kiện'],
    x: 705,
    y: 140,
    width: 90,
    height: 220,
  },
  {
    id: 'GA_2B',
    name: 'GA 2B',
    code: 'GA_2B',
    price: 800000,
    color: '#475569',
    type: 'standing',
    is_sold_out: true,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé vào cổng GA 2B (đứng)', '01 vòng tay sự kiện'],
    x: 810,
    y: 140,
    width: 85,
    height: 220,
  },
  {
    id: 'CAT_3B',
    name: 'CAT 3B',
    code: 'CAT_3B',
    price: 1500000,
    color: '#9333ea',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé khán đài CAT 3B (ngồi)', '01 vòng tay sự kiện'],
    x: 910,
    y: 140,
    width: 80,
    height: 90,
  },
  {
    id: 'CAT_2B',
    name: 'CAT 2B',
    code: 'CAT_2B',
    price: 1800000,
    color: '#6b21a8',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'KHU VỰC DÀNH CHO NGƯỜI THAM DỰ TỪ ĐỦ 08 TUỔI',
    perks: ['01 vé vào cổng khu vực CAT 2B (ngồi)', 'Quà tặng nhận tại sự kiện: 01 vòng tay, 01 Photocard ngẫu nhiên'],
    x: 910,
    y: 245,
    width: 80,
    height: 195,
  },

  // Lower Center
  {
    id: 'SKY_LOUNGE',
    name: 'SKY LOUNGE',
    code: 'SKY_LOUNGE',
    price: 10000000,
    color: '#7dd3fc',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'KHU VỰC DÀNH CHO KHÁCH VIP TỪ ĐỦ 08 TUỔI',
    perks: ['Ghế sofa hạng sang, Tiệc nhẹ thượng hạng', 'Bộ quà tặng lưu niệm độc quyền', 'Lối check-in ưu tiên riêng biệt'],
    x: 400,
    y: 380,
    width: 200,
    height: 80,
  },
  {
    id: 'SVIP_A',
    name: 'SVIP A',
    code: 'SVIP_A',
    price: 5000000,
    color: '#38bdf8',
    type: 'seated',
    is_sold_out: true,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['Ghế ngồi trực diện sàn chữ T', 'Vé tham gia buổi Soundcheck', 'Thẻ đeo sự kiện'],
    x: 320,
    y: 380,
    width: 70,
    height: 60,
  },
  {
    id: 'SVIP_B',
    name: 'SVIP B',
    code: 'SVIP_B',
    price: 5000000,
    color: '#38bdf8',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['Ghế ngồi trực diện sàn chữ T', 'Vé tham gia buổi Soundcheck', 'Thẻ đeo sự kiện'],
    x: 610,
    y: 380,
    width: 70,
    height: 60,
  },
  {
    id: 'VIP_A',
    name: 'VIP A',
    code: 'VIP_A',
    price: 4000000,
    color: '#0284c7',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['Ghế ngồi VIP trung tâm', 'Lightstick chính hãng phát sáng', '01 Photocard'],
    x: 235,
    y: 380,
    width: 75,
    height: 60,
  },
  {
    id: 'VIP_B',
    name: 'VIP B',
    code: 'VIP_B',
    price: 4000000,
    color: '#0284c7',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['Ghế ngồi VIP trung tâm', 'Lightstick chính hãng phát sáng', '01 Photocard'],
    x: 690,
    y: 380,
    width: 75,
    height: 60,
  },

  // Bottom Wings
  {
    id: 'CAT_1A',
    name: 'CAT 1A',
    code: 'CAT_1A',
    price: 2500000,
    color: '#8b5cf6',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'DÀNH CHO NGƯỜI TỪ ĐỦ 08 TUỔI',
    perks: ['Khán đài CAT 1A góc nhìn bao quát toàn bộ hiệu ứng sân khấu', '01 vòng tay'],
    x: 130,
    y: 460,
    width: 250,
    height: 80,
  },
  {
    id: 'CAT_1B',
    name: 'CAT 1B',
    code: 'CAT_1B',
    price: 2500000,
    color: '#8b5cf6',
    type: 'seated',
    is_sold_out: false,
    age_limit: 'Khán đài CAT 1B góc nhìn bao quát toàn bộ hiệu ứng sân khấu',
    perks: ['Khán đài CAT 1B góc nhìn bao quát toàn bộ hiệu ứng sân khấu', '01 vòng tay'],
    x: 620,
    y: 460,
    width: 250,
    height: 80,
  },
];

interface TicketboxStageMapProps {
  selectedZone: StageZone | null;
  ticketQuantity: number;
  onSelectZone: (zone: StageZone, quantity: number) => void;
  onClearSelection: () => void;
  onProceedToCheckout?: (zone: StageZone, quantity: number) => void;
}

export const TicketboxStageMap: React.FC<TicketboxStageMapProps> = ({
  selectedZone,
  ticketQuantity,
  onSelectZone,
  onClearSelection,
  onProceedToCheckout,
}) => {
  const [scale, setScale] = useState(1);
  const [modalZone, setModalZone] = useState<StageZone | null>(null);
  const [modalQuantity, setModalQuantity] = useState(ticketQuantity > 0 ? ticketQuantity : 1);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setScale(1);

  const handleZoneClick = (zone: StageZone) => {
    setModalZone(zone);
    if (selectedZone?.id === zone.id) {
      setModalQuantity(ticketQuantity > 0 ? ticketQuantity : 1);
    } else {
      setModalQuantity(1);
    }
  };

  const handleConfirmModal = () => {
    if (modalZone && modalQuantity > 0) {
      onSelectZone(modalZone, modalQuantity);
      if (onProceedToCheckout) {
        onProceedToCheckout(modalZone, modalQuantity);
      }
      setModalZone(null);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[560px] bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 select-none">
      {/* Zoom Controls (Hình 3 Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Phóng to"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          aria-label="Đặt lại góc nhìn"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Thu nhỏ"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Canvas Stage & Zones */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          viewBox="0 0 1000 580"
          className="w-full max-w-[950px] h-auto drop-shadow-2xl"
          style={{ maxHeight: '540px' }}
        >
          {/* SÂN KHẤU CHÍNH (TOP MAIN STAGE) */}
          <rect
            x="290"
            y="30"
            width="420"
            height="65"
            rx="4"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <text
            x="500"
            y="72"
            textAnchor="middle"
            fill="#334155"
            fontSize="26"
            fontWeight="900"
            letterSpacing="3"
          >
            STAGE
          </text>

          {/* SÀN DIỄN CHỮ T (CATWALK RUNWAY) */}
          <rect
            x="440"
            y="95"
            width="120"
            height="185"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="1"
          />

          {/* SÂN KHẤU PHỤ Ở GIỮA CHỮ T (MIDDLE EXTENSION STAGE) */}
          <rect
            x="305"
            y="290"
            width="390"
            height="45"
            rx="4"
            fill="#cbd5e1"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <text
            x="500"
            y="320"
            textAnchor="middle"
            fill="#334155"
            fontSize="18"
            fontWeight="900"
            letterSpacing="2"
          >
            STAGE
          </text>

          {/* SMALL STAGE SIDES */}
          <rect x="205" y="70" width="55" height="40" rx="3" fill="#475569" opacity="0.6" />
          <rect x="740" y="70" width="55" height="40" rx="3" fill="#475569" opacity="0.6" />

          <rect x="295" y="215" width="35" height="45" rx="3" fill="#1e293b" stroke="#475569" />
          <text x="312" y="242" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="800">
            STAGE
          </text>

          <rect x="670" y="215" width="35" height="45" rx="3" fill="#1e293b" stroke="#475569" />
          <text x="687" y="242" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="800">
            STAGE
          </text>

          {/* FOH (FRONT OF HOUSE) */}
          <rect
            x="455"
            y="480"
            width="90"
            height="45"
            rx="3"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
          />
          <text
            x="500"
            y="508"
            textAnchor="middle"
            fill="#cbd5e1"
            fontSize="14"
            fontWeight="900"
            letterSpacing="1"
          >
            FOH
          </text>

          {/* TẤT CẢ CÁC KHU VỰC VÉ (SEAT ZONES) */}
          {TICKETBOX_ZONES.map((zone) => {
            const isSelected = selectedZone?.id === zone.id;
            const isSoldOut = zone.is_sold_out;

            return (
              <g
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                className={`cursor-pointer transition-all duration-200 group ${
                  isSoldOut ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                {/* Rect của khu vực */}
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="6"
                  fill={zone.color}
                  stroke={isSelected ? '#10b981' : isSoldOut ? '#64748b' : '#0f172a'}
                  strokeWidth={isSelected ? '4' : '1.5'}
                  className={`transition-all duration-150 ${
                    !isSoldOut ? 'group-hover:brightness-125 group-hover:stroke-white' : ''
                  }`}
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.7))' : undefined,
                  }}
                />

                {/* Tên khu vực */}
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2 + 5}
                  textAnchor="middle"
                  fill={zone.type === 'standing' && zone.color.includes('#64748b') ? '#f1f5f9' : '#ffffff'}
                  fontSize={zone.width > 100 ? '16' : '13'}
                  fontWeight="900"
                  letterSpacing="0.5"
                  className="pointer-events-none select-none drop-shadow"
                >
                  {zone.name}
                </text>

                {/* Huy hiệu hết vé */}
                {isSoldOut && (
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 22}
                    textAnchor="middle"
                    fill="#fca5a5"
                    fontSize="10"
                    fontWeight="800"
                    className="pointer-events-none select-none"
                  >
                    HẾT VÉ
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* POPUP MODAL CHỌN OPTION KHI CLICK VÀO KHU (HÌNH 4 TICKETBOX) */}
      {modalZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                Khu {modalZone.name.replace(' ', '_')}
              </h3>
              <button
                type="button"
                onClick={() => setModalZone(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Text */}
            <div className="text-xs font-bold text-amber-600">
              Lưu ý: Bạn chỉ có thể chọn vé trong 1 khu vực
            </div>

            {/* Ticket Stepper Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="font-extrabold text-sm text-slate-900 block">{modalZone.name}</span>
                <span className="text-xs text-slate-500 font-bold font-mono">
                  {modalZone.price.toLocaleString('vi-VN')} đ / vé
                </span>
              </div>

              {modalZone.is_sold_out ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-600">
                  Hết vé
                </span>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalQuantity((prev) => Math.max(prev - 1, 0))}
                    disabled={modalQuantity <= 0}
                    className="w-8 h-8 rounded-lg border border-slate-300 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 text-center font-black text-base text-slate-900 font-mono">
                    {modalQuantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setModalQuantity((prev) => Math.min(prev + 1, 4))}
                    disabled={modalQuantity >= 4}
                    className="w-8 h-8 rounded-lg border border-emerald-500 text-emerald-600 flex items-center justify-center font-bold hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Information Card (Hình 4) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-start space-x-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{modalZone.age_limit || 'KHU VỰC DÀNH CHO NGƯỜI THAM DỰ TỪ ĐỦ 08 TUỔI'}</span>
              </div>

              <ul className="space-y-1 pl-6 list-disc text-slate-600 leading-relaxed text-[11px]">
                {modalZone.perks?.map((perk, pIdx) => (
                  <li key={pIdx}>{perk}</li>
                )) || (
                  <>
                    <li>01 vé vào cổng khu vực {modalZone.name} ({modalZone.type === 'seated' ? 'ngồi' : 'đứng'})</li>
                    <li>Quà tặng nhận tại sự kiện: 01 vòng tay, 01 Photocard ngẫu nhiên</li>
                  </>
                )}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-1">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setModalZone(null);
                    onClearSelection();
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Chọn khu vực khác
                </button>
              </div>

              <button
                type="button"
                disabled={modalQuantity === 0 || modalZone.is_sold_out}
                onClick={handleConfirmModal}
                className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition-all ${
                  modalQuantity > 0 && !modalZone.is_sold_out
                    ? 'bg-[#00b14f] hover:bg-[#009643] text-white shadow-xl shadow-emerald-600/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{modalQuantity > 0 ? `Tiếp tục (${(modalZone.price * modalQuantity).toLocaleString('vi-VN')} đ) »` : 'Vui lòng chọn vé »'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
