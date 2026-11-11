import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CineTicket - Nền Tảng Đặt Vé Xem Phim & Vé Concert Hàng Đầu Việt Nam',
  description:
    'Hệ thống thương mại điện tử đặt vé cụm rạp CGV, Lotte, BHD và concert, fan meeting tại các nhà thi đấu, sân vận động quy mô lớn.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
