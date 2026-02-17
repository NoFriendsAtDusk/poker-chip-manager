'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { GameSettings } from '@/types/game-types';
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

  return (
    <div className="min-h-screen hero-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero Section */}
        <div className="text-center pt-4 pb-10">
          {/* Suit icons row */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-3xl sm:text-4xl opacity-60">♠</span>
            <span className="text-3xl sm:text-4xl text-red-500 opacity-60">♥</span>
            <span className="text-3xl sm:text-4xl text-red-500 opacity-60">♦</span>
            <span className="text-3xl sm:text-4xl opacity-60">♣</span>
          </div>

          {/* Main title */}
          <h1 className="text-3xl sm:text-5xl font-bold casino-text-white mb-3 tracking-wide">
            チップ不要・トランプだけで遊べる！
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold gold-text tracking-wider">
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

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-8">
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
              <input
                type="number"
                min="2"
                max="10"
                value={formData.playerCount}
                onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/40 border border-casino-gold-dark/50 text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all placeholder-gray-500"
              />
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

        {/* Footer Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-white text-sm">
          <Link href="/legal/privacy" className="hover:text-casino-gold-light hover:underline transition-colors">プライバシーポリシー</Link>
          <Link href="/legal/terms" className="hover:text-casino-gold-light hover:underline transition-colors">利用規約</Link>
          <Link href="/legal/specified-commercial-transactions" className="hover:text-casino-gold-light hover:underline transition-colors">
            特定商取引法に関する表示
          </Link>
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
