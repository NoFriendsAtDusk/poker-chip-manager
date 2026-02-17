import Link from 'next/link';

const CONTACT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScs6aXmueolWblaJV77fNdV5jqzc8Guvb1uMrD0haJBoKc2-g/viewform?usp=publish-editor';

export default function SpecifiedCommercialTransactionsPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">特定商取引法に基づく表記</h1>

          <div className="space-y-4 text-gray-700">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">注記：本サービスは完全無料であり、いかなる課金・販売・有償サービスも提供しておりません。特定商取引法（特定商取引に関する法律）は原則として有償の取引に適用されますが、透明性の確保と利用者への情報提供を目的として、本ページを設置しております。</p>
            </div>

            <table className="w-full border-collapse mt-4">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold w-1/3">販売業者の名称</td>
                  <td className="py-3">Pokerchip.jp管理人</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">所在地・電話番号</td>
                  <td className="py-3">請求があった場合、以下のお問い合わせ先より連絡ください。遅滞なくメールにて開示いたします。</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">販売価格</td>
                  <td className="py-3">無料（本サービスに有償サービスは一切ありません）</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">追加費用</td>
                  <td className="py-3">なし</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">決済手段</td>
                  <td className="py-3">該当なし（無料サービスのため）</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">役務の提供時期</td>
                  <td className="py-3">該当なし（無料サービスのため）</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">キャンセル・返金</td>
                  <td className="py-3">該当なし（無料サービスのため）</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-semibold">お問い合わせ先</td>
                  <td className="py-3">
                    <a href={CONTACT_FORM_URL} className="text-green-700 underline" target="_blank" rel="noopener noreferrer">お問い合わせフォーム</a>
                  </td>
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
