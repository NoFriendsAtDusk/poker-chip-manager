'use client';

import { useState, useMemo } from 'react';
import { GameState, PotWinner } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import { formatChips } from '@/lib/utils';

interface ShowdownPanelProps {
  gameState: GameState;
}

export default function ShowdownPanel({ gameState }: ShowdownPanelProps) {
  const { selectWinners } = useGameStore();
  const [currentPotIndex, setCurrentPotIndex] = useState(0);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [collectedPotWinners, setCollectedPotWinners] = useState<PotWinner[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Determine which pots need user selection vs auto-award
  const potResolutions = useMemo(() => {
    return gameState.pots.map((pot, index) => {
      const eligible = pot.eligiblePlayers.filter(id => {
        const player = gameState.players.find(p => p.id === id);
        return player && (player.status === 'active' || player.status === 'allIn');
      });
      return { pot, index, eligiblePlayerIds: eligible, needsSelection: eligible.length > 1 };
    });
  }, [gameState.pots, gameState.players]);

  // Find the current pot that needs user input (skip auto-award pots)
  const potsNeedingSelection = potResolutions.filter(r => r.needsSelection);
  const currentResolution = potsNeedingSelection[currentPotIndex];

  // Get player objects for the current pot's eligible players
  const currentEligiblePlayers = currentResolution
    ? gameState.players.filter(p => currentResolution.eligiblePlayerIds.includes(p.id))
    : [];

  const toggleWinner = (playerId: string) => {
    setErrorMessage(null);
    setSelectedWinners(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleConfirm = () => {
    if (selectedWinners.length === 0) {
      setErrorMessage('勝者を選択してください');
      return;
    }

    setErrorMessage(null);

    const newPotWinners = [
      ...collectedPotWinners,
      { potIndex: currentResolution.index, winners: selectedWinners }
    ];

    if (currentPotIndex + 1 < potsNeedingSelection.length) {
      // More pots to resolve
      setCollectedPotWinners(newPotWinners);
      setSelectedWinners([]);
      setCurrentPotIndex(currentPotIndex + 1);
    } else {
      // All pots resolved — add auto-award pots and distribute
      const autoAwardPots = potResolutions
        .filter(r => !r.needsSelection && r.eligiblePlayerIds.length === 1)
        .map(r => ({ potIndex: r.index, winners: r.eligiblePlayerIds }));

      selectWinners([...newPotWinners, ...autoAwardPots]);
    }
  };

  // If no pots need selection (all single-eligible), auto-distribute
  if (potsNeedingSelection.length === 0) {
    const autoAwardPots = potResolutions
      .filter(r => r.eligiblePlayerIds.length === 1)
      .map(r => ({ potIndex: r.index, winners: r.eligiblePlayerIds }));

    if (autoAwardPots.length > 0) {
      selectWinners(autoAwardPots);
    }

    return null;
  }

  const potLabel = currentResolution.pot.type === 'main'
    ? `メインポット: ${formatChips(currentResolution.pot.amount)}`
    : `サイドポット: ${formatChips(currentResolution.pot.amount)}`;

  return (
    <div className="bg-green-900 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">
        勝者を選択してください
      </h3>

      {potsNeedingSelection.length > 1 && (
        <div className="text-white text-sm mb-2">
          ポット {currentPotIndex + 1} / {potsNeedingSelection.length}
        </div>
      )}

      <div className="bg-black bg-opacity-30 rounded-lg p-3 sm:p-4 mb-4">
        <p className="text-white font-semibold mb-2">
          {potLabel}
        </p>
        <p className="text-white text-sm">
          対象プレイヤーから勝者を選択 (複数選択可):
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {currentEligiblePlayers.map(player => (
          <button
            key={player.id}
            onClick={() => toggleWinner(player.id)}
            aria-pressed={selectedWinners.includes(player.id)}
            className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left rounded-lg font-semibold transition-colors ${
              selectedWinners.includes(player.id)
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div role="alert" className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleConfirm}
        className="w-full py-3 sm:py-4 bg-blue-600 text-white text-lg sm:text-xl font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        {currentPotIndex + 1 < potsNeedingSelection.length ? '次のポットへ' : '勝者を確定'}
      </button>
    </div>
  );
}
