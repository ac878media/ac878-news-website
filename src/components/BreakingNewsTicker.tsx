'use client';

import { WPPost, stripHtml } from '@/lib/wordpress';
import Link from 'next/link';

interface Props {
  posts: WPPost[];
}

export default function BreakingNewsTicker({ posts }: Props) {
  if (posts.length === 0) return null;

  // Take the most recent 8 posts for the ticker
  const tickerPosts = posts.slice(0, 8);

  return (
    <div className="bg-black text-white py-2 overflow-hidden relative border-b border-accent">
      <div className="flex items-center">
        <div className="bg-accent px-3 md:px-4 py-1 text-xs md:text-sm font-bold flex-shrink-0 z-10 rounded-r">
          <span className="flex items-center gap-1 md:gap-2">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">最新</span>
            <span className="sm:hidden">新</span>
          </span>
        </div>
        <div className="flex-1 relative overflow-hidden ml-2 md:ml-4">
          <div className="ticker-wrapper">
            <div className="ticker-content">
              {/* Duplicate the content to create seamless loop */}
              {[...tickerPosts, ...tickerPosts].map((post, index) => (
                <Link
                  key={`${post.id}-${index}`}
                  href={`/post/${post.slug}`}
                  className="ticker-item text-white hover:text-accent transition-colors text-sm md:text-base"
                >
                  {stripHtml(post.title.rendered)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}