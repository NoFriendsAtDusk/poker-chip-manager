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
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500 border-4 border-white"></div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500 border-4 border-white"></div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-500 border-4 border-white"></div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold casino-text-white mb-2">
            トランプだけで遊べる！
          </h1>
          <h2 className="text-xl sm:text-2xl gold-text">
            ポーカーチップアプリ
          </h2>
          <div className="flex justify-center gap-2 mt-4 text-2xl">
            <span>♠️</span>
            <span>♥️</span>
            <span>♦️</span>
            <span>♣️</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-8">
          <Link
            href="/how-to-play"
            className="px-6 py-2 casino-card gold-text font-semibold rounded-lg hover:bg-casino-card-light transition-all text-center"
          >
            遊び方ガイド
          </Link>
          <Link
            href="/rules"
            className="px-6 py-2 casino-card gold-text font-semibold rounded-lg hover:bg-casino-card-light transition-all text-center"
          >
            ルール解説
          </Link>
          <Link
            href="/faq"
            className="px-6 py-2 casino-card gold-text font-semibold rounded-lg hover:bg-casino-card-light transition-all text-center"
          >
            このアプリについて
          </Link>
        </div>

        {/* Game Settings Form */}
        <div className="casino-card rounded-lg shadow-2xl p-4 sm:p-8">
          <h2 className="text-2xl font-bold gold-text mb-6 flex items-center gap-2">
            <span>♦️</span>
            ゲーム設定
            <span>♠️</span>
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
                className="w-full px-4 py-3 bg-casino-dark-bg-light border-2 border-casino-gold-dark text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all"
              />
            </div>

            {/* Player Names */}
            {formData.playerNames.map((name, index) => (
              <div key={index}>
                <label className="block text-white font-semibold mb-2">
                  プレイヤー {index + 1} の名前
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="w-full px-4 py-3 bg-casino-dark-bg-light border-2 border-casino-gold-dark text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all"
                />
              </div>
            ))}

            {/* Bet Unit */}
            <div>
              <label className="block text-white font-semibold mb-2">
                ベット単位
              </label>
              <input
                type="number"
                min="1"
                value={formData.betUnit}
                onChange={(e) => setFormData({ ...formData, betUnit: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-casino-dark-bg-light border-2 border-casino-gold-dark text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all"
              />
            </div>

            {/* Starting Chips */}
            <div>
              <label className="block text-white font-semibold mb-2">
                初期チップ
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={formData.startingChips}
                onChange={(e) => setFormData({ ...formData, startingChips: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-casino-dark-bg-light border-2 border-casino-gold-dark text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all"
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
                    type="number"
                    min="1"
                    value={formData.smallBlind}
                    onChange={(e) => setFormData({ ...formData, smallBlind: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-casino-dark-bg-light border-2 border-casino-gold-dark text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Big Blind
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.bigBlind}
                    onChange={(e) => setFormData({ ...formData, bigBlind: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-casino-dark-bg-light border-2 border-casino-gold-dark text-white rounded-lg focus:ring-2 focus:ring-casino-gold focus:border-casino-gold transition-all"
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

        {/* Disclaimer */}
        <div className="mt-8 text-center text-white text-sm felt-surface p-4 rounded-lg border border-casino-gold-dark">
          <p>
            本アプリは、ポーカーのゲーム進行を補助する目的でチップ計算を管理するツールです。
            金銭や換金可能な物品を賭ける行為は法律で禁止されており、本アプリはこれを一切認めません。
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
        <div className="mt-6 text-center text-white text-sm">
          © 2025 Poker Chips Manager. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
