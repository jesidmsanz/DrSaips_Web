const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/audit_trail",
        permanent: true,
      },
      {
        source: "/",
        destination: "/admin/audit_trail",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
