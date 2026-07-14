import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'
import { Breadcrumb } from '@/components/breadcrumb'
import { RelatedContent } from '@/components/related-content'

export const revalidate = 60

async function fetchEvent(locale: string, slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'events',
    locale: locale as 'fr' | 'en',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const event = await fetchEvent(locale, slug)
  if (!event) return {}
  return {
    title: event.seo?.metaTitle ?? event.title,
    description: event.seo?.metaDescription ?? undefined,
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'events' })
  const event = await fetchEvent(locale, slug)
  if (!event) notFound()

  const cover =
    typeof event.coverImage === 'object' ? (event.coverImage as Media) : null
  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : null

  return (
    <article className="container py-12">
      <Breadcrumb
        locale={locale}
        items={[
          { label: t('back'), href: `/${locale}/events` },
          { label: event.title },
        ]}
      />

      <h1 className="mt-6 max-w-4xl font-display text-4xl md:text-5xl">
        {event.title}
      </h1>

      <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
        <div>
          <dt className="uppercase tracking-widest text-accent">{t('when')}</dt>
          <dd className="mt-1 text-ink/80">
            <time dateTime={event.startDate}>
              {start.toLocaleString(locale, {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
            {end && (
              <>
                {' - '}
                <time dateTime={event.endDate ?? ''}>
                  {end.toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </>
            )}
          </dd>
        </div>
        {event.location && (
          <div>
            <dt className="uppercase tracking-widest text-accent">{t('where')}</dt>
            <dd className="mt-1 text-ink/80">{event.location}</dd>
          </div>
        )}
      </dl>

      {cover?.url && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={cover.url}
            alt={cover.alt ?? ''}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {event.registrationUrl && (
        <div className="mt-10">
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-accent"
          >
            {t('register')}
          </a>
        </div>
      )}

      {/* JSON-LD for Schema.org Event */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            startDate: event.startDate,
            endDate: event.endDate ?? event.startDate,
            location: event.location
              ? { '@type': 'Place', name: event.location }
              : undefined,
            organizer: {
              '@type': 'EducationalOrganization',
              name: 'CAD Brussels',
              url: 'https://cad.be',
            },
          }),
        }}
      />

      {/* Maillage — autres événements à venir + dernières actus.
          Fait rebondir le visiteur au lieu de le laisser sortir. */}
      <RelatedContent
        locale={locale}
        title={locale === 'fr' ? 'Autres événements' : 'Other events'}
      />
    </article>
  )
}
