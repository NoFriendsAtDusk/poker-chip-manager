'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types/game-types';
import PlayerCard from './PlayerCard';
import { staggerContainer } from '@/lib/animation-variants';

interface PlayerTableProps {
  players: Player[];
  dealerIndex: number;
  sbIndex: number;
  bbIndex: number;
  currentPlayerIndex: number;
}

export default function PlayerTable({
  players,
  dealerIndex,
  sbIndex,
  bbIndex,
  currentPlayerIndex
}: PlayerTableProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mb-4 sm:mb-6"
    >
      {players.map((player, index) => (
        <PlayerCard
          key={player.id}
          player={player}
          position={index + 1}
          isSB={index === sbIndex}
          isBB={index === bbIndex}
          isDealer={index === dealerIndex}
          isCurrent={index === currentPlayerIndex}
        />
      ))}
    </motion.div>
  );
}
