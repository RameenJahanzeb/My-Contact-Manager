import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const agentServiceUrl = (
      process.env.AGENT_SERVICE_URL || "http://localhost:8000"
    ).replace(/\/+$/, "");

    return [
      {
        source: "/agent-api/:path*",
        destination: `${agentServiceUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
