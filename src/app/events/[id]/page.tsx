'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EntertainmentEvent, Showtime } from '@/types';
import { Navbar } from '@/components/Navbar';
import { EventDetailView } from '@/components/EventDetailView';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

function EventDetailContent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id ? Number(params.id) : null;

  const [event, setEvent] = useState<EntertainmentEvent | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    async function loadEventData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Tải thông tin sự kiện / phim
        const eventRes = await fetch(`/api/movies/${eventId}`);
        const eventData = await eventRes.json();

        if (!eventRes.ok || !eventData.success || !eventData.data) {
          throw new Error(eventData.error || 'Không tìm thấy thông tin sự kiện hoặc phim đã chọn.');
        }

        const currentEvent = eventData.data;
        setEvent(currentEvent);

        // 2. Tải danh sách suất chiếu của sự kiện
        const movieId = currentEvent.movie_id || currentEvent.event_id;
        const showtimesRes = await fetch(`/api/showtimes?movieId=${movieId}`);
        const showtimesData = await showtimesRes.json();

        if (showtimesData.success && Array.isArray(showtimesData.data)) {
          setShowtimes(showtimesData.data);
          if (showtimesData.data.length > 0) {
            setSelectedShowtime(showtimesData.data[0]);
          }
        }
      } catch (err: any) {
        console.error('Lỗi tải chi tiết sự kiện:', err);
        setError(err.message || 'Không thể tải dữ liệu sự kiện lúc này.');
      } finally {
        setLoading(false);
      }
    }

    loadEventData();
  }, [eventId]);

  const handleProceedToSeats = () => {
    if (!selectedShowtime && showtimes.length > 0) {
      router.push(`/booking/${showtimes[0].showtime_id}`);
    } else if (selectedShowtime) {
      router.push(`/booking/${selectedShowtime.showtime_id}`);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        currentStep={1}
        onSearchClick={() => router.push('/')}
        onCategorySelect={() => router.push('/')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-sm font-semibold">Đang tải thông tin sự kiện &amp; lịch chiếu...</span>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-red-500/30 text-center space-y-4 max-w-lg mx-auto mt-12">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-base">Không thể tải dữ liệu</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
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

        {!loading && !error && event && (
          <EventDetailView
            event={event}
            showtimes={showtimes}
            selectedShowtime={selectedShowtime}
            onSelectShowtime={(st) => setSelectedShowtime(st)}
            onProceedToSeats={handleProceedToSeats}
            onBackToHome={handleBackToHome}
          />
        )}
      </main>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <EventDetailContent />
    </Suspense>
  );
}
