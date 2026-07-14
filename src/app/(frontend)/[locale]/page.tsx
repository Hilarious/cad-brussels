import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { EventCard } from '@/components/event-card'
import { AdmissionCTA } from '@/components/admission-cta'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { Marquee } from '@/components/marquee'

export const revalidate = 60

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })

  const payload = await getPayload({ config })

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
      limit: 3,
    }),
    payload.find({
      collection: 'posts',
      locale: locale as 'fr' | 'en',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
      depth: 0,
    }),
  ])

  const programs =
    locale === 'fr'
      ? [
          { slug: 'interior-architecture-design', label: 'Architecture d’intérieur', desc: 'Bachelor 3 ans' },
          { slug: 'communication-digital-design', label: 'Communication & Digital', desc: 'Bachelor 3 ans' },
          { slug: 'fashion-accessory-design', label: 'Mode & Accessoires', desc: 'Bachelor 3 ans' },
          { slug: 'masters', label: 'Masters', desc: '7 spécialisations' },
        ]
      : [
          { slug: 'interior-architecture-design', label: 'Interior Architecture', desc: 'Bachelor 3 years' },
          { slug: 'communication-digital-design', label: 'Communication & Digital', desc: 'Bachelor 3 years' },
          { slug: 'fashion-accessory-design', label: 'Fashion & Accessory', desc: 'Bachelor 3 years' },
          { slug: 'masters', label: 'Masters', desc: '7 specializations' },
        ]

  // Trust band — official figures from cad.be/fr/qui-sommes-nous and
  // the CUMULUS network partnership pages. These are the strongest
  // facts the school publishes, keep them in sync if numbers change.
  const trustFacts =
    locale === 'fr'
      ? [
          { value: '1961', label: 'Année de fondation' },
          { value: '160', label: 'Étudiants au total' },
          { value: '50', label: 'Professeurs en activité' },
          { value: '+90%', label: 'Insertion pro après diplôme' },
          { value: '200+', label: 'Écoles partenaires CUMULUS' },
        ]
      : [
          { value: '1961', label: 'Founded' },
          { value: '160', label: 'Students total' },
          { value: '50', label: 'Working teachers' },
          { value: '+90%', label: 'Employment after graduation' },
          { value: '200+', label: 'CUMULUS partner schools' },
        ]

  // Scroll-storytelling : 3 sections après le hero, alignées sur la
  // triade pédagogique de l'école — Œil, Esprit, Culture. L'IA, les
  // logiciels, les outils ne sont JAMAIS le sujet, juste des moyens.
  // Le vrai sujet, c'est la formation du regard et de la pensée.
  const stories =
    locale === 'fr'
      ? [
          {
            theme: 'theme-interior',
            eyebrow: '01 · L’œil',
            title: 'Vous apprenez à voir avant d’apprendre à faire.',
            body: "Le regard, le détail, la matière, la lumière. Avant les logiciels et les techniques, c'est l'œil qui se forme. Vos profs sont des designers, architectes, directeurs artistiques en activité. Ils transmettent leur exigence visuelle, leur sensibilité, leur culture du métier.",
            linkLabel: 'Rencontrer les professeurs',
            linkHref: `/${locale}/professeurs`,
          },
          {
            theme: 'theme-fashion',
            eyebrow: '02 · L’esprit',
            title: 'Vous pensez le design, vous ne le subissez pas.',
            body: 'Briefs réels apportés par Margiela, Decathlon, Mortierbrigade, des éditeurs de mobilier belges. Soutenances publiques devant des jurys de pros. Théorie, critique, défense de vos choix. L\'esprit créatif se construit par confrontation, pas par démonstration.',
            linkLabel: 'Découvrir les programmes',
            linkHref: `/${locale}/programmes`,
          },
          {
            theme: 'theme-lifelong',
            eyebrow: '03 · La culture',
            title: 'Vous nourrissez votre culture, partout, tout le temps.',
            body: 'Workshops à Milan, Shanghai, São Paulo, Lisbonne, Tokyo. Conférences mensuelles ouvertes, voyages culturels à Venise, Bâle, Paris. 160 étudiants de 30+ nationalités sur le campus. Le design ne s\'apprend pas en vase clos.',
            linkLabel: 'Ouverture & culture',
            linkHref: `/${locale}/openness-and-culture`,
          },
        ]
      : [
          {
            theme: 'theme-interior',
            eyebrow: '01 · The eye',
            title: 'You learn to see before you learn to make.',
            body: 'Vision, detail, material, light. Before software and techniques, the eye is what gets trained. Your teachers are working designers, architects, art directors. They pass on their visual standards, their sensibility, their culture of the craft.',
            linkLabel: 'Meet the faculty',
            linkHref: `/${locale}/professeurs`,
          },
          {
            theme: 'theme-fashion',
            eyebrow: '02 · The mind',
            title: 'You think design, you don’t just produce it.',
            body: 'Real briefs from Margiela, Decathlon, Mortierbrigade, Belgian furniture editors. Public defenses in front of juries of pros. Theory, criticism, defending your choices. The creative mind is built through confrontation, not demonstration.',
            linkLabel: 'Explore the programs',
            linkHref: `/${locale}/programmes`,
          },
          {
            theme: 'theme-lifelong',
            eyebrow: '03 · The culture',
            title: 'You feed your culture, everywhere, all the time.',
            body: 'Workshops in Milan, Shanghai, São Paulo, Lisbon, Tokyo. Monthly open lectures, cultural trips to Venice, Basel, Paris. 160 students from 30+ nationalities on campus. Design isn\'t learned in a vacuum.',
            linkLabel: 'Openness & culture',
            linkHref: `/${locale}/openness-and-culture`,
          },
        ]

  return (
    // Home is themed with the 65-year anniversary accent (Pink) for
    // the 2026 campaign. Swap to another `theme-*` when the campaign ends.
    <div className="theme-65">
      {/* Hero — primary CTA is "Apply", secondary is exploring programs.
          Mirrors the admissions-first strategy across the site. */}
      <section className="container py-20 md:py-32">
        <p className="text-sm uppercase tracking-widest text-accent">
          {t('heroEyebrow')}
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] md:text-6xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/70">{t('heroSubtitle')}</p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href={`/${locale}/admissions`}
            className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-accent"
          >
            {locale === 'fr' ? 'Postuler au CAD' : 'Apply to CAD'}
          </Link>
          <Link
            href={`/${locale}/programmes`}
            className="rounded-full border border-ink/20 px-6 py-3 text-sm hover:border-accent hover:text-accent"
          >
            {t('ctaPrograms')}
          </Link>
          <Link
            href={`/${locale}/events`}
            className="text-sm text-ink/70 hover:text-accent"
          >
            {t('ctaOpenDay')} →
          </Link>
        </div>
      </section>

      {/* Mosaïque éclatée style moodboard. Effet Pinterest / Behance :
          ratios mixés, grille irrégulière, montre tout de suite la
          richesse de la production étudiante. Pas un cliché 21:9
          publicitaire, une composition qui dit "école créative vivante".
          Référence : Penninghen, ECAL, Pentagram graduation books. */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          {/* Grande image portrait à gauche (mode/défilé) */}
          <div className="col-span-12 md:col-span-5 md:row-span-2">
            <ImagePlaceholder
              ratio="4:5"
              caption={
                locale === 'fr'
                  ? 'Mode · silhouette défilé 3e année'
                  : 'Fashion · year 3 runway silhouette'
              }
              className="h-full"
            />
          </div>
          {/* Bande paysage en haut à droite (atelier large) */}
          <div className="col-span-12 md:col-span-7">
            <ImagePlaceholder
              ratio="16:9"
              caption={
                locale === 'fr'
                  ? 'Atelier · vue large étudiants en projet'
                  : 'Studio · wide view students in project'
              }
            />
          </div>
          {/* Trois carrés en bas droite */}
          <div className="col-span-4 md:col-span-3">
            <ImagePlaceholder
              ratio="1:1"
              caption={
                locale === 'fr'
                  ? 'Détail · maquette architecture'
                  : 'Detail · architecture model'
              }
            />
          </div>
          <div className="col-span-4 md:col-span-2">
            <ImagePlaceholder
              ratio="1:1"
              caption={
                locale === 'fr'
                  ? 'Croquis main · projet design'
                  : 'Hand sketch · design project'
              }
            />
          </div>
          <div className="col-span-4 md:col-span-2">
            <ImagePlaceholder
              ratio="1:1"
              caption={
                locale === 'fr'
                  ? 'Écran · rendu 3D Unreal'
                  : 'Screen · Unreal 3D render'
              }
            />
          </div>
          {/* Bande paysage en bas (vie d'école) */}
          <div className="col-span-12 md:col-span-7">
            <ImagePlaceholder
              ratio="3:2"
              caption={
                locale === 'fr'
                  ? 'Vie d\'école · jurys publics, projet final'
                  : 'School life · public juries, final project'
              }
            />
          </div>
        </div>
      </section>

      {/* Scroll-storytelling : 3 manifestes thématiques, chacun dans sa
          propre couleur de programme via .theme-*. Pas un carrousel,
          un vrai scroll narratif. Le visiteur contrôle le rythme.
          Effet visuel fort (3 grandes bandes colorées qui s'enchaînent)
          + message éditorial qui répond à 3 questions du candidat :
          "qui m'enseigne", "qu'est-ce que je fais", "où ça mène". */}
      {stories.map((story, i) => (
        <section
          key={i}
          className={`${story.theme} relative bg-accent py-24 text-paper md:py-32`}
        >
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <p className="text-sm uppercase tracking-widest text-paper/70">
                  {story.eyebrow}
                </p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] md:text-6xl">
                  {story.title}
                </h2>
              </div>
              <div className="lg:col-span-5 lg:pt-4">
                <p className="text-lg leading-relaxed text-paper/90">
                  {story.body}
                </p>
                <Link
                  href={story.linkHref}
                  className="mt-6 inline-flex text-sm font-medium text-paper underline-offset-4 hover:underline"
                >
                  {story.linkLabel} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Trust band — visible reassurance for parents, signal of legitimacy
          for hesitating candidates. Placed after the 3 stories so the
          numbers confirm what the manifestos promised. */}
      <section className="border-y border-ink/10 bg-paper">
        <div className="container">
          <ul className="grid grid-cols-2 gap-y-8 py-10 md:grid-cols-5 md:gap-x-8 md:py-12">
            {trustFacts.map((fact, i) => (
              <li key={i} className="text-center md:text-left">
                <p className="font-display text-3xl text-ink md:text-4xl">
                  {fact.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-ink/60">
                  {fact.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Programs grid */}
      <section className="container py-16">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl">
            {locale === 'fr' ? 'Programmes' : 'Programs'}
          </h2>
          <Link
            href={`/${locale}/programmes`}
            className="text-sm text-ink/70 hover:text-accent"
          >
            {locale === 'fr' ? 'Tout voir' : 'See all'} →
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${locale}/${p.slug}`}
                className="block rounded-2xl border border-ink/10 p-6 transition hover:border-accent/40 hover:bg-paper"
              >
                <p className="text-xs uppercase tracking-widest text-ink/50">
                  {p.desc}
                </p>
                <p className="mt-2 font-display text-xl leading-snug">
                  {p.label}
                </p>
                <p className="mt-6 text-sm text-accent">
                  {locale === 'fr' ? 'Découvrir' : 'Discover'} →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Marquee défilant — projets étudiants en flux continu.
          Vient juste après la grille des noms de programmes : "vous
          avez vu les noms, voici la production". 8 visuels qui
          défilent en boucle infinie. CSS pure, respecte
          prefers-reduced-motion. */}
      <section className="py-10 md:py-16">
        <div className="container mb-8">
          <p className="text-sm uppercase tracking-widest text-accent">
            {locale === 'fr' ? 'Ce qu’on produit ici' : 'What we produce here'}
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl md:text-4xl">
            {locale === 'fr'
              ? 'Un flux continu de projets, en vrai.'
              : 'A continuous flow of projects, for real.'}
          </h2>
        </div>
        <Marquee speed="slow">
          {[
            { ratio: '4:5' as const, caption: locale === 'fr' ? 'Mode · silhouette défilé' : 'Fashion · runway silhouette' },
            { ratio: '3:4' as const, caption: locale === 'fr' ? 'Architecture · plan-coupe' : 'Architecture · section drawing' },
            { ratio: '1:1' as const, caption: locale === 'fr' ? 'Design produit · maquette' : 'Product · prototype' },
            { ratio: '3:4' as const, caption: locale === 'fr' ? 'Identité · poster festival' : 'Identity · festival poster' },
            { ratio: '4:5' as const, caption: locale === 'fr' ? 'Image 3D · still Unreal' : 'Image 3D · Unreal still' },
            { ratio: '1:1' as const, caption: locale === 'fr' ? 'Mode · détail tissu' : 'Fashion · fabric detail' },
            { ratio: '3:4' as const, caption: locale === 'fr' ? 'Communication · UX écran' : 'Communication · UX screen' },
            { ratio: '4:5' as const, caption: locale === 'fr' ? 'Scénographie · expo BOZAR' : 'Scenography · BOZAR expo' },
          ].map((item, i) => (
            <div key={i} className="h-80 w-60 shrink-0 md:h-96 md:w-72">
              <ImagePlaceholder
                ratio={item.ratio}
                caption={item.caption}
                className="h-full"
              />
            </div>
          ))}
        </Marquee>
      </section>

      {/* Upcoming events */}
      <section className="container py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl">
            {t('upcomingEvents')}
          </h2>
          <Link
            href={`/${locale}/events`}
            className="text-sm text-ink/70 hover:text-accent"
          >
            {t('viewAllEvents')} →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {eventsResult.docs.length === 0 ? (
            <p className="text-ink/60">—</p>
          ) : (
            eventsResult.docs.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} />
            ))
          )}
        </div>
      </section>

      {/* Recent news */}
      {postsResult.docs.length > 0 && (
        <section className="container py-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl md:text-4xl">
              {locale === 'fr' ? 'Actualités' : 'Latest news'}
            </h2>
            <Link
              href={`/${locale}/news`}
              className="text-sm text-ink/70 hover:text-accent"
            >
              {locale === 'fr' ? 'Toutes les actus' : 'All news'} →
            </Link>
          </div>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {postsResult.docs.map((post) => (
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
                  <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-accent">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-ink/70">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AdmissionCTA locale={locale} variant="primary" />
    </div>
  )
}
