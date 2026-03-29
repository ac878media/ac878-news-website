import type { Metadata } from 'next';
import './globals.css';
import TopBanner from '@/components/TopBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import InstallPrompt from '@/components/InstallPrompt';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import NavigationFix from '@/components/NavigationFix';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: {
    default: '878时讯 — 澳洲华语新闻 | AC878 Australian Chinese News',
    template: '%s | 878时讯 AC878 News',
  },
  description: '878时讯 — 澳洲最全华语新闻门户，每日更新澳洲本地、财经、中港、国际新闻。AC878 News — Australia\'s leading Chinese news portal with daily coverage of local, business, China/HK, and world news.',
  metadataBase: new URL('https://news.ac878.com.au'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '878时讯 | AC878 News',
    images: [{ url: 'https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png', width: 1024, height: 1024 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
  keywords: ['澳洲新闻', '华语新闻', 'Australian Chinese news', 'AC878', '878时讯', '澳洲华人', 'Sydney Chinese news'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#da2d2d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="878时讯" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="msapplication-TileColor" content="#da2d2d" />
        <meta name="msapplication-TileImage" content="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ServiceWorkerRegistration />
        <NavigationFix />
        <ThemeProvider>
          <TopBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
