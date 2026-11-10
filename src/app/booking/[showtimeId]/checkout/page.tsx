'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Showtime, Booking } from '@/types';
import { Navbar } from '@/components/Navbar';
import { TicketSuccessModal } from '@/components/TicketSuccessModal';
import { TICKETBOX_ZONES, StageZone } from '@/components/TicketboxStageMap';
import {
  Clock,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Tag,
  Loader2,
  Ticket,
} from 'lucide-react';

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const showtimeId = params?.showtimeId ? Number(params.showtimeId) : null;
  const zoneId = searchParams?.get('zone') || 'CAT_2B';
  const qtyParam = Number(searchParams?.get('qty') || '1');
  const quantity = isNaN(qtyParam) || qtyParam <= 0 ? 1 : qtyParam;

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [loading, setLoading] = useState(true);

  // Selected Zone
  const zone: StageZone =
    TICKETBOX_ZONES.find((z) => z.id === zoneId) || {
      id: 'CAT_2B',
      name: 'CAT 2B',
      code: 'CAT_2B',
      price: 1800000,
      color: '#6b21a8',
      type: 'seated',
      x: 910,
      y: 245,
      width: 80,
      height: 195,
    };

  // Questionnaire form states (Hình 5)
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeMarketing, setAgreeMarketing] = useState(true);
  const [email, setEmail] = useState('khachhang@gmail.com');
  const [phone, setPhone] = useState('0912345678');
  const [confirmVat, setConfirmVat] = useState(true);

  // Company VAT optional fields
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');

  // Discount code (ACB50)
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Countdown timer in red box: starts at 14:50 (890 seconds)
  const [timeLeft, setTimeLeft] = useState(890);

  // Success Modal state
  const [successBooking, setSuccessBooking] = useState<{
    booking: Booking;
    seats: { seat_id: string; price: number }[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return {
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0'),
    };
  };

  useEffect(() => {
    if (!showtimeId) return;
    async function loadShowtime() {
      try {
        setLoading(true);
        const res = await fetch(`/api/showtimes/${showtimeId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setShowtime(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadShowtime();
  }, [showtimeId]);

  const rawTotal = zone.price * quantity;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ACB50') {
      const discount = Math.min(rawTotal * 0.5, 100000);
      setDiscountAmount(discount);
      setPromoMessage(`Áp dụng thành công ưu đãi Thẻ ACB: Giảm ${discount.toLocaleString('vi-VN')} đ`);
    } else if (promoCode.trim()) {
      setDiscountAmount(0);
      setPromoMessage('Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng.');
    }
  };

  const handleProceedCheckout = async () => {
    if (!agreeTerms || !email || !phone) return;

    try {
      setIsSubmitting(true);
      const generatedSeats = Array.from({ length: quantity }, (_, idx) => ({
        seat_id: `${zone.id}-${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}`,
        price: zone.price,
      }));

      // Call checkout API
      const res = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtime_id: showtimeId || 101,
          seat_ids: generatedSeats.map((s) => s.seat_id),
          payment_method: 'ACB_DIGITAL',
          promo_code: promoCode || undefined,
          user_id: 'guest_' + phone,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.booking) {
        setSuccessBooking({
          booking: data.data.booking,
          seats: generatedSeats,
        });
      } else {
        // Fallback simulate success
        setSuccessBooking({
          booking: {
            booking_id: 'BK-' + Date.now().toString(36).toUpperCase(),
            user_id: 'guest_' + phone,
            customer_name: email.split('@')[0],
            customer_email: email,
            customer_phone: phone,
            showtime_id: showtimeId || 101,
            total_amount: finalTotal,
            final_amount: finalTotal,
            discount_amount: discountAmount,
            payment_method: 'ATM/Visa Online',
            payment_status: 'Paid',
            created_at: new Date().toISOString(),
          },
          seats: generatedSeats,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { minutes, seconds } = formatTimer(timeLeft);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar currentStep={3} onSearchClick={() => router.push('/')} onCategorySelect={() => router.push('/')} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Header Card with Countdown Timer (Hình 5) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {showtime?.movie?.title || 'Tinh Hà "Say Hi" Concert - Đêm 4'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>19:00 - 23:00, 15 Tháng 11, 2026</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Trung tâm triển lãm Việt Nam (VEC)</span>
              </span>
            </div>
          </div>

          {/* Ticketbox Countdown Box (Hình 5 Top Right) */}
          <div className="bg-[#111927] border border-slate-800 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center shrink-0 self-start md:self-auto min-w-[180px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Hoàn tất đặt vé trong
            </span>
            <div className="flex items-center space-x-1 text-2xl font-black font-mono">
              <span className="bg-rose-500 text-white px-2.5 py-1 rounded-lg shadow-md">
                {minutes}
              </span>
              <span className="text-rose-400 font-black">:</span>
              <span className="bg-rose-500 text-white px-2.5 py-1 rounded-lg shadow-md">
                {seconds}
              </span>
            </div>
          </div>
        </div>

        {/* Two Columns Checkout: BẢNG CÂU HỎI (Left) vs THÔNG TIN ĐẶT VÉ (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* CỘT TRÁI: BẢNG CÂU HỎI (Hình 5 Left Column) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-base font-black text-emerald-400 uppercase tracking-wider">
                BẢNG CÂU HỎI
              </h2>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              {/* Question 1: T&C */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block leading-relaxed">
                  Bạn đã đọc và hoàn toàn đồng ý &quot;Điều khoản và điều kiện&quot; của chương trình?{' '}
                  <span className="text-slate-400 font-normal">
                    / Have you read and fully agree with T&amp;C of the event
                  </span>
                </label>
                <label
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      agreeTerms
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-600 bg-transparent'
                    }`}
                  >
                    {agreeTerms && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    Tôi đã đọc và đồng ý / I have read and agree
                  </span>
                </label>
              </div>

              {/* Question 2: Marketing consent */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block leading-relaxed">
                  Cho phép Ticketbox, Vie Channel, VieSHOP, VieON sử dụng thông tin đặt vé để quảng cáo &amp; vận hành
                </label>
                <label
                  onClick={() => setAgreeMarketing(!agreeMarketing)}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      agreeMarketing
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-600 bg-transparent'
                    }`}
                  >
                    {agreeMarketing && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">Tôi đồng ý</span>
                </label>
              </div>

              {/* Question 3: Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block">
                  Email của bạn? <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Điền câu trả lời của bạn"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Question 4: Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 block">
                  Số điện thoại của bạn? <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Điền câu trả lời của bạn"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Question 5: VAT invoice Policy */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-bold text-slate-200 block">
                  Chính sách xuất hóa đơn VAT của Ban Tổ Chức <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Chi tiết chính sách xuất hóa đơn VAT vui lòng xem tại Quy định tham gia chương trình Mục II. Ban Tổ chức không tiếp nhận yêu cầu bổ sung, điều chỉnh hoặc xuất thay thế hóa đơn sau khi đơn hàng đã hoàn tất, dưới bất kỳ hình thức nào.
                </p>

                <label
                  onClick={() => setConfirmVat(!confirmVat)}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                      confirmVat
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-600 bg-transparent'
                    }`}
                  >
                    {confirmVat && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 leading-relaxed">
                    Lời xác nhận đã cung cấp đúng và đầy đủ thông tin xuất hóa đơn VAT: trường hợp nhập sai hoặc không cung cấp, giao dịch sẽ được ghi nhận là không lấy hóa đơn và không hỗ trợ điều chỉnh sau khi đơn hàng hoàn tất.
                  </span>
                </label>
              </div>

              {/* Optional Company Invoice details */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300 block">
                  Thông tin công ty (nếu quý khách cần xuất hóa đơn VAT điện tử):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Tên đơn vị mua hàng"
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="Mã số thuế"
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Địa chỉ công ty"
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 sm:col-span-2"
                  />
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="Email nhận hóa đơn"
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="Số điện thoại nhận hóa đơn"
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN ĐẶT VÉ (Hình 5 Right Column) */}
          <div className="space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                  Thông tin đặt vé
                </h3>
                <button
                  type="button"
                  onClick={() => router.push(`/booking/${showtimeId || 101}`)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Chọn lại vé
                </button>
              </div>

              {/* Selected tickets item */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
                  <span>Loại vé</span>
                  <span>Số lượng</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block">{zone.name}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {zone.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900 font-mono block">
                      {quantity < 10 ? '0' + quantity : quantity}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {rawTotal.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon ACB 50% */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Mã ưu đãi (ACB50)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs uppercase font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] font-semibold ${
                      discountAmount > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Subtotal & Total */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                    <span>Ưu đãi Thẻ ACB:</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-extrabold text-slate-600">
                    Tạm tính {quantity} vé:
                  </span>
                  <span className="text-lg font-black text-[#00b14f] font-mono">
                    {finalTotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Notice note */}
              {(!agreeTerms || !email || !phone) && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-700 text-center font-medium">
                  Vui lòng trả lời tất cả câu hỏi bắt buộc để tiếp tục
                </div>
              )}

              {/* Green Big Button (Hình 5) */}
              <button
                type="button"
                disabled={!agreeTerms || !email || !phone || isSubmitting}
                onClick={handleProceedCheckout}
                className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition-all ${
                  agreeTerms && email && phone && !isSubmitting
                    ? 'bg-[#00b14f] hover:bg-[#009643] text-white shadow-xl shadow-emerald-600/30 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Đang xử lý đặt vé...</span>
                  </>
                ) : (
                  <span>Tiếp tục »</span>
                )}
              </button>
            </div>

            <div className="text-center text-xs text-slate-500">
              Cổng thanh toán chính thức Ticketbox • Bảo mật SSL 256-bit
            </div>
          </div>
        </div>
      </main>

      {/* Ticket Success Confirmation Modal */}
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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
