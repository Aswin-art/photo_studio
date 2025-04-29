import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000"
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/contact-us",
        destination: "https://wa.me/6285770037336",
        permanent: false
      }
    ];
  }
};


export default nextConfig;
