'use client';

import { useEffect } from 'react';

export default function NavigationFix() {
  useEffect(() => {
    // Global click handler to force internal link navigation
    // Next.js router intercepts <a> clicks with preventDefault() but
    // fails to complete navigation for server-component-rendered Links.
    // This capture-phase handler fires FIRST and forces window.location navigation.
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;
      
      // Handle all internal links (starting with / but not //)
      if (href.startsWith('/') && !href.startsWith('//')) {
        // Don't handle if modifier keys are pressed (open in new tab, etc.)
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        // Don't handle target="_blank" links
        if (anchor.target === '_blank') return;
        
        // Force navigation directly — bypass Next.js router entirely
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.href = href;
      }
    };

    document.addEventListener('click', handleClick, true); // capture phase
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}
