/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MARKEL_USERNAME: process.env.MARKEL_USERNAME,
    MARKEL_PASSWORD: process.env.MARKEL_PASSWORD,
    MARKEL_API_KEY: process.env.MARKEL_API_KEY,
    MARKEL_BASE_URL: process.env.MARKEL_BASE_URL,
    CF_USERNAME: process.env.CF_USERNAME,
    CF_PASSWORD: process.env.CF_PASSWORD,
    CF_SERVICE_NAME: process.env.CF_SERVICE_NAME,
    CF_AGENCY_ID: process.env.CF_AGENCY_ID,
    CF_BASE_URL: process.env.CF_BASE_URL,
  },
  // Prevent caching issues in development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 