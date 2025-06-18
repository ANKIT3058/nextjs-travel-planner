import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   instrumentationHook: true,
  // }
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // env: {
  //   NEXT_PUBLIC_DOMAIN: "http://localhost:3000",
  // },
  images: {
    remotePatterns: [{ hostname: "imgcld.yatra.com" }],
  },
};

export default nextConfig;
