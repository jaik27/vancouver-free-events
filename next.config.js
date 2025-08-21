/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [
        'dailyhive.com',
        'www.destinationvancouver.com',
        'images.unsplash.com',
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    // Remove the experimental section as server actions are now available by default
  };
  
  module.exports = nextConfig;