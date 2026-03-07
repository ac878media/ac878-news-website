'use client';

import { useState, useEffect } from 'react';

export default function LastUpdated() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    // Set initial timestamp (when the page loads)
    const now = new Date();
    setLastUpdated(now);
    setTimeAgo('刚刚');

    // Update the "time ago" display every minute
    const interval = setInterval(() => {
      if (lastUpdated) {
        const now = new Date();
        const diffMs = now.getTime() - lastUpdated.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (diffMinutes < 1) {
          setTimeAgo('刚刚');
        } else if (diffMinutes < 60) {
          setTimeAgo(`${diffMinutes}分钟前`);
        } else {
          const diffHours = Math.floor(diffMinutes / 60);
          if (diffHours < 24) {
            setTimeAgo(`${diffHours}小时前`);
          } else {
            const diffDays = Math.floor(diffHours / 24);
            setTimeAgo(`${diffDays}天前`);
          }
        }
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (!lastUpdated) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span>数据更新于：{timeAgo}</span>
    </div>
  );
}