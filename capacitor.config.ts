import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.com.ac878.news',
  appName: '878时讯',
  webDir: 'out',
  server: {
    url: 'https://news.ac878.com.au',
    cleartext: false,
  },
  ios: {
    scheme: '878News',
    contentInset: 'automatic',
  },
};

export default config;
