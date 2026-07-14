import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { locales } from '@/lib/i18n'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cad.be'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const entries: MetadataRoute.Sitemap = []

  // Static routes per locale
  const staticRoutes = [
    '',
    '/events',
    '/contact',
    '/about',
    '/news',
    '/newsletter',
    '/info-pack',
    '/etudier-a-bruxelles',
    '/etudier-a-bruxelles/se-loger',
    '/etudier-a-bruxelles/visa',
    '/etudier-a-bruxelles/vie-pratique',
  ]
  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.7,
      })
    }
  }

  // Dynamic: published events
  const events = await payload.find({
    collection: 'events',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })
  for (const ev of events.docs) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/events/${ev.slug}`,
        lastModified: ev.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  // Dynamic: published pages
  const pages = await payload.find({
    collection: 'pages',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })
  for (const page of pages.docs) {
    if (page.slug === 'home') continue
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
  }

  // Dynamic: published posts
  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })
  for (const post of posts.docs) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/news/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  }

  return entries
}
