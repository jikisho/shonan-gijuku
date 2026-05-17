import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    // react-pdf がサーバーサイドで canvas を要求するのを防ぐ
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
