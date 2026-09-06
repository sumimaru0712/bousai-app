import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be reached from other devices on the LAN
  // (e.g. testing on a phone via the "Network" URL shown by `next dev`).
  allowedDevOrigins: ["192.168.2.108"],
};

export default nextConfig;
