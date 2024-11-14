import type { NextConfig } from "next";

// Import env here to validate during build. Using jiti we can import .ts files :)
import "@/env";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["rlqvhmhinnazuijrkrwq.supabase.co"],
  },
};

export default nextConfig;
