/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["vehicle.unibooker.app"],
  },
  experimental: {
    appDir: true, // ✅ Ensures App Router is enabled
  },
  reactStrictMode: true, // ✅ Recommended for better debugging
};

module.exports = nextConfig;
