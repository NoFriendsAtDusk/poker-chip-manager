import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">ポーカールール解説</h1>
          <p className="text-sm text-gray-500 mb-6">テキサスホールデム・ポーカーの基本ルールを解説します</p>

          <div className="space-y-8 text-gray-700">

            {/* Overview */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">テキサスホールデムとは</h2>
              <p>テキサスホールデムは、世界で最も人気のあるポーカーの形式です。各プレイヤーに配られる2枚の手札（ホールカード）と、テーブル中央に公開される5枚の共通カード（コミュニティカード）を組み合わせ、最も強い5枚の役（ハンド）を作ることを目指します。</p>
              <p className="mt-2">ゲーム中に合計4回のベッティングラウンドがあり、手札の強さや相手の動きを読みながら、ベット・レイズ・フォールドなどの判断を行います。</p>
            </section>

            {/* Positions */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">ポジション（役割）</h2>
              <p className="mb-3">各ゲームの開始時に、プレイヤーには以下の役割が割り当てられます。ゲームごとに時計回りに移動します。</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-green-800">
                      <th className="py-2 pr-3 text-left text-green-800">役割</th>
                      <th className="py-2 pr-3 text-left text-green-800">略称</th>
                      <th className="py-2 text-left text-green-800">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-3 font-semibold">ディーラー</td>
                      <td className="py-2 pr-3">BTN</td>
                      <td className="py-2">ディーラーボタンの位置。フロップ以降は最後にアクションできる有利なポジションです。</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-3 font-semibold">スモールブラインド</td>
                      <td className="py-2 pr-3">SB</td>
                      <td className="py-2">ディーラーの左隣。ゲーム開始時にスモールブラインド額（SB額）を強制ベットします。</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-3 font-semibold">ビッグブラインド</td>
                      <td className="py-2 pr-3">BB</td>
                      <td className="py-2">スモールブラインドの左隣。ゲーム開始時にビッグブラインド額（BB額）を強制ベットします。通常はSBの2倍です。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-2">※ ブラインドは強制ベットであり、ゲーム開始時に自動的にチップが差し引かれます。これにより毎ゲーム必ずポットにチップが入り、アクションが促されます。</p>
            </section>

            {/* Betting Rounds */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">ベッティングラウンド</h2>
              <p className="mb-3">1回のゲームで最大4回のベッティングラウンドがあります。</p>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-green-800">Pre-flop（プリフロップ）</p>
                  <p className="text-sm">手札2枚が配られた直後の最初のベッティング。BB（ビッグブラインド）の左隣のプレイヤーから時計回りにアクションします。SBとBBは既に強制ベットしているため、他のプレイヤーはまずこのBB額にコール（合わせる）するか、レイズ（引き上げる）するか、フォールド（降りる）するかを選びます。</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-green-800">Flop（フロップ）</p>
                  <p className="text-sm">コミュニティカード3枚が公開された後のベッティング。ディーラーの左隣の、まだゲームに参加しているプレイヤーからアクションが始まります。</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-green-800">Turn（ターン）</p>
                  <p className="text-sm">4枚目のコミュニティカードが公開された後のベッティング。フロップと同様にディーラーの左隣からアクションします。</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-green-800">River（リバー）</p>
                  <p className="text-sm">5枚目（最後）のコミュニティカードが公開された後のベッティング。これが最後のベッティングラウンドです。ここまで2人以上残っていれば、ショーダウンに進みます。</p>
                </div>
              </div>
            </section>

            {/* Actions */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">アクション一覧</h2>
              <p className="mb-3">各ベッティングラウンドで、プレイヤーは順番に以下のいずれかのアクションを選択します。</p>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-3">
                  <p className="font-semibold">フォールド（Fold）</p>
                  <p className="text-sm">手札を捨ててそのゲームから降ります。それまでに賭けたチップはポットに残り、戻ってきません。いつでも選択可能です。</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-semibold">チェック（Check）</p>
                  <p className="text-sm">追加でチップを賭けずにパスします。自分のベット額がテーブルの現在のベット額と同じ場合のみ可能です（例：プリフロップでBB本人が最後にアクションする場合や、フロップ以降で誰もまだベットしていない場合）。</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-semibold">コール（Call）</p>
                  <p className="text-sm">テーブルの現在のベット額に合わせます。例えば、現在のベットが200で自分が100しか賭けていない場合、100チップを追加してコールします。</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <p className="font-semibold">レイズ（Raise）</p>
                  <p className="text-sm">ベット額を引き上げます。最小レイズ額は直前のレイズ額と同じです（例：BBが200でレイズする場合、最小で200の上乗せ＝合計400）。レイズすると、他の全プレイヤーは再度アクションが必要になります。</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="font-semibold">オールイン（All-in）</p>
                  <p className="text-sm">手持ちの全チップを賭けます。チップが足りずにコール・レイズできない場合でもオールインは可能です。オールイン後はそれ以上のアクションはできませんが、ショーダウンまで勝利権を維持します。自分が賭けた額を超えるポットについてはサイドポットが作られ、他のプレイヤーが争います。</p>
                </div>
              </div>
            </section>

            {/* Betting Rules */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">ベッティングのルール</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>ラウンドの終了条件：</strong>全てのアクティブなプレイヤーが同額をベットし、かつ全員が少なくとも1回アクションを行った時点でベッティングラウンドが終了します。</li>
                <li><strong>レイズの最小額：</strong>直前のレイズと同額以上が必要です。最初のベットの場合はBB額が最小レイズ額です。</li>
                <li><strong>レイズ後の再アクション：</strong>誰かがレイズすると、全プレイヤー（既にアクション済みのプレイヤーを含む）は再度アクションする必要があります。</li>
                <li><strong>1人残り：</strong>全員がフォールドして1人だけになった場合、その時点でゲーム終了となり、残ったプレイヤーがポット全額を獲得します（カードを見せる必要はありません）。</li>
              </ul>
            </section>

            {/* Pots */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">ポットとサイドポット</h2>
              <p className="mb-3">ポットとは、プレイヤーが賭けたチップの合計です。オールインが発生すると、サイドポットが作成されることがあります。</p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-semibold text-green-800 mb-2">サイドポットの例</p>
                <p className="text-sm mb-2">プレイヤーA（チップ1,000）、B（チップ3,000）、C（チップ5,000）の3人がいるとします。</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Aが1,000チップでオールイン</li>
                  <li>BとCがそれぞれ3,000チップずつベット</li>
                </ul>
                <p className="text-sm mt-2">この場合、以下のようにポットが分かれます：</p>
                <ul className="list-disc pl-6 space-y-1 text-sm mt-1">
                  <li><strong>メインポット（3,000チップ）：</strong>全員が1,000ずつ拠出 → A, B, C全員に勝利権あり</li>
                  <li><strong>サイドポット（4,000チップ）：</strong>BとCが追加で2,000ずつ拠出 → BとCのみに勝利権あり</li>
                </ul>
                <p className="text-sm mt-2 text-gray-500">※ アプリがサイドポットの計算を自動で行います。ショーダウンではポットごとに勝者を選択してください。</p>
              </div>
            </section>

            {/* Hand Rankings */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">役の強さ一覧（強い順）</h2>
              <p className="mb-3">手札2枚とコミュニティカード5枚の合計7枚から、最も強い5枚の組み合わせで役が決まります。</p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 border-l-4 border-yellow-500 pl-3 py-1">
                  <span className="bg-yellow-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div>
                    <p className="font-bold text-green-800">ロイヤルフラッシュ（Royal Flush）</p>
                    <p className="text-sm">同じスート（マーク）のA・K・Q・J・10の組み合わせ。ポーカー最強の役であり、出現確率は約0.00015%です。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♠A ♠K ♠Q ♠J ♠10</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-yellow-500 pl-3 py-1">
                  <span className="bg-yellow-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div>
                    <p className="font-bold text-green-800">ストレートフラッシュ（Straight Flush）</p>
                    <p className="text-sm">同じスートで数字が5つ連続する組み合わせ。同じ役同士では、最も高い数字を比較します。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♥5 ♥6 ♥7 ♥8 ♥9</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-orange-400 pl-3 py-1">
                  <span className="bg-orange-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div>
                    <p className="font-bold text-green-800">フォーカード（Four of a Kind）</p>
                    <p className="text-sm">同じ数字のカード4枚の組み合わせ。同じ役同士では、4枚の数字が高い方が勝ちます。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♠K ♥K ♦K ♣K ♠9</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-orange-400 pl-3 py-1">
                  <span className="bg-orange-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <div>
                    <p className="font-bold text-green-800">フルハウス（Full House）</p>
                    <p className="text-sm">同じ数字3枚（スリーカード）＋同じ数字2枚（ワンペア）の組み合わせ。まず3枚の数字で比較し、同じなら2枚の数字で比較します。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♠Q ♥Q ♦Q ♣7 ♥7</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-blue-400 pl-3 py-1">
                  <span className="bg-blue-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">5</span>
                  <div>
                    <p className="font-bold text-green-800">フラッシュ（Flush）</p>
                    <p className="text-sm">同じスートのカード5枚（数字の連続は不要）。同じ役同士では、最も高いカードから順に比較します。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♦A ♦J ♦8 ♦6 ♦3</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-blue-400 pl-3 py-1">
                  <span className="bg-blue-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">6</span>
                  <div>
                    <p className="font-bold text-green-800">ストレート（Straight）</p>
                    <p className="text-sm">数字が5つ連続する組み合わせ（スートは問わない）。Aは最高（A-K-Q-J-10）にも最低（A-2-3-4-5）にも使えます。同じ役同士では、最も高い数字を比較します。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♠10 ♥J ♦Q ♣K ♠A</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-green-400 pl-3 py-1">
                  <span className="bg-green-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">7</span>
                  <div>
                    <p className="font-bold text-green-800">スリーカード（Three of a Kind）</p>
                    <p className="text-sm">同じ数字のカード3枚の組み合わせ。同じ役同士では、3枚の数字で比較し、同じならキッカー（残りのカード）で比較します。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♠8 ♥8 ♦8 ♣K ♥3</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-green-400 pl-3 py-1">
                  <span className="bg-green-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">8</span>
                  <div>
                    <p className="font-bold text-green-800">ツーペア（Two Pair）</p>
                    <p className="text-sm">異なる数字のペア2組の組み合わせ。まず高い方のペアで比較し、同じなら低い方のペア、それも同じならキッカーで比較します。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♠A ♥A ♦9 ♣9 ♠5</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-gray-400 pl-3 py-1">
                  <span className="bg-gray-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">9</span>
                  <div>
                    <p className="font-bold text-green-800">ワンペア（One Pair）</p>
                    <p className="text-sm">同じ数字のカード2枚の組み合わせ。同じ役同士では、ペアの数字で比較し、同じならキッカーを順に比較します。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♠J ♥J ♦A ♣8 ♥4</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-l-4 border-gray-400 pl-3 py-1">
                  <span className="bg-gray-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">10</span>
                  <div>
                    <p className="font-bold text-green-800">ハイカード（High Card）</p>
                    <p className="text-sm">上記のどの役にも該当しない場合、最も高い数字のカードで勝負します。同じなら次に高いカードを順に比較していきます。</p>
                    <p className="text-xs text-gray-500 mt-1">例：♠A ♥K ♦9 ♣6 ♥2（「エースハイ」）</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Card Strength */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">カードの強さ</h2>
              <p className="mb-2">カードの強さは数字で決まり、スート（マーク）による強弱はありません。</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-center font-semibold">
                  <span className="text-red-600">A</span>{' > '}
                  <span>K</span>{' > '}
                  <span className="text-red-600">Q</span>{' > '}
                  <span>J</span>{' > '}
                  <span className="text-red-600">10</span>{' > '}
                  <span>9</span>{' > '}
                  <span className="text-red-600">8</span>{' > '}
                  <span>7</span>{' > '}
                  <span className="text-red-600">6</span>{' > '}
                  <span>5</span>{' > '}
                  <span className="text-red-600">4</span>{' > '}
                  <span>3</span>{' > '}
                  <span className="text-red-600">2</span>
                </p>
                <p className="text-xs text-center text-gray-500 mt-2">A（エース）が最強。ただしストレートではA-2-3-4-5の最低ストレートとしても使用可能。</p>
              </div>
            </section>

            {/* Kicker */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">キッカーとは</h2>
              <p>同じ役のプレイヤーが複数いる場合、役に直接関係しない残りのカード（キッカー）の強さで勝敗を決めます。</p>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-2">
                <p className="text-sm"><strong>例：</strong>プレイヤーAの手札がK-Jで、プレイヤーBの手札がK-8の場合、コミュニティカードにKが含まれていれば両者ともワンペア（K）ですが、キッカーのJ &gt; 8でプレイヤーAの勝ちとなります。</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">※ 5枚すべてが完全に同じ強さの場合は引き分け（スプリットポット）となり、ポットを均等に分けます。</p>
            </section>

            {/* Suits */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">スート（マーク）について</h2>
              <p className="mb-2">トランプには4つのスートがあります。テキサスホールデムでは、スートに強弱はありません。</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <span className="text-3xl">♠</span>
                  <p className="text-sm font-semibold mt-1">スペード</p>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <span className="text-3xl text-red-500">♥</span>
                  <p className="text-sm font-semibold mt-1">ハート</p>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <span className="text-3xl text-red-500">♦</span>
                  <p className="text-sm font-semibold mt-1">ダイヤ</p>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <span className="text-3xl">♣</span>
                  <p className="text-sm font-semibold mt-1">クラブ</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">※ フラッシュやストレートフラッシュの成立にはスートの一致が必要ですが、スート自体に優劣はありません。</p>
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
