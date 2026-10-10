/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/AI-Workforce-Command-Center',
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: { cpus: 2 },
};

module.exports = nextConfig;
