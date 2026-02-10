'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen poker-table flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
        <p className="text-gray-700 mb-6">
          予期しないエラーが発生しました。もう一度お試しください。
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          やり直す
        </button>
      </div>
    </div>
  );
}
