import { fetchPosts, categorizePost, WPPost } from '@/lib/wordpress';
import { PostCardLarge, PostCardSmall } from '@/components/PostCard';
import CategorySection from '@/components/CategorySection';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import Sidebar from '@/components/Sidebar';
import LoadMoreButton from '@/components/LoadMoreButton';
import LastUpdated from '@/components/LastUpdated';
import { formatRelativeDate, getFallbackImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';


export const revalidate = 300;

export default async function HomePage() {
  const posts = await fetchPosts(20); // Reduced to avoid cache size issues

  const categories: Record<string, WPPost[]> = {
    australia: [],
    business: [],
    china: [],
    international: [],
  };

  // Categorize all posts
  for (const post of posts) {
    const cat = categorizePost(post);
    if (categories[cat]) {
      categories[cat].push(post);
    }
  }

  // Take the most recent posts for different sections
  const featuredPost = posts[0];
  const heroSecondaryPosts = posts.slice(1, 3);
  const latestNewsPosts = posts.slice(0, 10);

  // Get 5 posts per category for sections (featured + 4 small)
  Object.keys(categories).forEach(cat => {
    categories[cat] = categories[cat].slice(0, 5);
  });

  return (
    <>
      {/* Breaking News Ticker */}
      <BreakingNewsTicker posts={posts} />

      {/* Octopus Magazine Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <a href="https://ac878.com.au/magazine-octopus/" target="_blank" rel="noopener noreferrer" className="block">
          <Image
            src="https://ac878.com.au/wp-content/uploads/2026/02/ISSUE157_0220-scaled.jpg"
            alt="八爪娱 Octopus Magazine Issue 157"
            width={1920}
            height={500}
            className="w-full h-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            priority
          />
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Last Updated Timestamp */}
        <div className="mb-6 flex justify-center">
          <LastUpdated />
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section - Featured story full width */}
            <section className="mb-12">
              <FeaturedPostCard post={featuredPost} />
            </section>

            {/* Latest News Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-accent rounded-full"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">最新新闻</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Latest News</p>
                  </div>
                </div>
                <Link
                  href="/search"
                  className="text-accent hover:text-accent-dark font-medium text-sm transition-colors"
                >
                  查看更多 →
                </Link>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="space-y-4">
                  {latestNewsPosts.map((post, index) => (
                    <LatestNewsItem key={post.id} post={post} index={index} />
                  ))}
                </div>
              </div>
            </section>

            {/* Category Sections */}
            <div className="space-y-12">
              <CategorySectionEnhanced 
                id="australia" 
                title="澳洲新闻" 
                subtitle="Australian News" 
                posts={categories.australia} 
                category="australia"
              />
              <CategorySectionEnhanced 
                id="business" 
                title="财经新闻" 
                subtitle="Business & Finance" 
                posts={categories.business}
                category="business"
              />
              <CategorySectionEnhanced 
                id="china" 
                title="中港新闻" 
                subtitle="Mainland China & HK News" 
                posts={categories.china}
                category="china"
              />
              <CategorySectionEnhanced 
                id="international" 
                title="国际新闻" 
                subtitle="International News" 
                posts={categories.international}
                category="international"
              />
            </div>

            {/* Load More Section */}
            <section className="mt-12">
              <div className="text-center">
                <LoadMoreButton category="all" />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar posts={posts} />
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '878时讯 | AC878 News',
            alternateName: '878时讯',
            url: 'https://news.ac878.com.au',
            publisher: {
              '@type': 'Organization',
              name: 'AC878 Media Group Pty Ltd',
              logo: {
                '@type': 'ImageObject',
                url: 'https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png',
              },
            },
          }),
        }}
      />
    </>
  );
}

// Featured Post Card for Hero Section
function FeaturedPostCard({ post }: { post: WPPost }) {
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || getFallbackImageUrl();
  
  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 75vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <time className="text-sm font-medium bg-accent px-2 py-1 rounded-md mb-2 inline-block">
              {formatRelativeDate(post.date)}
            </time>
            <h1
              className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-gray-200 transition-colors line-clamp-3"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

// Secondary Post Card for Hero Section
function SecondaryPostCard({ post }: { post: WPPost }) {
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || getFallbackImageUrl();
  
  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="33vw"
          />
        </div>
        <div className="p-4">
          <time className="text-xs text-gray-400 dark:text-gray-500">
            {formatRelativeDate(post.date)}
          </time>
          <h2
            className="mt-2 font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2 text-gray-900 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </div>
      </article>
    </Link>
  );
}

// Latest News Item
function LatestNewsItem({ post, index }: { post: WPPost; index: number }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-medium group-hover:text-accent transition-colors line-clamp-2 text-gray-900 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <time className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">
            {formatRelativeDate(post.date)}
          </time>
        </div>
      </article>
    </Link>
  );
}

// Enhanced Category Section
function CategorySectionEnhanced({ 
  id, 
  title, 
  subtitle, 
  posts, 
  category 
}: { 
  id: string; 
  title: string; 
  subtitle: string; 
  posts: WPPost[]; 
  category: string;
}) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-accent rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">{subtitle}</p>
          </div>
        </div>
        <Link
          href={`/category/${category}`}
          className="text-accent hover:text-accent-dark font-medium text-sm transition-colors"
        >
          查看全部 →
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <PostCardLarge post={featured} />
        <div className="space-y-3">
          {rest.map((post) => (
            <PostCardSmall key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
