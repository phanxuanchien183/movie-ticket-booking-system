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
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'locks' | 'movies' | 'promotions' | 'bookings'>('overview');
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
      expiresIn: 185, // seconds
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

  // Giải phóng khóa cưỡng chế
  const handleForceReleaseLock = (seatId: string) => {
    setActiveLocks((prev) => prev.filter((l) => l.seatId !== seatId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Về Trang Đặt Vé</span>
              </Link>

              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-bold text-white">CineTicket Admin Portal</span>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                  Route: /admin
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Redis Cluster & MySQL 8.0 Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 overflow-x-auto">
          {[
            { id: 'overview', name: 'Tổng Quan Hệ Thống', icon: TrendingUp },
            { id: 'locks', name: 'Giám Sát Khóa Ghế Redis', icon: Lock, badge: activeLocks.length },
            { id: 'promotions', name: 'Khuyến Mãi & Ngân Hàng', icon: Tag },
            { id: 'bookings', name: 'Lịch Sử Giao Dịch', icon: Ticket },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Tổng Doanh Thu</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {stats.totalRevenue.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-400">VNĐ</span>
                </div>
                <div className="text-[11px] text-emerald-400">↑ 18.5% so với tuần trước</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Vé Đã Xuất</span>
                  <Ticket className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-white">{stats.totalBookings}</div>
                <div className="text-[11px] text-slate-400">Giao dịch thành công</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Khóa Ghế Đang Giữ</span>
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400">{activeLocks.length}</div>
                <div className="text-[11px] text-amber-300">Redis TTL active (5 phút)</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Tỷ Lệ Lấp Đầy Ghế</span>
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-indigo-400">{stats.occupancyRate}%</div>
                <div className="text-[11px] text-indigo-300">Rạp Laser IMAX Starlight</div>
              </div>
            </div>

            {/* Quick overview tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Redis locks quick view */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Ghế Đang Giữ Chỗ (Redis Live)</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('locks')}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Xem chi tiết →
                  </button>
                </div>

                <div className="space-y-2">
                  {activeLocks.map((lock) => (
                    <div
                      key={lock.seatId}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white mr-2">Ghế {lock.seatId}</span>
                        <span className="text-slate-400">{lock.movieTitle}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-amber-400 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lock.expiresIn}s còn lại</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings quick view */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Đơn Đặt Vé Mới Nhất</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Xem tất cả →
                  </button>
                </div>

                <div className="space-y-2">
                  {recentBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{b.customerName}</div>
                        <div className="text-slate-400">
                          {b.seats} • {b.paymentMethod}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">
                          {b.finalAmount.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-slate-500 text-[10px]">{b.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REDIS SEAT LOCKS MONITOR */}
        {activeTab === 'locks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Giám Sát Khóa Ghế Thời Gian Thực (Redis Key Manager)</h3>
                <p className="text-xs text-slate-400">
                  Key pattern: <code className="text-rose-400">lock:showtime:&#123;id&#125;:seat:&#123;id&#125;</code> với TTL tự hủy 300s.
                </p>
              </div>

              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                Đang lắng nghe cụm Redis
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="p-4">Mã Ghế</th>
                    <th className="p-4">Suất Chiếu & Phim</th>
                    <th className="p-4">Phòng Chiếu</th>
                    <th className="p-4">User ID</th>
                    <th className="p-4">TTL Còn Lại</th>
                    <th className="p-4 text-right">Thao Tác Quản Trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeLocks.map((lock) => (
                    <tr key={lock.seatId} className="hover:bg-slate-900/60">
                      <td className="p-4 font-black text-rose-400 text-sm">{lock.seatId}</td>
                      <td className="p-4 font-medium text-white">{lock.movieTitle}</td>
                      <td className="p-4 text-slate-400">{lock.roomName}</td>
                      <td className="p-4 font-mono text-slate-300">USER_{lock.userId}</td>
                      <td className="p-4 text-amber-400 font-mono font-bold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lock.expiresIn} giây</span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleForceReleaseLock(lock.seatId)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-colors"
                        >
                          Giải Phóng Khóa Cưỡng Chế
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activeLocks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Hiện không có ghế nào đang bị khóa. Mọi ghế đều ở trạng thái tự do.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PROMOTIONS & BANK BINDING */}
        {activeTab === 'promotions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Chính Sách Khuyến Mãi & Ràng Buộc Ngân Hàng</h3>
                <p className="text-xs text-slate-400">
                  Kiểm duyệt thanh toán khắt khe: Bắt buộc thẻ hoặc cổng thanh toán của ngân hàng đối tác.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="p-4">Mã Code</th>
                    <th className="p-4">Tên Chương Trình</th>
                    <th className="p-4">Ràng Buộc Ngân Hàng</th>
                    <th className="p-4">Mức Giảm</th>
                    <th className="p-4">Đơn Tối Thiểu</th>
                    <th className="p-4">Đã Dùng / Giới Hạn</th>
                    <th className="p-4">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {promotions.map((p) => (
                    <tr key={p.code} className="hover:bg-slate-900/60">
                      <td className="p-4 font-mono font-bold text-amber-400 text-sm">{p.code}</td>
                      <td className="p-4 font-medium text-white">{p.title}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.bankCode === 'ACB'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : p.bankCode === 'VCB'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {p.bankCode}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-rose-400">{p.discount}</td>
                      <td className="p-4 text-slate-300">{p.minOrder}</td>
                      <td className="p-4 text-slate-400">
                        {p.used} / {p.limit} lượt
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Lịch Sử Giao Dịch & Đơn Đặt Vé</h3>
                <p className="text-xs text-slate-400">
                  Toàn bộ giao dịch đặt vé đã được lưu vào MySQL Transaction và cấp mã QR.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="p-4">Mã Đơn</th>
                    <th className="p-4">Khách Hàng</th>
                    <th className="p-4">Phim</th>
                    <th className="p-4">Ghế</th>
                    <th className="p-4">Phương Thức</th>
                    <th className="p-4">Số Tiền</th>
                    <th className="p-4">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/60">
                      <td className="p-4 font-mono font-bold text-rose-400">{b.id}</td>
                      <td className="p-4 font-semibold text-white">{b.customerName}</td>
                      <td className="p-4 text-slate-300">{b.movie}</td>
                      <td className="p-4 font-bold text-amber-300">{b.seats}</td>
                      <td className="p-4 text-slate-400">{b.paymentMethod}</td>
                      <td className="p-4 font-bold text-emerald-400 text-sm">
                        {b.finalAmount.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
