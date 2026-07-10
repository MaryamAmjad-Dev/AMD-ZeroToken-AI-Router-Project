import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep dev URLs and HMR stable on Windows (localhost vs 127.0.0.1 mismatches).
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
