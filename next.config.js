/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // false ensures browsers don't cache this permanently if you change it later
      },
    ];
  },
};

module.exports = nextConfig;
