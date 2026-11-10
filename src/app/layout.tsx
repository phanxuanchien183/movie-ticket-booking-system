import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CineTicket Pro - Hệ Thống Đặt Vé Xem Phim & Sự Kiện Fullstack Next.js',
  description:
    'Hệ thống đặt vé trực tuyến cao cấp với Redis Seat Locking, Seat View Engine 3D mô phỏng góc nhìn rạp, chính sách voucher ràng buộc ngân hàng nghiêm ngặt.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
