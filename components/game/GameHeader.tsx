'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/types/game-types';
import { getStageText, formatChips } from '@/lib/utils';
import { formatPotDisplay } from '@/lib/pot-calculator';
import { stageSwap } from '@/lib/animation-variants';

interface GameHeaderProps {
  gameState: GameState;
}

export default function GameHeader({ gameState }: GameHeaderProps) {
  const { gameNumber, stage, settings, totalPot, pots } = gameState;

  return (
    <div className="casino-card rounded-lg shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gold-text">
            ゲーム {gameNumber}
          </h1>
          <p className="text-base sm:text-lg text-white">
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
          </p>
        </div>

        <div className="sm:text-right">
          {settings.blindsEnabled && (
            <div className="text-base sm:text-lg text-white mb-2">
              <span className="font-semibold">
                SB: {formatChips(settings.smallBlind)} / BB: {formatChips(settings.bigBlind)}
              </span>
            </div>
          )}

          <motion.div
            key={totalPot}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl font-bold gold-text gold-glow"
          >
            ポット合計: {formatChips(totalPot)}
          </motion.div>

          {pots.length > 0 && (
            <div className="text-sm text-casino-gold-light mt-1">
              {formatPotDisplay(pots)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
