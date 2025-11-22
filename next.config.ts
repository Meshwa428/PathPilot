import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  
  // Add this to allow ngrok
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.ngrok-free.app"],
    },
  },
};

export default nextConfig;