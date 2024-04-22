/** @type {import('next').NextConfig} */
// import { verifyPatch } from 'next-ws/server/index.js'

// verifyPatch()
const headers = [
  {
    // matching all routes for GET requests
    source: '/:path*',
    headers: [
      { key: 'Access-Control-Allow-Credentials', value: 'true' },
      { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_NEXTJS_URL },
      { key: 'Access-Control-Allow-Methods', value: 'GET' },
      {
        key: 'Access-Control-Allow-Headers',
        value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'no-referrer, strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
      }
      // {
      //   key: 'Content-Security-Policy',
      //   value: `default-src 'self'; script-src 'self' 'unsafe-inline'${
      //     process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"
      //   }; style-src 'self' 'unsafe-inline'; img-src 'self' * data:; font-src 'self'; connect-src 'self' 'wss://ws.yeonv.com'; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; manifest-src 'self'; worker-src 'self';`
      // }
    ]
  },
  {
    // matching all API routes
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Credentials', value: 'true' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
      {
        key: 'Access-Control-Allow-Headers',
        value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'no-referrer, strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
      }
    ]
  }
]

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  poweredByHeader: false,
  // headers: async () => headers,
  distDir: process.env.NEXT_PUBLIC_STAGE === 'dev' ? '.nextdev' : '.next'
}

export default nextConfig
