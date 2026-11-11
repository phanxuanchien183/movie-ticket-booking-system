'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Film,
  Music,
  Users,
  PhoneCall,
  MapPin,
  Gift,
  Search,
  Menu,
  X,
  Layers,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  User,
} from 'lucide-react';

interface NavbarProps {
  currentStep?: number;
  onSearchClick?: () => void;
  onCategorySelect?: (category: 'all' | 'movie' | 'concert' | 'meeting') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep = 1,
  onSearchClick,
  onCategorySelect,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navMenuItems = [
    {
      id: 'movie',
      label: 'Phim Chiếu Rạp',
      icon: Film,
      href: '/#movies',
      badge: 'CGV & Lotte',
      subItems: [
        { label: 'Phim Đang Chiếu', desc: 'Dune 2, Mai, Godzilla x Kong' },
        { label: 'Suất Chiếu Đặc Biệt (IMAX / 3D)', desc: 'Màn hình cong Laser IMAX' },
        { label: 'Phim Sắp Khởi Chiếu', desc: 'Đặt vé sớm nhận quà độc quyền' },
      ],
    },
    {
      id: 'concert',
      label: 'Live Concert & Nhạc Hội',
      icon: Music,
      href: '/#concerts',
      badge: 'Hot',
      subItems: [
        { label: 'Say Hi Concert 2026 - Đêm 4', desc: 'Trung tâm Triển lãm VEC' },
        { label: 'Anh Trai Vượt Ngàn Chông Gai', desc: 'Sân vận động Quốc gia Mỹ Đình' },
        { label: 'Vé Fanzone & Khán Đài Sân Khấu', desc: 'Gần sát đường băng biểu diễn' },
      ],
    },
    {
      id: 'meeting',
      label: 'Fan Meeting & Sự Kiện',
      icon: Users,
      href: '/#meetings',
      subItems: [
        { label: 'Giao Lưu Thần Tượng K-Pop & V-Pop', desc: 'Kim Seon Ho Love in Saigon' },
        { label: 'Vé VVIP Quyền Lợi Hi-Touch', desc: 'Chụp hình 1:1 cùng nghệ sĩ' },
      ],
    },
    {
      id: 'venues',
      label: 'Cụm Rạp & Địa Điểm',
      icon: MapPin,
      href: '/#venues',
      subItems: [
        { label: 'Cụm rạp CGV, Lotte, BHD, Galaxy', desc: 'Hơn 120 cụm rạp toàn quốc' },
        { label: 'Nhà thi đấu Phú Thọ & Quân Khu 7', desc: 'Sức chứa lên tới 15.000 khán giả' },
        { label: 'SVĐ Mỹ Đình & Trung tâm Triển lãm VEC', desc: 'Không gian đại nhạc hội quy mô lớn' },
      ],
    },
    {
      id: 'promotions',
      label: 'Ưu Đãi & Khuyến Mãi',
      icon: Gift,
      href: '/#promotions',
      badge: 'Giảm 50%',
      subItems: [
        { label: 'Chủ thẻ ACB: Giảm 50% (Mã ACB50)', desc: 'Áp dụng cho mọi vé xem phim & concert' },
        { label: 'Vietcombank Digibank: Giảm 30K', desc: 'Mã VCB30K cho đơn từ 180k' },
      ],
    },
  ];

  const handleMenuClick = (item: any) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    if (onCategorySelect && (item.id === 'movie' || item.id === 'concert' || item.id === 'meeting')) {
      onCategorySelect(item.id);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070b13]/95 border-b border-slate-800/80 shadow-xl">
      {/* 1. TOP UTILITY ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border-b border-slate-800/60 py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase text-[9px] shrink-0">
              Khuyến Mãi Hot
            </span>
            <span className="truncate">
              🔥 Giảm 50% khi thanh toán bằng thẻ ACB • Tinh Hoa &quot;Say Hi&quot; Concert &amp; Dune 2 IMAX đang mở bán vé!
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4 shrink-0 text-slate-400">
            <div className="flex items-center space-x-1.5">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Hotline CSKH: <strong className="text-white font-mono">1900 6408</strong> (8:00 - 22:00)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION MENU BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand (Ticketbox & CGV Commercial Hybrid) */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                <span>Cine</span>
                <span className="text-emerald-400">Box</span>
                <span className="ml-1 text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded uppercase tracking-wider">
                  Live
                </span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-bold">
                Đặt Vé Phim &amp; Concert Toàn Quốc
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION MENU ITEMS */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const hasSub = item.subItems && item.subItems.length > 0;
              const isDropdownOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => hasSub && setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    onClick={() => handleMenuClick(item)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.label}</span>

                    {item.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.badge}
                      </span>
                    )}

                    {hasSub && (
                      <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {/* Mega / Sub Menu Dropdown */}
                  {hasSub && isDropdownOpen && (
                    <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl shadow-black/80 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800">
                          {item.label}
                        </div>
                        {item.subItems!.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={item.href}
                            onClick={() => handleMenuClick(item)}
                            className="block p-2 rounded-xl hover:bg-slate-800 text-left transition-colors group/sub"
                          >
                            <span className="font-bold text-xs text-white group-hover/sub:text-emerald-400 block">
                              {sub.label}
                            </span>
                            <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
                              {sub.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Search Button */}
            <button
              onClick={onSearchClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Tìm sự kiện, phim...</span>
            </button>

            {/* My Tickets Button */}
            <Link
              href="/#my-tickets"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Vé Của Tôi</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-DOWN DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#090d16] px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-2">
              Danh Mục Đặt Vé
            </span>

            {navMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.id} className="border-b border-slate-800/60 pb-1">
                  <Link
                    href={item.href}
                    onClick={() => handleMenuClick(item)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-850 hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-3 py-1">
              <span>Hotline hỗ trợ:</span>
              <span className="font-mono font-bold text-emerald-400">1900 6408 (8:00 - 22:00)</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
