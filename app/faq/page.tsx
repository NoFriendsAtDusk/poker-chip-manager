import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">よくある質問</h1>
          <p className="text-sm text-gray-500 mb-6">ポーカーチップマネージャーについてのよくある質問と回答</p>

          <div className="space-y-8 text-gray-700">

            {/* Category: About the App */}
            <div>
              <h2 className="text-lg font-bold text-green-800 border-b-2 border-green-800 pb-2 mb-4">アプリについて</h2>
              <div className="space-y-5">
                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. このアプリは何ですか？</h3>
                  <p className="text-sm">実物のトランプカードを使ってテキサスホールデム・ポーカーを遊ぶ際に、チップの計算とゲーム進行を管理する無料の補助ツールです。カードの配布や役の判定はアプリでは行わず、ベット・コール・レイズ・フォールドなどのアクション管理、ポット計算、サイドポットの自動分配を行います。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 料金はかかりますか？</h3>
                  <p className="text-sm">完全無料でご利用いただけます。課金要素や有料プランは一切ありません。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. アカウント登録は必要ですか？</h3>
                  <p className="text-sm">不要です。サイトにアクセスするだけですぐにご利用いただけます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. スマートフォンでも使えますか？</h3>
                  <p className="text-sm">スマートフォン、タブレット、PCのいずれのブラウザにも対応しています。画面サイズに応じてレイアウトが自動調整されます。推奨ブラウザはChrome、Safari、Edgeの最新バージョンです。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. オフラインでも使えますか？</h3>
                  <p className="text-sm">観戦モード（マルチデバイス共有）を使用しない場合は、一度ページを読み込んだ後はインターネット接続なしでも基本的なゲーム進行が可能です。ただし、初回アクセス時にはインターネット接続が必要です。</p>
                </section>
              </div>
            </div>

            {/* Category: Gameplay */}
            <div>
              <h2 className="text-lg font-bold text-green-800 border-b-2 border-green-800 pb-2 mb-4">ゲームプレイについて</h2>
              <div className="space-y-5">
                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 何人まで遊べますか？</h3>
                  <p className="text-sm">2人から10人までのプレイに対応しています。トップページのゲーム設定でプレイ人数を変更できます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. トランプカードは必要ですか？</h3>
                  <p className="text-sm">実物のトランプカード（ジョーカーを除く52枚）が必要です。このアプリはチップの管理とゲーム進行のみを行い、カードの配布や役の判定は行いません。手札の配布やコミュニティカードの公開は、プレイヤー自身が手動で行ってください。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. ゲーム中にプレイヤー名を変更できますか？</h3>
                  <p className="text-sm">ゲーム画面でプレイヤー名の横にある編集アイコンをタップすると、その場で名前を変更できます。変更は即座に反映され、観戦モードを使用中の場合は観戦者の画面にもリアルタイムで反映されます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 操作を間違えた場合はどうすればいいですか？</h3>
                  <p className="text-sm">「元に戻す（Undo）」ボタンで直前の状態に戻すことができます。最大20手前まで遡ることが可能です。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. サイドポットとは何ですか？</h3>
                  <p className="text-sm">オールイン（全チップを賭ける）をしたプレイヤーがいる場合、そのプレイヤーが賭けた額を超えるベット分は別のポット（サイドポット）に分けられます。オールインしたプレイヤーはメインポットのみの勝利権を持ち、サイドポットは残りのプレイヤーで争います。アプリが自動で計算・分配するので、手計算は不要です。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. ショーダウンで引き分けの場合はどうなりますか？</h3>
                  <p className="text-sm">ショーダウン画面で複数のプレイヤーを勝者として選択できます（スプリットポット）。選択された勝者の人数で均等にチップが分配されます。端数が出た場合は、最初に選択したプレイヤーに割り当てられます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. チップが0になったプレイヤーはどうなりますか？</h3>
                  <p className="text-sm">チップが0になったプレイヤーは次のゲームから自動的に除外されます。ただし、ゲーム終了画面で「バイイン」機能を使って任意のチップ額で復帰することも可能です。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. ブラインドの自動増加とは何ですか？</h3>
                  <p className="text-sm">ゲーム設定で「ブラインド自動増加」を有効にすると、ゲームごとにスモールブラインド（SB）とビッグブラインド（BB）の額が約1.5倍ずつ増加します。これにより、ゲームが長引くほど各ラウンドのベット額が大きくなり、ゲームの決着が促されます。トーナメント形式のプレイに適しています。</p>
                </section>
              </div>
            </div>

            {/* Category: Multi-device */}
            <div>
              <h2 className="text-lg font-bold text-green-800 border-b-2 border-green-800 pb-2 mb-4">観戦モード（マルチデバイス共有）</h2>
              <div className="space-y-5">
                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 観戦モードとは何ですか？</h3>
                  <p className="text-sm">ゲームのホスト（主催者）が「共有する」ボタンを押すと、6文字のルームコードが発行されます。他のプレイヤーや観戦者はトップページの「観戦する」ボタンからこのルームコードを入力することで、リアルタイムでゲームの進行状況を別のデバイスから閲覧できます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 観戦者もアクション操作できますか？</h3>
                  <p className="text-sm">観戦モードは閲覧専用です。ベットやフォールドなどの操作はホストのデバイスからのみ行えます。観戦者の画面にはアクションボタンが表示されません。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 観戦者の人数に制限はありますか？</h3>
                  <p className="text-sm">特に人数制限はありません。ルームコードを知っている人は誰でも観戦に参加できます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 共有を停止するとどうなりますか？</h3>
                  <p className="text-sm">ホストが共有を停止するか、ゲームをリセットすると、サーバー上のゲームデータは自動的に削除されます。観戦者の画面にはゲーム情報が表示されなくなります。</p>
                </section>
              </div>
            </div>

            {/* Category: Data & Privacy */}
            <div>
              <h2 className="text-lg font-bold text-green-800 border-b-2 border-green-800 pb-2 mb-4">データとプライバシー</h2>
              <div className="space-y-5">
                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. データはどこに保存されますか？</h3>
                  <p className="text-sm">ゲームデータ（プレイヤー名、チップ数、ゲーム状態など）は、お使いのブラウザのローカルストレージに保存されます。観戦モード使用時のみ、ゲーム状態がクラウドデータベースに一時的に保存されます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. ゲームを中断・再開できますか？</h3>
                  <p className="text-sm">ゲームの状態はブラウザのローカルストレージに自動保存されるため、ページを閉じたりブラウザを終了しても、同じブラウザで再度アクセスすれば続きから再開できます。ただし、ブラウザのデータを消去すると保存データも削除されます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. ゲームデータを完全に削除するには？</h3>
                  <p className="text-sm">ブラウザの設定画面からローカルストレージ（サイトデータ）を削除してください。具体的な手順はブラウザによって異なりますが、一般的には「設定」→「プライバシー」→「サイトデータの消去」から行えます。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 個人情報は収集されますか？</h3>
                  <p className="text-sm">氏名、メールアドレス、アカウント情報などの個人情報は一切収集しません。詳細は<Link href="/legal/privacy" className="text-green-700 underline">プライバシーポリシー</Link>をご覧ください。</p>
                </section>
              </div>
            </div>

            {/* Category: Troubleshooting */}
            <div>
              <h2 className="text-lg font-bold text-green-800 border-b-2 border-green-800 pb-2 mb-4">トラブルシューティング</h2>
              <div className="space-y-5">
                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. ページが正しく表示されません</h3>
                  <p className="text-sm">ブラウザのキャッシュを削除してからページを再読み込みしてください。また、最新バージョンのChrome、Safari、またはEdgeをご利用ください。古いブラウザでは一部の機能が正しく動作しない場合があります。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 観戦モードが接続できません</h3>
                  <p className="text-sm">以下をご確認ください：</p>
                  <ul className="list-disc pl-6 text-sm space-y-1 mt-1">
                    <li>ルームコード（6文字）が正しく入力されているか</li>
                    <li>ホスト側で共有が有効になっているか</li>
                    <li>インターネット接続が安定しているか</li>
                  </ul>
                  <p className="text-sm mt-1">ホストが共有を停止・リセットした場合、ルームコードは無効になります。</p>
                </section>

                <section>
                  <h3 className="font-bold text-green-800 mb-1">Q. 前回のゲームデータが消えてしまいました</h3>
                  <p className="text-sm">ゲームデータはブラウザのローカルストレージに保存されています。ブラウザのデータ消去、シークレットモードの使用、別のブラウザやデバイスからのアクセスでは、以前のデータを引き継ぐことができません。</p>
                </section>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-semibold text-green-800 mb-1">上記で解決しない場合</p>
              <p className="text-sm">その他のご質問やご意見は、<Link href="/contact" className="text-green-700 underline">お問い合わせフォーム</Link>よりお気軽にご連絡ください。</p>
            </div>

          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:underline">トップページに戻る</Link>
        </div>
      </div>
    </div>
  );
}
