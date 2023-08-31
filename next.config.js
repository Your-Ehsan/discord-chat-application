/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "http",
        hostname: "uploadthing.com",
      },
    ],
  },
};

module.exports = nextConfig;
