import { GameState } from '@/types/game-types';
import { getStageText, formatChips } from '@/lib/utils';
import { formatPotDisplay } from '@/lib/pot-calculator';

interface GameHeaderProps {
  gameState: GameState;
}

export default function GameHeader({ gameState }: GameHeaderProps) {
  const { gameNumber, stage, settings, totalPot, pots } = gameState;

  return (
    <div className="casino-card rounded-lg shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gold-text">
            ゲーム {gameNumber}
          </h1>
          <p className="text-base sm:text-lg text-white">
            ステージ: <span className="font-semibold">{getStageText(stage)}</span>
          </p>
        </div>

        <div className="sm:text-right">
          {settings.blindsEnabled && (
            <div className="text-base sm:text-lg text-white mb-2">
              <span className="font-semibold">
                SB: {formatChips(settings.smallBlind)} / BB: {formatChips(settings.bigBlind)}
              </span>
            </div>
          )}

          <div className="text-lg sm:text-xl font-bold gold-text gold-glow">
            ポット合計: {formatChips(totalPot)}
          </div>

          {pots.length > 0 && (
            <div className="text-sm text-casino-gold-light mt-1">
              {formatPotDisplay(pots)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
