import Link from 'next/link';
import Image from 'next/image';
import { WPPost, stripHtml, getPostImage } from '@/lib/wordpress';
import { formatRelativeDate } from '@/lib/utils';
import Newsletter from './Newsletter';
import WeatherWidget from './WeatherWidget';

interface Props {
  posts: WPPost[];
}

export default function Sidebar({ posts }: Props) {
  // Mock "Most Read" - in a real app, this would come from analytics
  const mostReadPosts = posts.slice(0, 5);

  return (
    <aside className="space-y-8">
      {/* Weather Widget */}
      <WeatherWidget />
      
      {/* Most Read Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-accent rounded-full"></div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">热门新闻</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">Most Read</p>
          </div>
        </div>
        <div className="space-y-4">
          {mostReadPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="group block"
            >
              <article className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-medium leading-tight group-hover:text-accent transition-colors line-clamp-2 text-gray-900 dark:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <time className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                    {formatRelativeDate(post.date)}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Listen Widget */}
      <div className="bg-gradient-to-br from-accent to-accent-dark rounded-xl p-6 text-white shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2">新闻收听</h3>
          <p className="text-white text-opacity-90 text-sm mb-4">
            收听我们的每日新闻播报
          </p>
          <Link
            href="/listen"
            className="inline-flex items-center justify-center w-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors rounded-lg py-2 px-4 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            立即收听
          </Link>
        </div>
      </div>

      {/* About AC878 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="text-center">
          <Image
            src="https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png"
            alt="AC878 Logo"
            width={80}
            height={80}
            className="rounded-lg mx-auto mb-4"
          />
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">关于 AC878</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
            878时讯是澳洲华语新闻门户，为华人社区提供及时、准确的新闻资讯，涵盖澳洲本地、商业、中港及国际新闻。
          </p>
          <Link
            href="/about"
            className="inline-flex items-center text-accent hover:text-accent-dark font-medium text-sm transition-colors"
          >
            了解更多
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Newsletter Signup */}
      <Newsletter />

      {/* Quick Links */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">快速导航</h3>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/category/australia"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-accent transition-colors p-2 rounded hover:bg-white dark:hover:bg-gray-600"
          >
            澳洲新闻
          </Link>
          <Link
            href="/category/business"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-accent transition-colors p-2 rounded hover:bg-white dark:hover:bg-gray-600"
          >
            财经新闻
          </Link>
          <Link
            href="/category/china"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-accent transition-colors p-2 rounded hover:bg-white dark:hover:bg-gray-600"
          >
            中港新闻
          </Link>
          <Link
            href="/category/international"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-accent transition-colors p-2 rounded hover:bg-white dark:hover:bg-gray-600"
          >
            国际新闻
          </Link>
        </div>
      </div>
    </aside>
  );
}