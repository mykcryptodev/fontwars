import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fontcoins.com',
        port: '',
        pathname: '/helvetica.webp',
      },
    ],
  },
};

export default nextConfig;
