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
    <div className="bg-green-900 rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4">
        ゲーム終了
      </h2>

      <p className="text-white text-base sm:text-lg mb-4 sm:mb-6">
        勝者にチップが配分されました。
      </p>

      {/* Player chip standings */}
      <div className="bg-black bg-opacity-30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        {gameState.players
          .slice()
          .sort((a, b) => b.chips - a.chips)
          .map(player => (
            <div key={player.id} className="flex justify-between text-white py-2 chip-update">
              <span className="font-semibold">{player.name}</span>
              <span>{formatChips(player.chips)}</span>
            </div>
          ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleNextGame}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-green-600 text-white text-base sm:text-lg font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          次のゲームに進む
        </button>

        <button
          onClick={handleSaveAndQuit}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-purple-600 text-white text-base sm:text-lg font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          保存して中断する
        </button>
      </div>
    </div>
  );
}
