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
  const { gameState } = useGameStore();

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
          <a href="/" className="text-white hover:underline">
            お問い合わせ
          </a>
        </div>
      </div>
    </div>
  );
}
