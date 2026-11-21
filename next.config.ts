import type { NextConfig } from "next";

const backendBaseUrl = process.env.BACKEND_API_URL || "https://api.ravishingarthub.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path((?!chat|ai-chat).*)",
        destination: `${backendBaseUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendBaseUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
