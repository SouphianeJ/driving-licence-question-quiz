/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Activer si vous utilisez des images externes
  images: {
    domains: ['vercel.com'],
  },
}

module.exports = nextConfig