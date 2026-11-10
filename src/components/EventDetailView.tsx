'use client';

import React, { useState } from 'react';
import { EntertainmentEvent, Showtime } from '@/types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Play,
  Film,
  Music,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  Ticket,
  ChevronRight,
  Info,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface EventDetailViewProps {
  event: EntertainmentEvent;
  showtimes: Showtime[];
  selectedShowtime: Showtime | null;
  onSelectShowtime: (st: Showtime) => void;
  onProceedToSeats: () => void;
  onBackToHome: () => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  showtimes,
  selectedShowtime,
  onSelectShowtime,
  onProceedToSeats,
  onBackToHome,
}) => {
  const isConcert = event.category === 'concert' || event.category === 'meeting';
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [selectedTicketTier, setSelectedTicketTier] = useState<string | null>(null);

  // Nhóm suất chiếu theo định dạng rạp (IMAX, 2D, 3D...)
  const formatGroups = new Map<string, Showtime[]>();
  showtimes.forEach((st) => {
    const format = st.format_type;
    if (!formatGroups.has(format)) {
      formatGroups.set(format, []);
    }
    formatGroups.get(format)!.push(st);
  });

  const formatList = Array.from(formatGroups.keys());

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Quay lại trang chủ</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="hidden sm:inline">Danh mục:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold border border-slate-700">
            {event.category_label}
          </span>
        </div>
      </div>

      {/* HERO BANNER SECTION */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#090e18] shadow-2xl">
        {/* Backdrop Image with gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-sm scale-105"
          style={{ backgroundImage: `url(${event.backdrop_url || event.poster_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e18] via-[#090e18]/80 to-transparent" />

        <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Poster Card */}
          <div className="relative w-48 sm:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 group">
            <img
              src={event.poster_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {event.age_rating && (
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase shadow-md">
                {event.age_rating}
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-extrabold border border-emerald-500/30">
                {event.category_label}
              </span>

              {event.genre && (
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {event.genre}
                </span>
              )}

              <span className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{event.duration_minutes} phút</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Ratings & Key Metrics */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm">
              {event.rating_score && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{event.rating_score}</span>
                </div>
              )}

              {event.rating_imdb && (
                <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold font-mono">
                  {event.rating_imdb}
                </div>
              )}

              {event.director && (
                <div className="text-slate-300 font-medium text-xs">
                  {event.director}
                </div>
              )}
            </div>

            {/* Artists / Actors */}
            {event.artists && (
              <div className="text-xs text-slate-300 flex items-center justify-center md:justify-start space-x-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="line-clamp-1 font-semibold">{event.artists}</span>
              </div>
            )}

            {/* Venue & Event Dates */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-xl space-y-1.5 text-xs text-slate-300 text-left">
              <div className="flex items-center space-x-2 font-bold text-white">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{event.venue_name}</span>
              </div>
              <div className="text-slate-400 pl-6 text-[11px]">{event.venue_address}</div>
              <div className="flex items-center space-x-2 text-slate-300 pl-6 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="font-semibold">{event.event_dates}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      </div>

      {/* BRANCH 1: CONCERT FLOW -> THÔNG TIN LOẠI VÉ & QUY ĐỊNH */}
      {isConcert && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-rose-500" />
                <span>Bảng Các Loại Vé &amp; Quyền Lợi Khán Đài</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Chọn hạng vé phù hợp để xem vị trí trên sơ đồ sân khấu nhà thi đấu
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              Đang mở bán trực tuyến
            </span>
          </div>

          {/* Ticket Tiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(event.ticket_tiers || [
              { name: 'SKY LOUNGE', price: 10000000, color: '#38bdf8', type: 'seated', perks: 'Ghế Sofa VIP, Tiệc nhẹ, Quà lưu niệm độc quyền' },
              { name: 'SVIP SÂN KHẤU', price: 5000000, color: '#06b6d4', type: 'seated', perks: 'Vé Soundcheck, Lối vào ưu tiên' },
              { name: 'FANZONE TRUNG TÂM', price: 2500000, color: '#6366f1', type: 'standing', perks: 'Sát sàn diễn chính chữ T, không gian cuồng nhiệt' },
              { name: 'KHÁN ĐÀI CAT 1', price: 1800000, color: '#a855f7', type: 'seated', perks: 'Khán đài trung tâm góc nhìn toàn cảnh' },
              { name: 'KHÁN ĐÀI CAT 2', price: 1200000, color: '#581c87', type: 'seated' },
              { name: 'GA TIÊU CHUẨN', price: 800000, color: '#64748b', type: 'standing' },
            ]).map((tier, idx) => {
              const isSelected = selectedTicketTier === tier.name;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedTicketTier(tier.name)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: tier.color }}
                        />
                        <span className="font-extrabold text-sm text-white">{tier.name}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tier.type === 'standing' ? 'Vé Đứng (GA)' : 'Ghế Ngồi (Seated)'}
                      </span>
                    </div>

                    <div className="text-lg font-black text-emerald-400 font-mono">
                      {tier.price.toLocaleString('vi-VN')} đ
                    </div>

                    {tier.perks && (
                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        🎁 {tier.perks}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Trạng thái: <strong className="text-emerald-400">Còn vé</strong></span>
                    <span className="text-emerald-400 font-bold flex items-center space-x-0.5">
                      <span>Chọn xem sơ đồ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Event Rules & Regulations Card */}
          {event.rules_notice && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">Lưu Ý &amp; Quy Định Tham Gia Sự Kiện:</span>
                <p className="text-slate-300 leading-relaxed">{event.rules_notice}</p>
              </div>
            </div>
          )}

          {/* Large CTA Button to Enter Stage Map */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1424] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Đã sẵn sàng chọn vị trí?</span>
              <span className="text-base font-extrabold text-white">
                Vào sơ đồ sân khấu để chọn vị trí khán đài &amp; Fanzone
              </span>
            </div>

            <button
              onClick={onProceedToSeats}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all group"
            >
              <span>Vào Sơ Đồ Khán Đài Sân Khấu</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* BRANCH 2: PHIM CHIẾU RẠP -> TRAILER, ĐÁNH GIÁ & CHỌN RẠP + SUẤT CHIẾU */}
      {!isConcert && (
        <div className="space-y-6">
          {/* Trailer Preview Banner */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Play className="w-6 h-6 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Xem Trailer Chính Thức</h3>
                <p className="text-xs text-slate-400">
                  Thưởng thức trích đoạn âm thanh và kỹ xảo điện ảnh chuẩn rạp
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPlayingTrailer(!isPlayingTrailer)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors flex items-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>{isPlayingTrailer ? 'Ẩn Trailer' : 'Phát Trailer Phim'}</span>
            </button>
          </div>

          {/* Embedded Trailer Video Simulation */}
          {isPlayingTrailer && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-w-3xl mx-auto shadow-2xl flex items-center justify-center text-center p-6">
              <div className="space-y-3">
                <Film className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                <span className="font-bold text-white text-base block">
                  Đang phát trailer: {event.title}
                </span>
                <span className="text-xs text-slate-400 block max-w-md">
                  Chất lượng hình ảnh 4K Ultra HD • Âm thanh Dolby Atmos • Độc quyền rạp chiếu
                </span>
              </div>
            </div>
          )}

          {/* CHỌN CỤM RẠP & KHUNG GIỜ SUẤT CHIẾU */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
                  <Film className="w-5 h-5 text-emerald-400" />
                  <span>Chọn Cụm Rạp &amp; Khung Giờ Suất Chiếu</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lựa chọn định dạng chiếu và giờ chiếu tại cụm rạp đối tác
                </p>
              </div>

              <span className="text-xs text-slate-400">
                {showtimes.length} suất chiếu khả dụng
              </span>
            </div>

            {/* Formats and Hours */}
            <div className="space-y-4">
              {formatList.map((format) => {
                const groupShowtimes = formatGroups.get(format) || [];

                return (
                  <div key={format} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {format}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        • {groupShowtimes[0]?.room?.room_name || 'Phòng chiếu rạp'}
                      </span>
                    </div>

                    {/* Showtimes Pill List */}
                    <div className="flex flex-wrap gap-2.5">
                      {groupShowtimes.map((st) => {
                        const isSelected = selectedShowtime?.showtime_id === st.showtime_id;
                        const startTimeStr = new Date(st.start_time).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <button
                            key={st.showtime_id}
                            onClick={() => onSelectShowtime(st)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 scale-105'
                                : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                            }`}
                          >
                            <span>{startTimeStr}</span>
                            {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Continue to Seatmap */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1420] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">
                  {selectedShowtime ? `Đã chọn suất ${new Date(selectedShowtime.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Vui lòng chọn khung giờ'}
                </span>
                <span className="text-base font-extrabold text-white">
                  {selectedShowtime?.room?.room_name || event.venue_name}
                </span>
              </div>

              <button
                disabled={!selectedShowtime}
                onClick={onProceedToSeats}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center space-x-2 transition-all group ${
                  selectedShowtime
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/20 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Vào Sơ Đồ Rạp &amp; Chọn Ghế Ngồi</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
