import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production için optimize edilmiş ayarlar
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // TypeScript ve ESLint'i build sırasında atla (VPS için)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Output optimize edilmiş
  output: 'standalone',
  // Performans iyileştirmeleri
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
