import type { NextConfig } from 'next'
import { redirects } from './redirects'
import bundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
    turbopack: {},
    webpack: config => {
        config.output.globalObject = 'self'
        return config
    },
    cacheHandler:
        process.env.NODE_ENV === 'production'
            ? require.resolve('./cache-handler.js')
            : undefined,
    // disable default in-memory caching
    cacheMaxMemorySize: process.env.NODE_ENV === 'production' ? 0 : undefined,
    transpilePackages: ['next-mdx-remote'],
    experimental: {
        optimizePackageImports: ['@chakra-ui/react']
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdaas*.aexp.com'
            }
        ]
    },
    redirects
}

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
})

export default withBundleAnalyzer(nextConfig)
