import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['tradeclub03.s3.eu-north-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
