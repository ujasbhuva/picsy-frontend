/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['*']
  },
  async rewrites () {
    return [
      {
        source: '/privacy-policy',
        destination: '/privacy-policy.html'
      },
      {
        source: '/terms-of-use',
        destination: '/terms-of-use.html'
      }
    ]
  }
}

module.exports = nextConfig
