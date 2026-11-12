'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Calendar,
  Ticket,
  Users,
  DollarSign,
  Lock,
  Unlock,
  Tag,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Layers,
  LogOut,
  User,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Music,
  MapPin,
  Building,
  Tv,
  Armchair,
  Eye,
  Compass,
} from 'lucide-react';
import { StageZoneDesigner } from '@/components/admin/StageZoneDesigner';
import { KonvaCanvasStageDesigner } from '@/components/admin/KonvaCanvasStageDesigner';
import { CinemaSeatViewSimulator } from '@/components/admin/CinemaSeatViewSimulator';
import {
  ConcertCategoriesManager,
  ConcertEventsManager,
  ConcertVenuesManager,
} from '@/components/admin/ConcertAdminModules';
import {
  CinemaChainsManager,
  CinemaBranchesManager,
  CinemaAddressesManager,
  CinemaRoomsManager,
  CinemaSeatDesigner,
  MoviesManager,
} from '@/components/admin/CinemaAdminModules';

export type AdminTab =
  | 'overview'
  | 'designer'
  | 'locks'
  | 'promotions'
  | 'bookings'
  // Group A: Đại Nhạc Hội
  | 'concert_categories'
  | 'concert_events'
  | 'concert_venues'
  | 'concert_stage_designer'
  // Group B: Rạp Chiếu Phim
  | 'cinema_chains'
  | 'cinema_branches'
  | 'cinema_addresses'
  | 'cinema_rooms'
  | 'cinema_seat_designer'
  | 'cinema_seat_view'
  | 'movies_mgmt';

