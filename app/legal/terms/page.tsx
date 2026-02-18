import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">利用規約</h1>
          <p className="text-sm text-gray-500 mb-6">最終更新日：2026年2月</p>

          <div className="space-y-4 text-gray-700">
            <p>この利用規約（以下「本規約」といいます）は、Pokerchip.jp（以下「本サービス」といいます）の利用条件を定めるものです。本サービスをご利用いただくことで、本規約に同意したものとみなします。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">第1条（適用）</h2>
            <p>本規約は、ユーザーと本サービス運営者との間における本サービスの利用に関わる一切の関係に適用されます。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">第2条（本サービスの目的と性質）</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>本サービスは、ユーザーが現物のトランプカードを用いたテキサス・ホールデム形式のポーカーを娯楽目的でプレイする際に、仮想チップの枚数管理・ベット管理・ゲーム進行の補助を行うためのツールです。</li>
              <li>本サービスは、カードの配布・役の判定・対戦相手とのマッチングなどのゲームプレイ機能を提供しません。</li>
              <li>本サービスは完全無料です。課金要素・有料プランは一切存在しません。本サービスはGoogle AdSenseによる広告を表示する場合があります。</li>
            </ol>

            <h2 className="text-xl font-bold text-green-800 mt-6">第3条（禁止事項）</h2>
            <p>ユーザーは本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>金銭、またはその他一切の財産的価値を有するもの（換金性のある景品・暗号資産・その他財物を含みます）を賭ける行為（賭博行為）</li>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為またはそれを助長する行為</li>
              <li>本サービスのサーバー・ネットワーク・システムに対する不正アクセス・妨害・破壊行為</li>
              <li>共有機能を利用して、他のユーザーの個人情報等を収集・蓄積する行為</li>
              <li>本サービスを営利目的で無断複製・転用・販売する行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ol>
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 mt-4">
              <p className="font-bold text-red-800">賭博に関する重要な注意事項</p>
              <p className="text-red-700 mt-1">日本の刑法第185条（賭博罪）・第186条（常習賭博罪・賭博場開帳等図利罪）により、金銭等の財物を賭ける行為は刑事罰の対象となります。本サービスは娯楽目的のチップ管理ツールであり、いかなる形での賭博行為にも利用しないでください。</p>
            </div>

            <h2 className="text-xl font-bold text-green-800 mt-6">第4条（共有機能の利用）</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>本サービスの共有（観戦）機能は、ホストが明示的に有効にした場合にのみ動作します。</li>
              <li>共有機能を使用する際、ゲームデータ（プレイヤー名・チップ数等）は第三者が閲覧可能な状態になります。プレイヤー名に個人を特定できる情報を使用しないことを推奨します。</li>
              <li>共有機能を通じた情報漏洩・プライバシー侵害等については、ユーザー自身の判断と責任のもとで利用するものとし、運営者は一切の責任を負いません。</li>
            </ol>

            <h2 className="text-xl font-bold text-green-800 mt-6">第5条（免責事項）</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>本サービスの利用によってユーザーに生じたいかなる損害（チップ計算のエラー、サービス停止等による損害を含む）についても、運営者は一切の責任を負いません。</li>
              <li>本サービスの内容の正確性・完全性・特定目的への適合性を保証するものではありません。</li>
              <li>ユーザー間のトラブルに関して、運営者は一切関与せず、責任を負いません。</li>
              <li>運営者は、予告なく本サービスの内容変更・中断・終了を行うことができます。これによりユーザーに損害が生じた場合でも、運営者は責任を負いません。</li>
              <li>本サービスからリンクされる外部サイトの内容・安全性について、運営者は一切保証・責任を負いません。</li>
            </ol>

            <h2 className="text-xl font-bold text-green-800 mt-6">第6条（知的財産権）</h2>
            <p>本サービスのデザイン・コード・テキスト等に関する知的財産権は運営者または正当な権利者に帰属します。ユーザーは、私的利用の範囲を超えて無断で複製・転用することはできません。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">第7条（規約の変更）</h2>
            <p>運営者は、必要と判断した場合には、ユーザーへの事前通知なく本規約を変更することができます。変更後の規約は本サービス上に掲載された時点から効力を生じます。重要な変更については可能な限り事前に告知します。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">第8条（準拠法・管轄裁判所）</h2>
            <p>本規約の解釈にあたっては日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する日本の裁判所を専属的合意管轄とします。</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:underline">トップページに戻る</Link>
        </div>
      </div>
    </div>
  );
}
