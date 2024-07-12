/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/:path*', // Matches all API routes
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // For development or allowing all origins (not recommended for production)
        ],
      },
    ];
  },
};

export default nextConfig;
