/**
 * Format date with Chinese relative time for recent posts
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  // Recent posts (less than 24 hours) show relative time
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes < 1 ? '刚刚' : `${diffMinutes}分钟前`;
  }
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }

  // Older posts show full date
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format full date in Chinese style
 */
export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Truncate text with proper handling of Chinese characters
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const lastChinese = Math.max(
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('，'),
    truncated.lastIndexOf('、')
  );
  
  const cutPoint = Math.max(lastSpace, lastChinese);
  return cutPoint > maxLength * 0.8 
    ? truncated.slice(0, cutPoint) + '...'
    : truncated + '...';
}

/**
 * Category-specific fallback images from Unsplash (free, high quality)
 * Multiple images per category for visual variety
 */
const CATEGORY_IMAGES: Record<string, string[]> = {
  australia: [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=450&fit=crop', // Sydney Opera House
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=450&fit=crop', // Melbourne
    'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&h=450&fit=crop', // Sydney harbour
    'https://images.unsplash.com/photo-1494233892892-84542a694e72?w=800&h=450&fit=crop', // Australian landscape
    'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=800&h=450&fit=crop', // Australian city
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop', // Stock market
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop', // Finance charts
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop', // Business buildings
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop', // Business meeting
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop', // Data analytics
  ],
  china: [
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=450&fit=crop', // Shanghai skyline
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=450&fit=crop', // Beijing
    'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&h=450&fit=crop', // Hong Kong
    'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=450&fit=crop', // Chinese temple
    'https://images.unsplash.com/photo-1474181628612-0dbea49e78e5?w=800&h=450&fit=crop', // Hong Kong night
  ],
  international: [
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&h=450&fit=crop', // World map
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop', // Globe digital
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop', // Technology
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop', // Conference
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&h=450&fit=crop', // Diplomacy
  ],
};

/**
 * Get fallback image URL — category-aware with variety
 * Uses post ID to deterministically pick different images
 */
export function getFallbackImageUrl(category?: string, postId?: number): string {
  const cat = category || 'australia';
  const images = CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.australia;
  const index = postId ? (postId % images.length) : 0;
  return images[index];
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Generate WhatsApp share URL
 */
export function getWhatsAppShareUrl(url: string, title: string): string {
  const text = `${title} ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Generate WeChat QR code URL (using QR code generator)
 */
export function getWeChatQRUrl(url: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
}

/**
 * Calculate reading time based on CJK character count
 * Average reading speed: 300 characters/minute for Chinese
 */
export function calculateReadingTime(content: string): number {
  // Strip HTML tags first
  const textContent = content.replace(/<[^>]*>/g, '');
  
  // Count characters (CJK characters count as 1 each)
  const charCount = textContent.length;
  
  // Average reading speed: 300 chars/min for Chinese
  const readingTime = Math.ceil(charCount / 300);
  
  // Minimum 1 minute
  return Math.max(1, readingTime);
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes}分钟阅读`;
}