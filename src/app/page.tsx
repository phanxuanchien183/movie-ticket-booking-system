'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntertainmentEvent, Showtime, Seat, SeatGeometricView, Booking } from '@/types';
import { Navbar } from '@/components/Navbar';
import { MovieSelector } from '@/components/MovieSelector';
import { EventDetailView } from '@/components/EventDetailView';
import { SeatSelectionView } from '@/components/SeatSelectionView';
import { SeatViewModal } from '@/components/SeatViewModal';
import { CheckoutDrawer } from '@/components/CheckoutDrawer';
import { TicketSuccessModal } from '@/components/TicketSuccessModal';
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  Building2,
  Ticket,
  ChevronRight,
  Star,
  Music,
  Film,
} from 'lucide-react';

interface SeatWithView extends Seat {
  view_metrics?: SeatGeometricView;
}

type ScreenType = 'home' | 'detail' | 'seats';

export default function Home() {
  const router = useRouter();

  // Sinh mã phiên độc quyền cho từng trình duyệt/tab (Phân biệt User A và User B)
  const [currentUserId, setCurrentUserId] = useState<string>('guest_default');

  useEffect(() => {
    let stored = sessionStorage.getItem('cinebox_guest_id');
    if (!stored) {
      stored = 'guest_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('cinebox_guest_id', stored);
    }
    setCurrentUserId(stored);
  }, []);

  // Screen state machine: 'home' -> 'detail' -> 'seats'
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  const [movies, setMovies] = useState<EntertainmentEvent[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<EntertainmentEvent | null>(null);

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  const [seats, setSeats] = useState<SeatWithView[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number | null>(null);

  // Modals state
  const [viewingSeat, setViewingSeat] = useState<SeatWithView | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState<{
    booking: Booking;
    seats: { seat_id: string; price: number }[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // 1. Fetch danh sách sự kiện & phim ban đầu
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const res = await fetch('/api/movies');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setMovies(data.data);
          setSelectedMovie(data.data[0]);
        }
      } catch (e) {
        console.error('Lỗi tải phim:', e);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // 2. Fetch danh sách suất chiếu khi chọn sự kiện/phim
  useEffect(() => {
    if (!selectedMovie) return;
    async function loadShowtimes() {
      try {
        const movieId = selectedMovie?.movie_id || selectedMovie?.event_id;
        const res = await fetch(`/api/showtimes?movieId=${movieId}`);
        const data = await res.json();
        if (data.success) {
          setShowtimes(data.data);
          if (data.data.length > 0) {
            setSelectedShowtime(data.data[0]);
          } else {
            setSelectedShowtime(null);
          }
        }
      } catch (e) {
        console.error('Lỗi tải suất chiếu:', e);
      }
    }
    loadShowtimes();
  }, [selectedMovie]);

  // 3. Fetch sơ đồ ghế với Polling thời gian thực
  const fetchSeats = async (showtimeId: number, isPolling: boolean = false) => {
    try {
      const res = await fetch(`/api/showtimes/${showtimeId}/seats`);
      const data = await res.json();
      if (data.success) {
        setSeats(data.data.seats);

        if (isPolling && selectedSeatIds.length > 0) {
          const validSelected = selectedSeatIds.filter((id) => {
            const currentSeat = data.data.seats.find((s: SeatWithView) => s.seat_id === id);
            return currentSeat && currentSeat.status === 'locked' && currentSeat.locked_by_user === currentUserId;
          });

          if (validSelected.length !== selectedSeatIds.length) {
            setSelectedSeatIds(validSelected);
            if (validSelected.length === 0) setLockTimeRemaining(null);
          }
        }
      }
    } catch (e) {
      console.error('Lỗi tải ghế:', e);
    }
  };

  // Heartbeat Polling: Tự động đồng bộ ghế mỗi 2.5 giây khi đang ở màn hình chọn ghế
  useEffect(() => {
    if (!selectedShowtime || currentScreen !== 'seats') return;
    fetchSeats(selectedShowtime.showtime_id);

    const interval = setInterval(() => {
      fetchSeats(selectedShowtime.showtime_id, true);
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedShowtime, currentUserId, currentScreen]);

  // Xử lý Toggle chọn / bỏ chọn ghế
  const handleToggleSeat = async (seat: SeatWithView) => {
    if (!selectedShowtime) return;
    setErrorToast(null);

    const isAlreadySelected = selectedSeatIds.includes(seat.seat_id);

    if (isAlreadySelected) {
      try {
        await fetch('/api/seats/release', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            showtime_id: selectedShowtime.showtime_id,
            seat_ids: [seat.seat_id],
            user_id: currentUserId,
          }),
        });

        const nextSelected = selectedSeatIds.filter((id) => id !== seat.seat_id);
        setSelectedSeatIds(nextSelected);
        if (nextSelected.length === 0) setLockTimeRemaining(null);
        await fetchSeats(selectedShowtime.showtime_id);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await fetch('/api/seats/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            showtime_id: selectedShowtime.showtime_id,
            seat_ids: [seat.seat_id],
            user_id: currentUserId,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorToast(data.error || 'Ghế vừa có người khác giữ chỗ, vui lòng chọn ghế khác!');
          await fetchSeats(selectedShowtime.showtime_id);
        } else {
          setSelectedSeatIds([...selectedSeatIds, seat.seat_id]);
          setLockTimeRemaining(300); // 5 phút
          await fetchSeats(selectedShowtime.showtime_id);
        }
      } catch (e) {
        setErrorToast('Không thể giữ chỗ ghế lúc này. Vui lòng thử lại!');
      }
    }
  };

  const selectedSeatsList = seats.filter((s) => selectedSeatIds.includes(s.seat_id));

  // Handler khi click vào 1 sự kiện trên Trang chủ -> chuyển sang màn hình Chi Tiết qua Router
  const handleSelectEventFromHome = (event: EntertainmentEvent) => {
    const id = event.movie_id || event.event_id;
    router.push(`/events/${id}`);
  };

  // Handler khi từ màn hình Chi Tiết -> chuyển sang màn hình Chọn Ghế qua Router
  const handleProceedToSeats = () => {
    if (selectedShowtime) {
      router.push(`/booking/${selectedShowtime.showtime_id}`);
    } else if (showtimes.length > 0) {
      router.push(`/booking/${showtimes[0].showtime_id}`);
    }
  };

  // Handler quay lại Trang Chủ
  const handleBackToHome = () => {
    setCurrentScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler quay lại màn hình Chi Tiết
  const handleBackToDetail = () => {
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  let currentStep = 1;
  if (successBooking) currentStep = 4;
  else if (isCheckoutOpen) currentStep = 3;
  else if (currentScreen === 'seats') currentStep = 2;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Menu Bar */}
      <Navbar
        currentStep={currentStep}
        onSearchClick={() => {
          setCurrentScreen('home');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onCategorySelect={() => {
          setCurrentScreen('home');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Error Notification Toast */}
        {errorToast && (
          <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-center justify-between shadow-md animate-in fade-in">
            <span>{errorToast}</span>
            <button
              onClick={() => setErrorToast(null)}
              className="text-xs font-bold px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400"
            >
              Đóng
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN HÌNH 1: TRANG CHỦ SHOWCASE (Home Showcase)            */}
        {/* ======================================================== */}
        {currentScreen === 'home' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* HERO FEATURED BANNER SLIDER */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#090e18] shadow-2xl p-6 sm:p-10">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-sm scale-105"
                style={{
                  backgroundImage: `url(${movies[0]?.backdrop_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200'})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080c14] via-[#080c14]/90 to-transparent" />

              <div className="relative max-w-2xl space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white uppercase shadow-md">
                    Sự Kiện Hot Nhất
                  </span>
                  <span className="text-xs text-amber-400 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mở bán vé đợt cuối</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {movies[0]?.title || 'Anh Trai "Say Hi" - The Live Concert 2026'}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {movies[0]?.description ||
                    'Đêm đại nhạc hội bùng nổ quy tụ dàn Anh Trai hot nhất màn ảnh với sân khấu chữ T 360 độ và hệ thống âm thanh ánh sáng đẳng cấp quốc tế.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => movies[0] && handleSelectEventFromHome(movies[0])}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center space-x-2 transition-all group"
                  >
                    <span>Xem Chi Tiết &amp; Đặt Vé</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="text-xs text-slate-400 flex items-center space-x-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Giảm 50% cùng Thẻ ACB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DANH SÁCH SỰ KIỆN & PHIM (Showcase Grid) */}
            <section id="events-grid">
              <MovieSelector
                movies={movies}
                selectedMovieId={selectedMovie?.event_id || selectedMovie?.movie_id || 0}
                onSelectMovie={handleSelectEventFromHome}
              />
            </section>

            {/* ĐỐI TÁC CỤM RẠP & NHÀ THI ĐẤU (Partner Showcase) */}
            <section className="pt-6 border-t border-slate-800/80 space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white flex items-center justify-center space-x-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span>Hệ Thống Cụm Rạp &amp; Nhà Thi Đấu Đối Tác</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Hợp tác chính thức cùng hơn 120 cụm rạp và các sân vận động lớn nhất Việt Nam
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { name: 'CGV Cinemas', type: 'Cụm Rạp IMAX', tag: 'IMAX Laser' },
                  { name: 'Lotte Cinema', type: 'Cụm Rạp Toàn Quốc', tag: 'SuperFlex' },
                  { name: 'BHD Star', type: 'Cụm Rạp Chiếu Phim', tag: 'Dolby Atmos' },
                  { name: 'Nhà Thi Đấu Phú Thọ', type: 'Nhà Thi Đấu', tag: '15.000 Chỗ' },
                  { name: 'SVĐ Quốc Gia Mỹ Đình', type: 'Sân Vận Động', tag: '40.000 Chỗ' },
                  { name: 'Trung Tâm Triển Lãm VEC', type: 'Mega Arena', tag: 'Live Concert' },
                ].map((partner, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-1 hover:border-slate-700 transition-colors"
                  >
                    <div className="font-extrabold text-xs text-white truncate">{partner.name}</div>
                    <div className="text-[10px] text-slate-400">{partner.type}</div>
                    <span className="inline-block text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {partner.tag}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN HÌNH 2: GIỚI THIỆU CHI TIẾT SỰ KIỆN / PHIM             */}
        {/* (Event Detail + Ticket Classes or Showtime Selector)     */}
        {/* ======================================================== */}
        {currentScreen === 'detail' && selectedMovie && (
          <EventDetailView
            event={selectedMovie}
            showtimes={showtimes}
            selectedShowtime={selectedShowtime}
            onSelectShowtime={(st) => setSelectedShowtime(st)}
            onProceedToSeats={handleProceedToSeats}
            onBackToHome={handleBackToHome}
          />
        )}

        {/* ======================================================== */}
        {/* MÀN HÌNH 3: SƠ ĐỒ CHỌN GHẾ / VỊ TRÍ KHÁN ĐÀI              */}
        {/* (Interactive Seat Map + Seat View Engine + Checkout CTA) */}
        {/* ======================================================== */}
        {currentScreen === 'seats' && selectedMovie && selectedShowtime && (
          <SeatSelectionView
            event={selectedMovie}
            showtime={selectedShowtime}
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            currentUserId={currentUserId}
            lockTimeRemaining={lockTimeRemaining}
            onToggleSeat={handleToggleSeat}
            onOpenSeatView={(s) => setViewingSeat(s)}
            onRefreshSeats={() => fetchSeats(selectedShowtime.showtime_id)}
            onBackToDetail={handleBackToDetail}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}
      </main>

      {/* ======================================================== */}
      {/* GLOBAL MODALS (Seat 3D View, Checkout Drawer, E-Ticket)  */}
      {/* ======================================================== */}
      {viewingSeat && (
        <SeatViewModal
          seat={viewingSeat}
          movieTitle={selectedMovie?.title}
          roomName={selectedShowtime?.room?.room_name}
          isConcert={Boolean(
            selectedShowtime?.room?.is_concert_stage ||
              selectedMovie?.category === 'concert' ||
              selectedMovie?.category === 'meeting'
          )}
          isSelected={selectedSeatIds.includes(viewingSeat.seat_id)}
          onClose={() => setViewingSeat(null)}
          onSelectSeat={(seatId) => {
            const found = seats.find((s) => s.seat_id === seatId);
            if (found) handleToggleSeat(found);
          }}
        />
      )}

      {selectedShowtime && (
        <CheckoutDrawer
          isOpen={isCheckoutOpen}
          showtime={selectedShowtime}
          selectedSeats={selectedSeatsList}
          currentUserId={currentUserId}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={(data) => {
            setIsCheckoutOpen(false);
            setSuccessBooking(data);
            setSelectedSeatIds([]);
            setLockTimeRemaining(null);
            fetchSeats(selectedShowtime.showtime_id);
          }}
        />
      )}

      {successBooking && (
        <TicketSuccessModal
          booking={successBooking.booking}
          seats={successBooking.seats}
          onClose={() => setSuccessBooking(null)}
        />
      )}

      {/* Commercial Ticketbox / CGV Style Footer */}
      <footer className="border-t border-slate-900 bg-[#05080e] py-8 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <p className="font-bold text-slate-400">
          CineBox - Cổng Đặt Vé Xem Phim Cụm Rạp &amp; Live Concert Toàn Quốc
        </p>
        <p>
          Hỗ trợ đối tác &amp; khách hàng: 1900 6408 • Email: support@cinebox.vn • Bản quyền © 2026 CineTicket Pro
        </p>
      </footer>
    </div>
  );
}
