import { notFound } from 'next/navigation';
import { fetchPostsByCategory, getCategoryDisplayName, getBreadcrumbs } from '@/lib/wordpress';
import { PostCardLarge } from '@/components/PostCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import LoadMoreButton from '@/components/LoadMoreButton';

export const revalidate = 300;

const validCategories = ['australia', 'business', 'china', 'international'];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return validCategories.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  if (!validCategories.includes(slug)) {
    return {
      title: '分类未找到',
      description: '请求的分类不存在',
    };
  }

  const categoryName = getCategoryDisplayName(slug);
  
  return {
    title: `${categoryName.zh} | 878时讯`,
    description: `${categoryName.zh} - ${categoryName.en}。878时讯为您提供最新的${categoryName.zh}资讯。`,
    openGraph: {
      title: `${categoryName.zh} | 878时讯`,
      description: `最新${categoryName.zh}资讯`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  if (!validCategories.includes(slug)) {
    notFound();
  }

  const categoryName = getCategoryDisplayName(slug);
  const posts = await fetchPostsByCategory(slug, 12);
  const breadcrumbs = getBreadcrumbs(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-12 bg-accent rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold">{categoryName.zh}</h1>
            <p className="text-gray-500 text-lg">{categoryName.en}</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl">
          {getCategoryDescription(slug)}
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCardLarge key={post.id} post={post} />
            ))}
          </div>

          {/* Load More Button */}
          <LoadMoreButton category={slug} />
        </>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146.832-5.657 2.343m0 0L3 20.657M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无新闻</h3>
          <p className="text-gray-600">
            {categoryName.zh}分类下暂时没有新闻内容，请稍后再来查看。
          </p>
        </div>
      )}
    </div>
  );
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    australia: '涵盖澳大利亚本地新闻、政治、社会、移民等各类澳洲本土资讯，为华人社区提供最新的澳洲动态。',
    business: '关注澳洲及全球财经动态，包括股市行情、经济政策、房地产市场、投资理财等商业资讯。',
    china: '报道中国大陆、香港、澳门的最新新闻动态，涵盖政治、经济、社会、文化等各个领域。',
    international: '聚焦全球重大新闻事件，包括国际政治、经济、军事、科技等国际新闻资讯。',
  };
  return descriptions[category] || '';
}