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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 sm:mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left text-gray-700 font-semibold">#</th>
              <th className="px-2 sm:px-4 py-3 text-left text-gray-700 font-semibold">プレイヤー</th>
              <th className="px-2 sm:px-4 py-3 text-right text-gray-700 font-semibold">チップ</th>
              <th className="px-2 sm:px-4 py-3 text-right text-gray-700 font-semibold">ベット額</th>
              <th className="px-2 sm:px-4 py-3 text-center text-gray-700 font-semibold">ステータス</th>
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
