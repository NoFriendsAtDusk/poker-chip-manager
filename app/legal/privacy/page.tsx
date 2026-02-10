import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">プライバシーポリシー</h1>

          <div className="space-y-4 text-gray-700">
            <p>本アプリ（以下「当アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">1. 収集する情報</h2>
            <p>当アプリはサーバーへのデータ送信を行いません。すべてのゲームデータはお使いのブラウザのローカルストレージにのみ保存されます。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">2. Cookie の使用</h2>
            <p>当アプリは必要最低限の Cookie のみを使用する場合があります。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">3. 第三者への提供</h2>
            <p>当アプリはユーザーの個人情報を第三者に提供することはありません。</p>

            <h2 className="text-xl font-bold text-green-800 mt-6">4. お問い合わせ</h2>
            <p>プライバシーに関するお問い合わせは、お問い合わせページよりご連絡ください。</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:underline">トップページに戻る</Link>
        </div>
      </div>
    </div>
  );
}
