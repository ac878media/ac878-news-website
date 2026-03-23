const WP_API = 'https://ac878.com.au/wp-json/wp/v2';
const DAILY_NEWS_CAT = 5114;

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          medium_large?: { source_url: string };
          medium?: { source_url: string };
          full?: { source_url: string };
        };
      };
    }>;
  };
}

export function getFeaturedImage(post: WPPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  return (
    media.media_details?.sizes?.medium_large?.source_url ||
    media.media_details?.sizes?.medium?.source_url ||
    media.source_url ||
    null
  );
}

export function getFirstContentImage(content: string): string | null {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : null;
}

export function getPostImage(post: WPPost): string | null {
  return getFeaturedImage(post) || getFirstContentImage(post.content.rendered);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

export function categorizePost(post: WPPost): string {
  const title = post.title.rendered;
  const content = post.content.rendered;
  const text = title + ' ' + content;
  
  if (/财经|股市|经济|金融|ASX|市场|投资|银行|利率/.test(text)) return 'business';
  if (/中国|香港|澳门|北京|台湾|两岸|港澳/.test(text)) return 'china';
  if (/国际|全球|美国|欧洲|英国|日本|世界|联合国/.test(text)) return 'international';
  if (/澳洲|澳大利亚|悉尼|墨尔本|堪培拉|昆士兰|维州|新州/.test(text)) return 'australia';
  
  return 'australia';
}

export async function fetchPosts(perPage = 20, page = 1): Promise<WPPost[]> {
  const res = await fetch(
    `${WP_API}/posts?categories=${DAILY_NEWS_CAT}&per_page=${perPage}&page=${page}&_embed`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(
    `${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const posts = await res.json();
  return posts[0] || null;
}

export async function searchPosts(query: string, perPage = 10): Promise<WPPost[]> {
  const res = await fetch(
    `${WP_API}/posts?search=${encodeURIComponent(query)}&categories=${DAILY_NEWS_CAT}&per_page=${perPage}&_embed`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPostsByCategory(category: string, perPage = 10, page = 1): Promise<WPPost[]> {
  const posts = await fetchPosts(100); // Get more posts to filter by category
  const filteredPosts = posts.filter(post => categorizePost(post) === category);
  const start = (page - 1) * perPage;
  return filteredPosts.slice(start, start + perPage);
}

export async function fetchRelatedPosts(currentPost: WPPost, limit = 4): Promise<WPPost[]> {
  const category = categorizePost(currentPost);
  const posts = await fetchPostsByCategory(category, limit + 5);
  return posts.filter(post => post.id !== currentPost.id).slice(0, limit);
}

export async function fetchAdjacentPosts(currentPost: WPPost): Promise<{ prev: WPPost | null; next: WPPost | null }> {
  // Fetch the post published just before this one (older)
  const prevRes = await fetch(
    `${WP_API}/posts?categories=${DAILY_NEWS_CAT}&per_page=1&before=${currentPost.date}&orderby=date&order=desc&_embed`,
    { next: { revalidate: 300 } }
  );
  const prevPosts = prevRes.ok ? await prevRes.json() : [];
  
  // Fetch the post published just after this one (newer)
  const nextRes = await fetch(
    `${WP_API}/posts?categories=${DAILY_NEWS_CAT}&per_page=1&after=${currentPost.date}&orderby=date&order=asc&_embed`,
    { next: { revalidate: 300 } }
  );
  const nextPosts = nextRes.ok ? await nextRes.json() : [];
  
  return {
    prev: prevPosts[0] || null,
    next: nextPosts[0] || null,
  };
}

export function getCategoryDisplayName(category: string): { zh: string; en: string } {
  const categories: Record<string, { zh: string; en: string }> = {
    australia: { zh: '澳洲新闻', en: 'Australian News' },
    business: { zh: '财经新闻', en: 'Business & Finance' },
    china: { zh: '中港新闻', en: 'Mainland China & HK News' },
    international: { zh: '国际新闻', en: 'International News' },
  };
  return categories[category] || { zh: '澳洲新闻', en: 'Australian News' };
}

export function getBreadcrumbs(category?: string, postTitle?: string): Array<{ label: string; href?: string }> {
  const breadcrumbs: Array<{ label: string; href?: string }> = [{ label: '首页', href: '/' }];
  
  if (category) {
    const catName = getCategoryDisplayName(category);
    breadcrumbs.push({ label: catName.zh, href: `/category/${category}` });
  }
  
  if (postTitle) {
    breadcrumbs.push({ label: postTitle }); // No href for current page
  }
  
  return breadcrumbs;
}
