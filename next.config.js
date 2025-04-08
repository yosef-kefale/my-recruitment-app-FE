/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode for development
  reactStrictMode: false,
  
  // Allow images from any domain
  images: {
    domains: ['*'],
    unoptimized: true,
  },
  
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Increase the maximum size of the build output
  webpack: (config) => {
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
    return config
  }
}

module.exports = nextConfig 