import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/render-blocks'
import { themeForSlug } from '@/lib/program-themes'
import { ProgramProjects } from '@/components/program-projects'
import { ProgramsHub } from '@/components/programs-hub'
import { RelatedPrograms } from '@/components/related-programs'
import { JsonLd } from '@/components/json-ld'
import { course } from '@/lib/schema'
import { programBySlug } from '@/lib/programs'

export const revalidate = 60

async function fetchPage(locale: string, slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    locale: locale as 'fr' | 'en',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await fetchPage(locale, slug[slug.length - 1] ?? '')
  if (!page) return {}
  return {
    title: page.seo?.metaTitle ?? page.title,
    description: page.seo?.metaDescription ?? undefined,
  }
}

export default async function CMSPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const lastSlug = slug[slug.length - 1] ?? ''
  const page = await fetchPage(locale, lastSlug)
  if (!page) notFound()

  // Apply the program's official accent color via a wrapper class.
  // Empty string when the slug isn't in the program map (e.g. About,
  // Around the World) — the page keeps the default Pink accent.
  const themeClass = themeForSlug(lastSlug)

  // JSON-LD Schema.org Course — pour les pages programme uniquement.
  // Renvoie null si le slug n'est pas dans le catalogue (hub, About, etc.).
  const program = programBySlug(lastSlug)
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://cad.be'

  return (
    <div className={themeClass}>
      {program && (
        <JsonLd
          data={course({
            name: locale === 'fr' ? program.labelFR : program.labelEN,
            description:
              locale === 'fr' ? program.taglineFR : program.taglineEN,
            url: `${siteUrl}/${locale}/${program.slug}`,
            locale,
            level: program.level,
            duration: program.duration,
          })}
        />
      )}
      <RenderBlocks blocks={page.layout ?? []} locale={locale} />
      {/* Cartes immersives plein écran — injectées seulement pour les
          hubs « programmes » (Tous les Bachelors) et « masters » (Tous
          les Masters). Renvoie null pour les autres slugs, donc safe
          à mettre ici de manière inconditionnelle. */}
      <ProgramsHub slug={lastSlug} locale={locale} />
      {/* Section projets étudiants — injectée pour les pages programmes
          qui ont des projets définis dans `program-projects.tsx`.
          Renvoie null pour les autres pages (About, Around the World,
          etc.), donc safe à mettre ici de manière inconditionnelle. */}
      <ProgramProjects slug={lastSlug} locale={locale} />
      {/* Maillage interne — cartes "autres programmes" en bas de chaque
          page programme (bachelor, master, spécialisation). Le composant
          détecte automatiquement le niveau et injecte 3 programmes du
          même niveau + 3 d'un niveau différent. Renvoie null pour les
          slugs qui ne sont pas dans le catalogue (hubs, About, etc.). */}
      <RelatedPrograms currentSlug={lastSlug} locale={locale} />
    </div>
  )
}
