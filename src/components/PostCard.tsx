import Image from 'next/image';
import Link from 'next/link';
import { WPPost, getPostImage, stripHtml } from '@/lib/wordpress';
import { formatRelativeDate, getFallbackImageUrl, calculateReadingTime, formatReadingTime } from '@/lib/utils';

export function PostCardLarge({ post }: { post: WPPost }) {
  const image = getPostImage(post) || getFallbackImageUrl();
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 150);
  const readingTime = calculateReadingTime(post.content.rendered);

  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={stripHtml(post.title.rendered)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-2">
            <time>{formatRelativeDate(post.date)}</time>
            <span>•</span>
            <span>{formatReadingTime(readingTime)}</span>
          </div>
          <h3
            className="text-lg font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2 text-gray-900 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          {excerpt && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{excerpt}</p>}
        </div>
      </article>
    </Link>
  );
}

export function PostCardSmall({ post }: { post: WPPost }) {
  const image = getPostImage(post) || getFallbackImageUrl();
  const readingTime = calculateReadingTime(post.content.rendered);

  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="flex gap-4 bg-white dark:bg-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={stripHtml(post.title.rendered)}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
            <time>{formatRelativeDate(post.date)}</time>
            <span>•</span>
            <span>{formatReadingTime(readingTime)}</span>
          </div>
          <h4
            className="text-sm font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-3 text-gray-900 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </div>
      </article>
    </Link>
  );
}
