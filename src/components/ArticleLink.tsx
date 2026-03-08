'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useCallback } from 'react';

interface ArticleLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function ArticleLink({ href, className, children }: ArticleLinkProps) {
  const router = useRouter();
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    try {
      router.push(href);
    } catch {
      // Fallback: direct navigation if router fails
      window.location.href = href;
    }
  }, [href, router]);

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
