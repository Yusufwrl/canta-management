import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15 için optimize edilmiş ayarlar
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // TypeScript kontrol hızlandırma
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Performans iyileştirmeleri
  optimizeFonts: true,
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
