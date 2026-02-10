import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "ポーカーチップマネージャー",
  description: "トランプだけで遊べるポーカーチップ管理アプリ",
  openGraph: {
    title: "ポーカーチップマネージャー",
    description: "トランプだけで遊べるポーカーチップ管理アプリ",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
