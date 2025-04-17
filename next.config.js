
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*', // Keep the destination as is, but ensure API routes are recognized
      },
    ];
  },
  webpack(config) {
    // Prevent TypeScript from looking for vite.config.ts
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        // Add any aliases you need here
      },
    };
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
