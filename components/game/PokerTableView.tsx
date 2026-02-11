'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/types/game-types';
import { calculateSeatPositions, getRadiiForPlayerCount } from '@/lib/table-layout';
import { formatChips } from '@/lib/utils';
import { formatPotDisplay } from '@/lib/pot-calculator';
import { cardDeal } from '@/lib/animation-variants';
import { getBetChips, getChipPile } from '@/lib/chip-visuals';
import { useIsMobile } from '@/lib/use-is-mobile';
import SeatPanel from './SeatPanel';
import ChipStack from './ChipStack';

interface PokerTableViewProps {
  gameState: GameState;
  onRenamePlayer?: (playerId: string, newName: string) => void;
}

export default function PokerTableView({ gameState, onRenamePlayer }: PokerTableViewProps) {
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

  const isMobile = useIsMobile();
  const { rx, ry } = getRadiiForPlayerCount(players.length, isMobile);

  const positions = useMemo(
    () => calculateSeatPositions(players.length, rx, ry),
    [players.length, rx, ry]
  );

  // Collected pot = totalPot minus current round's bets (those are shown individually)
  const currentBetsTotal = players.reduce((sum, p) => sum + p.currentBet, 0);
  const collectedPot = totalPot - currentBetsTotal;

  // Pot chip pile — only shows chips from completed betting rounds
  const potPileDiscs = useMemo(
    () => getChipPile(collectedPot, 20),
    [collectedPot]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative mx-auto
        w-[300px] h-[460px]
        sm:w-[520px] sm:h-[320px]
        md:w-[700px] md:h-[420px]"
      style={{ overflow: 'visible' }}
    >
      {/* Felt surface — the oval table */}
      <div
        className="absolute inset-[4px] sm:inset-[15px] md:inset-[20px]
          rounded-[50%]
          poker-felt-surface
          border-[4px] sm:border-[8px] md:border-[10px]
          border-amber-900"
        style={{
          boxShadow:
            'inset 0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.2), 0 0 0 3px #b8941f',
        }}
      >
        {/* Inner decorative felt line */}
        <div
          className="absolute inset-[3px] sm:inset-[10px] md:inset-[14px]
            rounded-[50%]
            border border-casino-felt-light/30"
        />
      </div>

      {/* Bet chips — between each player and center */}
      {players.map((player, index) => {
        if (player.currentBet <= 0) return null;
        const betDiscs = getBetChips(player.currentBet);
        if (betDiscs.length === 0) return null;

        // Position toward center — further on mobile so chips aren't hidden by seat panels
        const betLerp = isMobile ? 0.55 : 0.4;
        const betX = positions[index].x + (50 - positions[index].x) * betLerp;
        const betY = positions[index].y + (50 - positions[index].y) * betLerp;

        return (
          <div
            key={`bet-${player.id}`}
            className="absolute z-[15]"
            style={{
              left: `${betX}%`,
              top: `${betY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <ChipStack discs={betDiscs} size="sm" />
          </div>
        );
      })}

      {/* Center content: Pot pile + Pot text + Community Cards */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {/* Pot chip pile (behind text) */}
        {potPileDiscs.length > 0 && (
          <div className="relative mb-1" style={{ width: '60px', height: '40px' }}>
            {potPileDiscs.map((disc, i) => (
              <Image
                key={i}
                src="/chip.png"
                alt=""
                width={22}
                height={13}
                className="chip-disc"
                style={{
                  left: `calc(50% + ${disc.offsetX}px)`,
                  top: `calc(50% + ${disc.offsetY}px)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: i,
                }}
                draggable={false}
              />
            ))}
          </div>
        )}

        {/* Pot text */}
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
            onRename={onRenamePlayer}
          />
        </div>
      ))}
    </motion.div>
  );
}
