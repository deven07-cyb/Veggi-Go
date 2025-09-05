/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false; // Disable persistent caching
    return config;
  },
};

module.exports = nextConfig;