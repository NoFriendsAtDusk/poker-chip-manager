'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types/game-types';
import { formatChips, getStatusText } from '@/lib/utils';

interface PlayerRowProps {
  player: Player;
  position: number;
  isSB: boolean;
  isBB: boolean;
  isDealer: boolean;
  isCurrent: boolean;
}

export default function PlayerRow({
  player,
  position,
  isSB,
  isBB,
  isDealer,
  isCurrent
}: PlayerRowProps) {
  const rowClass = isCurrent
    ? 'bg-casino-felt-dark border-l-4 border-casino-gold text-white'
    : player.status === 'folded'
    ? 'bg-casino-dark-bg text-gray-500'
    : 'text-white';

  return (
    <motion.tr
      layout
      animate={{ opacity: player.status === 'folded' ? 0.5 : 1 }}
      transition={{ duration: 0.3 }}
      className={`border-b border-casino-gold-dark/30 ${rowClass}`}
      aria-current={isCurrent ? 'step' : undefined}
    >
      <td className="px-2 py-2 sm:px-4 sm:py-4 font-medium">{position}</td>
      <td className="px-2 py-2 sm:px-4 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold">{player.name}</span>
          {isDealer && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-casino-gold text-casino-dark-bg text-xs font-bold rounded shadow-md">
              BTN
            </span>
          )}
          {isSB && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-casino-dark-bg-light border border-casino-gold text-casino-gold text-xs font-bold rounded">
              SB
            </span>
          )}
          {isBB && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-casino-dark-bg border-2 border-casino-gold text-casino-gold text-xs font-bold rounded">
              BB
            </span>
          )}
        </div>
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-right font-semibold">
        {formatChips(player.chips)}
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-right">
        {player.currentBet > 0 ? formatChips(player.currentBet) : '0'}
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-center">
        {getStatusText(player.status)}
      </td>
    </motion.tr>
  );
}
