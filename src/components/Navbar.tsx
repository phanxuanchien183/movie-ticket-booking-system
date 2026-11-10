'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket, Film, PhoneCall, ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
  currentStep?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStep = 1 }) => {
  const steps = [
    { num: 1, name: 'Chọn Phim & Suất' },
    { num: 2, name: 'Chọn Ghế Ngồi' },
    { num: 3, name: 'Thanh Toán' },
    { num: 4, name: 'Nhận Vé Điện Tử' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0f17]/95 border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand (Ticketbox Cinema Style) */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                <span>Cine</span>
                <span className="text-emerald-400">Box</span>
              </span>
              <span className="text-[10px] text-slate-400 -mt-0.5 tracking-wider uppercase font-semibold">
                Cổng Đặt Vé Trực Tuyến
              </span>
            </div>
          </Link>

          {/* Stepper Progress */}
          <div className="hidden md:flex items-center space-x-2">
            {steps.map((s, idx) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;

              return (
                <React.Fragment key={s.num}>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                        : isPast
                        ? 'text-slate-300 bg-slate-800/60'
                        : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950'
                          : isPast
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : s.num}
                    </span>
                    <span>{s.name}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-4 h-[1px] ${
                        isPast ? 'bg-emerald-500/40' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Customer Support & Quick Access */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline: <strong className="text-white font-mono">1900 6408</strong></span>
            </div>

            <Link
              href="/admin"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Kênh Đối Tác
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
