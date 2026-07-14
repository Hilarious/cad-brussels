import Link from 'next/link'
import { themeForSlug } from '@/lib/program-themes'

/**
 * <RelatedPrograms> — bloc de maillage interne pour pages programme.
 *
 * Motivation : l'audit SEO Digistage janvier 2026 a démontré que les
 * pages "gagnantes" du site actuel ont **154 liens internes en moyenne**
 * vs 33 sur la moyenne du site (+360 %). Le maillage interne est le
 * facteur le plus corrélé au trafic organique (score 0.27 en corrélation
 * positive dans le rapport).
 *
 * Ce composant injecte 4-6 liens contextuels vers d'autres programmes
 * du même thème (Bachelor / Master) et vers les hubs, en bas de chaque
 * page programme. Renforce le maillage sans effort éditorial manuel.
 *
 * Chaque carte porte sa couleur de programme (theme-*) même à
 * l'intérieur d'un contexte accent différent — parfait pour montrer la
 * diversité de l'offre pédagogique.
 */

type ProgramLink = {
  slug: string
  labelFR: string
  labelEN: string
  descFR: string
  descEN: string
  level: 'bachelor' | 'master' | 'specialisation'
}

// Source unique : ce catalogue est aligné sur les slugs Payload seed.
// Ordre pédagogique (bachelors d'abord, puis masters, puis spécialisations).
const CATALOG: ProgramLink[] = [
  {
    slug: 'interior-architecture-design',
    labelFR: 'Architecture d’intérieur',
    labelEN: 'Interior Architecture & Design',
    descFR: 'Bachelor 3 ans',
    descEN: 'Bachelor 3 years',
    level: 'bachelor',
  },
  {
    slug: 'communication-digital-design',
    labelFR: 'Communication & Digital',
    labelEN: 'Communication & Digital',
    descFR: 'Bachelor 3 ans',
    descEN: 'Bachelor 3 years',
    level: 'bachelor',
  },
  {
    slug: 'fashion-accessory-design',
    labelFR: 'Mode & Accessoires',
    labelEN: 'Fashion & Accessory',
    descFR: 'Bachelor 3 ans',
    descEN: 'Bachelor 3 years',
    level: 'bachelor',
  },
  {
    slug: 'interior-architecture-design-master',
    labelFR: 'Interior Architecture',
    labelEN: 'Interior Architecture',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    level: 'master',
  },
  {
    slug: 'home-living-design',
    labelFR: 'Home & Living Design',
    labelEN: 'Home & Living Design',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    level: 'master',
  },
  {
    slug: 'digital-brand-content',
    labelFR: 'Digital Brand Content',
    labelEN: 'Digital Brand Content',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    level: 'master',
  },
  {
    slug: 'image-3d-motion-video-ai',
    labelFR: 'Image 3D · Motion · AI',
    labelEN: 'Image 3D · Motion · AI',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    level: 'master',
  },
  {
    slug: 'event-management',
    labelFR: 'Event Management',
    labelEN: 'Event Management',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    level: 'master',
  },
  {
    slug: 'fashion-management',
    labelFR: 'Fashion Management',
    labelEN: 'Fashion Management',
    descFR: 'Spécialisation',
    descEN: 'Specialisation',
    level: 'specialisation',
  },
]

export function RelatedPrograms({
  currentSlug,
  locale,
}: {
  currentSlug: string
  locale: string
}) {
  const isFR = locale === 'fr'

  // Exclude the current program from the list.
  const others = CATALOG.filter((p) => p.slug !== currentSlug)

  // Detect current level to prioritize same-level programs in the output.
  const current = CATALOG.find((p) => p.slug === currentSlug)
  const sameLevel = others.filter((p) => p.level === current?.level)
  const otherLevels = others.filter((p) => p.level !== current?.level)

  // Show 3 same-level + 3 cross-level. Adjust if same-level < 3.
  const primary = sameLevel.slice(0, 3)
  const secondary = otherLevels.slice(0, 6 - primary.length)
  const toShow = [...primary, ...secondary].slice(0, 6)

  // If the current slug isn't in the catalog, this component is not
  // relevant (probably a hub page or editorial). Skip render.
  if (!current) return null

  return (
    <section className="border-t border-ink/10 bg-paper py-16 md:py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-accent">
              {isFR ? 'Explorer plus' : 'Explore more'}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {isFR ? 'Autres programmes' : 'Other programs'}
            </h2>
          </div>
          <div className="hidden shrink-0 md:block">
            <Link
              href={`/${locale}/${current.level === 'master' ? 'masters' : 'programmes'}`}
              className="tap text-sm text-ink/70 hover:text-accent"
            >
              {isFR ? 'Voir tous' : 'See all'} →
            </Link>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toShow.map((p) => {
            const themeClass = themeForSlug(p.slug)
            return (
              <li key={p.slug} className={themeClass}>
                <Link
                  href={`/${locale}/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink/10 p-6 transition hover:border-accent/40 hover:bg-accent/5"
                >
                  <p className="text-xs uppercase tracking-widest text-accent">
                    {isFR ? p.descFR : p.descEN}
                  </p>
                  <p className="mt-3 font-display text-xl leading-snug">
                    {isFR ? p.labelFR : p.labelEN}
                  </p>
                  <p className="mt-auto pt-6 text-sm text-ink/70 group-hover:text-accent">
                    {isFR ? 'Découvrir le programme' : 'Discover the program'} →
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile "See all" — mirror of the desktop link in header */}
        <div className="mt-8 md:hidden">
          <Link
            href={`/${locale}/${current.level === 'master' ? 'masters' : 'programmes'}`}
            className="tap text-sm text-ink/70 hover:text-accent"
          >
            {isFR
              ? current.level === 'master'
                ? 'Voir tous les Masters'
                : 'Voir tous les Bachelors'
              : current.level === 'master'
                ? 'See all Masters'
                : 'See all Bachelors'}
            {' '}
            →
          </Link>
        </div>
      </div>
    </section>
  )
}
