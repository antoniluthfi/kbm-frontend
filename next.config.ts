import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/storage/:path*`,
      },
    ]
  },
};

export default nextConfig;
