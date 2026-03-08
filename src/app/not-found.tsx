import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <Image
            src="https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png"
            alt="AC878"
            width={120}
            height={120}
            className="rounded-xl mx-auto mb-6 opacity-50"
          />
          <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">页面未找到</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          抱歉，您访问的页面不存在或已被移动。
          <br />
          请检查网址是否正确，或返回首页浏览最新新闻。
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V11a1 1 0 011-1h2a1 1 0 011 1v10m0 0h3a1 1 0 001-1V10M9 21h6" />
            </svg>
            返回首页
          </Link>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-accent hover:text-accent rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              搜索新闻
            </Link>
            
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-accent hover:text-accent rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              关于我们
            </Link>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>如果问题持续存在，您可以尝试：</p>
          <ul className="mt-2 space-y-1 text-left inline-block">
            <li>• 刷新页面</li>
            <li>• 清除浏览器缓存</li>
            <li>• 检查网络连接</li>
            <li>• 稍后重试</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
