'use client';

import React, { useState } from 'react';
import { Showtime, Seat } from '@/types';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  Wallet,
  Tag,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Loader2,
  X,
  Ticket,
} from 'lucide-react';

interface CheckoutDrawerProps {
  showtime: Showtime;
  selectedSeats: Seat[];
  currentUserId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingData: any) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'ACB_CREDIT',
    name: 'Thẻ Tín Dụng ACB (Visa/Mastercard)',
    bankCode: 'ACB',
    icon: CreditCard,
    badge: 'Khuyên Dùng - Giảm 50% với ACB50',
  },
  {
    id: 'ACB_QR',
    name: 'ACB One QR Code',
    bankCode: 'ACB',
    icon: QrCode,
    badge: 'Hỗ trợ mã ACB50',
  },
  {
    id: 'VCB_DIGIBANK',
    name: 'Vietcombank Digibank QR',
    bankCode: 'VCB',
    icon: QrCode,
    badge: 'Hỗ trợ mã VCB30K',
  },
  {
    id: 'MOMO_WALLET',
    name: 'Ví Điện Tử MoMo',
    bankCode: null,
    icon: Wallet,
    badge: 'Thanh toán siêu tốc',
  },
  {
    id: 'VNPAY_QR',
    name: 'Cổng thanh toán VNPAY QR',
    bankCode: null,
    icon: QrCode,
    badge: 'Quét mọi app ngân hàng',
  },
];

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  showtime,
  selectedSeats,
  currentUserId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [customerName, setCustomerName] = useState('Phan Xuân Chiến');
  const [customerEmail, setCustomerEmail] = useState('phanxuanchien183@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('0987654321');

  const [paymentMethod, setPaymentMethod] = useState('ACB_CREDIT');
  const [promoCode, setPromoCode] = useState('ACB50');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Tính tiền vé
  const totalTicketPrice = selectedSeats.reduce((sum, s) => sum + (s.price || 90000), 0);
  const finalPrice = Math.max(0, totalTicketPrice - discountAmount);

  // Validate Promo Code
  const handleValidatePromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Vui lòng nhập mã giảm giá');
      setPromoMessage(null);
      setDiscountAmount(0);
      return;
    }

    setIsValidatingPromo(true);
    setPromoError(null);
    setPromoMessage(null);

    try {
      const res = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.trim(),
          total_amount: totalTicketPrice,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPromoError(data.message || 'Mã giảm giá không hợp lệ');
        setDiscountAmount(0);
      } else {
        setPromoMessage(data.message);
        setDiscountAmount(data.data.discount_amount);
      }
    } catch (err: any) {
      setPromoError('Lỗi kiểm tra mã giảm giá');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  // Submit Checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const res = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtime_id: showtime.showtime_id,
          seat_ids: selectedSeats.map((s) => s.seat_id),
          user_id: currentUserId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          promo_code: discountAmount > 0 ? promoCode.trim() : undefined,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCheckoutError(data.error || 'Đặt vé thất bại, vui lòng thử lại.');
      } else {
        // Bắn pháo hoa ăn mừng đặt vé thành công
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        onSuccess(data.data);
      }
    } catch (err: any) {
      setCheckoutError('Lỗi kết nối tới máy chủ khi thanh toán.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Thanh Toán & Xác Nhận Vé</h3>
              <p className="text-xs text-slate-400">
                {showtime.movie?.title} • {showtime.format_type}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCheckout} className="p-6 space-y-6 flex-1">
          {/* Seat details recap */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Ghế đã chọn:</span>
              <span className="font-bold text-white text-sm">
                {selectedSeats.map((s) => s.seat_id).join(', ')}
              </span>
            </div>

            <div className="divide-y divide-slate-800/60 text-xs">
              {selectedSeats.map((s) => (
                <div key={s.seat_id} className="py-1.5 flex items-center justify-between text-slate-300">
                  <span>
                    Ghế {s.seat_id} ({s.seat_type})
                  </span>
                  <span className="font-semibold">{s.price?.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Thông Tin Người Nhận Vé
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email nhận vé *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                    placeholder="0987654321"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Phương Thức Thanh Toán
            </h4>

            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <div
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      setDiscountAmount(0);
                      setPromoMessage(null);
                      setPromoError(null);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/30'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{method.name}</div>
                        <div className="text-[11px] text-slate-400">{method.badge}</div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-rose-500 bg-rose-500' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promotion Code & Bank Binding */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Mã Khuyến Mãi (Ràng Buộc Ngân Hàng)</span>
            </h4>

            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setDiscountAmount(0);
                  setPromoMessage(null);
                  setPromoError(null);
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono uppercase text-white focus:outline-none focus:border-amber-500"
                placeholder="VD: ACB50, VCB30K..."
              />
              <button
                type="button"
                onClick={handleValidatePromo}
                disabled={isValidatingPromo}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/40 transition-colors flex items-center space-x-1"
              >
                {isValidatingPromo ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Áp Dụng</span>
                )}
              </button>
            </div>

            {/* Validation Feedback */}
            {promoMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{promoMessage}</span>
              </div>
            )}

            {promoError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{promoError}</span>
              </div>
            )}

            <div className="text-[11px] text-slate-500 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Gợi ý: Mã <strong>ACB50</strong> (Giảm 50% max 100k, bắt buộc thẻ ACB), mã <strong>VCB30K</strong> (Giảm 30k Vietcombank).</span>
            </div>
          </div>

          {/* Error Message */}
          {checkoutError && (
            <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 font-medium">
              {checkoutError}
            </div>
          )}

          {/* Pricing Totals */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Tổng tiền vé ({selectedSeats.length} ghế):</span>
              <span className="text-white font-medium">
                {totalTicketPrice.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Khuyến mãi giảm trừ:</span>
                <span>-{discountAmount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Tổng thanh toán:</span>
              <span className="text-2xl font-black text-rose-400">
                {finalPrice.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || selectedSeats.length === 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white font-bold text-base shadow-xl shadow-rose-500/25 hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang xử lý giao dịch...</span>
              </>
            ) : (
              <span>Xác Nhận Đặt Vé & Thanh Toán</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