export default function AdminDashboard() {
  // Requirement 5: Quản lý đăng nhập Admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check login session on mount
  useEffect(() => {
    const authStored = sessionStorage.getItem('cineticket_admin_auth');
    if (authStored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'admin' && loginPassword === 'admin123') {
      sessionStorage.setItem('cineticket_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác! (Mặc định: admin / admin123)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cineticket_admin_auth');
    setIsAuthenticated(false);
  };

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [stats, setStats] = useState({
    totalRevenue: 24500000,
    totalBookings: 182,
    activeLocks: 3,
    occupancyRate: 78.5,
  });

  const [activeLocks, setActiveLocks] = useState([
    {
      showtimeId: 1,
      movieTitle: 'Dune: Hành Tinh Cát - Phần Hai',
      roomName: 'Rạp 01 - Laser IMAX Starlight',
      seatId: 'R1-E07',
      userId: 1,
      expiresIn: 185,
      status: 'Active',
    },
    {
      showtimeId: 1,
      movieTitle: 'Dune: Hành Tinh Cát - Phần Hai',
      roomName: 'Rạp 01 - Laser IMAX Starlight',
      seatId: 'R1-E08',
      userId: 1,
      expiresIn: 185,
      status: 'Active',
    },
    {
      showtimeId: 2,
      movieTitle: 'Oppenheimer',
      roomName: 'Rạp 01 - Laser IMAX Starlight',
      seatId: 'R1-D05',
      userId: 42,
      expiresIn: 72,
      status: 'Active',
    },
  ]);

  const [promotions, setPromotions] = useState([
    {
      code: 'ACB50',
      title: 'Giảm 50% cùng Thẻ ACB',
      bankCode: 'ACB',
      discount: '50% (Max 100k)',
      minOrder: '150.000 VNĐ',
      used: 12,
      limit: 500,
      status: 'Active',
    },
    {
      code: 'VCB30K',
      title: 'Giảm 30K Vietcombank',
      bankCode: 'VCB',
      discount: '30.000 VNĐ',
      minOrder: '180.000 VNĐ',
      used: 45,
      limit: 1000,
      status: 'Active',
    },
    {
      code: 'CINEMA20',
      title: 'Khách hàng thân thiết',
      bankCode: 'Tất cả ngân hàng',
      discount: '20% (Max 50k)',
      minOrder: '100.000 VNĐ',
      used: 150,
      limit: 2000,
      status: 'Active',
    },
  ]);

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 'BK-982134-AC8F12',
      customerName: 'Phan Xuân Chiến',
      movie: 'Dune: Hành Tinh Cát - Phần Hai',
      seats: 'R1-E07, R1-E08',
      finalAmount: 140000,
      paymentMethod: 'ACB_CREDIT',
      time: '10 phút trước',
      status: 'Paid',
    },
    {
      id: 'BK-774120-BD3E90',
      customerName: 'Nguyễn Hoàng Long',
      movie: 'Oppenheimer',
      seats: 'R1-D04',
      finalAmount: 120000,
      paymentMethod: 'VCB_DIGIBANK',
      time: '25 phút trước',
      status: 'Paid',
    },
    {
      id: 'BK-552918-FA1122',
      customerName: 'Lê Minh Tú',
      movie: 'Mai - Trấn Thành Film',
      seats: 'R1-H01 (Sweetbox)',
      finalAmount: 220000,
      paymentMethod: 'MOMO_WALLET',
      time: '1 giờ trước',
      status: 'Paid',
    },
  ]);

  const handleForceReleaseLock = (seatId: string) => {
    setActiveLocks((prev) => prev.filter((l) => l.seatId !== seatId));
  };

  // ========================================================
  // REQUIREMENT 5: MÀN HÌNH ĐĂNG NHẬP ADMIN (KHI CHƯA AUTH)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-[#00b14f] selection:text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#121620] border border-[#1e2638] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#00b14f]/15 border border-[#00b14f]/30 text-[#00b14f] flex items-center justify-center mx-auto shadow-xl">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              CINETICKET ADMIN PORTAL
            </h1>
            <p className="text-xs text-slate-400">
              Cổng Quản Trị Hệ Thống Đặt Vé Phim &amp; Sơ Đồ Concert
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Tên Đăng Nhập</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Nhập tài khoản admin..."
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-sm text-white focus:outline-none focus:border-[#00b14f] font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Mật Khẩu Quản Trị</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-sm text-white focus:outline-none focus:border-[#00b14f] font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00b14f] hover:bg-[#009643] text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Đăng Nhập Quản Trị Hệ Thống »
            </button>
          </form>

          <div className="pt-2 border-t border-[#1e2638] text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                setLoginUsername('admin');
                setLoginPassword('admin123');
              }}
              className="text-xs font-bold text-[#00b14f] hover:underline"
            >
              Điền tài khoản mặc định (admin / admin123)
            </button>

            <div>
              <Link
                href="/"
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại trang chủ người dùng</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // REQUIREMENT 6: BỐ CỤC CHUẨN ADMIN:
  // - HEADER: Logo & User Icon Name
  // - BÊN TRÁI: Menu phân cấp rõ A. Đại Nhạc Hội & B. Rạp Chiếu Phim
  // - Ở GIỮA: Content
  // ========================================================
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-[#00b14f] selection:text-white">
      {/* 1. HEADER (LOGO + USER ICON NAME) */}
      <header className="h-16 shrink-0 bg-[#0c1017] border-b border-[#1e2638] sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00b14f] to-emerald-700 flex items-center justify-center shadow-md">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight text-white flex items-center">
              <span>Cine</span>
              <span className="text-[#00b14f]">Ticket</span>
              <span className="ml-2 text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-black uppercase">
                ADMIN
              </span>
            </span>
            <span className="text-[10px] text-slate-400">Hệ Thống Quản Trị Vé Phim &amp; Sơ Đồ Sân Khấu</span>
          </div>
        </div>

        {/* Center: System Status Indicators */}
        <div className="hidden md:flex items-center space-x-3 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#121620] border border-[#1e2638]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Redis 6379 Active</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#121620] border border-[#1e2638]">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>MySQL 8.0 Active</span>
          </div>
        </div>

        {/* Right: User Avatar, Name & Logout */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5 bg-[#121620] border border-[#1e2638] px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-[#00b14f]/20 border border-[#00b14f]/40 text-[#00b14f] flex items-center justify-center font-black text-xs">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight">
                Quản trị viên Hệ thống
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                admin@cineticket.vn
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
            title="Đăng xuất khỏi trang quản trị"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* 2. BODY SPLIT: BÊN TRÁI LÀ MENU, Ở GIỮA LÀ CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* BÊN TRÁI: MENU SIDEBAR (w-64) */}
        <aside className="w-64 shrink-0 bg-[#0c1017] border-r border-[#1e2638] flex flex-col justify-between p-4 overflow-y-auto">
          <div className="space-y-6">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3">
              Menu Điều Hành
            </div>

            {/* PHẦN A: ĐẠI NHẠC HỘI (CONCERTS & EVENTS) */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 px-3 py-1 text-[11px] font-black text-[#00b14f] tracking-wider uppercase">
                <Music className="w-3.5 h-3.5" />
                <span>A. Đại Nhạc Hội</span>
              </div>
              <nav className="space-y-1">
                {[
                  { id: 'concert_categories', name: '1. Danh Mục Sự Kiện', icon: Tag },
                  { id: 'concert_events', name: '2. Quản Lý Sự Kiện', icon: Calendar },
                  { id: 'concert_venues', name: '3. Trong Nhà & Ngoài Trời', icon: MapPin },
                  { id: 'concert_stage_designer', name: '4. Thiết Kế Sơ Đồ (Konva)', icon: Layers, badge: 'Canvas' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#00b14f] text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-[#121620]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-emerald-300 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* PHẦN B: RẠP CHIẾU PHIM (CINEMAS & MOVIES) */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 px-3 py-1 text-[11px] font-black text-red-400 tracking-wider uppercase">
                <Film className="w-3.5 h-3.5" />
                <span>B. Rạp Chiếu Phim</span>
              </div>
              <nav className="space-y-1">
                {[
                  { id: 'cinema_chains', name: '1. Chuỗi Rạp Chiếu', icon: Building },
                  { id: 'cinema_branches', name: '2. Chi Nhánh Rạp', icon: Building },
                  { id: 'cinema_addresses', name: '3. Địa Chỉ Rạp', icon: MapPin },
                  { id: 'cinema_rooms', name: '4. Quản Lý Phòng Rạp', icon: Tv },
                  { id: 'cinema_seat_designer', name: '5. Thiết Kế Ghế Phòng', icon: Armchair },
                  { id: 'cinema_seat_view', name: '6. Góc Seat View 360°', icon: Compass, badge: '360°' },
                  { id: 'movies_mgmt', name: '7. Quản Lý Phim', icon: Film },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#e71a0f] text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-[#121620]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-rose-300 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* VẬN HÀNH CHUNG HỆ THỐNG */}
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3">
                Vận Hành Hệ Thống
              </div>
              <nav className="space-y-1">
                {[
                  { id: 'overview', name: 'Tổng Quan Hệ Thống', icon: TrendingUp },
                  { id: 'designer', name: 'Thiết Kế Sơ Đồ & Hạng Vé', icon: Layers, badge: 'Mục 1 & 2' },
                  { id: 'locks', name: 'Giám Sát Khóa Ghế Redis', icon: Lock, count: activeLocks.length },
                  { id: 'promotions', name: 'Khuyến Mãi & Ngân Hàng', icon: Tag, count: promotions.length },
                  { id: 'bookings', name: 'Lịch Sử Giao Dịch', icon: Ticket, count: recentBookings.length },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#00b14f] text-white shadow-lg shadow-emerald-600/25'
                          : 'text-slate-400 hover:text-white hover:bg-[#121620]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.count !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                            isActive ? 'bg-white text-slate-900 font-black' : 'bg-[#1e2638] text-slate-300'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}

                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            isActive ? 'bg-white text-slate-900' : 'bg-emerald-500/20 text-[#00b14f]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom link to consumer site */}
          <div className="pt-4 border-t border-[#1e2638]">
            <Link
              href="/"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#121620] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-[#00b14f]" />
                <span>Xem Trang Người Dùng</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </Link>
          </div>
        </aside>

        {/* Ở GIỮA: CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#07090e]">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Tổng Doanh Thu</span>
                    <DollarSign className="w-4 h-4 text-[#00b14f]" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {stats.totalRevenue.toLocaleString('vi-VN')}{' '}
                    <span className="text-xs font-normal text-slate-400">VNĐ</span>
                  </div>
                  <div className="text-[11px] text-[#00b14f] font-semibold">↑ 18.5% so với tuần trước</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Vé Đã Xuất</span>
                    <Ticket className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{stats.totalBookings}</div>
                  <div className="text-[11px] text-slate-400">Giao dịch thành công</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Khóa Ghế Đang Giữ</span>
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">{activeLocks.length}</div>
                  <div className="text-[11px] text-amber-300">Redis TTL active (5 phút)</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Tỷ Lệ Lấp Đầy Ghế</span>
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-indigo-400 font-mono">{stats.occupancyRate}%</div>
                  <div className="text-[11px] text-slate-400">Trung bình các suất chiếu</div>
                </div>
              </div>

              {/* Quick Jump Grid into A and B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[#121620] border border-[#00b14f]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#00b14f] uppercase tracking-wider">
                      A. ĐẠI NHẠC HỘI &amp; CONCERTS
                    </span>
                    <Music className="w-4 h-4 text-[#00b14f]" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Quản lý danh mục sự kiện, các tour âm nhạc quy mô lớn, địa điểm trong nhà &amp; ngoài trời, thiết kế sơ đồ sân khấu trực quan Konva.js.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab('concert_categories')}
                      className="px-2.5 py-1 rounded-lg bg-[#0b0e14] hover:bg-[#1a2233] text-[11px] font-bold text-slate-200 border border-[#1e2638]"
                    >
                      1. Danh Mục
                    </button>
                    <button
                      onClick={() => setActiveTab('concert_events')}
                      className="px-2.5 py-1 rounded-lg bg-[#0b0e14] hover:bg-[#1a2233] text-[11px] font-bold text-slate-200 border border-[#1e2638]"
                    >
                      2. Sự Kiện
                    </button>
                    <button
                      onClick={() => setActiveTab('concert_venues')}
                      className="px-2.5 py-1 rounded-lg bg-[#0b0e14] hover:bg-[#1a2233] text-[11px] font-bold text-slate-200 border border-[#1e2638]"
                    >
                      3. Địa Điểm
                    </button>
                    <button
                      onClick={() => setActiveTab('concert_stage_designer')}
                      className="px-2.5 py-1 rounded-lg bg-[#00b14f]/20 hover:bg-[#00b14f]/30 text-[11px] font-black text-[#00b14f] border border-[#00b14f]/40"
                    >
                      4. Sơ Đồ Konva »
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#121620] border border-red-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-400 uppercase tracking-wider">
                      B. RẠP CHIẾU PHIM &amp; PHIM
                    </span>
                    <Film className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Quản trị chuỗi rạp (CGV, Lotte, BHD, Galaxy), chi nhánh, địa chỉ rạp, cấu hình phòng Laser IMAX/Gold Class, thiết kế sơ đồ ghế và góc nhìn Seat View 360°.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab('cinema_chains')}
                      className="px-2.5 py-1 rounded-lg bg-[#0b0e14] hover:bg-[#1a2233] text-[11px] font-bold text-slate-200 border border-[#1e2638]"
                    >
                      1. Chuỗi Rạp
                    </button>
                    <button
                      onClick={() => setActiveTab('cinema_rooms')}
                      className="px-2.5 py-1 rounded-lg bg-[#0b0e14] hover:bg-[#1a2233] text-[11px] font-bold text-slate-200 border border-[#1e2638]"
                    >
                      4. Phòng Rạp
                    </button>
                    <button
                      onClick={() => setActiveTab('cinema_seat_view')}
                      className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-[11px] font-black text-red-400 border border-red-500/40"
                    >
                      6. Seat View 360° »
                    </button>
                    <button
                      onClick={() => setActiveTab('movies_mgmt')}
                      className="px-2.5 py-1 rounded-lg bg-[#0b0e14] hover:bg-[#1a2233] text-[11px] font-bold text-slate-200 border border-[#1e2638]"
                    >
                      7. Quản Lý Phim
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="p-6 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white">Giao Dịch Đặt Vé Gần Đây</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-[#00b14f] hover:underline"
                  >
                    Xem tất cả giao dịch »
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#0b0e14] text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Mã Đặt Vé</th>
                        <th className="p-3">Khách Hàng</th>
                        <th className="p-3">Sự Kiện / Phim</th>
                        <th className="p-3">Vị Trí Ghế</th>
                        <th className="p-3">Thanh Toán</th>
                        <th className="p-3">Số Tiền</th>
                        <th className="p-3">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2638]">
                      {recentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#1a2233]/40">
                          <td className="p-3 font-mono font-bold text-white">{b.id}</td>
                          <td className="p-3 font-medium text-slate-200">{b.customerName}</td>
                          <td className="p-3 font-semibold text-slate-300">{b.movie}</td>
                          <td className="p-3 font-mono text-emerald-400">{b.seats}</td>
                          <td className="p-3 text-slate-400">{b.paymentMethod}</td>
                          <td className="p-3 font-mono font-bold text-white">
                            {b.finalAmount.toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-[#00b14f] border border-emerald-500/30">
                              ĐÃ THANH TOÁN
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* GROUP A: ĐẠI NHẠC HỘI MODULES */}
          {activeTab === 'concert_categories' && <ConcertCategoriesManager />}
          {activeTab === 'concert_events' && <ConcertEventsManager />}
          {activeTab === 'concert_venues' && <ConcertVenuesManager />}
          {activeTab === 'concert_stage_designer' && <KonvaCanvasStageDesigner />}

          {/* GROUP B: RẠP CHIẾU PHIM MODULES */}
          {activeTab === 'cinema_chains' && <CinemaChainsManager />}
          {activeTab === 'cinema_branches' && <CinemaBranchesManager />}
          {activeTab === 'cinema_addresses' && <CinemaAddressesManager />}
          {activeTab === 'cinema_rooms' && <CinemaRoomsManager />}
          {activeTab === 'cinema_seat_designer' && <CinemaSeatDesigner />}
          {activeTab === 'cinema_seat_view' && <CinemaSeatViewSimulator />}
          {activeTab === 'movies_mgmt' && <MoviesManager />}

          {/* TAB: DESIGNER (STAGE ZONE DESIGNER - MỤC 1 & 2 SUB-CATEGORIES) */}
          {activeTab === 'designer' && (
            <div>
              <StageZoneDesigner />
            </div>
          )}

          {/* TAB: LOCKS */}
          {activeTab === 'locks' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Giám Sát Khóa Ghế Thời Gian Thực (Redis Key Manager)</h3>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    TTL 300s Tự Động Giải Phóng
                  </span>
                </div>

                <div className="space-y-3">
                  {activeLocks.map((lock, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0b0e14] border border-[#1e2638] flex flex-col sm:flex-row items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-bold text-sm text-white">
                            Ghế: <span className="font-mono text-emerald-400">{lock.seatId}</span> • {lock.movieTitle}
                          </div>
                          <div className="text-xs text-slate-400">
                            {lock.roomName} • Người dùng ID: {lock.userId}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono font-bold text-amber-300">
                          Còn lại: {lock.expiresIn}s
                        </span>
                        <button
                          onClick={() => handleForceReleaseLock(lock.seatId)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition-colors cursor-pointer"
                        >
                          Giải Phóng Khóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div className="p-6 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4">
              <h3 className="text-base font-bold text-white">Chính Sách Khuyến Mãi &amp; Liên Kết Ngân Hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {promotions.map((p) => (
                  <div key={p.code} className="p-4 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-[#00b14f] bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        {p.code}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{p.bankCode}</span>
                    </div>
                    <div className="font-bold text-sm text-white">{p.title}</div>
                    <div className="text-xs text-slate-400">Mức giảm: {p.discount}</div>
                    <div className="text-xs text-slate-400">Đã dùng: {p.used} / {p.limit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="p-6 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4">
              <h3 className="text-base font-bold text-white">Toàn Bộ Lịch Sử Đặt Vé</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0b0e14] text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="p-3">Mã Vé</th>
                      <th className="p-3">Khách Hàng</th>
                      <th className="p-3">Sự Kiện</th>
                      <th className="p-3">Ghế</th>
                      <th className="p-3">Phương Thức</th>
                      <th className="p-3">Tổng Tiền</th>
                      <th className="p-3">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2638]">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#1a2233]/40">
                        <td className="p-3 font-mono font-bold text-white">{b.id}</td>
                        <td className="p-3 text-slate-200">{b.customerName}</td>
                        <td className="p-3 text-slate-300">{b.movie}</td>
                        <td className="p-3 font-mono text-emerald-400">{b.seats}</td>
                        <td className="p-3 text-slate-400">{b.paymentMethod}</td>
                        <td className="p-3 font-mono font-bold text-white">
                          {b.finalAmount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="p-3 text-slate-400">{b.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
