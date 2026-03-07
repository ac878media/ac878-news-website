'use client';

import { useState } from 'react';
import { fetchPostsByCategory, WPPost } from '@/lib/wordpress';
import { PostCardLarge } from '@/components/PostCard';
import { PostCardSkeleton } from '@/components/SkeletonLoader';

interface Props {
  category: string;
  initialPage?: number;
}

export default function LoadMoreButton({ category, initialPage = 2 }: Props) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);
    try {
      let newPosts;
      if (category === 'all') {
        // For homepage, load all posts
        const { fetchPosts } = await import('@/lib/wordpress');
        newPosts = await fetchPosts(12, page);
      } else {
        newPosts = await fetchPostsByCategory(category, 12, page);
      }
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMore && posts.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Additional Posts */}
      {posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <PostCardLarge key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-3 px-8 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                加载中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                加载更多
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">已显示全部内容</p>
        </div>
      )}
    </div>
  );
}