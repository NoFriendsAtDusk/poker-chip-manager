'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/types/game-types';
import { getStageText, formatChips } from '@/lib/utils';
import { stageSwap } from '@/lib/animation-variants';

interface GameHeaderProps {
  gameState: GameState;
}

export default function GameHeader({ gameState }: GameHeaderProps) {
  const { gameNumber, stage, settings } = gameState;

  return (
    <div className="bg-casino-dark-bg/80 backdrop-blur-sm rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <div className="flex items-center gap-2">
        <span className="gold-text font-bold text-sm">ゲーム {gameNumber}</span>
        <span className="text-white text-sm">
          ステージ:{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={stage}
              initial={stageSwap.initial}
              animate={stageSwap.animate}
              exit={stageSwap.exit}
              className="font-semibold inline-block"
            >
              {getStageText(stage)}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

      {settings.blindsEnabled && (
        <span className="text-white text-xs font-semibold">
          SB: {formatChips(settings.smallBlind)} / BB: {formatChips(settings.bigBlind)}
        </span>
      )}
    </div>
  );
}
