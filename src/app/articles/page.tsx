'use client';

import { useState, useEffect } from 'react';
import { fetchPosts, WPPost } from '@/lib/wordpress';
import { PostCardLarge } from '@/components/PostCard';
import { PostCardSkeleton } from '@/components/SkeletonLoader';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ArticlesPage() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const newPosts = await fetchPosts(18, pageNum);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  const handleLoadMore = () => {
    loadPosts(page + 1, true);
  };

  const breadcrumbs = [
    { label: '首页', href: '/' },
    { label: '全部新闻' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-12 bg-accent rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold">全部新闻</h1>
            <p className="text-gray-500 text-lg">All News</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCardLarge key={post.id} post={post} />
            ))}
          </div>

          {loadingMore && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          )}

          {hasMore && !loadingMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-3 px-8 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                加载更多
              </button>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">已显示全部内容</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
