'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NavigationFix() {
  const router = useRouter();

  useEffect(() => {
    // Global click handler to ensure all internal links work
    // Catches cases where Next.js Link hydration fails silently
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;
      
      // Only handle internal links
      if (href.startsWith('/') && !href.startsWith('//')) {
        // Don't handle if modifier keys are pressed (open in new tab, etc.)
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        // Don't handle target="_blank" links
        if (anchor.target === '_blank') return;
        
        e.preventDefault();
        e.stopPropagation();
        
        try {
          router.push(href);
        } catch {
          window.location.href = href;
        }
      }
    };

    document.addEventListener('click', handleClick, true); // capture phase
    return () => document.removeEventListener('click', handleClick, true);
  }, [router]);

  return null;
}
