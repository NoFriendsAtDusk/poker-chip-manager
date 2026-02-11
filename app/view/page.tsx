'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GameState } from '@/types/game-types';
import { fetchRoom, subscribeToRoom } from '@/lib/room-manager';
import GameHeader from '@/components/game/GameHeader';
import PokerTableView from '@/components/game/PokerTableView';

function ViewerContent() {
  const searchParams = useSearchParams();
  const [roomCodeInput, setRoomCodeInput] = useState(searchParams.get('room') || '');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = useCallback(async (code: string) => {
    const normalized = code.toUpperCase().trim();
    if (normalized.length !== 6) {
      setError('ルームコードは6文字です。');
      return;
    }

    setError(null);
    const state = await fetchRoom(normalized);
    if (!state) {
      setError('ルームが見つかりません。コードを確認してください。');
      return;
    }

    setGameState(state);
    setRoomCode(normalized);
    setIsJoined(true);
  }, []);

  // Subscribe to real-time updates once joined
  useEffect(() => {
    if (!isJoined || !roomCode) return;

    const unsubscribe = subscribeToRoom(roomCode, (newState) => {
      setGameState(newState);
    });

    return unsubscribe;
  }, [isJoined, roomCode]);

  // Re-fetch on visibility change (phone screen off/on)
  useEffect(() => {
    if (!isJoined || !roomCode) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchRoom(roomCode).then((state) => {
          if (state) setGameState(state);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isJoined, roomCode]);

  // Auto-join if room code is in URL
  useEffect(() => {
    const urlRoom = searchParams.get('room');
    if (urlRoom && !isJoined) {
      handleJoin(urlRoom);
    }
  }, [searchParams, isJoined, handleJoin]);

  // Join form
  if (!isJoined) {
    return (
      <div className="min-h-screen poker-table flex items-center justify-center">
        <div className="casino-card rounded-xl p-6 w-[320px] text-center">
          <h1 className="gold-text text-xl font-bold mb-4">ゲームを観戦</h1>
          <p className="text-gray-400 text-sm mb-4">
            ホストから共有されたルームコードを入力してください。
          </p>

          <input
            type="text"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
            placeholder="ルームコード（例: ABC123）"
            maxLength={6}
            className="w-full px-4 py-3 bg-casino-dark-bg border-2 border-casino-gold-dark text-white text-center text-xl font-mono tracking-widest rounded-lg focus:border-casino-gold focus:outline-none mb-3"
          />

          {error && (
            <p className="text-red-400 text-sm mb-3">{error}</p>
          )}

          <button
            onClick={() => handleJoin(roomCodeInput)}
            disabled={roomCodeInput.length !== 6}
            className="w-full py-3 bg-casino-gold text-casino-dark-bg font-bold rounded-lg hover:bg-casino-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            参加する
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (!gameState) {
    return (
      <div className="min-h-screen poker-table flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  // Read-only game view
  return (
    <div className="h-screen poker-table flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-2 pt-2 sm:px-4 sm:pt-4 z-30">
        <GameHeader gameState={gameState} />
        {/* Viewer badge */}
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="px-2 py-0.5 bg-casino-dark-bg/80 border border-casino-gold-dark text-casino-gold text-xs rounded">
            観戦中 | ルーム: {roomCode}
          </span>
        </div>
      </div>

      {/* Poker Table */}
      <div className="flex-1 flex items-center justify-center z-10" style={{ overflow: 'visible' }}>
        <PokerTableView gameState={gameState} />
      </div>

      {/* Status bar (read-only — no action buttons) */}
      <div className="flex-shrink-0 px-2 pb-2 sm:px-4 sm:pb-4 z-30">
        <div className="bg-casino-dark-bg/80 backdrop-blur-sm rounded-lg px-4 py-3 text-center">
          <span className="text-gray-400 text-sm">
            {gameState.stage === 'showdown'
              ? 'ショーダウン中...'
              : gameState.stage === 'gameOver'
              ? `ゲーム${gameState.gameNumber} 終了`
              : `${gameState.players[gameState.currentPlayerIndex]?.name} のターン`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen poker-table flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    }>
      <ViewerContent />
    </Suspense>
  );
}
