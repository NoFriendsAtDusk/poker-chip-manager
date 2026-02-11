'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import {
  canCheck,
  getCallAmount,
  getMinimumRaise,
  validateRaiseAmount
} from '@/lib/betting-logic';
import { formatChips } from '@/lib/utils';
import { panelVariants, buttonTap, buttonHover, errorShake } from '@/lib/animation-variants';

interface ActionPanelProps {
  gameState: GameState;
}

export default function ActionPanel({ gameState }: ActionPanelProps) {
  const { performAction } = useGameStore();
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const [raiseAmount, setRaiseAmount] = useState(getMinimumRaise(gameState));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canPlayerCheck = canCheck(gameState, currentPlayer.id);
  const callAmount = getCallAmount(gameState, currentPlayer.id);
  const minRaise = getMinimumRaise(gameState);

  const handleRaise = () => {
    const validation = validateRaiseAmount(gameState, currentPlayer, raiseAmount);
    if (!validation.valid) {
      setErrorMessage(validation.error || null);
      return;
    }

    setErrorMessage(null);
    performAction({
      type: 'raise',
      amount: raiseAmount,
      playerId: currentPlayer.id
    });
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="felt-surface rounded-lg shadow-2xl p-2 sm:p-3 border-2 border-casino-gold"
    >
      {/* Primary Actions */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
        <motion.button
          whileTap={buttonTap}
          whileHover={buttonHover}
          onClick={() => { setErrorMessage(null); performAction({ type: 'fold', playerId: currentPlayer.id }); }}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-casino-dark-bg border-2 border-gray-600 text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-all"
          aria-label="フォールド"
        >
          フォールド
        </motion.button>

        {canPlayerCheck ? (
          <motion.button
            whileTap={buttonTap}
            whileHover={buttonHover}
            onClick={() => { setErrorMessage(null); performAction({ type: 'check', playerId: currentPlayer.id }); }}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-blue-600 to-blue-800 text-white text-sm font-semibold rounded-lg hover:from-blue-500 hover:to-blue-700 shadow-lg transition-all"
            aria-label="チェック"
          >
            チェック
          </motion.button>
        ) : (
          <motion.button
            whileTap={buttonTap}
            whileHover={buttonHover}
            onClick={() => { setErrorMessage(null); performAction({ type: 'call', playerId: currentPlayer.id }); }}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-blue-600 to-blue-800 text-white text-sm font-semibold rounded-lg hover:from-blue-500 hover:to-blue-700 shadow-lg transition-all"
            aria-label={`コール ${formatChips(callAmount)}`}
          >
            コール({formatChips(callAmount)})
          </motion.button>
        )}

        <motion.button
          whileTap={buttonTap}
          whileHover={buttonHover}
          onClick={() => { setErrorMessage(null); performAction({ type: 'allIn', playerId: currentPlayer.id }); }}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-red-600 to-red-800 text-white text-sm font-semibold rounded-lg hover:from-red-500 hover:to-red-700 shadow-lg transition-all"
          aria-label="オールイン"
        >
          オールイン
        </motion.button>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            variants={errorShake}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
            className="mb-2 p-1.5 bg-red-900/80 border-2 border-red-600 text-red-200 rounded-lg text-xs shadow-lg"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Raise Controls — single row */}
      <div className="flex gap-1.5 sm:gap-2">
        <input
          type="number"
          value={raiseAmount}
          onChange={(e) => { setRaiseAmount(Number(e.target.value)); setErrorMessage(null); }}
          min={minRaise}
          step={gameState.settings.betUnit}
          aria-label="レイズ額"
          className="flex-1 min-w-0 px-2 py-1.5 sm:px-3 sm:py-2 text-sm bg-casino-dark-bg-light border-2 border-casino-gold-dark text-white rounded-lg focus:border-casino-gold focus:outline-none transition-all"
        />
        <motion.button
          whileTap={buttonTap}
          whileHover={raiseAmount >= minRaise ? buttonHover : undefined}
          onClick={handleRaise}
          disabled={raiseAmount < minRaise}
          className="px-3 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-b from-casino-gold to-casino-gold-dark text-casino-dark-bg text-sm font-bold rounded-lg hover:from-casino-gold-light hover:to-casino-gold shadow-lg transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap"
        >
          レイズ (min: {formatChips(minRaise)})
        </motion.button>
      </div>
    </motion.div>
  );
}
