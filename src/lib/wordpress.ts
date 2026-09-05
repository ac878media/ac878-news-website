const WP_API = 'https://ac878.com.au/wp-json/wp/v2';
const DAILY_NEWS_CAT = 5114;
const WP_FETCH_HEADERS = {
  'User-Agent': 'AC878-News-Portal/1.0 (+https://news.ac878.com.au)',
  'Accept': 'application/json',
};

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  tags?: number[];
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

export function cleanContent(content: string): string {
  // Remove any Next.js hydration data that might leak from WordPress
  let cleaned = content.replace(/self\.__next_f\.push\([^}]+}.*$/g, '');
  // Remove Yoast SEO head data if it appears in content
  cleaned = cleaned.replace(/<!-- This site is optimized with the Yoast SEO plugin[\s\S]*?-->/g, '');
  // Remove any stray script tags
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
  return cleaned.trim();
}

// Clean WordPress API response to remove problematic Yoast data and other problematic fields
export function cleanWPResponse(data: any): any {
  if (Array.isArray(data)) {
    return data.map(cleanWPResponse);
  }
  
  if (typeof data === 'object' && data !== null) {
    const cleaned = { ...data };
    
    const featuredMedia = cleaned._embedded?.['wp:featuredmedia']?.[0];
    const safeEmbedded = featuredMedia ? {
      'wp:featuredmedia': [{
        source_url: featuredMedia.source_url,
        alt_text: featuredMedia.alt_text,
        media_details: {
          sizes: {
            medium_large: featuredMedia.media_details?.sizes?.medium_large,
            medium: featuredMedia.media_details?.sizes?.medium,
            full: featuredMedia.media_details?.sizes?.full,
          },
        },
      }],
    } : undefined;

    // Remove all potentially problematic fields that might contain raw HTML/JSON
    const fieldsToRemove = [
      'yoast_head',
      'yoast_head_json', 
      '_embedded',
      '_links',
      'class_list',
      'meta',
      'categories'
    ];
    
    fieldsToRemove.forEach(field => {
      delete cleaned[field];
    });
    
    // Only keep essential fields for posts
    if (cleaned.type === 'post') {
      const essentialFields = {
        id: cleaned.id,
        date: cleaned.date,
        slug: cleaned.slug,
        title: cleaned.title,
        content: cleaned.content,
        excerpt: cleaned.excerpt,
        featured_media: cleaned.featured_media,
        categories: Array.isArray(cleaned.categories) ? cleaned.categories : [],
        tags: Array.isArray(cleaned.tags) ? cleaned.tags : [],
        author: cleaned.author,
        ...(safeEmbedded ? { _embedded: safeEmbedded } : {})
      };
      return essentialFields;
    }
    
    // For other objects, recursively clean
    Object.keys(cleaned).forEach(key => {
      if (typeof cleaned[key] === 'object') {
        cleaned[key] = cleanWPResponse(cleaned[key]);
      }
    });
    
    return cleaned;
  }
  
  return data;
}

export function categorizePost(post: WPPost): string {
  const title = stripHtml(post.title.rendered);
  const content = stripHtml(post.content.rendered);
  const text = `${title} ${content}`;
  const tags = new Set(post.tags || []);

  if (/中国|香港|澳门|北京|台湾|两岸|港澳|西藏|习近平|上合组织|上海合作组织/.test(title)) return 'china';
  if (/美国|华盛顿|白宫|特朗普|拜登|法国|欧洲|英国|德国|俄罗斯|乌克兰|伊朗|以色列|日本|韩国|尼泊尔|孟加拉国|印度|埃及|海湾|约旦河西岸|加沙|联合国/.test(title)) return 'international';
  if (/澳洲|澳大利亚|悉尼|墨尔本|堪培拉|昆士兰|维州|新州|阿尔巴尼斯/.test(title)) return 'australia';
  if (/财经|股市|经济|金融|ASX|市场|投资|银行|利率|通胀|澳元/.test(title)) return 'business';

  if ([112].some(tag => tags.has(tag))) return 'china';
  if ([1371, 5134].some(tag => tags.has(tag))) return 'international';
  if ([1581, 1583, 5128, 5135].some(tag => tags.has(tag))) return 'business';
  if ([1369, 5130, 5126, 5132, 54, 2491, 1810].some(tag => tags.has(tag))) return 'australia';

  if (/中国|香港|澳门|北京|台湾|两岸|港澳/.test(text)) return 'china';
  if (/国际|全球|美国|欧洲|英国|日本|世界|联合国|埃及|海湾|约旦河西岸|加沙/.test(text)) return 'international';
  if (/财经|股市|经济|金融|ASX|市场|投资|银行|利率/.test(text)) return 'business';
  if (/澳洲|澳大利亚|悉尼|墨尔本|堪培拉|昆士兰|维州|新州/.test(text)) return 'australia';

  return 'australia';
}

export async function fetchPosts(perPage = 20, page = 1): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WP_API}/posts?categories=${DAILY_NEWS_CAT}&per_page=${perPage}&page=${page}&_embed`,
      { headers: WP_FETCH_HEADERS, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return cleanWPResponse(data);
  } catch {
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(
    `${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed`,
    { headers: WP_FETCH_HEADERS, next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const posts = await res.json();
  if (!Array.isArray(posts)) return null;
  const cleanedPosts = cleanWPResponse(posts);
  return cleanedPosts[0] || null;
}

export async function searchPosts(query: string, perPage = 10): Promise<WPPost[]> {
  const res = await fetch(
    `${WP_API}/posts?search=${encodeURIComponent(query)}&categories=${DAILY_NEWS_CAT}&per_page=${perPage}&_embed`,
    { headers: WP_FETCH_HEADERS, next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return cleanWPResponse(data);
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
    { headers: WP_FETCH_HEADERS, next: { revalidate: 300 } }
  );
  const prevPosts = prevRes.ok ? cleanWPResponse(await prevRes.json()) : [];
  
  // Fetch the post published just after this one (newer)
  const nextRes = await fetch(
    `${WP_API}/posts?categories=${DAILY_NEWS_CAT}&per_page=1&after=${currentPost.date}&orderby=date&order=asc&_embed`,
    { headers: WP_FETCH_HEADERS, next: { revalidate: 300 } }
  );
  const nextPosts = nextRes.ok ? cleanWPResponse(await nextRes.json()) : [];
  
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
