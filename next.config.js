/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  }
}

require('dotenv').config()

module.exports = nextConfig