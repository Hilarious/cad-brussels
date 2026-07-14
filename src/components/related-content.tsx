import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { EventCard } from './event-card'

/**
 * <RelatedContent> — bloc de maillage éditorial générique.
 *
 * Injecté en bas des pages éditoriales (About, Pourquoi le CAD, Alumni,
 * Professeurs, Étudier à Bruxelles, etc.) pour ramener du contenu
 * dynamique en fin de scroll et créer des ponts vers Events + News.
 *
 * Objectif audit SEO (Digistage janvier 2026) : porter le maillage
 * interne moyen de 33 → 100+ liens par page (les pages "gagnantes" du
 * site actuel en ont 154).
 *
 * Fetch server-side, cache Next.js (revalidate parent). Zéro impact
 * bundle client.
 *
 * Comportement gracieux : si aucun événement à venir ou aucun post
 * publié, la section correspondante est simplement omise. Si les deux
 * sont vides, le composant ne rend rien.
 */

export async function RelatedContent({
  locale,
  eventsLimit = 3,
  postsLimit = 3,
  title,
  className = '',
}: {
  locale: string
  eventsLimit?: number
  postsLimit?: number
  title?: string
  className?: string
}) {
  const payload = await getPayload({ config })
  const isFR = locale === 'fr'

  const [eventsResult, postsResult] = await Promise.all([
    payload.find({
      collection: 'events',
      locale: locale as 'fr' | 'en',
      where: {
        and: [
          { status: { equals: 'published' } },
          { startDate: { greater_than_equal: new Date().toISOString() } },
        ],
      },
      sort: 'startDate',
      limit: eventsLimit,
    }),
    payload.find({
      collection: 'posts',
      locale: locale as 'fr' | 'en',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: postsLimit,
      depth: 0,
    }),
  ])

  const events = eventsResult.docs
  const posts = postsResult.docs

  if (events.length === 0 && posts.length === 0) return null

  return (
    <section className={`border-t border-ink/10 py-16 md:py-20 ${className}`}>
      <div className="container">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl md:text-4xl">
            {title ??
              (isFR
                ? 'À découvrir aussi'
                : 'You may also like')}
          </h2>
        </div>

        {events.length > 0 && (
          <div className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-6">
              <h3 className="font-display text-xl text-ink">
                {isFR ? 'Événements à venir' : 'Upcoming events'}
              </h3>
              <Link
                href={`/${locale}/events`}
                className="tap text-sm text-ink/70 hover:text-accent"
              >
                {isFR ? 'Tous les événements' : 'All events'} →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} locale={locale} />
              ))}
            </div>
          </div>
        )}

        {posts.length > 0 && (
          <div>
            <div className="mb-6 flex items-end justify-between gap-6">
              <h3 className="font-display text-xl text-ink">
                {isFR ? 'Actualités' : 'Latest news'}
              </h3>
              <Link
                href={`/${locale}/news`}
                className="tap text-sm text-ink/70 hover:text-accent"
              >
                {isFR ? 'Toutes les actus' : 'All news'} →
              </Link>
            </div>
            <ul className="grid gap-8 md:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/${locale}/news/${post.slug}`}
                    className="group block"
                  >
                    <time
                      dateTime={post.publishedAt ?? post.updatedAt}
                      className="text-xs uppercase tracking-widest text-accent"
                    >
                      {new Date(
                        post.publishedAt ?? post.updatedAt,
                      ).toLocaleDateString(locale, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                    <h4 className="mt-2 font-display text-xl leading-snug group-hover:text-accent">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-ink/70">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
