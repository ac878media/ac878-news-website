'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: Array<{ href: string; label: string; subtitle: string; external?: boolean; children?: Array<{ href: string; label: string; subtitle?: string }> }> = [
    { href: '/#australia', label: '澳洲新闻', subtitle: 'Australian News' },
    { href: '/#business', label: '财经新闻', subtitle: 'Business & Finance' },
    { href: '/#china', label: '中港新闻', subtitle: 'China & HK News' },
    { href: '/#international', label: '国际新闻', subtitle: 'International News' },
    
    // New Menu Items
    { href: 'https://ac878.com.au/program/', label: '📻 电台节目', subtitle: 'Radio Programs', external: true },
    { 
      href: 'https://ac878.com.au', 
      label: '🎉 活动', 
      subtitle: 'Events', 
      external: true,
      children: [
        { href: 'https://ac878.com.au/chatswood-dragon-boat-festival/', label: '车士活端午嘉年华' },
        { href: 'https://ac878.com.au/2025-lny/', label: '新春庆祝活动' },
        { href: 'https://ac878.com.au/2024moonfestival/', label: '宝活中秋嘉年华' },
      ]
    },
    { 
      href: 'https://ac878.com.au/magazine-octopus/', 
      label: '📖 八爪娱', 
      subtitle: 'Magazine', 
      external: true,
      children: [
        { href: 'https://ac878.com.au/magazine-octopus/', label: '八爪娱 悉尼' },
        { href: 'https://ac878.com.au/magazine-octopus-mel/', label: '八爪娱 墨尔本' },
      ]
    },
    { href: 'https://ac878.com.au/interview/', label: '🎤 独家专访', subtitle: 'Exclusive Interviews', external: true },
    { href: 'https://ac878.com.au/category/videoprogram/878-interview/', label: '📺 878会客室', subtitle: 'Talk Show', external: true },
    { href: 'https://ac878.com.au/category/comm-news/', label: '📰 社区新闻', subtitle: 'Community News', external: true },
    
    { href: '/listen', label: '🎙️ 收听', subtitle: 'Listen' },
    { href: 'https://stream4.rcast.net/71937/', label: '📻 FM 87.8 直播', subtitle: 'Live Radio', external: true },
    { href: '/search', label: '🔍 搜索', subtitle: 'Search' },
    { href: '/about', label: 'ℹ️ 关于我们', subtitle: 'About Us' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'mb-1'
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </div>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-black shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-white text-lg font-bold">878时讯</h2>
              <p className="text-gray-400 text-sm">AC878 News</p>
            </div>
            <button
              onClick={closeMenu}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.href}>
                {/* Main Item */}
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="font-medium group-hover:text-accent transition-colors">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      {item.subtitle}
                    </div>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <div className="font-medium group-hover:text-accent transition-colors">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      {item.subtitle}
                    </div>
                  </Link>
                )}
                
                {/* Children Items */}
                {item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                        className="block px-3 py-2 text-gray-300 hover:text-accent hover:bg-gray-800 rounded text-sm transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* App Download */}
          <div className="mt-6 px-4">
            <p className="text-gray-400 text-xs mb-3">📱 下载APP</p>
            <div className="flex gap-2">
              <a href="https://apps.apple.com/au/app/ac878-australian-chinese-radio/id6741985210" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=appac878comau.wpapp&hl=en" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.48c-.42-.25-.68-.7-.68-1.2V1.72c0-.5.26-.95.68-1.2l11.6 11.48-11.6 11.48zM14.54 12L4.5 1.96l12.35 6.92L14.54 12zm0 0l2.31-3.04L4.5 22.04 14.54 12z"/></svg>
                Google Play
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t border-gray-800 pt-4 text-center">
              <p className="text-gray-400 text-xs">
                © 2026 AC878 Media Group Pty Ltd
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Suite 11, 89-97 Jones St, Ultimo NSW 2007
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}