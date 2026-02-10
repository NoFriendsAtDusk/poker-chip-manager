import { Player } from '@/types/game-types';
import PlayerRow from './PlayerRow';

interface PlayerTableProps {
  players: Player[];
  dealerIndex: number;
  sbIndex: number;
  bbIndex: number;
  currentPlayerIndex: number;
}

export default function PlayerTable({
  players,
  dealerIndex,
  sbIndex,
  bbIndex,
  currentPlayerIndex
}: PlayerTableProps) {
  return (
    <div className="casino-card rounded-lg shadow-2xl overflow-hidden mb-4 sm:mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-casino-dark-bg-light border-b-2 border-casino-gold-dark">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left gold-text font-semibold">#</th>
              <th className="px-2 sm:px-4 py-3 text-left gold-text font-semibold">プレイヤー</th>
              <th className="px-2 sm:px-4 py-3 text-right gold-text font-semibold">チップ</th>
              <th className="px-2 sm:px-4 py-3 text-right gold-text font-semibold">ベット額</th>
              <th className="px-2 sm:px-4 py-3 text-center gold-text font-semibold">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <PlayerRow
                key={player.id}
                player={player}
                position={index + 1}
                isSB={index === sbIndex}
                isBB={index === bbIndex}
                isDealer={index === dealerIndex}
                isCurrent={index === currentPlayerIndex}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
