'use client';

import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Seat, SeatGeometricView, Booking } from '@/types';
import { Navbar } from '@/components/Navbar';
import { MovieSelector } from '@/components/MovieSelector';
import { ShowtimeSelector } from '@/components/ShowtimeSelector';
import { SeatMap } from '@/components/SeatMap';
import { SeatViewModal } from '@/components/SeatViewModal';
import { CheckoutDrawer } from '@/components/CheckoutDrawer';
import { TicketSuccessModal } from '@/components/TicketSuccessModal';
import {
  Film,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Info,
  Clock,
  Ticket,
} from 'lucide-react';

interface SeatWithView extends Seat {
  view_metrics?: SeatGeometricView;
}

export default function Home() {
  const currentUserId = 1; // Giả lập user đăng nhập

  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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

  // 1. Fetch danh sách phim ban đầu
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

  // 2. Fetch danh sách suất chiếu khi chọn phim
  useEffect(() => {
    if (!selectedMovie) return;
    async function loadShowtimes() {
      try {
        const res = await fetch(`/api/showtimes?movieId=${selectedMovie?.movie_id}`);
        const data = await res.json();
        if (data.success) {
          setShowtimes(data.data);
          if (data.data.length > 0) {
            setSelectedShowtime(data.data[0]);
          } else {
            setSelectedShowtime(null);
            setSeats([]);
            setSelectedSeatIds([]);
          }
        }
      } catch (e) {
        console.error('Lỗi tải suất chiếu:', e);
      }
    }
    loadShowtimes();
  }, [selectedMovie]);

  // 3. Fetch sơ đồ ghế khi chọn suất chiếu
  const fetchSeats = async (showtimeId: number) => {
    try {
      const res = await fetch(`/api/showtimes/${showtimeId}/seats`);
      const data = await res.json();
      if (data.success) {
        setSeats(data.data.seats);
      }
    } catch (e) {
      console.error('Lỗi tải ghế:', e);
    }
  };

  useEffect(() => {
    if (!selectedShowtime) return;
    setSelectedSeatIds([]);
    setLockTimeRemaining(null);
    fetchSeats(selectedShowtime.showtime_id);
  }, [selectedShowtime]);

  // Xử lý Toggle chọn / bỏ chọn ghế (Gọi Redis Lock API)
  const handleToggleSeat = async (seat: SeatWithView) => {
    if (!selectedShowtime) return;
    setErrorToast(null);

    const isAlreadySelected = selectedSeatIds.includes(seat.seat_id);

    if (isAlreadySelected) {
      // Giải phóng ghế
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
      // Khóa ghế qua Redis
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
          setErrorToast(data.error || 'Ghế đang được người khác giữ!');
          await fetchSeats(selectedShowtime.showtime_id);
        } else {
          setSelectedSeatIds([...selectedSeatIds, seat.seat_id]);
          setLockTimeRemaining(300); // 5 phút TTL
          await fetchSeats(selectedShowtime.showtime_id);
        }
      } catch (e) {
        setErrorToast('Không thể kết nối dịch vụ khóa ghế.');
      }
    }
  };

  const selectedSeatsList = seats.filter((s) => selectedSeatIds.includes(s.seat_id));
  const totalAmount = selectedSeatsList.reduce((sum, s) => sum + (s.price || 90000), 0);

  // Xác định bước tiến trình
  let currentStep = 1;
  if (successBooking) currentStep = 4;
  else if (isCheckoutOpen) currentStep = 3;
  else if (selectedSeatIds.length > 0) currentStep = 2;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar currentStep={currentStep} />

      {/* Hero Movie Banner */}
      {selectedMovie && (
        <div className="relative border-b border-slate-800 bg-slate-900/60 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-sm scale-105"
            style={{
              backgroundImage: `url(${selectedMovie.backdrop_url || selectedMovie.poster_url})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Movie Poster */}
            <div className="w-36 sm:w-44 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 ring-4 ring-slate-800/40">
              <img
                src={selectedMovie.poster_url}
                alt={selectedMovie.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500 text-slate-950">
                  {selectedMovie.age_rating || 'T16'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {selectedMovie.genre}
                </span>
                <span className="text-xs text-slate-400">
                  Thời lượng: {selectedMovie.duration_minutes} phút
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {selectedMovie.title}
              </h1>

              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed line-clamp-3">
                {selectedMovie.description}
              </p>

              {/* Architecture Feature Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-400">
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Redis Seat Lock (TTL 300s)</span>
                </span>
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Seat View Engine (Góc nhìn mô phỏng 3D)</span>
                </span>
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ràng buộc thanh toán ngân hàng nghiêm ngặt</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Error Toast */}
        {errorToast && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
            <span>{errorToast}</span>
            <button
              onClick={() => setErrorToast(null)}
              className="text-xs font-bold px-2.5 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Đã hiểu
            </button>
          </div>
        )}

        {/* 1. Chọn Phim */}
        <section>
          <MovieSelector
            movies={movies}
            selectedMovieId={selectedMovie?.movie_id || 0}
            onSelectMovie={(m) => {
              setSelectedMovie(m);
            }}
          />
        </section>

        {/* 2. Chọn Suất Chiếu */}
        <section className="pt-4 border-t border-slate-800/80">
          <ShowtimeSelector
            showtimes={showtimes}
            selectedShowtimeId={selectedShowtime?.showtime_id || null}
            onSelectShowtime={(st) => setSelectedShowtime(st)}
          />
        </section>

        {/* 3. Sơ đồ ghế tương tác & Mô phỏng góc nhìn */}
        {selectedShowtime && (
          <section className="pt-6 border-t border-slate-800/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>Sơ Đồ Ghế Phòng Chiếu</span>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                    {selectedShowtime.room?.room_name || 'Rạp 01'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click vào ghế để xem góc nhìn mô phỏng hoặc chọn ghế đặt chỗ độc quyền.
                </p>
              </div>

              <button
                onClick={() => fetchSeats(selectedShowtime.showtime_id)}
                className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Làm mới trạng thái ghế</span>
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
              <SeatMap
                seats={seats}
                selectedSeatIds={selectedSeatIds}
                currentUserId={currentUserId}
                onToggleSeat={handleToggleSeat}
                onOpenSeatView={(s) => setViewingSeat(s)}
                lockTimeRemaining={lockTimeRemaining}
              />
            </div>
          </section>
        )}
      </main>

      {/* Floating Bottom Bar (Sticky Selection & Checkout CTA) */}
      {selectedSeatIds.length > 0 && selectedShowtime && (
        <div className="sticky bottom-0 z-40 p-4 backdrop-blur-md bg-slate-950/90 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-lg">
                {selectedSeatIds.length}
              </div>
              <div>
                <div className="text-xs text-slate-400">
                  Ghế đã giữ ({selectedSeatIds.join(', ')}):
                </div>
                <div className="text-2xl font-black text-rose-400">
                  {totalAmount.toLocaleString('vi-VN')}{' '}
                  <span className="text-xs text-slate-400 font-normal">VNĐ</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white font-bold text-base shadow-xl shadow-rose-500/25 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
              >
                <span>Tiếp Tục Thanh Toán</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {viewingSeat && (
        <SeatViewModal
          seat={viewingSeat}
          movieTitle={selectedMovie?.title}
          roomName={selectedShowtime?.room?.room_name}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>Hệ Thống Đặt Vé Xem Phim & Sự Kiện Fullstack Next.js</p>
        <p className="mt-1">
          Bản quyền © 2026 phanxuanchien183 • Zod Schemas • Redis Seat Lock • Seat View Engine • Bank Binding Checkout
        </p>
      </footer>
    </div>
  );
}
