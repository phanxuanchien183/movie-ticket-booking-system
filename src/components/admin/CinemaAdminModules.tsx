'use client';

import React, { useState } from 'react';
import {
  Film,
  Building,
  MapPin,
  Tv,
  Armchair,
  Star,
  Plus,
  Trash2,
  Edit3,
  Search,
  ExternalLink,
  CheckCircle2,
  Phone,
  Globe,
  Sliders,
  DollarSign,
  Maximize2,
  Eye,
  Sparkles,
} from 'lucide-react';
import {
  AdminCinemaChain,
  AdminCinemaBranch,
  AdminCinemaAddress,
  AdminCinemaRoom,
  AdminMovieMgmt,
} from '@/types';

// ==========================================
// B.1 QUẢN LÝ CHUỖI CHIẾU PHIM (CHAINS)
// ==========================================
export const CinemaChainsManager: React.FC = () => {
  const [chains, setChains] = useState<AdminCinemaChain[]>([
    {
      id: 'chain-cgv',
      code: 'CGV',
      name: 'CGV Cinemas Việt Nam',
      logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=120&q=80',
      hotline: '1900 6017',
      website: 'https://cgv.vn',
      branchesCount: 82,
      description: 'Hệ thống rạp chiếu phim lớn nhất Việt Nam sở hữu định dạng Laser IMAX, Starium, Gold Class, 4DX và ScreenX.',
    },
    {
      id: 'chain-lotte',
      code: 'LOTTE',
      name: 'Lotte Cinema Việt Nam',
      logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=120&q=80',
      hotline: '028 3775 2524',
      website: 'https://lottecinemavn.com',
      branchesCount: 46,
      description: 'Cụm rạp tiêu chuẩn Hàn Quốc với phòng chiếu Superplex màn hình cực đại và ghế ngồi êm ái.',
    },
    {
      id: 'chain-bhd',
      code: 'BHD',
      name: 'BHD Star Cineplex',
      logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=120&q=80',
      hotline: '1900 2099',
      website: 'https://bhdstar.vn',
      branchesCount: 15,
      description: 'Chuỗi rạp tiên phong phòng chiếu First Class sang trọng tại các trung tâm thương mại cao cấp.',
    },
    {
      id: 'chain-galaxy',
      code: 'GALAXY',
      name: 'Galaxy Cinema',
      logo: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=120&q=80',
      hotline: '1900 2224',
      website: 'https://galaxycine.vn',
      branchesCount: 22,
      description: 'Hệ thống rạp chiếu phim hiện đại gắn liền với văn hóa xem phim trẻ trung, năng động.',
    },
    {
      id: 'chain-beta',
      code: 'BETA',
      name: 'Beta Cinemas',
      logo: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=120&q=80',
      hotline: '0934 632 682',
      website: 'https://betacinemas.vn',
      branchesCount: 18,
      description: 'Rạp chiếu phim phong cách Pastel hiện đại, giá vé hợp lý cho học sinh sinh viên.',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e71a0f] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              B.1 RẠP CHIẾU PHIM
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">Quản Lý Chuỗi Chiếu Phim</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản trị các thương hiệu cụm rạp đối tác (CGV Cinemas, Lotte Cinema, BHD Star, Galaxy, Beta...)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {chains.map((chain) => (
          <div
            key={chain.id}
            className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4 hover:border-red-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                  {chain.code}
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  {chain.branchesCount} chi nhánh rạp
                </span>
              </div>

              <h3 className="text-base font-black text-white">{chain.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{chain.description}</p>
            </div>

            <div className="pt-3 border-t border-[#1e2638] space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hotline:</span>
                </span>
                <span className="font-mono text-white font-bold">{chain.hotline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Trang chủ:</span>
                </span>
                <a
                  href={chain.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#00b14f] hover:underline"
                >
                  {chain.website.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// B.2 QUẢN LÝ CHI NHÁNH RẠP (BRANCHES)
// ==========================================
export const CinemaBranchesManager: React.FC = () => {
  const [branches, setBranches] = useState<AdminCinemaBranch[]>([
    {
      id: 'br-cgv-landmark81',
      chainId: 'chain-cgv',
      chainName: 'CGV Cinemas',
      branchName: 'CGV Vincom Landmark 81',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận Bình Thạnh',
      address: 'Tầng B1, TTTM Vincom Center Landmark 81, 720A Điện Biên Phủ',
      phone: '028 3636 8282',
      roomsCount: 8,
      status: 'active',
    },
    {
      id: 'br-cgv-suvanhanh',
      chainId: 'chain-cgv',
      chainName: 'CGV Cinemas',
      branchName: 'CGV Vạn Hạnh Mall',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 10',
      address: 'Tầng 6, Vạn Hạnh Mall, 11 Sư Vạn Hạnh',
      phone: '028 3868 8282',
      roomsCount: 9,
      status: 'active',
    },
    {
      id: 'br-lotte-nowzone',
      chainId: 'chain-lotte',
      chainName: 'Lotte Cinema',
      branchName: 'Lotte Cinema Nowzone',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      address: 'Tầng 5, Nowzone Fashion Mall, 235 Nguyễn Văn Cừ',
      phone: '028 3925 2525',
      roomsCount: 6,
      status: 'active',
    },
    {
      id: 'br-bhd-bitexco',
      chainId: 'chain-bhd',
      chainName: 'BHD Star Cineplex',
      branchName: 'BHD Star Bitexco',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      address: 'Tầng 3 & 4, Tòa nhà Bitexco Financial Tower, 02 Hải Triều',
      phone: '028 6267 0670',
      roomsCount: 7,
      status: 'active',
    },
    {
      id: 'br-galaxy-nguyendu',
      chainId: 'chain-galaxy',
      chainName: 'Galaxy Cinema',
      branchName: 'Galaxy Nguyễn Du',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      address: '116 Nguyễn Du, Phường Bến Thành',
      phone: '028 3823 4999',
      roomsCount: 5,
      status: 'active',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e71a0f] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              B.2 RẠP CHIẾU PHIM
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">Quản Lý Chi Nhánh Rạp</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản trị các chi nhánh rạp theo từng chuỗi (CGV Landmark 81, Lotte Nowzone, BHD Bitexco...)
          </p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0b0e14] text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Chuỗi Rạp</th>
                <th className="p-3">Tên Chi Nhánh</th>
                <th className="p-3">Khu Vực</th>
                <th className="p-3">Địa Chỉ Chi Tiết</th>
                <th className="p-3 text-center">Số Phòng Chiếu</th>
                <th className="p-3 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-[#1a2233]/40">
                  <td className="p-3 font-bold text-red-400">{b.chainName}</td>
                  <td className="p-3 font-bold text-white">{b.branchName}</td>
                  <td className="p-3 text-slate-300">{b.district}, {b.city}</td>
                  <td className="p-3 text-slate-400 max-w-xs truncate">{b.address}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-400">
                    {b.roomsCount} phòng
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-[#00b14f] border border-emerald-500/30">
                      HOẠT ĐỘNG
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// B.3 QUẢN LÝ ĐỊA CHỈ RẠP (ADDRESSES)
// ==========================================
export const CinemaAddressesManager: React.FC = () => {
  const [addresses, setAddresses] = useState<AdminCinemaAddress[]>([
    {
      id: 'addr-1',
      branchId: 'br-cgv-landmark81',
      branchName: 'CGV Vincom Landmark 81',
      chainName: 'CGV Cinemas',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận Bình Thạnh',
      fullAddress: 'Tầng B1, TTTM Vincom Center Landmark 81, 720A Điện Biên Phủ, Phường 22',
      hotline: '1900 6017 (Ext 81)',
      googleMapQuery: 'https://maps.google.com/?q=CGV+Vincom+Landmark+81',
    },
    {
      id: 'addr-2',
      branchId: 'br-lotte-nowzone',
      branchName: 'Lotte Cinema Nowzone',
      chainName: 'Lotte Cinema',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      fullAddress: 'Tầng 5, Nowzone Fashion Mall, 235 Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh',
      hotline: '028 3925 2525',
      googleMapQuery: 'https://maps.google.com/?q=Lotte+Cinema+Nowzone',
    },
    {
      id: 'addr-3',
      branchId: 'br-bhd-bitexco',
      branchName: 'BHD Star Bitexco',
      chainName: 'BHD Star Cineplex',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      fullAddress: 'Tầng 3 & 4, Tòa tháp Bitexco Financial Tower, 02 Hải Triều, Phường Bến Nghé',
      hotline: '1900 2099',
      googleMapQuery: 'https://maps.google.com/?q=BHD+Star+Bitexco',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e71a0f] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              B.3 RẠP CHIẾU PHIM
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">Quản Lý Địa Chỉ Rạp Chiếu Phim</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấu hình Tỉnh/Thành phố, Quận/Huyện, địa chỉ cụ thể từng cụm rạp và liên kết định vị bản đồ.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {addresses.map((a) => (
          <div key={a.id} className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400">{a.chainName}</span>
              <span className="text-xs font-mono text-slate-400">{a.city}</span>
            </div>
            <h3 className="text-base font-black text-white">{a.branchName}</h3>
            <p className="text-xs text-slate-300 flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{a.fullAddress}</span>
            </p>
            <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between text-xs">
              <span className="text-slate-400">Hotline: <strong className="text-white">{a.hotline}</strong></span>
              <a
                href={a.googleMapQuery}
                target="_blank"
                rel="noreferrer"
                className="text-[#00b14f] hover:underline flex items-center space-x-1"
              >
                <span>Xem bản đồ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// B.4 QUẢN LÝ PHÒNG RẠP (ROOMS & SCREENS)
// ==========================================
export const CinemaRoomsManager: React.FC = () => {
  const [rooms, setRooms] = useState<AdminCinemaRoom[]>([
    {
      id: 'room-01',
      branchId: 'br-cgv-landmark81',
      branchName: 'CGV Vincom Landmark 81',
      roomName: 'Phòng 01 - Laser IMAX Starlight',
      roomType: 'Laser IMAX',
      screenWidth: 22.0,
      screenHeight: 16.0,
      distanceToRowA: 5.0,
      totalRows: 8,
      seatsPerRow: 14,
      totalSeats: 104,
      soundSystem: 'Dolby Atmos 64 kênh độc lập',
    },
    {
      id: 'room-02',
      branchId: 'br-cgv-landmark81',
      branchName: 'CGV Vincom Landmark 81',
      roomName: 'Phòng 02 - Gold Class VIP Sofa',
      roomType: 'Gold Class VIP',
      screenWidth: 14.0,
      screenHeight: 8.0,
      distanceToRowA: 4.5,
      totalRows: 5,
      seatsPerRow: 8,
      totalSeats: 40,
      soundSystem: 'Dolby 7.1 Surround cao cấp',
    },
    {
      id: 'room-03',
      branchId: 'br-cgv-landmark81',
      branchName: 'CGV Vincom Landmark 81',
      roomName: 'Phòng 03 - 4DX Dynamic Motion',
      roomType: '4DX Motion',
      screenWidth: 16.0,
      screenHeight: 9.0,
      distanceToRowA: 4.2,
      totalRows: 7,
      seatsPerRow: 12,
      totalSeats: 84,
      soundSystem: 'Hiệu ứng rung lắc, gió, mùi hương & Dolby 7.1',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e71a0f] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              B.4 RẠP CHIẾU PHIM
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">Quản Lý Phòng Chiếu Phim</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấu hình kích thước màn hình rộng x cao, khoảng cách hàng A tới màn hình và công nghệ âm thanh.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4 hover:border-red-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {room.roomType}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {room.totalSeats} ghế ngồi
                </span>
              </div>

              <h3 className="text-base font-black text-white">{room.roomName}</h3>
              <p className="text-xs text-slate-400">{room.branchName}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
                  <span className="text-[10px] text-slate-500 block">Kích Thước Màn</span>
                  <span className="font-mono font-bold text-white">{room.screenWidth}m × {room.screenHeight}m</span>
                </div>
                <div className="p-2 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
                  <span className="text-[10px] text-slate-500 block">Khoảng Cách Hàng A</span>
                  <span className="font-mono font-bold text-amber-400">{room.distanceToRowA}m</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e2638] space-y-1.5 text-xs text-slate-400">
              <span className="text-[10px] text-slate-500 block">Hệ thống âm thanh:</span>
              <span className="text-slate-200 font-medium block">{room.soundSystem}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// B.5 THIẾT KẾ SƠ ĐỒ GHẾ PHÒNG RẠP (SEAT MATRIX DESIGNER)
// ==========================================
export const CinemaSeatDesigner: React.FC = () => {
  const [rows, setRows] = useState([
    { rowName: 'A', seatCount: 14, seatType: 'standard', price: 110000 },
    { rowName: 'B', seatCount: 14, seatType: 'standard', price: 110000 },
    { rowName: 'C', seatCount: 14, seatType: 'standard', price: 110000 },
    { rowName: 'D', seatCount: 14, seatType: 'vip', price: 140000 },
    { rowName: 'E', seatCount: 14, seatType: 'vip', price: 140000 },
    { rowName: 'F', seatCount: 14, seatType: 'vip', price: 140000 },
    { rowName: 'G', seatCount: 14, seatType: 'standard', price: 110000 },
    { rowName: 'H', seatCount: 6, seatType: 'sweetbox', price: 260000 },
  ]);

  const [activeRowIndex, setActiveRowIndex] = useState<number>(3); // Row D
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdateRow = (idx: number, key: string, val: any) => {
    const updated = [...rows];
    updated[idx] = { ...updated[idx], [key]: val };
    setRows(updated);
  };

  const handleSave = () => {
    setNotification('Đã lưu cấu hình sơ đồ ghế phòng chiếu thành công!');
    setTimeout(() => setNotification(null), 3000);
  };

  const activeRow = rows[activeRowIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e71a0f] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              B.5 RẠP CHIẾU PHIM
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">Thiết Kế Sơ Đồ Ghế Phòng Rạp</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấu hình ma trận hàng ghế A..H, phân bổ loại ghế Thường, VIP, Sweetbox đôi, lối đi và bảng giá vé.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#e71a0f] hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          <span>Lưu Cấu Hình Ghế</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Seat Map (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0b0e14] border border-[#1e2638] space-y-4">
          <div className="text-center py-2">
            <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full shadow-[0_0_15px_rgba(239,68,68,0.7)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
              Màn Hình Phòng Chiếu Laser
            </span>
          </div>

          <div className="space-y-2 py-3 overflow-x-auto">
            {rows.map((r, idx) => (
              <div
                key={r.rowName}
                onClick={() => setActiveRowIndex(idx)}
                className={`flex items-center justify-center space-x-1.5 p-1.5 rounded-lg cursor-pointer transition-all ${
                  idx === activeRowIndex ? 'bg-[#1a2233] ring-1 ring-red-500' : 'hover:bg-slate-900/50'
                }`}
              >
                <span className="w-5 text-xs font-mono font-bold text-slate-400 text-center">
                  {r.rowName}
                </span>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: r.seatCount }, (_, sIdx) => {
                    const seatNum = sIdx + 1;
                    return (
                      <div
                        key={seatNum}
                        className={`w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center border ${
                          r.seatType === 'vip'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : r.seatType === 'sweetbox'
                            ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                            : 'bg-[#1a2233] text-slate-300 border-slate-700'
                        }`}
                      >
                        {seatNum}
                      </div>
                    );
                  })}
                </div>

                <span className="w-5 text-xs font-mono font-bold text-slate-400 text-center">
                  {r.rowName}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1e2638] flex items-center justify-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#1a2233] border border-slate-700" />
              <span>Tiêu chuẩn (110k)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500/50" />
              <span>VIP (140k)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded bg-pink-500/20 border border-pink-500/50" />
              <span>Sweetbox (260k)</span>
            </div>
          </div>
        </div>

        {/* Row Config Form (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4">
          <h3 className="text-sm font-black text-white">
            Cấu Hình Hàng Ghế: <span className="text-red-400">{activeRow.rowName}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Loại Ghế Hàng {activeRow.rowName}</label>
              <select
                value={activeRow.seatType}
                onChange={(e) => handleUpdateRow(activeRowIndex, 'seatType', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white font-bold focus:outline-none focus:border-red-500"
              >
                <option value="standard">Ghế Tiêu Chuẩn</option>
                <option value="vip">Ghế VIP Trục Trung Tâm</option>
                <option value="sweetbox">Ghế Đôi Sweetbox (Hàng Sau Cùng)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Số Lượng Ghế Trong Hàng</label>
              <input
                type="number"
                min={2}
                max={20}
                value={activeRow.seatCount}
                onChange={(e) => handleUpdateRow(activeRowIndex, 'seatCount', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white font-mono font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Đơn Giá Vé (VNĐ)</label>
              <input
                type="number"
                step={5000}
                value={activeRow.price}
                onChange={(e) => handleUpdateRow(activeRowIndex, 'price', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white font-mono font-bold focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// B.7 QUẢN LÝ PHIM (MOVIES MGMT)
// ==========================================
export const MoviesManager: React.FC = () => {
  const [movies, setMovies] = useState<AdminMovieMgmt[]>([
    {
      id: 1,
      title: 'Dune: Hành Tinh Cát - Phần Hai',
      bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
      trailerYoutubeId: 'Way9Dexny3w',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      description: 'Hành trình huyền thoại của Paul Atreides khi anh hợp nhất với Chani và người Fremen trên sa mạc Arrakis.',
      ratingScore: '4.8/5',
      ratingImdb: '8.6/10',
      ageRating: 'T16',
      durationMinutes: 166,
      director: 'Denis Villeneuve',
      cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
      genre: 'Khoa học viễn tưởng, Hành động',
      releaseDate: '01/03/2026',
      status: 'NowShowing',
    },
    {
      id: 2,
      title: 'Oppenheimer',
      bannerUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80',
      posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80',
      trailerYoutubeId: 'uYPbbksJxIg',
      trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
      description: 'Câu chuyện kịch tính về cuộc đời nhà vật lý J. Robert Oppenheimer trong dự án Manhattan.',
      ratingScore: '4.9/5',
      ratingImdb: '8.9/10',
      ageRating: 'T18',
      durationMinutes: 180,
      director: 'Christopher Nolan',
      cast: 'Cillian Murphy, Emily Blunt, Robert Downey Jr.',
      genre: 'Tiểu sử, Lịch sử, Kịch tính',
      releaseDate: '15/02/2026',
      status: 'NowShowing',
    },
    {
      id: 3,
      title: 'Mai - Phim Của Trấn Thành',
      bannerUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
      posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=500&q=80',
      trailerYoutubeId: 'exd4rT879K0',
      trailerUrl: 'https://www.youtube.com/watch?v=exd4rT879K0',
      description: 'Một câu chuyện tình cảm động và đầy trắc trở giữa Mai và Dương giữa những định kiến xã hội hiện đại.',
      ratingScore: '4.7/5',
      ratingImdb: '7.8/10',
      ageRating: 'T18',
      durationMinutes: 131,
      director: 'Trấn Thành',
      cast: 'Phương Anh Đào, Tuấn Trần, Hồng Đào, Trấn Thành',
      genre: 'Tâm lý, Tình cảm',
      releaseDate: '10/02/2026',
      status: 'NowShowing',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#e71a0f] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              B.7 RẠP CHIẾU PHIM
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">Quản Lý Phim Chiếu Rạp</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản trị thông tin phim: banner ngang, poster dọc, liên kết trailer YouTube, mô tả, đánh giá khán giả/IMDb và độ tuổi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {movies.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl bg-[#121620] border border-[#1e2638] overflow-hidden hover:border-red-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Banner with Age Rating */}
              <div className="relative h-44 overflow-hidden group">
                <img
                  src={m.bannerUrl}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/60" />

                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs">
                    {m.ageRating}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur text-[11px] font-mono">
                    {m.durationMinutes} phút
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{m.ratingScore} Khán Giả</span>
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">{m.ratingImdb} IMDb</span>
                </div>
              </div>

              {/* Movie Details */}
              <div className="p-4 space-y-2.5">
                <h3 className="text-base font-black text-white line-clamp-1">{m.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{m.description}</p>
                <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                  <div>Đạo diễn: <strong className="text-slate-200">{m.director}</strong></div>
                  <div className="line-clamp-1">Diễn viên: <span className="text-slate-300">{m.cast}</span></div>
                </div>
              </div>
            </div>

            {/* Trailer & Action Footer */}
            <div className="p-4 border-t border-[#1e2638] bg-[#0b0e14]/50 flex items-center justify-between">
              <a
                href={m.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-red-400 hover:underline flex items-center space-x-1 font-bold"
              >
                <span>Trailer YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button className="px-3 py-1.5 rounded-lg bg-[#1a2233] hover:bg-[#232d42] text-xs font-bold text-white transition-colors">
                Chỉnh Sửa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
