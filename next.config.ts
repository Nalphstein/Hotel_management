import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the output: 'export' line for Vercel deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;