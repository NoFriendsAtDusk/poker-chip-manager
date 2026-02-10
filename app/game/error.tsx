'use client';

import { useRouter } from 'next/navigation';

export default function GameError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen poker-table flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">ゲームエラー</h2>
        <p className="text-gray-700 mb-6">
          ゲーム中にエラーが発生しました。再試行するか、トップページに戻ってください。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            やり直す
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            トップページに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
