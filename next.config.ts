import type { NextConfig } from "next";

// Import env here to validate during build. Using jiti we can import .ts files :)
import "@/env";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["bff.xceltutors.com"],
  },
};

export default nextConfig;
