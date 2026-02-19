import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "ポーカーチップ管理 | チップなし・トランプだけで遊べる無料アプリ",
  description:
    "チップがなくてもポーカーができる！トランプだけでテキサスホールデムを楽しむ無料チップ管理Webアプリ。登録不要・インストール不要ですぐ使えます。ブラインド管理・サイドポット計算・観戦機能付き。",
  keywords: [
    "ポーカー チップ管理",
    "チップ管理",
    "ポーカー チップなし",
    "トランプだけ ポーカー",
    "テキサスホールデム 無料",
    "チップ計算",
    "ポーカー 無料アプリ",
    "チップなし ポーカー やり方",
  ],
  alternates: {
    canonical: "https://pokerchip.jp",
  },
  openGraph: {
    title: "ポーカーチップ管理 | チップなし・トランプだけで遊べる無料アプリ",
    description:
      "チップがなくてもポーカーができる！トランプだけでテキサスホールデムを楽しむ無料チップ管理Webアプリ。",
    url: "https://pokerchip.jp",
    siteName: "ポーカーチップマネージャー",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ポーカーチップ管理 | チップなし・トランプだけ",
    description: "チップなしでポーカーができる無料Webアプリ。登録不要。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2027941585770580"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
