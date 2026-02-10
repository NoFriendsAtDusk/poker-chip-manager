import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">利用規約</h1>

          <div className="space-y-4 text-gray-700">
            <p>本利用規約（以下「本規約」）は、当アプリの利用条件を定めるものです。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">1. 利用目的</h2>
            <p>当アプリは、ポーカーのゲーム進行を補助する目的でチップ計算を管理するツールです。金銭や換金可能な物品を賭ける行為は法律で禁止されており、本アプリはこれを一切認めません。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">2. 禁止事項</h2>
            <p>ユーザーは、当アプリを金銭を賭けた賭博行為に使用してはなりません。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">3. 免責事項</h2>
            <p>当アプリの利用により生じた損害について、開発者は一切の責任を負いません。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">4. 規約の変更</h2>
            <p>本規約は予告なく変更される場合があります。</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:underline">トップページに戻る</Link>
        </div>
      </div>
    </div>
  );
}
