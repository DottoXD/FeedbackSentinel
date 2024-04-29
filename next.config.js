/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      dns: false,
      tls: false,
      net: false,
    };

    return config;
  },
};

module.exports = nextConfig;
