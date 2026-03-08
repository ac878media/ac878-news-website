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
    default: '878时讯 | AC878 News',
    template: '%s | 878时讯',
  },
  description: '878时讯 - 澳洲华语新闻门户。AC878 News - Australian Chinese news portal covering local, business, China/HK, and international news.',
  metadataBase: new URL('https://news.ac878.com.au'),
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
