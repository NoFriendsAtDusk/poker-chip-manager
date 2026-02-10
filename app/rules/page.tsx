import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">ルール解説</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-2">テキサスホールデム</h2>
              <p>各プレイヤーに2枚の手札が配られ、5枚のコミュニティカードと組み合わせて最強の5枚の役を作ります。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-800 mb-2">ベッティングラウンド</h2>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Pre-flop:</strong> 手札配布後の最初のベッティング</li>
                <li><strong>Flop:</strong> コミュニティカード3枚公開後</li>
                <li><strong>Turn:</strong> 4枚目のカード公開後</li>
                <li><strong>River:</strong> 5枚目のカード公開後</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-800 mb-2">アクション</h2>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>フォールド:</strong> 手札を捨てて降りる</li>
                <li><strong>チェック:</strong> ベットせずにパス（ベット額が同じ場合のみ）</li>
                <li><strong>コール:</strong> 現在のベット額に合わせる</li>
                <li><strong>レイズ:</strong> ベット額を引き上げる</li>
                <li><strong>オールイン:</strong> 全チップを賭ける</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-800 mb-2">役の強さ（強い順）</h2>
              <ol className="list-decimal list-inside space-y-1">
                <li>ロイヤルフラッシュ</li>
                <li>ストレートフラッシュ</li>
                <li>フォーカード</li>
                <li>フルハウス</li>
                <li>フラッシュ</li>
                <li>ストレート</li>
                <li>スリーカード</li>
                <li>ツーペア</li>
                <li>ワンペア</li>
                <li>ハイカード</li>
              </ol>
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
