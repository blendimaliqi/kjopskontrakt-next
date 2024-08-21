/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "run-ad-auction=(), join-ad-interest-group=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
