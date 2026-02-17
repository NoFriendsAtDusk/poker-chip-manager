import Link from 'next/link';

const CONTACT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScs6aXmueolWblaJV77fNdV5jqzc8Guvb1uMrD0haJBoKc2-g/viewform?usp=publish-editor';

export default function ContactPage() {
  return (
    <div className="min-h-screen poker-table">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">お問い合わせ</h1>

          <div className="space-y-4 text-gray-700">
            <p>ポーカーチップマネージャーに関するご質問・ご意見・不具合のご報告は、以下のお問い合わせフォームよりお送りください。</p>

            <div className="text-center py-6">
              <a
                href={CONTACT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-green-700 text-white text-lg font-bold rounded-lg hover:bg-green-800 transition-colors"
              >
                お問い合わせフォームを開く
              </a>
            </div>

            <p className="text-sm text-gray-500">※ お問い合わせへの回答にはお時間をいただく場合がございます。あらかじめご了承ください。</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:underline">トップページに戻る</Link>
        </div>
      </div>
    </div>
  );
}
