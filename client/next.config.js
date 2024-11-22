/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    "@injectivelabs/sdk-ts",
    "@injectivelabs/ts-types",
    "@injectivelabs/utils",
    "@injectivelabs/wallet-ts",
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  images: {
    domains: ['ipfs.io', 'gateway.ipfs.io'],
  },
};

module.exports = nextConfig;
