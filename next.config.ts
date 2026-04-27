import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brndsplc.kiki.bg',
      },
    ],
  },
}

export default nextConfig
