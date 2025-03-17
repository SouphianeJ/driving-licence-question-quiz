/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Activer si vous utilisez des images externes
async headers() {
    return [
      {
        source: '/content/questions.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      }
    ];
  },
  
}

module.exports = nextConfig

