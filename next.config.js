/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac878.com.au',
      },
    ],
  },
};

module.exports = nextConfig;
