'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Showtime, Seat, SeatGeometricView, Booking } from '@/types';
import { Navbar } from '@/components/Navbar';
import { SeatSelectionView } from '@/components/SeatSelectionView';
import { SeatViewModal } from '@/components/SeatViewModal';
import { CheckoutDrawer } from '@/components/CheckoutDrawer';
import { TicketSuccessModal } from '@/components/TicketSuccessModal';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

interface SeatWithView extends Seat {
  view_metrics?: SeatGeometricView;
}

function BookingContent() {
  const params = useParams();
  const router = useRouter();
  const showtimeId = params?.showtimeId ? Number(params.showtimeId) : null;

  // Phiên người dùng độc lập để khóa ghế chính xác
  const [currentUserId, setCurrentUserId] = useState<string>('guest_default');

  useEffect(() => {
    let stored = sessionStorage.getItem('cinebox_guest_id');
    if (!stored) {
      stored = 'guest_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('cinebox_guest_id', stored);
    }
    setCurrentUserId(stored);
  }, []);

  const [showtime, setShowtime] = useState<Showtime | null>(null);
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

  // 1. Tải thông tin suất chiếu
  useEffect(() => {
    if (!showtimeId) return;

    async function loadShowtime() {
      try {
        setLoading(true);
        const res = await fetch(`/api/showtimes/${showtimeId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setShowtime(data.data);
        } else {
          setErrorToast(data.error || 'Không tìm thấy thông tin suất chiếu.');
        }
      } catch (err: any) {
        console.error('Lỗi tải thông tin suất chiếu:', err);
        setErrorToast('Không thể kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    }

    loadShowtime();
  }, [showtimeId]);

  // 2. Fetch danh sách ghế & Heartbeat Polling mỗi 2.5 giây
  const fetchSeats = async (stId: number, isPolling: boolean = false) => {
    try {
      const res = await fetch(`/api/showtimes/${stId}/seats`);
      const data = await res.json();
      if (data.success && data.data?.seats) {
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

  useEffect(() => {
    if (!showtimeId) return;

    fetchSeats(showtimeId);
    const interval = setInterval(() => {
      fetchSeats(showtimeId, true);
    }, 2500);

    return () => clearInterval(interval);
  }, [showtimeId, currentUserId]);

  // Đếm ngược thời gian giữ ghế
  useEffect(() => {
    if (lockTimeRemaining === null || lockTimeRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setSelectedSeatIds([]);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockTimeRemaining]);

  // Xử lý Toggle chọn / bỏ chọn ghế
  const handleToggleSeat = async (seat: SeatWithView) => {
    if (!showtimeId) return;
    setErrorToast(null);

    const isAlreadySelected = selectedSeatIds.includes(seat.seat_id);

    if (isAlreadySelected) {
      try {
        await fetch('/api/seats/release', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            showtime_id: showtimeId,
            seat_ids: [seat.seat_id],
            user_id: currentUserId,
          }),
        });

        const nextSelected = selectedSeatIds.filter((id) => id !== seat.seat_id);
        setSelectedSeatIds(nextSelected);
        if (nextSelected.length === 0) setLockTimeRemaining(null);
        await fetchSeats(showtimeId);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await fetch('/api/seats/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            showtime_id: showtimeId,
            seat_ids: [seat.seat_id],
            user_id: currentUserId,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorToast(data.error || 'Ghế vừa có người khác giữ chỗ, vui lòng chọn ghế khác!');
          await fetchSeats(showtimeId);
        } else {
          setSelectedSeatIds((prev) => [...prev, seat.seat_id]);
          setLockTimeRemaining(300); // 5 phút
          await fetchSeats(showtimeId);
        }
      } catch (e) {
        setErrorToast('Không thể giữ chỗ ghế lúc này. Vui lòng thử lại!');
      }
    }
  };

  const selectedSeatsList = seats.filter((s) => selectedSeatIds.includes(s.seat_id));

  const handleBackToDetail = () => {
    if (showtime?.movie_id) {
      router.push(`/events/${showtime.movie_id}`);
    } else {
      router.back();
    }
  };

  let currentStep = 2;
  if (successBooking) currentStep = 4;
  else if (isCheckoutOpen) currentStep = 3;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        currentStep={currentStep}
        onSearchClick={() => router.push('/')}
        onCategorySelect={() => router.push('/')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
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

        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-sm font-semibold">Đang tải sơ đồ rạp &amp; dữ liệu ghế ngồi...</span>
          </div>
        )}

        {!loading && showtime && (
          <SeatSelectionView
            event={showtime.movie}
            showtime={showtime}
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            currentUserId={currentUserId}
            lockTimeRemaining={lockTimeRemaining}
            onToggleSeat={handleToggleSeat}
            onOpenSeatView={(s: SeatWithView) => setViewingSeat(s)}
            onRefreshSeats={() => fetchSeats(showtime.showtime_id)}
            onBackToDetail={handleBackToDetail}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}

        {!loading && !showtime && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-red-500/30 text-center space-y-4 max-w-lg mx-auto mt-12">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-base">Suất chiếu không tồn tại</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Suất chiếu bạn yêu cầu không tìm thấy hoặc đã kết thúc.
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors inline-flex items-center space-x-2 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Quay lại trang chủ</span>
            </button>
          </div>
        )}
      </main>

      {/* MODAL 1: GÓC NHÌN 3D MÔ PHỎNG GHẾ NGỒI */}
      {viewingSeat && (
        <SeatViewModal
          seat={viewingSeat}
          movieTitle={showtime?.movie?.title}
          roomName={showtime?.room?.room_name}
          isConcert={Boolean(
            showtime?.room?.is_concert_stage ||
              showtime?.movie?.category === 'concert' ||
              showtime?.movie?.category === 'meeting'
          )}
          isSelected={selectedSeatIds.includes(viewingSeat.seat_id)}
          onClose={() => setViewingSeat(null)}
          onSelectSeat={(seatId) => {
            const found = seats.find((s) => s.seat_id === seatId);
            if (found) handleToggleSeat(found);
          }}
        />
      )}

      {/* DRAWER 2: THANH TOÁN TIỆN ÍCH */}
      {isCheckoutOpen && showtime && (
        <CheckoutDrawer
          isOpen={isCheckoutOpen}
          showtime={showtime}
          selectedSeats={selectedSeatsList}
          currentUserId={currentUserId}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={(data: any) => {
            setIsCheckoutOpen(false);
            setSuccessBooking(data);
            setSelectedSeatIds([]);
            setLockTimeRemaining(null);
            fetchSeats(showtime.showtime_id);
          }}
        />
      )}

      {/* MODAL 3: XÁC NHẬN VÉ ĐIỆN TỬ VNPAY / ACB */}
      {successBooking && (
        <TicketSuccessModal
          booking={successBooking.booking}
          seats={successBooking.seats}
          onClose={() => {
            setSuccessBooking(null);
            router.push('/');
          }}
        />
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
