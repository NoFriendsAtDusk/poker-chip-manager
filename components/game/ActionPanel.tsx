'use client';

import { useState } from 'react';
import { GameState } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import {
  canCheck,
  getCallAmount,
  getMinimumRaise,
  validateRaiseAmount
} from '@/lib/betting-logic';
import { formatChips } from '@/lib/utils';

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
    <div className="bg-green-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 className="text-white text-lg sm:text-xl font-bold mb-4">
        {currentPlayer.name} のアクション
      </h3>

      {/* Primary Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
        <button
          onClick={() => { setErrorMessage(null); performAction({ type: 'fold', playerId: currentPlayer.id }); }}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="フォールド"
        >
          フォールド
        </button>

        {canPlayerCheck ? (
          <button
            onClick={() => { setErrorMessage(null); performAction({ type: 'check', playerId: currentPlayer.id }); }}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="チェック"
          >
            チェック
          </button>
        ) : (
          <button
            onClick={() => { setErrorMessage(null); performAction({ type: 'call', playerId: currentPlayer.id }); }}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            aria-label={`コール ${formatChips(callAmount)}`}
          >
            コール({formatChips(callAmount)})
          </button>
        )}

        <button
          onClick={() => { setErrorMessage(null); performAction({ type: 'allIn', playerId: currentPlayer.id }); }}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          aria-label="オールイン"
        >
          オールイン
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div role="alert" className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* Raise Controls */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="number"
          value={raiseAmount}
          onChange={(e) => { setRaiseAmount(Number(e.target.value)); setErrorMessage(null); }}
          min={minRaise}
          step={gameState.settings.betUnit}
          aria-label="レイズ額"
          className="flex-1 px-4 py-2 sm:py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-yellow-500 focus:outline-none"
        />
        <button
          onClick={handleRaise}
          disabled={raiseAmount < minRaise}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          レイズ (min: {formatChips(minRaise)})
        </button>
      </div>
    </div>
  );
}
