/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://insurance-api.your-worker.workers.dev/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;