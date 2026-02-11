'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, PotWinner } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import { formatChips } from '@/lib/utils';
import { panelVariants, staggerContainer, staggerItem, buttonTap, buttonHover, errorShake } from '@/lib/animation-variants';

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
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="felt-surface rounded-lg shadow-2xl p-3 sm:p-4 border-2 border-casino-gold"
    >
      <h3 className="gold-text text-xl sm:text-2xl font-bold mb-4">
        勝者を選択してください
      </h3>

      {potsNeedingSelection.length > 1 && (
        <div className="casino-text-white text-sm mb-2">
          ポット {currentPotIndex + 1} / {potsNeedingSelection.length}
        </div>
      )}

      <div className="bg-casino-dark-bg/80 border border-casino-gold-dark rounded-lg p-3 sm:p-4 mb-4">
        <p className="casino-text-white font-semibold mb-2">
          {potLabel}
        </p>
        <p className="casino-text-white text-sm">
          対象プレイヤーから勝者を選択 (複数選択可):
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-[30vh] overflow-y-auto"
      >
        {currentEligiblePlayers.map(player => (
          <motion.button
            key={player.id}
            variants={staggerItem}
            whileTap={buttonTap}
            onClick={() => toggleWinner(player.id)}
            aria-pressed={selectedWinners.includes(player.id)}
            className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left rounded-lg font-semibold transition-all ${
              selectedWinners.includes(player.id)
                ? 'bg-gradient-to-b from-casino-gold to-casino-gold-dark text-casino-dark-bg border-2 border-casino-gold shadow-lg'
                : 'bg-casino-card-light text-white border-2 border-casino-gold-dark hover:border-casino-gold hover:bg-casino-card-dark'
            }`}
          >
            {player.name}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            variants={errorShake}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
            className="mb-3 p-2 bg-red-900/80 border-2 border-red-600 text-red-200 rounded-lg text-sm shadow-lg"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={buttonTap}
        whileHover={buttonHover}
        onClick={handleConfirm}
        className="w-full py-3 sm:py-4 bg-gradient-to-b from-casino-gold to-casino-gold-dark text-casino-dark-bg text-lg sm:text-xl font-bold rounded-lg hover:from-casino-gold-light hover:to-casino-gold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
      >
        {currentPotIndex + 1 < potsNeedingSelection.length ? '次のポットへ' : '勝者を確定'}
      </motion.button>
    </motion.div>
  );
}
