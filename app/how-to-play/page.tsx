import Link from 'next/link';

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">遊び方ガイド</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-2">1. ゲームの準備</h2>
              <p>トップページでプレイ人数、プレイヤー名、初期チップ、ブラインドなどを設定し、「ゲーム開始」を押してください。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-800 mb-2">2. ゲームの流れ</h2>
              <p>テキサスホールデムのルールに従い、Pre-flop → Flop → Turn → River → Showdown の順で進行します。各ラウンドでアクション（フォールド、チェック、コール、レイズ、オールイン）を選択してください。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-800 mb-2">3. 勝者の決定</h2>
              <p>Showdown では、実際のカードを見て勝者を選択してください。複数選択でスプリットポットにも対応しています。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-800 mb-2">4. 次のゲームへ</h2>
              <p>チップが配分された後、「次のゲームに進む」でディーラーボタンが回り、新しいゲームが始まります。</p>
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
