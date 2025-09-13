import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/images/00php9jv/**')],
  },
};

export default nextConfig;
