/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  reactStrictMode: true,
  trailingSlash: true,
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'res.cloudinary.com',
  //     },
  //   ]
  // },
  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;
