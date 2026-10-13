import type { NextConfig } from "next";

// URL interne du backend FastAPI (le navigateur ne parle qu'à Next.js :
// /api/* et /uploads/* sont relayés vers le backend → pas de CORS, cookie same-origin)
const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_INTERNAL_URL}/api/:path*` },
      { source: "/uploads/:path*", destination: `${API_INTERNAL_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
