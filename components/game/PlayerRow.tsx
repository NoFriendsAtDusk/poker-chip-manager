import { Player } from '@/types/game-types';
import { formatChips, getStatusText } from '@/lib/utils';

interface PlayerRowProps {
  player: Player;
  position: number;
  isSB: boolean;
  isBB: boolean;
  isDealer: boolean;
  isCurrent: boolean;
}

export default function PlayerRow({
  player,
  position,
  isSB,
  isBB,
  isDealer,
  isCurrent
}: PlayerRowProps) {
  const rowClass = isCurrent
    ? 'bg-blue-100 border-l-4 border-blue-500'
    : player.status === 'folded'
    ? 'bg-gray-50 text-gray-400'
    : '';

  return (
    <tr
      className={`border-b border-gray-200 ${rowClass}`}
      aria-current={isCurrent ? 'step' : undefined}
    >
      <td className="px-2 py-2 sm:px-4 sm:py-4 font-medium">{position}</td>
      <td className="px-2 py-2 sm:px-4 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold">{player.name}</span>
          {isDealer && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-500 text-white text-xs rounded">
              BTN
            </span>
          )}
          {isSB && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-700 text-white text-xs rounded">
              SB
            </span>
          )}
          {isBB && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-900 text-white text-xs rounded">
              BB
            </span>
          )}
        </div>
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-right font-semibold">
        {formatChips(player.chips)}
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-right">
        {player.currentBet > 0 ? formatChips(player.currentBet) : '0'}
      </td>
      <td className="px-2 py-2 sm:px-4 sm:py-4 text-center">
        {getStatusText(player.status)}
      </td>
    </tr>
  );
}
