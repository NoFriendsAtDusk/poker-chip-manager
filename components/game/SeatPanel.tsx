'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types/game-types';
import { formatChips } from '@/lib/utils';

interface SeatPanelProps {
  player: Player;
  isSB: boolean;
  isBB: boolean;
  isDealer: boolean;
  isCurrent: boolean;
}

export default function SeatPanel({
  player,
  isSB,
  isBB,
  isDealer,
  isCurrent,
}: SeatPanelProps) {
  const isFolded = player.status === 'folded';
  const isOut = player.status === 'out';

  return (
    <motion.div
      animate={{
        opacity: isFolded || isOut ? 0.4 : 1,
        scale: isCurrent ? 1.05 : 1,
      }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      {/* Info panel */}
      <div
        className={`
          w-[70px] sm:w-[100px] md:w-[120px]
          rounded-lg p-1.5 sm:p-2 text-center
          ${isCurrent
            ? 'bg-casino-felt-dark border-2 border-casino-gold current-player-glow'
            : isFolded || isOut
            ? 'bg-casino-dark-bg/80 border border-gray-700'
            : 'bg-casino-card-dark border border-casino-gold-dark'
          }
        `}
        aria-current={isCurrent ? 'step' : undefined}
      >
        {/* Badges */}
        <div className="flex justify-center gap-0.5 mb-0.5 min-h-[16px]">
          {isDealer && <span className="text-[9px] px-1 py-0 bg-casino-gold text-casino-dark-bg font-bold rounded">BTN</span>}
          {isSB && <span className="text-[9px] px-1 py-0 bg-casino-dark-bg-light border border-casino-gold text-casino-gold font-bold rounded">SB</span>}
          {isBB && <span className="text-[9px] px-1 py-0 bg-casino-dark-bg border border-casino-gold text-casino-gold font-bold rounded">BB</span>}
          {player.status === 'allIn' && <span className="text-[9px] px-1 py-0 bg-gradient-to-b from-red-600 to-red-800 text-white font-bold rounded animate-pulse">ALL-IN</span>}
        </div>

        {/* Name */}
        <div className="text-white text-[10px] sm:text-xs font-semibold truncate">
          {player.name}
        </div>

        {/* Chips */}
        <div className="gold-text text-[10px] sm:text-xs font-bold">
          {formatChips(player.chips)}
        </div>

        {/* Current bet */}
        {player.currentBet > 0 && (
          <div className="text-casino-gold-light text-[9px] sm:text-[10px]">
            Bet: {formatChips(player.currentBet)}
          </div>
        )}

        {/* Status for folded/out */}
        {(isFolded || isOut) && (
          <div className="text-gray-500 text-[9px]">
            {isFolded ? 'FOLD' : 'OUT'}
          </div>
        )}
      </div>
    </motion.div>
  );
}
