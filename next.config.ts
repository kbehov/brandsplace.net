import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brndsplc.kiki.bg',
      },
      {
        protocol: 'https',
        hostname: 'fhouse.bg',
      },
      {
        protocol: 'https',
        hostname: 'kiki.bg',
      },
    ],
  },
}

export default nextConfig
