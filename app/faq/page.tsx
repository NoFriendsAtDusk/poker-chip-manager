import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">このアプリについて</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-lg font-bold text-green-800 mb-1">Q. このアプリは何ですか？</h2>
              <p>トランプだけでポーカーを遊ぶ際に、チップの計算を管理するためのツールです。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-green-800 mb-1">Q. 料金はかかりますか？</h2>
              <p>本アプリは無料でご利用いただけます。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-green-800 mb-1">Q. データはどこに保存されますか？</h2>
              <p>ゲームデータはお使いのブラウザのローカルストレージに保存されます。サーバーにデータが送信されることはありません。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-green-800 mb-1">Q. 何人まで遊べますか？</h2>
              <p>2人から10人までのプレイに対応しています。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-green-800 mb-1">Q. ゲームを中断できますか？</h2>
              <p>はい。ゲームの状態はブラウザに自動保存されるため、ページを閉じても続きから再開できます。</p>
            </section>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:underline">トップページに戻る</Link>
        </div>
      </div>
    </div>
  );
}
