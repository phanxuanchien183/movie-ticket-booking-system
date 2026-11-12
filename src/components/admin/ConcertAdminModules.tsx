'use client';

import React, { useState } from 'react';
import {
  Music,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Users,
  MapPin,
  Tag,
  CheckCircle2,
  Ticket,
  Search,
  Sparkles,
  ExternalLink,
  Save,
  Check,
} from 'lucide-react';
import { AdminConcertCategory, AdminConcertEvent, AdminConcertVenue } from '@/types';

// ==========================================
// A.1 QUẢN LÝ DANH MỤC SỰ KIỆN
// ==========================================
export const ConcertCategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<AdminConcertCategory[]>([
    {
      id: 'cat-1',
      name: 'Live Concert & Tour Âm Nhạc',
      slug: 'live-concert',
      description: 'Các tour diễn âm nhạc quy mô lớn của các ca sĩ hàng đầu, nhóm nhạc trong nước và quốc tế.',
      eventsCount: 8,
      status: 'active',
    },
    {
      id: 'cat-2',
      name: 'Fan Meeting & Giao Lưu Nghệ Sĩ',
      slug: 'fan-meeting',
      description: 'Sự kiện họp mặt người hâm mộ, tương tác thần tượng, chụp ảnh 1:1 và ký tặng poster.',
      eventsCount: 4,
      status: 'active',
    },
    {
      id: 'cat-3',
      name: 'Lễ Hội Âm Nhạc & EDM Festival',
      slug: 'edm-festival',
      description: 'Đại nhạc hội ngoài trời, quy tụ hàng chục DJ và nghệ sĩ trình diễn kéo dài cả ngày.',
      eventsCount: 3,
      status: 'active',
    },
    {
      id: 'cat-4',
      name: 'Nhạc Kịch & Giao Hưởng Thính Phòng',
      slug: 'musical-theatre',
      description: 'Các buổi hòa nhạc hàn lâm, giao hưởng quốc tế và nhạc kịch kịch tính trên sân khấu lớn.',
      eventsCount: 2,
      status: 'active',
    },
    {
      id: 'cat-5',
      name: 'Hội Thảo & Talkshow Nghệ Thuật',
      slug: 'talkshow-conference',
      description: 'Diễn đàn gặp gỡ, chia sẻ kinh nghiệm âm nhạc, sản xuất và sáng tạo nội dung.',
      eventsCount: 2,
      status: 'active',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newCat: AdminConcertCategory = {
      id: `cat-${Date.now()}`,
      name: newName,
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDesc || 'Danh mục sự kiện biểu diễn',
      eventsCount: 0,
      status: 'active',
    };
    setCategories([...categories, newCat]);
    setNewName('');
    setNewDesc('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#00b14f] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              A.1 ĐẠI NHẠC HỘI
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">Quản Lý Danh Mục Sự Kiện</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Phân loại các hình thức biểu diễn (Live Concert, Fan Meeting, Lễ Hội EDM, Nhạc Kịch...)
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#00b14f] hover:bg-[#009643] text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Đóng Form' : 'Thêm Danh Mục Mới'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-[#121620] border border-[#00b14f]/40 space-y-4">
          <h3 className="text-sm font-bold text-white">Thêm Danh Mục Sự Kiện Mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Tên Danh Mục</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="VD: Lễ Hội Âm Nhạc Indie Rock"
                className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white focus:outline-none focus:border-[#00b14f]"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">Mô Tả Tóm Tắt</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Mô tả mục đích và tính chất sự kiện..."
                className="w-full px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-white focus:outline-none focus:border-[#00b14f]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-2 rounded-xl bg-[#1a2233] text-slate-300 text-xs font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#00b14f] text-white text-xs font-black shadow"
            >
              Lưu Danh Mục
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0b0e14] text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Tên Danh Mục</th>
                <th className="p-3">Đường Dẫn Slug</th>
                <th className="p-3">Mô Tả Chi Tiết</th>
                <th className="p-3 text-center">Số Sự Kiện</th>
                <th className="p-3 text-center">Trạng Thái</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#1a2233]/40">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <Music className="w-4 h-4 text-[#00b14f] shrink-0" />
                    <span>{cat.name}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">/{cat.slug}</td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{cat.description}</td>
                  <td className="p-3 text-center font-mono font-bold text-white">{cat.eventsCount}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-[#00b14f] border border-emerald-500/30">
                      ĐANG HOẠT ĐỘNG
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors"
                      title="Xóa danh mục"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
// A.2 QUẢN LÝ SỰ KIỆN (CONCERTS & SHOWS)
// ==========================================
export const ConcertEventsManager: React.FC = () => {
  const [events, setEvents] = useState<AdminConcertEvent[]>([
    {
      id: 'evt-sayhi',
      title: 'Tinh Hoa "Say Hi" Concert - Đêm 4',
      categoryId: 'cat-1',
      categoryName: 'Live Concert & Tour Âm Nhạc',
      artists: 'Dàn Nghệ Sĩ Anh Trai "Say Hi" All-Stars',
      venueId: 'ven-vec',
      venueName: 'Trung tâm Triển lãm Việt Nam (VEC)',
      isIndoor: true,
      eventDates: '15/11/2026',
      timeSlot: '19:00 - 23:00',
      priceFrom: 800000,
      totalCapacity: 12000,
      ticketsSold: 9800,
      status: 'SellingFast',
      bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'evt-kpop',
      title: 'K-Pop World Tour Arena 2026',
      categoryId: 'cat-1',
      categoryName: 'Live Concert & Tour Âm Nhạc',
      artists: 'Top K-Pop Idol Groups & Special Guests',
      venueId: 'ven-mydinh',
      venueName: 'Sân Vận Động Quốc Gia Mỹ Đình',
      isIndoor: false,
      eventDates: '28/12/2026',
      timeSlot: '18:30 - 22:30',
      priceFrom: 1200000,
      totalCapacity: 35000,
      ticketsSold: 28000,
      status: 'SellingFast',
      bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      posterUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'evt-seonho',
      title: 'Fan Meeting Kim Seon Ho - Hà Nội 2026',
      categoryId: 'cat-2',
      categoryName: 'Fan Meeting & Giao Lưu Nghệ Sĩ',
      artists: 'Diễn viên Kim Seon Ho',
      venueId: 'ven-ncc',
      venueName: 'Trung tâm Hội nghị Quốc gia NCC',
      isIndoor: true,
      eventDates: '20/12/2026',
      timeSlot: '18:00 - 21:00',
      priceFrom: 800000,
      totalCapacity: 3500,
      ticketsSold: 3500,
      status: 'SoldOut',
      bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
      posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.artists.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#00b14f] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              A.2 ĐẠI NHẠC HỘI
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">Quản Lý Sự Kiện &amp; Vé Concert</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý tên sự kiện, ca sĩ / nghệ sĩ tham gia, ngày diễn ra, trạng thái vé và poster
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sự kiện, nghệ sĩ..."
              className="pl-8 pr-3 py-2 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-xs text-white focus:outline-none focus:border-[#00b14f]"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="rounded-2xl bg-[#121620] border border-[#1e2638] overflow-hidden hover:border-[#00b14f]/50 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Banner with Status badge */}
              <div className="relative h-44 overflow-hidden group">
                <img
                  src={evt.bannerUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/60" />

                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    evt.status === 'SoldOut'
                      ? 'bg-rose-500/80 text-white'
                      : 'bg-emerald-500/80 text-white'
                  }`}>
                    {evt.status === 'SoldOut' ? 'HẾT VÉ' : 'ĐANG MỞ BÁN'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur">
                    {evt.isIndoor ? 'Trong Nhà' : 'Ngoài Trời'}
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 text-[11px] font-bold text-emerald-400">
                  {evt.categoryName}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-black text-white line-clamp-1">{evt.title}</h3>
                <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{evt.artists}</span>
                </p>

                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{evt.eventDates} • {evt.timeSlot}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{evt.venueName}</span>
                  </div>
                </div>

                {/* Capacity & Progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Đã bán: {evt.ticketsSold.toLocaleString()} vé</span>
                    <span>Sức chứa: {evt.totalCapacity.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0b0e14] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00b14f] rounded-full"
                      style={{ width: `${Math.round((evt.ticketsSold / evt.totalCapacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1e2638] bg-[#0b0e14]/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Giá vé từ</span>
                <span className="text-sm font-black text-[#00b14f] font-mono">
                  {evt.priceFrom.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  className="px-3 py-1.5 rounded-lg bg-[#1a2233] hover:bg-[#232d42] text-xs font-bold text-white transition-colors"
                  title="Chỉnh sửa thông tin sự kiện"
                >
                  Sửa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// A.3 NGOÀI TRỜI HOẶC TRONG NHÀ (ĐỊA ĐIỂM)
// ==========================================
export const ConcertVenuesManager: React.FC = () => {
  const [venues, setVenues] = useState<AdminConcertVenue[]>([
    {
      id: 'ven-vec',
      name: 'Trung tâm Triển lãm Việt Nam (VEC)',
      environment: 'indoor',
      address: 'Đường Đông Hội, Huyện Đông Anh',
      district: 'Huyện Đông Anh',
      city: 'Hà Nội',
      capacity: 15000,
      description: 'Trung tâm hội chợ triển lãm quy mô quốc tế với hệ thống mái che khẩu độ lớn, điều hòa trung tâm và sàn chịu tải cao.',
      stageFormat: 'T-Stage Runway & Catwalk trung tâm',
    },
    {
      id: 'ven-mydinh',
      name: 'Sân Vận Động Quốc Gia Mỹ Đình',
      environment: 'outdoor',
      address: 'Đường Lê Đức Thọ, Phường Mỹ Đình 1',
      district: 'Quận Nam Từ Liêm',
      city: 'Hà Nội',
      capacity: 45000,
      description: 'Sân vận động ngoài trời lớn nhất Việt Nam, chuyên đăng cai các đại nhạc hội quốc tế K-Pop, EDM Festival và lễ khai mạc thể thao.',
      stageFormat: 'End-Stage hoành tráng & Sân cỏ GA',
    },
    {
      id: 'ven-phutho',
      name: 'Nhà Thi Đấu Thể Dục Thể Thao Phú Thọ',
      environment: 'indoor',
      address: '01 Lữ Gia, Phường 15',
      district: 'Quận 11',
      city: 'TP. Hồ Chí Minh',
      capacity: 8000,
      description: 'Nhà thi đấu trong nhà khép kín, sức chứa lớn, âm học chuẩn cho concert, chung kết cuộc thi sắc đẹp và gameshow truyền hình.',
      stageFormat: 'Sân khấu Arena 360° hoặc T-Stage',
    },
    {
      id: 'ven-quan-khu-7',
      name: 'Sân Vận Động Quân Khu 7',
      environment: 'outdoor',
      address: '202 Hoàng Văn Thụ, Phường 9',
      district: 'Quận Phú Nhuận',
      city: 'TP. Hồ Chí Minh',
      capacity: 25000,
      description: 'Địa điểm biểu diễn ngoài trời huyền thoại tại TP.HCM, nơi diễn ra các liveshow âm nhạc đỉnh cao và lễ hội âm nhạc.',
      stageFormat: 'Sân khấu ngoài trời màn hình LED 1000m²',
    },
    {
      id: 'ven-ncc',
      name: 'Trung Tâm Hội Nghị Quốc Gia NCC',
      environment: 'indoor',
      address: 'Đại lộ Thăng Long, Phường Mễ Trì',
      district: 'Quận Nam Từ Liêm',
      city: 'Hà Nội',
      capacity: 3800,
      description: 'Hội trường biểu diễn trong nhà sang trọng bậc nhất, ghế bọc nỉ cao cấp, hệ thống âm thanh ánh sáng hội nghị & hòa nhạc đỉnh cao.',
      stageFormat: 'Sân khấu End-Stage thính phòng',
    },
  ]);

  const [filterEnv, setFilterEnv] = useState<'all' | 'indoor' | 'outdoor'>('all');

  const filteredVenues = venues.filter((v) => {
    if (filterEnv === 'all') return true;
    return v.environment === filterEnv;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-[#1e2638]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#00b14f] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              A.3 ĐẠI NHẠC HỘI
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">
            Quản Lý Địa Điểm Tổ Chức (Trong Nhà &amp; Ngoài Trời)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Phân loại địa điểm Trong Nhà (Indoor) và Ngoài Trời (Outdoor), tên địa điểm, địa chỉ và sức chứa.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
          <button
            onClick={() => setFilterEnv('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterEnv === 'all' ? 'bg-[#00b14f] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả ({venues.length})
          </button>
          <button
            onClick={() => setFilterEnv('indoor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterEnv === 'indoor' ? 'bg-[#00b14f] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Trong Nhà ({venues.filter((v) => v.environment === 'indoor').length})
          </button>
          <button
            onClick={() => setFilterEnv('outdoor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterEnv === 'outdoor' ? 'bg-[#00b14f] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ngoài Trời ({venues.filter((v) => v.environment === 'outdoor').length})
          </button>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVenues.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-2xl bg-[#121620] border border-[#1e2638] space-y-4 hover:border-slate-600 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      v.environment === 'indoor'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {v.environment === 'indoor' ? 'TRONG NHÀ (INDOOR)' : 'NGOÀI TRỜI (OUTDOOR)'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{v.city}</span>
                </div>
                <h3 className="text-base font-black text-white">{v.name}</h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Sức Chứa Khán Giả</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {v.capacity.toLocaleString()} chỗ
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{v.description}</p>

            <div className="pt-2 border-t border-[#1e2638] space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-slate-200">{v.address}, {v.district}, {v.city}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-medium">Định dạng: {v.stageFormat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
