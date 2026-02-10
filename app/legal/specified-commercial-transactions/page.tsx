import Link from 'next/link';

export default function SpecifiedCommercialTransactionsPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">特定商取引法に基づく表記</h1>

          <div className="space-y-4 text-gray-700">
            <p>本ページは特定商取引法に基づく表記のプレースホルダーです。正式な内容は後日更新されます。</p>

            <table className="w-full border-collapse mt-4">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold w-1/3">販売業者</td>
                  <td className="py-3">（後日記載）</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">運営統括責任者</td>
                  <td className="py-3">（後日記載）</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">所在地</td>
                  <td className="py-3">（後日記載）</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">連絡先</td>
                  <td className="py-3">（後日記載）</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">販売価格</td>
                  <td className="py-3">無料</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:underline">トップページに戻る</Link>
        </div>
      </div>
    </div>
  );
}
