'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { GameSettings } from '@/types/game-types';
import Image from 'next/image';
import Link from 'next/link';

export default function SetupScreen() {
  const router = useRouter();
  const { setSettings, startGame } = useGameStore();

  const [formData, setFormData] = useState<GameSettings>({
    playerCount: 4,
    playerNames: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
    betUnit: 100,
    startingChips: 10000,
    blindsEnabled: true,
    smallBlind: 100,
    bigBlind: 200,
    autoIncreaseBlind: false
  });

  const handlePlayerCountChange = (count: number) => {
    const newNames = Array.from({ length: count }, (_, i) =>
      formData.playerNames[i] || `Player ${i + 1}`
    );
    setFormData({ ...formData, playerCount: count, playerNames: newNames });
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...formData.playerNames];
    newNames[index] = name;
    setFormData({ ...formData, playerNames: newNames });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    startGame();
    router.push('/game');
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ポーカーチップマネージャー',
    alternateName: ['ポーカーチップ管理アプリ', 'pokerchip.jp'],
    url: 'https://pokerchip.jp',
    description:
      'チップなし・トランプだけでテキサスホールデムを楽しむ無料チップ管理Webアプリ。プレイヤー名・チップ枚数・ブラインド・ポットをリアルタイムで管理。',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'ja',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    featureList: [
      'チップ枚数管理',
      'ベット・レイズ管理',
      'サイドポット自動計算',
      'ブラインド管理',
      'リアルタイム観戦機能（共有コード）',
      'プレイヤー2〜10人対応',
    ],
    author: {
      '@type': 'Organization',
      name: 'Pokerchip.jp',
    },
  };

  return (
    <div className="min-h-screen hero-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero Section */}
        <div className="relative text-center pt-4 pb-10 overflow-hidden rounded-xl">
          {/* Background illustration */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ maskImage: 'radial-gradient(ellipse 80% 70% at center, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at center, black 40%, transparent 100%)' }}>
            <Image
              src="/toppage-bg.png"
              alt=""
              width={800}
              height={340}
              priority
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

          {/* Main title */}
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-5xl font-bold casino-text-white mb-3 tracking-wide drop-shadow-lg">
              チップ不要・トランプだけで遊べる！
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold gold-text tracking-wider drop-shadow-lg">
              プレイ状況をカンタン管理
            </h2>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-casino-gold opacity-60"></div>
              <span className="text-casino-gold text-sm">POKER CHIP MANAGEMENT APP</span>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-casino-gold opacity-60"></div>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm sm:text-base mt-4">
              カードは本物、チップはアプリで。本格テキサスホールデムを手軽に楽しもう。
            </p>
          </div>
        </div>

        {/* Characters — mobile: centered row, desktop: flanking buttons */}
        <div className="flex justify-center items-end gap-6 mt-2 mb-2 sm:hidden">
          <Image
            src="/character.png"
            alt="ポーカーチップマスコット"
            width={240}
            height={240}
            priority
            className="w-24 h-auto object-contain"
          />
          <Image
            src="/character2.png"
            alt="ポーカーチップマスコット"
            width={240}
            height={240}
            priority
            className="w-24 h-auto object-contain"
          />
        </div>

        {/* Navigation Buttons (with flanking characters on sm+) */}
        <div className="relative mb-8">
          {/* Left character — desktop only */}
          <Image
            src="/character.png"
            alt="ポーカーチップマスコット"
            width={240}
            height={240}
            className="hidden sm:block absolute pointer-events-none select-none sm:w-32 md:w-44 lg:w-52 -left-4 md:-left-8 bottom-0 sm:bottom-[-1rem]"
          />
          {/* Right character — desktop only */}
          <Image
            src="/character2.png"
            alt="ポーカーチップマスコット"
            width={240}
            height={240}
            className="hidden sm:block absolute pointer-events-none select-none sm:w-32 md:w-44 lg:w-52 -right-4 md:-right-8 bottom-0 sm:bottom-[-1rem]"
          />

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 relative z-10 py-2">
            <Link
              href="/how-to-play"
              className="px-6 py-2.5 glass-card gold-text font-semibold rounded-lg hover:bg-white/10 transition-all text-center"
            >
              使い方
            </Link>
            <Link
              href="/rules"
              className="px-6 py-2.5 glass-card gold-text font-semibold rounded-lg hover:bg-white/10 transition-all text-center"
            >
              ポーカーのルール
            </Link>
            <Link
              href="/faq"
              className="px-6 py-2.5 glass-card gold-text font-semibold rounded-lg hover:bg-white/10 transition-all text-center"
            >
              よくある質問
            </Link>
          </div>
        </div>

        {/* Game Settings Form */}
        <div className="glass-card rounded-xl p-4 sm:p-8">
          <h2 className="text-2xl font-bold gold-text mb-6 flex items-center gap-2">
            <span className="text-casino-gold">♦</span>
            ゲーム設定
            <span className="text-casino-gold">♠</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Count */}
            <div>
              <label className="block text-white font-semibold mb-2">
                プレイ人数
              </label>
              {/* Silhouette icons */}
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { if (n >= 2) handlePlayerCountChange(n); }}
                    className={`flex flex-col items-center justify-center w-8 h-10 rounded transition-all ${
                      n <= formData.playerCount
                        ? 'text-casino-gold'
                        : n >= 2
                          ? 'text-gray-600 hover:text-gray-400'
                          : 'text-gray-700 cursor-not-allowed'
                    }`}
                    disabled={n < 2}
                    aria-label={`${n}人`}
                  >
                    <svg viewBox="0 0 24 32" fill="currentColor" className="w-5 h-6">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M12 16c-7 0-11 4-11 8v2c0 1 0.5 2 2 2h18c1.5 0 2-1 2-2v-2c0-4-4-8-11-8z" />
                    </svg>
                  </button>
                ))}
              </div>
              {/* +/- controls with count */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { if (formData.playerCount > 2) handlePlayerCountChange(formData.playerCount - 1); }}
                  disabled={formData.playerCount <= 2}
                  className="w-10 h-10 rounded-lg bg-black/40 border border-casino-gold-dark/50 text-casino-gold text-xl font-bold hover:border-casino-gold transition-all disabled:text-gray-600 disabled:border-gray-700 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="gold-text text-2xl font-bold min-w-[2ch] text-center">{formData.playerCount}</span>
                <button
                  type="button"
                  onClick={() => { if (formData.playerCount < 10) handlePlayerCountChange(formData.playerCount + 1); }}
                  disabled={formData.playerCount >= 10}
                  className="w-10 h-10 rounded-lg bg-black/40 border border-casino-gold-dark/50 text-casino-gold text-xl font-bold hover:border-casino-gold transition-all disabled:text-gray-600 disabled:border-gray-700 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Player Names — 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {formData.playerNames.map((name, index) => (
                <div key={index}>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    プレイヤー {index + 1}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="w-full px-4 py-3 bg-black/40 border border-casino-gold-dark/50 text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all placeholder-gray-500"
                  />
                </div>
              ))}
            </div>

            {/* Bet Unit */}
            <div>
              <label className="block text-white font-semibold mb-2">
                ベット単位
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={formData.betUnit}
                onChange={(e) => setFormData({ ...formData, betUnit: Number(e.target.value) })}
                className="gold-slider mb-2"
              />
              <input
                type="number"
                min="1"
                value={formData.betUnit}
                onChange={(e) => setFormData({ ...formData, betUnit: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-black/40 border border-casino-gold-dark/50 text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all placeholder-gray-500"
              />
            </div>

            {/* Starting Chips */}
            <div>
              <label className="block text-white font-semibold mb-2">
                初期チップ
              </label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={formData.startingChips}
                onChange={(e) => setFormData({ ...formData, startingChips: Number(e.target.value) })}
                className="gold-slider mb-2"
              />
              <input
                type="number"
                min="100"
                step="100"
                value={formData.startingChips}
                onChange={(e) => setFormData({ ...formData, startingChips: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-black/40 border border-casino-gold-dark/50 text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all placeholder-gray-500"
              />
            </div>

            {/* Blinds Toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.blindsEnabled}
                  onChange={(e) => setFormData({ ...formData, blindsEnabled: e.target.checked })}
                  className="w-5 h-5 accent-casino-gold rounded focus:ring-casino-gold"
                />
                <span className="text-white font-semibold">ブラインドあり</span>
              </label>
            </div>

            {/* Blind Settings (conditional) */}
            {formData.blindsEnabled && (
              <>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Small Blind
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="5000"
                    step="10"
                    value={formData.smallBlind}
                    onChange={(e) => setFormData({ ...formData, smallBlind: Number(e.target.value) })}
                    className="gold-slider mb-2"
                  />
                  <input
                    type="number"
                    min="1"
                    value={formData.smallBlind}
                    onChange={(e) => setFormData({ ...formData, smallBlind: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/40 border border-casino-gold-dark/50 text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Big Blind
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="10000"
                    step="10"
                    value={formData.bigBlind}
                    onChange={(e) => setFormData({ ...formData, bigBlind: Number(e.target.value) })}
                    className="gold-slider mb-2"
                  />
                  <input
                    type="number"
                    min="1"
                    value={formData.bigBlind}
                    onChange={(e) => setFormData({ ...formData, bigBlind: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/40 border border-casino-gold-dark/50 text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.autoIncreaseBlind}
                      onChange={(e) => setFormData({ ...formData, autoIncreaseBlind: e.target.checked })}
                      className="w-5 h-5 accent-casino-gold rounded focus:ring-casino-gold"
                    />
                    <span className="text-white font-semibold">ブラインド自動増加</span>
                  </label>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-b from-casino-gold to-casino-gold-dark text-casino-dark-bg text-xl font-bold rounded-lg hover:from-casino-gold-light hover:to-casino-gold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
            >
              ゲーム開始
            </button>
          </form>
        </div>

        {/* View ongoing game */}
        <div className="mt-6 text-center">
          <Link
            href="/view"
            className="inline-block px-8 py-3 glass-card gold-text text-lg font-bold rounded-lg hover:bg-white/10 transition-all"
          >
            観戦する
          </Link>
          <p className="text-gray-400 text-sm mt-2">
            ルームコードを入力して進行中のゲームを観戦できます
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-white text-sm glass-card p-4 rounded-lg">
          <p>
            本アプリケーションは、ポーカーにおけるチップ計算およびゲーム進行の管理を目的とした補助ツールです。
当アプリ内での金銭や換金可能な物品を賭ける行為（賭博）は法律で固く禁じられており、本サービスはこれらを一切推奨・容認するものではありません。
          </p>
        </div>

        {/* SEO Content Section */}
        <section className="mt-10 glass-card rounded-xl p-4 sm:p-8 text-gray-300">
          <h2 className="text-xl font-bold mb-4 gold-text">
            チップなしでポーカーができる無料ツール
          </h2>
          <p className="mb-6 leading-relaxed text-sm">
            物理的なポーカーチップがなくても大丈夫。トランプさえあれば、このチップ管理アプリがチップの代わりになります。テキサスホールデムのベット・ポット・ブラインドをリアルタイムで管理し、面倒な計算を自動化します。登録不要・インストール不要で今すぐ使えます。
          </p>

          <h2 className="text-xl font-bold mb-4 gold-text">
            主な機能
          </h2>
          <ul className="space-y-2 mb-6 list-disc list-inside text-sm">
            <li>2〜10人のプレイヤーに対応したチップ管理</li>
            <li>フォールド・チェック・コール・レイズ・オールインに対応</li>
            <li>サイドポットの自動計算</li>
            <li>ブラインド（スモール・ビッグ）の管理と自動増加</li>
            <li>6文字のコードで観戦者とリアルタイム共有</li>
            <li>ゲーム進行状況をブラウザに自動保存</li>
          </ul>

          <h2 className="text-xl font-bold mb-4 gold-text">
            よくある質問
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold casino-text-white mb-1">
                チップなしでポーカーはできますか？
              </h3>
              <p className="leading-relaxed">
                はい、このアプリがあればチップは不要です。スマートフォンやタブレットをテーブルに置いて、全員のチップ枚数をアプリで管理してください。トランプだけあればテキサスホールデムを楽しめます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold casino-text-white mb-1">
                無料で使えますか？
              </h3>
              <p className="leading-relaxed">
                完全無料です。アカウント登録も不要で、アプリのダウンロードも必要ありません。ブラウザで pokerchip.jp にアクセスするだけで使えます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold casino-text-white mb-1">
                何人まで対応していますか？
              </h3>
              <p className="leading-relaxed">
                2人から10人まで対応しています。ヘッズアップ（1対1）からフルリング（9〜10人）まで、どんな人数でもチップ管理ができます。
              </p>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-white text-sm">
          <Link href="/legal/privacy" className="hover:text-casino-gold-light hover:underline transition-colors">プライバシーポリシー</Link>
          <Link href="/legal/terms" className="hover:text-casino-gold-light hover:underline transition-colors">利用規約</Link>
        </div>

        {/* Contact */}
        <div className="mt-4 text-center text-white text-sm">
          <Link href="/contact" className="hover:text-casino-gold-light hover:underline transition-colors">お問い合わせ</Link>
        </div>

        {/* Copyright */}
        <div className="mt-6 pb-4 text-center text-gray-500 text-sm">
          © 2026 Poker Chips.  All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
