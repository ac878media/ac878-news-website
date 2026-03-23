import { 
  fetchPostBySlug, 
  fetchPosts, 
  stripHtml, 
  getPostImage, 
  fetchRelatedPosts,
  fetchAdjacentPosts, 
  categorizePost,
  getBreadcrumbs 
} from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';

import Link from 'next/link';
import { formatRelativeDate, formatFullDate, getFallbackImageUrl, calculateReadingTime, formatReadingTime } from '@/lib/utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import { PostCardLarge } from '@/components/PostCard';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return {};

  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const image = getPostImage(post);

  return {
    title: `${title} | 878时讯`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.date,
      images: image ? [{ url: image }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export async function generateStaticParams() {
  // Reduce the number of posts to avoid cache size issues
  const posts = await fetchPosts(10);
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const title = stripHtml(post.title.rendered);
  const category = categorizePost(post);
  const image = getPostImage(post) || getFallbackImageUrl(category, post.id);
  const breadcrumbs = getBreadcrumbs(category, title);
  const readingTime = calculateReadingTime(post.content.rendered);
  
  // Get related posts
  const relatedPosts = await fetchRelatedPosts(post, 4);
  const { prev, next } = await fetchAdjacentPosts(post);

  // Clean content: remove social share widgets
  let cleanContent = post.content.rendered
    .replace(/<div[^>]*class="[^"]*xs_social_share[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*xs_social[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Fix single-paragraph posts: split on double newlines within <p> tags
  cleanContent = cleanContent.replace(/<p>([\s\S]*?)<\/p>/g, (match, inner) => {
    if (inner.includes('\n\n')) {
      const parts = inner.split(/\n\n+/).filter((s: string) => s.trim());
      if (parts.length > 1) {
        return parts.map((p: string) => `<p>${p.trim()}</p>`).join('\n');
      }
    }
    return match;
  });

  const currentUrl = `https://news.ac878.com.au/post/${slug}`;

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link 
              href={`/category/${category}`}
              className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-accent-dark transition-colors"
            >
              {category === 'australia' && '澳洲新闻'}
              {category === 'business' && '财经新闻'}
              {category === 'china' && '中港新闻'}
              {category === 'international' && '国际新闻'}
            </Link>
            <span>•</span>
            <time title={formatFullDate(post.date)}>
              {formatRelativeDate(post.date)}
            </time>
            <span>•</span>
            <span>{formatReadingTime(readingTime)}</span>
          </div>
          
          <h1
            className="text-3xl md:text-4xl font-bold leading-tight mb-6 text-gray-900 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          {/* Share Buttons */}
          <ShareButtons url={currentUrl} title={title} className="mb-6" />
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="prose-content text-lg leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              发布时间：{formatFullDate(post.date)}
            </div>
            <ShareButtons url={currentUrl} title={title} />
          </div>
        </footer>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: title,
              datePublished: post.date,
              dateModified: post.date,
              image: image,
              publisher: {
                '@type': 'Organization',
                name: 'AC878 Media Group Pty Ltd',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': currentUrl,
              },
              author: {
                '@type': 'Organization',
                name: '878时讯编辑部',
              },
              description: stripHtml(post.excerpt.rendered),
            }),
          }}
        />
      </article>

      {/* Prev/Next Navigation */}
      <nav className="max-w-4xl mx-auto px-4 py-6" aria-label="文章导航">
        <div className="grid grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/post/${prev.slug}`}
              className="group flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mt-0.5 text-gray-400 group-hover:text-accent transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="min-w-0">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">上一篇</span>
                <h4
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors line-clamp-2 mt-1"
                  dangerouslySetInnerHTML={{ __html: prev.title.rendered }}
                />
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/post/${next.slug}`}
              className="group flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-right justify-end"
            >
              <div className="min-w-0">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">下一篇</span>
                <h4
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors line-clamp-2 mt-1"
                  dangerouslySetInnerHTML={{ __html: next.title.rendered }}
                />
              </div>
              <svg className="w-5 h-5 mt-0.5 text-gray-400 group-hover:text-accent transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-accent rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">相关新闻</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500">Related Articles</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <PostCardLarge key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href={`/category/${category}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              查看更多相关新闻
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}