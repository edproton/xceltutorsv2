import type { NextConfig } from "next";

// Import env here to validate during build. Using jiti we can import .ts files :)
import "@/env";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rlqvhmhinnazuijrkrwq.supabase.co",
      },
    ],
  },
};

export default nextConfig;
