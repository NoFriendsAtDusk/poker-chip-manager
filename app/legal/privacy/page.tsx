import Link from 'next/link';

const CONTACT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScs6aXmueolWblaJV77fNdV5jqzc8Guvb1uMrD0haJBoKc2-g/viewform?usp=publish-editor';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">プライバシーポリシー</h1>
          <p className="text-sm text-gray-500 mb-6">最終更新日：2025年6月</p>

          <div className="space-y-4 text-gray-700">

            <h2 className="text-xl font-bold text-green-800 mt-6">1. 基本方針</h2>
            <p>ポーカーチップマネージャー（以下「本サービス」といいます）は、ユーザーのプライバシーを尊重し、個人情報の適切な保護に努めます。本ポリシーは、本サービスにおける情報の取り扱いについて説明するものです。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">2. 収集する情報</h2>
            <p>本サービスは、ユーザーを直接特定できる個人情報（氏名・メールアドレス・アカウント情報等）を収集しません。本サービスが取り扱う情報は以下のとおりです。</p>

            <h3 className="text-lg font-semibold text-green-700 mt-4">(1) ゲームデータ（ローカル保存）</h3>
            <p>プレイヤー名・チップ枚数・ブラインド設定・ゲームの進行状況などのゲームデータは、ユーザーご自身のデバイス内ブラウザのローカルストレージ（localStorage）にのみ保存されます。このデータはユーザーが「共有機能」を有効にしない限り、本サービスのサーバーに送信されることはありません。ローカルストレージのデータはブラウザの設定画面からいつでも削除できます。</p>

            <h3 className="text-lg font-semibold text-green-700 mt-4">(2) アクセス解析情報（Vercel Analytics）</h3>
            <p>本サービスでは、サービス改善のためVercel Inc.が提供するプライバシーフレンドリーなアクセス解析ツール「Vercel Analytics」を利用しています。収集される情報は以下のとおりです。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>閲覧ページのURL</li>
              <li>リファラー（参照元URL）</li>
              <li>ブラウザの種類・バージョン</li>
              <li>デバイスの種類（モバイル/デスクトップ等）</li>
              <li>おおよその国・地域（IPアドレスから推定後、ハッシュ化処理）</li>
              <li>ページ読み込み時間等のパフォーマンス指標</li>
            </ul>
            <p><strong>Vercel AnalyticsはCookieを使用しません。</strong>IPアドレスは直接記録されず、Vercelによってハッシュ化された後に破棄されます。収集されたデータは個人を特定するために使用されることはありません。詳細は<a href="https://vercel.com/legal/privacy-policy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Vercelのプライバシーポリシー</a>をご確認ください。</p>

            <h3 className="text-lg font-semibold text-green-700 mt-4">(3) リアルタイム共有データ（Supabase）— 任意機能</h3>
            <p>本サービスには、プレイヤーがゲーム進行状況を観戦者とリアルタイムで共有できるオプション機能があります。この機能はホスト（主催者）が明示的に「共有する」ボタンを押した場合にのみ有効になります。</p>
            <p>共有が有効な間、以下のデータがSupabase Inc.のサーバーへ送信・保存されます。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>プレイヤー名（ユーザーが入力した文字列）</li>
              <li>チップ枚数・ベット額・ポット額等のゲーム状態</li>
              <li>ランダム生成された6文字のルームコード</li>
            </ul>
            <p>共有データはホストが共有を停止するか、ゲームをリセットした時点でSupabaseから自動的に削除されます。ルームコードは認証なしに誰でも閲覧可能なため、プレイヤー名には実名等の個人情報を入力しないことを推奨します。</p>

            <h3 className="text-lg font-semibold text-green-700 mt-4">(4) 広告配信情報（Google AdSense）</h3>
            <p>本サービスでは、Google LLC（以下「Google」といいます）が提供する広告配信サービス「Google AdSense」を利用しています。GoogleはCookieを使用して、ユーザーの本サービスおよび他のウェブサイトへの過去のアクセス情報に基づき、関連性の高い広告を表示することがあります（インタレストベース広告）。</p>
            <p>Google AdSenseによって収集・利用される情報の詳細、およびパーソナライズ広告を無効化する方法については、以下をご参照ください。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><a href="https://policies.google.com/privacy?hl=ja" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Google プライバシーポリシー</a></li>
              <li><a href="https://adssettings.google.com/authenticated" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Google 広告設定（パーソナライズ広告の管理）</a></li>
              <li><a href="https://policies.google.com/technologies/partner-sites?hl=ja" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Cookie によるGoogleの情報利用について</a></li>
            </ul>
            <p>ユーザーはブラウザの設定によりCookieを無効化することもできます。ただし、Cookieを無効化するとパーソナライズ広告が表示されなくなりますが、非パーソナライズ広告は引き続き表示される場合があります。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">3. Cookieについて</h2>
            <p>本サービス自身は独自のCookieを設定しません。ただし、第三者サービスであるGoogle AdSenseが広告配信の目的でCookieを使用します。詳細は上記「(4) 広告配信情報（Google AdSense）」をご参照ください。Vercel AnalyticsはCookieを使用しません。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">4. 第三者サービスへの情報提供</h2>
            <p>本サービスが利用する第三者サービスは以下のとおりです。</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-2 text-sm">
                <thead>
                  <tr className="border-b-2 border-green-800">
                    <th className="py-2 pr-2 text-left">サービス</th>
                    <th className="py-2 pr-2 text-left">目的</th>
                    <th className="py-2 pr-2 text-left">共有される情報</th>
                    <th className="py-2 text-left">データ保存先</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-2">Vercel Inc.</td>
                    <td className="py-2 pr-2">ホスティング・アクセス解析</td>
                    <td className="py-2 pr-2">ページ閲覧情報・パフォーマンス指標・ハッシュ化されたIP</td>
                    <td className="py-2">米国</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-2">Supabase Inc.</td>
                    <td className="py-2 pr-2">リアルタイム共有機能</td>
                    <td className="py-2 pr-2">ゲーム状態（共有機能有効時のみ）</td>
                    <td className="py-2">米国</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-2">Google LLC</td>
                    <td className="py-2 pr-2">広告配信（Google AdSense）</td>
                    <td className="py-2 pr-2">Cookie・広告インタラクション情報・閲覧履歴</td>
                    <td className="py-2">米国</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">上記以外の第三者にユーザー情報を販売・提供・開示することはありません。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">5. 収集しない情報</h2>
            <p>本サービスでは以下の情報は一切収集しません。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>ユーザーアカウント・ログイン情報・メールアドレス・パスワード</li>
              <li>金融・決済情報（本サービスは完全無料です）</li>
              <li>Facebookピクセル等のソーシャルメディアトラッキング情報</li>
            </ul>

            <h2 className="text-xl font-bold text-green-800 mt-6">6. 未成年者の利用</h2>
            <p>本サービスは年齢確認を行っておりません。18歳未満の方は、保護者の同意のもとでご利用ください。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">7. 越境データ移転について</h2>
            <p>本サービスが利用するVercel Inc.、Supabase Inc.、およびGoogle LLCは米国に拠点を置きます。日本の個人情報保護法（改正個人情報保護法、2022年施行）に基づき、これらのサービスへの情報送信については、各社のプライバシーポリシーに基づく適切な保護措置が講じられています。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">8. お問い合わせ</h2>
            <p>本プライバシーポリシーに関するご質問・ご意見は、<a href={CONTACT_FORM_URL} className="text-green-700 underline" target="_blank" rel="noopener noreferrer">お問い合わせフォーム</a>よりご連絡ください。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">9. プライバシーポリシーの変更</h2>
            <p>本ポリシーは、法令改正やサービス内容の変更に応じて予告なく改定する場合があります。重要な変更を行った場合は、本ページに最終更新日を記載します。改定後のポリシーは掲載された時点から効力を生じます。</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:underline">トップページに戻る</Link>
        </div>
      </div>
    </div>
  );
}
