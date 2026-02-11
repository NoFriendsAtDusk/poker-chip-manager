'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/types/game-types';
import { calculateSeatPositions, getRadiiForPlayerCount } from '@/lib/table-layout';
import { formatChips } from '@/lib/utils';
import { formatPotDisplay } from '@/lib/pot-calculator';
import { cardDeal } from '@/lib/animation-variants';
import SeatPanel from './SeatPanel';

interface PokerTableViewProps {
  gameState: GameState;
}

export default function PokerTableView({ gameState }: PokerTableViewProps) {
  const {
    players,
    dealerButtonIndex,
    smallBlindIndex,
    bigBlindIndex,
    currentPlayerIndex,
    communityCards,
    totalPot,
    pots,
  } = gameState;

  const { rx, ry } = getRadiiForPlayerCount(players.length);

  const positions = useMemo(
    () => calculateSeatPositions(players.length, rx, ry),
    [players.length, rx, ry]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative mx-auto
        w-[340px] h-[220px]
        sm:w-[520px] sm:h-[320px]
        md:w-[700px] md:h-[420px]"
      style={{ overflow: 'visible' }}
    >
      {/* Felt surface — the oval table */}
      <div
        className="absolute inset-[10px] sm:inset-[15px] md:inset-[20px]
          rounded-[50%]
          poker-felt-surface
          border-[6px] sm:border-[8px] md:border-[10px]
          border-amber-900"
        style={{
          boxShadow:
            'inset 0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.2), 0 0 0 3px #b8941f',
        }}
      >
        {/* Inner decorative felt line */}
        <div
          className="absolute inset-[6px] sm:inset-[10px] md:inset-[14px]
            rounded-[50%]
            border border-casino-felt-light/30"
        />
      </div>

      {/* Center content: Pot + Community Cards */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {/* Pot display */}
        <motion.div
          key={totalPot}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          className="gold-text text-xs sm:text-base md:text-lg font-bold gold-glow mb-1 sm:mb-2"
        >
          ポット: {formatChips(totalPot)}
        </motion.div>

        {/* Side pot info */}
        {pots.length > 1 && (
          <div className="text-[9px] sm:text-xs text-casino-gold-light mb-1">
            {formatPotDisplay(pots)}
          </div>
        )}

        {/* Community cards */}
        <AnimatePresence>
          {communityCards > 0 && (
            <div className="flex gap-1 sm:gap-2" style={{ perspective: '400px' }}>
              {Array.from({ length: communityCards }).map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardDeal}
                  initial="hidden"
                  animate="visible"
                  className="w-7 h-10 sm:w-10 sm:h-14 md:w-14 md:h-20
                    bg-white rounded border-2 border-casino-gold
                    shadow-lg flex items-center justify-center"
                >
                  <span className="text-sm sm:text-lg md:text-2xl">&#9824;&#65039;</span>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Players positioned around the ellipse */}
      {players.map((player, index) => (
        <div
          key={player.id}
          className="absolute z-20"
          style={{
            left: `${positions[index].x}%`,
            top: `${positions[index].y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <SeatPanel
            player={player}
            isSB={index === smallBlindIndex}
            isBB={index === bigBlindIndex}
            isDealer={index === dealerButtonIndex}
            isCurrent={index === currentPlayerIndex}
          />
        </div>
      ))}
    </motion.div>
  );
}
