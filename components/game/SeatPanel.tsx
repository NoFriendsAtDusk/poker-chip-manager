'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/types/game-types';
import { formatChips } from '@/lib/utils';

interface SeatPanelProps {
  player: Player;
  isSB: boolean;
  isBB: boolean;
  isDealer: boolean;
  isCurrent: boolean;
  onRename?: (playerId: string, newName: string) => void;
}

export default function SeatPanel({
  player,
  isSB,
  isBB,
  isDealer,
  isCurrent,
  onRename,
}: SeatPanelProps) {
  const isFolded = player.status === 'folded';
  const isOut = player.status === 'out';
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(player.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== player.name && onRename) {
      onRename(player.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(player.name);
      setIsEditing(false);
    }
  };

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

        {/* Name — editable or static */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            maxLength={10}
            className="w-full bg-casino-dark-bg border border-casino-gold text-white text-[10px] sm:text-xs text-center rounded px-0.5 py-0 outline-none"
          />
        ) : (
          <div className="flex items-center justify-center gap-0.5">
            <div className="text-white text-[10px] sm:text-xs font-semibold truncate">
              {player.name}
            </div>
            {onRename && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditValue(player.name);
                  setIsEditing(true);
                }}
                className="text-gray-500 hover:text-casino-gold text-[9px] sm:text-[10px] leading-none flex-shrink-0 transition-colors"
                aria-label={`${player.name}の名前を変更`}
                title="名前を変更"
              >
                ✎
              </button>
            )}
          </div>
        )}

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
