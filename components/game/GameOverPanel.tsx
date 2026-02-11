'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GameState } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import { formatChips } from '@/lib/utils';
import { panelVariants, staggerContainer, staggerItem, buttonTap, buttonHover } from '@/lib/animation-variants';

interface GameOverPanelProps {
  gameState: GameState;
}

export default function GameOverPanel({ gameState }: GameOverPanelProps) {
  const router = useRouter();
  const { nextGame, buyIn } = useGameStore();
  const [buyInAmounts, setBuyInAmounts] = useState<Record<string, number>>({});

  const betUnit = gameState.settings.betUnit;

  const handleBuyIn = (playerId: string) => {
    const amount = buyInAmounts[playerId];
    if (!amount || amount <= 0) return;
    buyIn(playerId, amount);
    setBuyInAmounts((prev) => {
      const next = { ...prev };
      delete next[playerId];
      return next;
    });
  };

  const handleNextGame = () => {
    nextGame();
  };

  const handleSaveAndQuit = () => {
    router.push('/');
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div className="felt-surface rounded-lg shadow-2xl p-4 sm:p-6 border-2 border-casino-gold max-w-md w-full">
        <h2 className="gold-text text-2xl sm:text-3xl font-bold mb-4">
          ゲーム終了
        </h2>

        <p className="casino-text-white text-base sm:text-lg mb-4 sm:mb-6">
          勝者にチップが配分されました。
        </p>

        {/* Player chip standings */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="bg-casino-dark-bg/80 border border-casino-gold-dark rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 max-h-[40vh] overflow-y-auto"
        >
          {gameState.players
            .slice()
            .sort((a, b) => b.chips - a.chips)
            .map(player => (
              <motion.div
                key={player.id}
                variants={staggerItem}
                className="py-2"
              >
                <div className="flex justify-between items-center">
                  <span className="casino-text-white font-semibold">{player.name}</span>
                  <span className="gold-text font-bold">{formatChips(player.chips)}</span>
                </div>

                {/* Buy-in option for eliminated players */}
                {player.chips === 0 && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="number"
                      min={betUnit}
                      step={betUnit}
                      value={buyInAmounts[player.id] ?? ''}
                      onChange={(e) =>
                        setBuyInAmounts((prev) => ({
                          ...prev,
                          [player.id]: Number(e.target.value),
                        }))
                      }
                      placeholder={`${betUnit}単位`}
                      className="flex-1 min-w-0 px-2 py-1 bg-casino-dark-bg border border-casino-gold-dark text-white text-sm rounded focus:border-casino-gold focus:outline-none"
                    />
                    <button
                      onClick={() => handleBuyIn(player.id)}
                      disabled={!buyInAmounts[player.id] || buyInAmounts[player.id] <= 0}
                      className="px-3 py-1 bg-gradient-to-b from-casino-gold to-casino-gold-dark text-casino-dark-bg text-sm font-bold rounded hover:from-casino-gold-light hover:to-casino-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      バイイン
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <motion.button
            whileTap={buttonTap}
            whileHover={buttonHover}
            onClick={handleNextGame}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-casino-gold to-casino-gold-dark text-casino-dark-bg text-base sm:text-lg font-bold rounded-lg hover:from-casino-gold-light hover:to-casino-gold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            次のゲームに進む
          </motion.button>

          <motion.button
            whileTap={buttonTap}
            whileHover={buttonHover}
            onClick={handleSaveAndQuit}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-casino-card-dark border-2 border-casino-gold-dark text-white text-base sm:text-lg font-bold rounded-lg hover:border-casino-gold hover:bg-casino-card-light transition-all flex items-center justify-center gap-2"
          >
            保存して中断する
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
