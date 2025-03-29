/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: '/api/docs'
      }
    ];
  }
};
