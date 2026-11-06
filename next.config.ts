import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "petlove.b.goit.study",
      },
      {
        protocol: "https",
        hostname: "www.nytimes.com",
      },
      {
        protocol: "https",
        hostname: "media4.giphy.com",
      },
    ],
  },
};

export default nextConfig;
