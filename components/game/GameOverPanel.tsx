'use client';

import { useRouter } from 'next/navigation';
import { GameState } from '@/types/game-types';
import { useGameStore } from '@/store/game-store';
import { formatChips } from '@/lib/utils';

interface GameOverPanelProps {
  gameState: GameState;
}

export default function GameOverPanel({ gameState }: GameOverPanelProps) {
  const router = useRouter();
  const { nextGame } = useGameStore();

  const handleNextGame = () => {
    nextGame();
  };

  const handleSaveAndQuit = () => {
    router.push('/');
  };

  return (
    <div className="felt-surface rounded-lg shadow-2xl p-4 sm:p-6 border-2 border-casino-gold">
      <h2 className="gold-text text-2xl sm:text-3xl font-bold mb-4">
        ゲーム終了
      </h2>

      <p className="casino-text-white text-base sm:text-lg mb-4 sm:mb-6">
        勝者にチップが配分されました。
      </p>

      {/* Player chip standings */}
      <div className="bg-casino-dark-bg/80 border border-casino-gold-dark rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        {gameState.players
          .slice()
          .sort((a, b) => b.chips - a.chips)
          .map(player => (
            <div key={player.id} className="flex justify-between py-2 chip-update">
              <span className="casino-text-white font-semibold">{player.name}</span>
              <span className="gold-text font-bold">{formatChips(player.chips)}</span>
            </div>
          ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleNextGame}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-casino-gold to-casino-gold-dark text-casino-dark-bg text-base sm:text-lg font-bold rounded-lg hover:from-casino-gold-light hover:to-casino-gold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          次のゲームに進む
        </button>

        <button
          onClick={handleSaveAndQuit}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-casino-card-dark border-2 border-casino-gold-dark text-white text-base sm:text-lg font-bold rounded-lg hover:border-casino-gold hover:bg-casino-card-light transition-all flex items-center justify-center gap-2"
        >
          保存して中断する
        </button>
      </div>
    </div>
  );
}
