'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import GameHeader from '@/components/game/GameHeader';
import CommunityCards from '@/components/game/CommunityCards';
import PlayerTable from '@/components/game/PlayerTable';
import ActionPanel from '@/components/game/ActionPanel';
import ShowdownPanel from '@/components/game/ShowdownPanel';
import GameOverPanel from '@/components/game/GameOverPanel';

export default function GameScreen() {
  const router = useRouter();
  const { gameState, undoLastAction } = useGameStore();
  const undoHistory = useGameStore((s) => s.undoHistory);
  const canUndo = undoHistory.length > 0;

  useEffect(() => {
    // Redirect to setup if no game state
    if (!gameState) {
      router.push('/');
    }
  }, [gameState, router]);

  if (!gameState) {
    return (
      <div className="min-h-screen poker-table flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-6xl mx-auto px-2 py-4 sm:px-4 sm:py-8">
        {/* Game Header */}
        <GameHeader gameState={gameState} />

        {/* Community Cards */}
        {gameState.communityCards > 0 && (
          <CommunityCards count={gameState.communityCards} />
        )}

        {/* Player Table */}
        <PlayerTable
          players={gameState.players}
          dealerIndex={gameState.dealerButtonIndex}
          sbIndex={gameState.smallBlindIndex}
          bbIndex={gameState.bigBlindIndex}
          currentPlayerIndex={gameState.currentPlayerIndex}
        />

        {/* Undo Button */}
        {gameState.stage !== 'showdown' && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={undoLastAction}
              disabled={!canUndo}
              className="px-4 py-2 bg-casino-dark-bg border-2 border-casino-gold-dark text-casino-gold text-sm font-semibold rounded-lg hover:border-casino-gold hover:bg-casino-card-light transition-all disabled:bg-casino-dark-bg disabled:border-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed"
              aria-label="元に戻す"
            >
              ↩ 元に戻す
            </button>
          </div>
        )}

        {/* Action Panel (conditional) */}
        {gameState.stage !== 'showdown' && gameState.stage !== 'gameOver' && (
          <ActionPanel gameState={gameState} />
        )}

        {/* Showdown Panel */}
        {gameState.stage === 'showdown' && (
          <ShowdownPanel gameState={gameState} />
        )}

        {/* Game Over Panel */}
        {gameState.stage === 'gameOver' && (
          <GameOverPanel gameState={gameState} />
        )}

        {/* Contact Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <a href="/" className="text-white hover:text-casino-gold-light hover:underline transition-colors">
            お問い合わせ
          </a>
        </div>
      </div>
    </div>
  );
}
