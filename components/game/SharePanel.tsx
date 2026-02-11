'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';

export default function SharePanel() {
  const { multiplayerSession, createMultiplayerRoom, leaveMultiplayer } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await createMultiplayerRoom();
    } catch (e) {
      setError(e instanceof Error ? e.message : '共有に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    leaveMultiplayer();
  };

  // Not sharing yet — show share button
  if (!multiplayerSession) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleShare}
          disabled={isLoading}
          className="px-3 py-1 bg-casino-dark-bg border border-casino-gold-dark text-casino-gold text-xs font-semibold rounded-lg hover:border-casino-gold transition-all disabled:opacity-50"
        >
          {isLoading ? '作成中...' : '📡 共有する'}
        </button>
        {error && <span className="text-red-400 text-xs">{error}</span>}
      </div>
    );
  }

  // Active sharing — show room code and stop button
  const viewUrl = `${window.location.origin}/view?room=${multiplayerSession.roomCode}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="px-2 py-1 bg-casino-felt-dark border border-casino-gold text-casino-gold text-xs font-bold rounded tracking-widest">
        ルーム: {multiplayerSession.roomCode}
      </span>
      <button
        onClick={() => navigator.clipboard.writeText(viewUrl)}
        className="px-2 py-1 bg-casino-dark-bg border border-casino-gold-dark text-casino-gold text-[10px] rounded hover:border-casino-gold transition-all"
        title="URLをコピー"
      >
        URLコピー
      </button>
      <button
        onClick={handleStop}
        className="px-2 py-1 bg-casino-dark-bg border border-red-800 text-red-400 text-[10px] rounded hover:border-red-600 transition-all"
      >
        共有を停止
      </button>
    </div>
  );
}
