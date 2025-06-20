import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui'],
  experimental: {
    reactCompiler: false,
  },
};

export default nextConfig;
