/**
 * Fix HTML Display Issue - Clean WordPress block markup
 * 
 * The issue: WordPress block editor generates complex HTML structures with
 * class names and nested divs that are being rendered raw on the frontend
 * 
 * This script adds HTML sanitization to prevent raw block markup from showing
 */

const fs = require('fs');
const path = require('path');

// 1. Create HTML sanitizer utility
const sanitizerCode = `/**
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
    .replace(/<div class="xs_social_share_widget[^>]*>.*?<\/div>/gis, '')
    
    // Clean up multiple consecutive divs
    .replace(/(<\/div>)\s*(<div[^>]*>)/gi, '$1\\n$2')
    
    // Remove empty paragraphs and divs
    .replace(/<p>\\s*<\/p>/gi, '')
    .replace(/<div>\\s*<\/div>/gi, '');
    
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
    .replace(/&#8216;/g, ''')
    .replace(/&#8217;/g, ''')
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
    .replace(/<br\\s*\/?>/gi, '\\n')  // Convert br to newlines
    .replace(/<\/p>/gi, '\\n\\n')     // Convert p endings to double newlines
    .replace(/<[^>]*>/g, '')          // Remove all HTML tags
    .replace(/\\s+/g, ' ')            // Normalize whitespace
    .trim();
    
  return textOnly;
}
`;

fs.writeFileSync(path.join(__dirname, 'src/lib/sanitize.ts'), sanitizerCode);

// 2. Update the main page component to use sanitization
const pageComponentPath = path.join(__dirname, 'src/app/page.tsx');
let pageContent = fs.readFileSync(pageComponentPath, 'utf8');

// Add sanitization import
if (!pageContent.includes('sanitizeTitle')) {
  pageContent = pageContent.replace(
    `import { formatRelativeDate, getFallbackImageUrl } from '@/lib/utils';`,
    `import { formatRelativeDate, getFallbackImageUrl } from '@/lib/utils';
import { sanitizeTitle, sanitizeWordPressContent } from '@/lib/sanitize';`
  );
}

// Replace dangerouslySetInnerHTML with sanitized versions
pageContent = pageContent
  // Replace title rendering with sanitized version
  .replace(
    /dangerouslySetInnerHTML=\{\{ __html: post\.title\.rendered \}\}/g,
    'dangerouslySetInnerHTML={{ __html: sanitizeTitle(post.title.rendered) }}'
  )
  // Also create a safe title prop for cases where we don't want HTML at all
  .replace(
    /<h1[^>]*dangerouslySetInnerHTML=\{\{ __html: sanitizeTitle\(post\.title\.rendered\) \}\}/g,
    `<h1
              className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-gray-200 transition-colors line-clamp-3"
            >
              {sanitizeTitle(post.title.rendered)}
            </h1>`
  )
  .replace(
    /<h2[^>]*dangerouslySetInnerHTML=\{\{ __html: sanitizeTitle\(post\.title\.rendered\) \}\}/g,
    `<h2
            className="mt-2 font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2 text-gray-900 dark:text-gray-100"
          >
            {sanitizeTitle(post.title.rendered)}
          </h2>`
  )
  .replace(
    /<h3[^>]*dangerouslySetInnerHTML=\{\{ __html: sanitizeTitle\(post\.title\.rendered\) \}\}/g,
    `<h3
            className="font-medium group-hover:text-accent transition-colors line-clamp-2 text-gray-900 dark:text-gray-100"
          >
            {sanitizeTitle(post.title.rendered)}
          </h3>`
  );

fs.writeFileSync(pageComponentPath, pageContent);

// 3. Update PostCard components to use sanitization
const postCardPath = path.join(__dirname, 'src/components/PostCard.tsx');
if (fs.existsSync(postCardPath)) {
  let postCardContent = fs.readFileSync(postCardPath, 'utf8');
  
  // Add sanitization import if not present
  if (!postCardContent.includes('sanitizeTitle')) {
    postCardContent = postCardContent.replace(
      `import { formatRelativeDate, getFallbackImageUrl } from '@/lib/utils';`,
      `import { formatRelativeDate, getFallbackImageUrl } from '@/lib/utils';
import { sanitizeTitle } from '@/lib/sanitize';`
    );
  }
  
  // Replace all title renderings with sanitized versions
  postCardContent = postCardContent
    .replace(
      /dangerouslySetInnerHTML=\{\{ __html: post\.title\.rendered \}\}/g,
      'children={sanitizeTitle(post.title.rendered)}'
    );
    
  fs.writeFileSync(postCardPath, postCardContent);
}

console.log('✅ HTML display fix applied!');
console.log('Fixed issues:');
console.log('- Added HTML sanitization for WordPress block markup');
console.log('- Cleaned up title rendering to prevent raw HTML display'); 
console.log('- Removed complex Gutenberg block classes');
console.log('- Added safe text extraction utilities');
console.log('');
console.log('🔄 Restart the Next.js development server to see changes');