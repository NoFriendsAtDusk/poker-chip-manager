'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types/game-types';
import { formatChips, getStatusText } from '@/lib/utils';
import { staggerItem } from '@/lib/animation-variants';

interface PlayerCardProps {
  player: Player;
  position: number;
  isSB: boolean;
  isBB: boolean;
  isDealer: boolean;
  isCurrent: boolean;
}

export default function PlayerCard({
  player,
  position,
  isSB,
  isBB,
  isDealer,
  isCurrent
}: PlayerCardProps) {
  const cardClass = isCurrent
    ? 'bg-casino-felt-dark border-4 border-casino-gold current-player-glow'
    : player.status === 'folded'
    ? 'bg-casino-dark-bg border border-casino-gold-dark/20'
    : 'casino-card';

  return (
    <motion.div
      layout
      variants={staggerItem}
      animate={{
        opacity: player.status === 'folded' ? 0.5 : 1,
        scale: isCurrent ? 1.02 : 1,
      }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 ${cardClass}`}
      aria-current={isCurrent ? 'step' : undefined}
    >
      {/* Top Row: Position + Name + Badges */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="gold-text font-bold text-lg">#{position}</span>
          <span className="font-semibold text-white text-base truncate">{player.name}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isDealer && <span className="badge-btn">BTN</span>}
          {isSB && <span className="badge-sb">SB</span>}
          {isBB && <span className="badge-bb">BB</span>}
          {player.status === 'allIn' && <span className="badge-allin">ALL-IN</span>}
        </div>
      </div>

      {/* Bottom Row: Chips + Bet (2 columns) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-casino-gold-light text-xs">チップ</div>
          <div className="text-white font-bold text-lg">{formatChips(player.chips)}</div>
        </div>
        <div className="text-right">
          <div className="text-casino-gold-light text-xs">ベット額</div>
          <div className="text-white font-semibold text-lg">
            {player.currentBet > 0 ? formatChips(player.currentBet) : '0'}
          </div>
        </div>
      </div>

      {/* Status — only for folded/out players */}
      {(player.status === 'folded' || player.status === 'out') && (
        <div className="text-center text-gray-500 text-sm mt-2">
          {getStatusText(player.status)}
        </div>
      )}
    </motion.div>
  );
}
