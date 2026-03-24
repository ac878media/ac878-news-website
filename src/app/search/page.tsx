'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchPosts, fetchPosts, WPPost } from '@/lib/wordpress';
import { PostCardLarge } from '@/components/PostCard';
import { PostCardSkeleton } from '@/components/SkeletonLoader';
import Breadcrumbs from '@/components/Breadcrumbs';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [results, setResults] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      if (!searchQuery.trim()) {
        // No query — show all recent articles
        const allPosts = await fetchPosts(30, 1);
        setResults(allPosts);
        setSearched(true);
      } else {
        const searchResults = await searchPosts(searchQuery.trim(), 20);
        setResults(searchResults);
        setSearched(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams?.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    } else {
      // No query param — load all recent articles by default
      performSearch('');
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL without triggering a full page reload
    if (query.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', query.trim());
      window.history.replaceState({}, '', url.toString());
    }
  };

  const breadcrumbs = [
    { label: '首页', href: '/' },
    { label: '搜索' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">搜索新闻</h1>
        <p className="text-gray-600">在878时讯中搜索您感兴趣的新闻内容</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入关键词搜索新闻..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-shadow"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                搜索中...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                搜索
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Search Results */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && searched && (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              {query.trim() ? (
                <>
                  找到 <span className="font-semibold text-accent">{results.length}</span> 条相关结果
                  关于 &ldquo;<span className="font-semibold">{query}</span>&rdquo;
                </>
              ) : (
                <>
                  共 <span className="font-semibold text-accent">{results.length}</span> 条最新新闻
                </>
              )}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((post) => (
                <PostCardLarge key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146.832-5.657 2.343m0 0L3 20.657M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关结果</h3>
              <p className="text-gray-600 mb-4">
                抱歉，没有找到与 "{query}" 相关的新闻内容。
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">建议：</p>
                <ul className="space-y-1 text-left max-w-md mx-auto">
                  <li>• 检查关键词的拼写</li>
                  <li>• 尝试使用不同的关键词</li>
                  <li>• 使用更简短的搜索词</li>
                  <li>• 尝试搜索相关主题</li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {!searched && !loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">加载中...</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">搜索新闻</h1>
          <p className="text-gray-600">在878时讯中搜索您感兴趣的新闻内容</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}