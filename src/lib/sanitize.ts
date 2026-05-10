/**
 * HTML sanitization utilities for WordPress content
 */

/**
 * Clean WordPress block markup and complex HTML structures
 * Removes Gutenberg block classes and wrapper divs
 */
export function sanitizeWordPressContent(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Remove WordPress block wrapper classes and complex markup
  let cleaned = html
    // Remove wp-block wrappers with complex classes
    .replace(/<div class="wp-block-[^"]*"[^>]*>/gi, '<div>')
    .replace(/<div class="[^"]*wp-block-[^"]*"[^>]*>/gi, '<div>')
    .replace(/<div class="[^"]*is-layout-[^"]*"[^>]*>/gi, '<div>')
    
    // Clean up nested block containers
    .replace(/<div class="wp-block-group__inner-container[^"]*"[^>]*>/gi, '<div>')
    
    // Remove empty div wrappers that only contained block markup
    .replace(/<div>\s*<div>/gi, '<div>')
    .replace(/<\/div>\s*<\/div>/gi, '</div>')
    
    // Remove social share widgets and tracking elements
    .replace(/<div class="xs_social_share_widget[^>]*>[\s\S]*?<\/div>/gi, '')
    
    // Clean up multiple consecutive divs
    .replace(/(<\/div>)\s*(<div[^>]*>)/gi, '$1\n$2')
    
    // Remove empty paragraphs and divs
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/<div>\s*<\/div>/gi, '');
    
  return cleaned.trim();
}

/**
 * Sanitize title content - remove HTML tags but keep text
 */
export function sanitizeTitle(titleHtml: string): string {
  if (!titleHtml || typeof titleHtml !== 'string') return '';
  
  // Decode HTML entities first
  const decoded = titleHtml
    .replace(/&quot;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
    
  // Remove any remaining HTML tags
  return decoded.replace(/<[^>]*>/g, '').trim();
}

/**
 * Extract plain text from HTML content
 */
export function extractTextFromHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // First sanitize WordPress blocks
  const sanitized = sanitizeWordPressContent(html);
  
  // Then strip all remaining HTML tags
  const textOnly = sanitized
    .replace(/<br\s*\/?>/gi, '\n')  // Convert br to newlines
    .replace(/<\/p>/gi, '\n\n')     // Convert p endings to double newlines
    .replace(/<[^>]*>/g, '')          // Remove all HTML tags
    .replace(/\s+/g, ' ')            // Normalize whitespace
    .trim();
    
  return textOnly;
}