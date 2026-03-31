import { Suspense } from 'react';
import { PostCardSkeleton } from '@/components/SkeletonLoader';
import ArticlesContent from './ArticlesContent';

export const metadata = {
  title: '全部新闻 | 878时讯',
  description: '浏览878时讯所有新闻文章',
};

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">全部新闻</h1>
          <p className="text-gray-500 text-lg">All News</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <ArticlesContent />
    </Suspense>
  );
}
