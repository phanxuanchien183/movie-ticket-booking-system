import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CineTicket Pro - Nền Tảng Đặt Vé Xem Phim & Concert Toàn Diện',
  description:
    'Hệ thống thương mại đặt vé trực tuyến cao cấp cho cụm rạp chiếu phim CGV, Lotte và live concert, fan meeting tại các nhà thi đấu, sân vận động.',
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
      className="h-full antialiased dark"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
