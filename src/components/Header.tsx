
import Image from 'next/image';
import Link from 'next/link';
import MobileNav from './MobileNav';
import NavDropdown from './NavDropdown';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="bg-black sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <Image
              src="https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png"
              alt="AC878"
              width={48}
              height={48}
              className="rounded-lg bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">AC878</h1>
              <p className="text-gray-400 text-xs">24小时澳洲华语FM电台</p>
            </div>
            <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">FM 87.8</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm">
            <NavDropdown 
              trigger="新闻" 
              items={[
                { href: '/#australia', label: '澳洲新闻' },
                { href: '/#business', label: '财经新闻' },
                { href: '/#china', label: '中港新闻' },
                { href: '/#international', label: '国际新闻' },
              ]}
            />
            
            <NavDropdown 
              trigger="电台节目" 
              items={[
                { href: 'https://ac878.com.au/program/', label: '节目表' },
                { href: 'https://ac878.com.au/category/videoprogram/878-interview/', label: '878会客室' },
              ]}
            />
            
            <NavDropdown 
              trigger="专题节目" 
              items={[
                { href: 'https://ac878.com.au/interview/', label: '独家专访' },
                { href: 'https://ac878.com.au/category/videoprogram/878-interview/', label: '878会客室' },
              ]}
            />
            
            <NavDropdown 
              trigger="本地活动" 
              items={[
                { href: 'https://ac878.com.au/chatswood-dragon-boat-festival/', label: '车士活端午嘉年华' },
                { href: 'https://ac878.com.au/2025-lny/', label: '新春庆祝活动' },
                { href: 'https://ac878.com.au/2024moonfestival/', label: '宝活中秋嘉年华' },
              ]}
            />
            
            <NavDropdown 
              trigger="八爪娱" 
              items={[
                { href: 'https://ac878.com.au/magazine-octopus/', label: '八爪娱 悉尼' },
                { href: 'https://ac878.com.au/magazine-octopus-mel/', label: '八爪娱 墨尔本' },
              ]}
            />
            
            <a href="https://ac878.com.au/category/comm-news/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">社区新闻</a>
            
            <a href="https://stream4.rcast.net/71937/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              收听直播
            </a>
            
            <Link href="/listen" className="text-white bg-accent/90 hover:bg-accent px-3 py-1 rounded-full transition-colors">🎧 收听</Link>
          </nav>
          
          {/* Search Button (Desktop) */}
          <Link
            href="/search"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            title="搜索新闻"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Theme Toggle (Desktop) */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-accent via-orange-500 to-accent"></div>
    </header>
  );
}
