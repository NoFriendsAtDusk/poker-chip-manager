'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/game-store';
import { panelVariants } from '@/lib/animation-variants';
import GameHeader from '@/components/game/GameHeader';
import PokerTableView from '@/components/game/PokerTableView';
import ActionPanel from '@/components/game/ActionPanel';
import ShowdownPanel from '@/components/game/ShowdownPanel';
import GameOverPanel from '@/components/game/GameOverPanel';
import SharePanel from '@/components/game/SharePanel';

export default function GameScreen() {
  const router = useRouter();
  const { gameState, undoLastAction, renamePlayer } = useGameStore();
  const undoHistory = useGameStore((s) => s.undoHistory);
  const canUndo = undoHistory.length > 0;

  useEffect(() => {
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

  const isPlayPhase = gameState.stage !== 'showdown' && gameState.stage !== 'gameOver';

  return (
    <div className="h-screen poker-table flex flex-col overflow-hidden">
      {/* Compact Header + Share */}
      <div className="flex-shrink-0 px-2 pt-2 sm:px-4 sm:pt-4 z-30">
        <GameHeader gameState={gameState} />
        <div className="flex items-center justify-between mt-1">
          {/* Current turn indicator */}
          {isPlayPhase ? (
            <div className="flex items-center gap-2 bg-casino-dark-bg/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-casino-gold/40">
              <span className="text-gray-400 text-xs">ターン：</span>
              <span className="gold-text font-bold text-sm">
                {gameState.players[gameState.currentPlayerIndex]?.name}
              </span>
            </div>
          ) : (
            <div />
          )}
          <SharePanel />
        </div>
      </div>

      {/* Poker Table — centered in remaining space */}
      <div className="flex-1 flex items-center justify-center z-10" style={{ overflow: 'visible' }}>
        <PokerTableView gameState={gameState} onRenamePlayer={renamePlayer} />
      </div>

      {/* Bottom dock — undo + action/showdown/gameover panels */}
      <div className="min-h-0 overflow-y-auto px-2 pb-2 sm:px-4 sm:pb-4 z-30">
        {/* Undo button */}
        <AnimatePresence>
          {isPlayPhase && (
            <motion.div
              key="undo"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex justify-end mb-1"
            >
              <button
                onClick={undoLastAction}
                disabled={!canUndo}
                className="px-3 py-1 bg-casino-dark-bg border border-casino-gold-dark text-casino-gold text-xs font-semibold rounded-lg hover:border-casino-gold transition-all disabled:border-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed"
                aria-label="元に戻す"
              >
                ↩ 元に戻す
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panels */}
        <AnimatePresence mode="wait">
          {isPlayPhase && (
            <ActionPanel key="action" gameState={gameState} />
          )}
          {gameState.stage === 'showdown' && (
            <ShowdownPanel key="showdown" gameState={gameState} />
          )}
          {gameState.stage === 'gameOver' && (
            <GameOverPanel key="gameOver" gameState={gameState} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
