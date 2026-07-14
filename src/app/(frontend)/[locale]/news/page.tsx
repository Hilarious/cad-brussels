import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AdmissionCTA } from '@/components/admission-cta'

export const revalidate = 60

export default async function NewsListPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    locale: locale as 'fr' | 'en',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 0,
  })

  return (
    <>
      <section className="container py-20 md:py-28">
        <p className="text-sm uppercase tracking-widest text-accent">
          {locale === 'fr' ? "Vie de l'école" : 'School life'}
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">
          {locale === 'fr' ? 'Actualités' : 'News'}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/70">
          {locale === 'fr'
            ? 'Les nouvelles de l’école, les workshops récents, les annonces d’admission et les coulisses de la vie au CAD.'
            : 'School news, recent workshops, admission announcements and behind-the-scenes life at CAD.'}
        </p>

        <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {posts.docs.length === 0 ? (
            <li className="py-6 text-ink/60">
              {locale === 'fr' ? 'Aucune actualité.' : 'No news yet.'}
            </li>
          ) : (
            posts.docs.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/${locale}/news/${post.slug}`}
                  className="grid gap-4 py-8 md:grid-cols-[160px_1fr] md:gap-8"
                >
                  <time
                    dateTime={post.publishedAt ?? post.updatedAt}
                    className="text-sm uppercase tracking-widest text-accent"
                  >
                    {new Date(
                      post.publishedAt ?? post.updatedAt,
                    ).toLocaleDateString(locale, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                  <div>
                    <h2 className="font-display text-2xl leading-snug md:text-3xl">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 max-w-2xl text-ink/70">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>

      <AdmissionCTA locale={locale} variant="primary" />
    </>
  )
}
