/**
 * Format date with Chinese relative time for recent posts
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
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
    day: 'numeric'
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

const FALLBACK_IMAGE = 'https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png';

/**
 * Get fallback image URL — category-aware with variety
 * Uses post ID to deterministically pick different images
 */
export function getFallbackImageUrl(category?: string, postId?: number): string {
  return FALLBACK_IMAGE;
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
