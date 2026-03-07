import Link from 'next/link';
import Image from 'next/image';
import MobileNav from './MobileNav';
import NavDropdown from './NavDropdown';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="bg-black sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png"
            alt="AC878"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight">878时讯</h1>
            <p className="text-gray-400 text-xs">AC878 News</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm">
            <Link href="/#australia" className="text-gray-300 hover:text-accent transition-colors">澳洲新闻</Link>
            <Link href="/#business" className="text-gray-300 hover:text-accent transition-colors">财经新闻</Link>
            <Link href="/#china" className="text-gray-300 hover:text-accent transition-colors">中港新闻</Link>
            <Link href="/#international" className="text-gray-300 hover:text-accent transition-colors">国际新闻</Link>
            
            {/* New Menu Items */}
            <a href="https://ac878.com.au/program/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">电台节目</a>
            
            <NavDropdown 
              trigger="活动" 
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
            
            <a href="https://ac878.com.au/interview/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">独家专访</a>
            <a href="https://ac878.com.au/category/videoprogram/878-interview/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">878会客室</a>
            
            <Link href="/listen" className="text-white bg-accent/90 hover:bg-accent px-3 py-1 rounded-full transition-colors">🎙️ 收听</Link>
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
