
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  webpack(config) {
    return config;
  },
  // Set port to 8080 as required
  serverRuntimeConfig: {
    port: 8080
  },
  env: {
    PORT: 8080
  }
}

module.exports = nextConfig;
