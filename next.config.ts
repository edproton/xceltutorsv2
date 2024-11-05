import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["bff.xceltutors.com"],
  }
};

export default nextConfig;
