import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // for Docker multi-stage build (see Dockerfile)
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      // S3 / R2 endpoint for media uploads
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.scw.cloud' },
      { protocol: 'https', hostname: 'cad.be' },
    ],
  },
  async redirects() {
    return [
      // Old single page redirected to new hub (preserves SEO juice)
      {
        source: '/fr/living-in-brussels',
        destination: '/fr/etudier-a-bruxelles',
        permanent: true,
      },
      {
        source: '/en/living-in-brussels',
        destination: '/en/etudier-a-bruxelles',
        permanent: true,
      },
      // /galerie deprecated (May 2026 decision): student projects now live
      // inside their program pages rather than in a standalone gallery —
      // more powerful for prospect projection. Redirect to the programs hub.
      {
        source: '/fr/galerie',
        destination: '/fr/programmes',
        permanent: true,
      },
      {
        source: '/en/galerie',
        destination: '/en/programmes',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(withPayload(nextConfig))
