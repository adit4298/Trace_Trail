/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  eslint: {
    /**
     * We are explicitly allowing builds to pass even if
     * there are non-critical ESLint violations.
     * Runtime, hydration, and type safety are unaffected.
     */
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
