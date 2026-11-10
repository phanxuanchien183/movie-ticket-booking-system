'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  RefreshCw,
  Clock,
  Ticket,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface SeatWithView extends Seat {
  view_metrics?: SeatGeometricView;
}

export default function Home() {
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

  // 3. Fetch sơ đồ ghế với Polling thời gian thực (Cập nhật tức thì giữa User A và User B)
  const fetchSeats = async (showtimeId: number, isPolling: boolean = false) => {
    try {
      const res = await fetch(`/api/showtimes/${showtimeId}/seats`);
      const data = await res.json();
      if (data.success) {
        setSeats(data.data.seats);

        // Kiểm tra nếu ghế của mình bị hết hạn lock
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

  // Heartbeat Polling: Tự động đồng bộ ghế mỗi 2.5 giây
  useEffect(() => {
    if (!selectedShowtime) return;
    setSelectedSeatIds([]);
    setLockTimeRemaining(null);
    fetchSeats(selectedShowtime.showtime_id);

    const interval = setInterval(() => {
      fetchSeats(selectedShowtime.showtime_id, true);
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedShowtime, currentUserId]);

  // Xử lý Toggle chọn / bỏ chọn ghế
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
      // Khóa giữ chỗ ghế
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
  const totalAmount = selectedSeatsList.reduce((sum, s) => sum + (s.price || 90000), 0);

  let currentStep = 1;
  if (successBooking) currentStep = 4;
  else if (isCheckoutOpen) currentStep = 3;
  else if (selectedSeatIds.length > 0) currentStep = 2;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar currentStep={currentStep} />

      {/* Commercial Movie Banner */}
      {selectedMovie && (
        <div className="relative border-b border-slate-800 bg-[#0c121e] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-sm scale-105"
            style={{
              backgroundImage: `url(${selectedMovie.backdrop_url || selectedMovie.poster_url})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/80 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            {/* Poster */}
            <div className="w-32 sm:w-40 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
              <img
                src={selectedMovie.poster_url}
                alt={selectedMovie.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1 text-center md:text-left space-y-2.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-amber-500 text-slate-950">
                  {selectedMovie.age_rating || 'T16'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {selectedMovie.genre}
                </span>
                <span className="text-xs text-slate-400">
                  Thời lượng: {selectedMovie.duration_minutes} phút
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {selectedMovie.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed line-clamp-2">
                {selectedMovie.description}
              </p>

              {/* Service Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-400">
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Giữ chỗ độc quyền 5 phút</span>
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Xem trước tầm nhìn ghế</span>
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ưu đãi chủ thẻ ACB & Vietcombank</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Notification */}
        {errorToast && (
          <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-center justify-between shadow-md">
            <span>{errorToast}</span>
            <button
              onClick={() => setErrorToast(null)}
              className="text-xs font-bold px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400"
            >
              Đóng
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

        {/* 3. Sơ Đồ Ghế Ngồi */}
        {selectedShowtime && (
          <section className="pt-4 border-t border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <span>Sơ Đồ Ghế Ngồi</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({selectedShowtime.room?.room_name || 'Rạp 01'})
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ghế được đồng bộ trực tiếp theo thời gian thực giữa các khách hàng
                </p>
              </div>

              <button
                onClick={() => fetchSeats(selectedShowtime.showtime_id)}
                className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Cập nhật ghế</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
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
        <div className="sticky bottom-0 z-40 p-4 backdrop-blur-md bg-[#090d15]/95 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-base">
                {selectedSeatIds.length}
              </div>
              <div>
                <div className="text-xs text-slate-400">
                  Ghế đang chọn: <strong className="text-white">{selectedSeatIds.join(', ')}</strong>
                </div>
                <div className="text-xl font-black text-emerald-400">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center space-x-2"
              >
                <span>Tiến Hành Đặt Vé</span>
                <ChevronRight className="w-4 h-4" />
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

      {/* Commercial Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          CineBox - Hệ Thống Bán Vé Xem Phim Trực Tuyến Chính Thức
        </p>
        <p>
          Hỗ trợ khách hàng: 1900 6408 • Email: support@cinebox.vn
        </p>
      </footer>
    </div>
  );
}
