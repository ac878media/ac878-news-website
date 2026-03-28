/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac878.com.au',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: 'https://ac878.com.au/wp-content/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
