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
 * Get fallback image URL
 */
export function getFallbackImageUrl(): string {
  return 'https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png';
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