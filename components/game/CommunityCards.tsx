interface CommunityCardsProps {
  count: number; // 3, 4, or 5
}

export default function CommunityCards({ count }: CommunityCardsProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="bg-green-900 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span className="text-white text-lg sm:text-xl font-semibold">Community Cards:</span>
          <div className="flex gap-2 sm:gap-3">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="w-14 h-20 sm:w-20 sm:h-28 bg-white rounded-lg border-4 border-gray-300 flex items-center justify-center shadow-lg card-enter"
              >
                <div className="text-2xl sm:text-4xl">♠️</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
