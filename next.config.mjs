/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.glidingclub.org.uk' },
      { protocol: 'https', hostname: 'glidingclub.org.uk' },
    ],
  },
};

export default nextConfig;
