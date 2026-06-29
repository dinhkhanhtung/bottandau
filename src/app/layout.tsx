import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kim Kê Connect | AI Business Network Tân Dậu 1981",
  description: "Mạng lưới kết nối giao thương và tri thức thông minh dành riêng cho cộng đồng Tân Dậu 1981. Tích hợp AI Semantic Search và AI Matching chủ động.",
  keywords: "Tân Dậu 1981, Hỗ trợ chéo Tân Dậu, Kim Kê Connect, AI Business Network, Kết nối kinh doanh 1981",
  openGraph: {
    title: "Kim Kê Connect | AI Business Network Tân Dậu 1981",
    description: "Mạng lưới kết nối giao thương và tri thức thông minh dành riêng cho cộng đồng Tân Dậu 1981. Tích hợp AI Semantic Search và AI Matching chủ động.",
    type: "website",
    locale: "vi_VN",
    url: "https://kimke-connect.vercel.app",
    siteName: "Kim Kê Connect",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500/30 selection:text-amber-200">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/70 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="flex items-center gap-2 group">
                  <span className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent group-hover:opacity-85 transition-opacity">
                    KIM KÊ CONNECT
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
                    AI Network
                  </span>
                </a>
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-sm font-medium text-neutral-300 hover:text-amber-400 transition-colors">
                  Trang chủ
                </a>
                <a href="/dang-ky" className="text-sm font-medium text-neutral-300 hover:text-amber-400 transition-colors">
                  Đăng ký hồ sơ
                </a>
                <a href="https://m.me/2571120902929642" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-neutral-300 hover:text-amber-400 transition-colors">
                  Chat với Bot
                </a>
              </nav>

              {/* CTA Button */}
              <div className="flex items-center gap-4">
                <a
                  href="/dang-ky"
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-all hover:scale-105"
                >
                  Đăng ký ngay
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="border-t border-neutral-900 bg-neutral-950 py-8 text-neutral-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} Kim Kê Connect. Dành riêng cho cộng đồng Tân Dậu 1981.
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Được vận hành tự động bằng công nghệ Trí tuệ Nhân tạo thông minh.
                </p>
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/" className="hover:text-amber-400 transition-colors">Trang chủ</a>
                <a href="/dang-ky" className="hover:text-amber-400 transition-colors">Đăng ký</a>
                <a href="https://m.me/2571120902929642" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Facebook Bot</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
