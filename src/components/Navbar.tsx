'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Sparkles, ShieldCheck, Code2 } from 'lucide-react';

interface NavbarProps {
  currentStep?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStep = 1 }) => {
  const steps = [
    { num: 1, name: 'Chọn Suất Chiếu' },
    { num: 2, name: 'Chọn Ghế & Góc Nhìn' },
    { num: 3, name: 'Thanh Toán' },
    { num: 4, name: 'Vé Điện Tử' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
                CineTicket Pro
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-rose-400 font-medium px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                Fullstack Next.js
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
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-500/20'
                        : isPast
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isActive
                          ? 'bg-rose-500 text-white'
                          : isPast
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPast ? '✓' : s.num}
                    </span>
                    <span>{s.name}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-4 h-[1px] ${
                        isPast ? 'bg-emerald-500/50' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2.5">
            <Link
              href="/admin"
              className="flex items-center space-x-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-colors"
            >
              <span>Quản Trị / Admin</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Redis Lock Active</span>
            </div>
            <a
              href="https://github.com/phanxuanchien183/movie-ticket-booking-system"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Code2 className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">GitHub Repo</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
