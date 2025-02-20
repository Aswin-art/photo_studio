import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*"
      }
    ]
  },

  reactStrictMode: false,

  async redirects() {
    return [
      {
        source: "/contact-us",
        destination: "https://wa.me/628123456789",
        permanent: false
      }
    ];
  }
};

export default nextConfig;
