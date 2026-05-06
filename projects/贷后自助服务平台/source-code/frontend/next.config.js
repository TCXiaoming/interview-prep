/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发时代理 /api 到后端服务
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
  images: {
    // 允许加载后端图片
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
    ],
  },
}

module.exports = nextConfig
