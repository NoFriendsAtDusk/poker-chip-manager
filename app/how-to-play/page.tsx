import Link from 'next/link';

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">使い方ガイド</h1>
          <p className="text-sm text-gray-500 mb-6">ポーカーチップマネージャーの使い方を詳しく説明します</p>

          <div className="space-y-8 text-gray-700">

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">1. ゲームの準備</h2>
              <p className="mb-3">トップページのゲーム設定フォームで、以下の項目を設定して「ゲーム開始」を押してください。</p>
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="font-semibold text-green-800">プレイ人数（2〜10人）</p>
                  <p className="text-sm">参加するプレイヤーの人数を設定します。人数を変更すると、プレイヤー名の入力欄が自動で増減します。</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">プレイヤー名</p>
                  <p className="text-sm">各プレイヤーの名前を入力します。ゲーム中でも名前の横にある編集ボタンからいつでも変更できます。</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">ベット単位</p>
                  <p className="text-sm">レイズ時の最小単位です。スライダーまたは数値入力で設定できます。</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">初期チップ</p>
                  <p className="text-sm">各プレイヤーに配られる開始時のチップ枚数です。</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">ブラインド設定</p>
                  <p className="text-sm">「ブラインドあり」を有効にすると、Small Blind（SB）とBig Blind（BB）の金額を設定できます。「ブラインド自動増加」を有効にすると、ゲームごとにブラインドが約1.5倍ずつ増加します。</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">2. ゲーム画面の見方</h2>
              <p className="mb-3">ゲームが始まると、ポーカーテーブルが表示されます。</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>テーブル中央：</strong>ポット（賭けられたチップの合計）とコミュニティカードの枚数が表示されます。</li>
                <li><strong>各プレイヤーの席：</strong>プレイヤー名、現在のチップ数、ベット額、役割バッジ（BTN / SB / BB）が表示されます。</li>
                <li><strong>現在のプレイヤー：</strong>ゴールドの光で囲まれて強調表示されます。</li>
                <li><strong>アクションパネル：</strong>画面下部に表示され、現在のプレイヤーが実行できるアクションボタンが並びます。</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">3. ゲームの流れ</h2>
              <p className="mb-3">テキサスホールデムのルールに従い、以下の順番で進行します。各ラウンドの間に、実際のトランプでコミュニティカードを場に出してください。</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  <div>
                    <p className="font-semibold">Pre-flop（プリフロップ）</p>
                    <p className="text-sm">各プレイヤーに2枚の手札を配ります。ブラインドが有効な場合、SBとBBのチップは自動で差し引かれます。BBの左隣のプレイヤーからアクションが始まります。</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  <div>
                    <p className="font-semibold">Flop（フロップ）</p>
                    <p className="text-sm">テーブルの中央にコミュニティカードを3枚表向きに出します。ディーラーの左隣から2回目のベッティングラウンドが始まります。</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  <div>
                    <p className="font-semibold">Turn（ターン）</p>
                    <p className="text-sm">4枚目のコミュニティカードを出します。3回目のベッティングラウンドが行われます。</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  <div>
                    <p className="font-semibold">River（リバー）</p>
                    <p className="text-sm">5枚目（最後）のコミュニティカードを出します。最後のベッティングラウンドが行われます。</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">5</span>
                  <div>
                    <p className="font-semibold">Showdown（ショーダウン）</p>
                    <p className="text-sm">全員の手札を見て、最も強い役を持つプレイヤーを選択します。ポットが複数ある場合（サイドポット）は、それぞれのポットごとに勝者を選びます。</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">4. アクションの種類</h2>
              <p className="mb-3">各ベッティングラウンドで、現在のプレイヤーは以下のアクションから選択できます。</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-green-800">
                      <th className="py-2 pr-3 text-left text-green-800">アクション</th>
                      <th className="py-2 pr-3 text-left text-green-800">条件</th>
                      <th className="py-2 text-left text-green-800">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-3 font-semibold">フォールド</td>
                      <td className="py-2 pr-3">いつでも</td>
                      <td className="py-2">手札を捨ててそのゲームから降ります。それまでに賭けたチップは戻りません。</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-3 font-semibold">チェック</td>
                      <td className="py-2 pr-3">追加ベットなし</td>
                      <td className="py-2">自分のベット額がテーブルの現在のベット額と同じとき、チップを賭けずにパスできます。</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-3 font-semibold">コール</td>
                      <td className="py-2 pr-3">ベット差あり</td>
                      <td className="py-2">テーブルの現在のベット額と同額になるまでチップを追加します。</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-3 font-semibold">レイズ</td>
                      <td className="py-2 pr-3">最小レイズ額以上</td>
                      <td className="py-2">現在のベット額に上乗せして、テーブルのベット額を引き上げます。他のプレイヤーは再度アクションが必要になります。</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-3 font-semibold">オールイン</td>
                      <td className="py-2 pr-3">いつでも</td>
                      <td className="py-2">手持ちのチップを全額賭けます。チップ不足でもコール・レイズの代わりに使えます。サイドポットが自動で作成されます。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-3">
                <p className="text-sm"><strong>ヒント：</strong>レイズが行われると、まだアクションしていないプレイヤーだけでなく、既にアクション済みのプレイヤーも再度アクションが必要になります。全員のベット額が揃い、全員がアクション済みになるとラウンドが終了します。</p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">5. ショーダウン（勝者の決定）</h2>
              <p className="mb-3">リバーのベッティングが終わると、ショーダウンに進みます。</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>実際のトランプカードを見て、最も強い役を持つプレイヤーを画面上で選択してください。</li>
                <li><strong>複数のポットがある場合：</strong>メインポットとサイドポットが順番に表示されます。それぞれのポットで勝者を個別に選択します。</li>
                <li><strong>スプリットポット（引き分け）：</strong>同じ強さの役を持つプレイヤーが複数いる場合、複数名を選択できます。チップは均等に分配されます。</li>
                <li><strong>自動判定：</strong>ポットの対象者が1人しかいない場合、そのプレイヤーにチップが自動で付与されます。</li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">※ 途中で全員がフォールドして1人だけ残った場合は、ショーダウンを行わずにそのプレイヤーが自動的に勝者となります。</p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">6. 次のゲームへ進む</h2>
              <p className="mb-3">ショーダウン後のゲーム結果画面では、以下の操作ができます。</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>次のゲームに進む：</strong>ディーラーボタンが時計回りに1つ移動し、新しいゲームが始まります。チップが0のプレイヤーは自動的に除外されます。</li>
                <li><strong>バイイン（再参加）：</strong>チップが0になったプレイヤーは、次のゲームに進む前に任意のチップ額で復帰できます。</li>
                <li><strong>ブラインド自動増加：</strong>この設定が有効な場合、ゲームごとにブラインド額が約1.5倍に増加します。</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">7. 便利な機能</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-700 mb-1">元に戻す（Undo）</h3>
                  <p className="text-sm">誤った操作をした場合、「元に戻す」ボタンで直前の状態に戻せます。最大20手前まで遡ることができます。</p>
                </div>
                <div>
                  <h3 className="font-semibold text-green-700 mb-1">プレイヤー名の変更</h3>
                  <p className="text-sm">ゲーム中でも、プレイヤー名の横にある編集アイコンをタップすると名前を変更できます。</p>
                </div>
                <div>
                  <h3 className="font-semibold text-green-700 mb-1">観戦モード（マルチデバイス共有）</h3>
                  <p className="text-sm">ゲーム画面の「共有する」ボタンを押すと、6文字のルームコードが発行されます。他のプレイヤーはトップページの「観戦する」ボタンからルームコードを入力することで、リアルタイムでゲーム状況を閲覧できます。ホストのアクションは自動的に全員の画面に反映されます。</p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-bold text-green-800 mb-3">8. 本アプリでの遊び方まとめ</h2>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="mb-2">このアプリは<strong>チップ計算とゲーム進行の管理</strong>を行うツールです。カードの配布や役の判定はアプリでは行いません。</p>
                <ol className="list-decimal pl-6 space-y-1 text-sm">
                  <li>実物のトランプを用意してください。</li>
                  <li>アプリのゲーム設定を行い、ゲームを開始します。</li>
                  <li>各ラウンドでは、手動でカードを配り・場に出してください。</li>
                  <li>アプリのアクションボタンでベット・フォールドなどの操作を行います。</li>
                  <li>ショーダウンでは、実際のカードを確認し、勝者をアプリで選択します。</li>
                  <li>チップの計算・分配はアプリが自動で行います。</li>
                </ol>
              </div>
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
