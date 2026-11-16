/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Pages that were merged into another page. The old addresses still work —
   * bookmarks, links in old emails and the old site's own links all land in the
   * right place. Add to this list whenever a page is merged; never just remove one.
   */
  async redirects() {
    return [
      { source: '/club-life/roles', destination: '/directory#roles', permanent: false },
      { source: '/club-life/photo-galleries', destination: '/gallery#galleries', permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.glidingclub.org.uk' },
      { protocol: 'https', hostname: 'glidingclub.org.uk' },
    ],
  },
};

export default nextConfig;
