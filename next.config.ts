import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   instrumentationHook: true,
  // }
  env: {
    NEXT_PUBLIC_DOMAIN: "http://localhost:3000",
  },
};

export default nextConfig;
