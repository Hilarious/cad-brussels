import Link from 'next/link'
import { Fragment } from 'react'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'
import { ImagePlaceholder } from '@/components/image-placeholder'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Alumni du CAD Brussels, où sont nos diplômés',
        description:
          'Portraits de diplômés du CAD : architectes d’intérieur, designers digitaux, créateurs de mode, motion designers. Où ils sont, ce qu’ils font, ce qu’ils en disent.',
      }
    : {
        title: 'CAD Brussels Alumni, where our graduates are',
        description:
          'Portraits of CAD graduates: interior architects, digital designers, fashion designers, motion designers. Where they are, what they do, what they say.',
      }
}

// ---------------------------------------------------------------- alumni data
// Note: photos are placeholders for now. Replace `imageUrl` with real
// CDN URLs once the school has consent and final images. The structure
// is intentionally consistent so a future Payload `Alumni` collection
// can plug in here without touching the rendering.
type Alumni = {
  name: string
  classOf: string
  program: string
  programSlug: string
  currentRole: string
  currentEmployer: string
  city: string
  quote: string
  initials: string
}

const alumniFR: Alumni[] = [
  {
    name: 'Inès Daems',
    classOf: 'Promo 2022',
    program: 'Communication & Digital',
    programSlug: 'communication-digital-design',
    currentRole: 'Art Director',
    currentEmployer: 'Mortierbrigade',
    city: 'Bruxelles',
    quote:
      "Au CAD, on m'a appris à défendre une idée devant un jury de pros, pas seulement à la dessiner. Aujourd'hui je dirige des campagnes pour des marques que j'admirais quand j'étais étudiante.",
    initials: 'ID',
  },
  {
    name: 'Lukas Vandenberghe',
    classOf: 'Promo 2021',
    program: 'Architecture d’intérieur',
    programSlug: 'interior-architecture-design',
    currentRole: 'Architecte d’intérieur',
    currentEmployer: 'Studio indépendant',
    city: 'Anvers',
    quote:
      "J'ai monté mon studio 18 mois après le diplôme. Ce qui m'a permis de partir vite : les briefs réels qu'on faisait en 3e année, et le carnet d'adresses que les profs nous transmettent.",
    initials: 'LV',
  },
  {
    name: 'Maya Tanaka',
    classOf: 'Promo 2023',
    program: 'Mode & Accessoires',
    programSlug: 'fashion-accessory-design',
    currentRole: 'Junior designer',
    currentEmployer: 'Maison Margiela',
    city: 'Paris',
    quote:
      'Mon défilé de 3e année m\'a fait repérer par un studio de tendance, qui m\'a recommandée à Margiela. Le défilé public, ce n\'est pas un exercice scolaire, c\'est ton portfolio vivant.',
    initials: 'MT',
  },
  {
    name: 'Tom Verheyen',
    classOf: 'Promo 2022',
    program: 'Image, 3D, Motion, IA',
    programSlug: 'image-3d-motion-video-ai',
    currentRole: 'Motion designer',
    currentEmployer: 'Buck Studios',
    city: 'Amsterdam',
    quote:
      "Le Master m'a forcé à passer de l'esthétique au workflow industriel. C'est là que j'ai compris la différence entre faire de jolies images et livrer un projet qui tient en agence.",
    initials: 'TV',
  },
  {
    name: 'Léa Moreno',
    classOf: 'Promo 2021',
    program: 'Home & Living Design',
    programSlug: 'home-living-design',
    currentRole: 'Designer produit',
    currentEmployer: 'Vitra (équipe externe)',
    city: 'Bâle',
    quote:
      'Le workshop Milan en cours d\'année a été un déclic. J\'y ai rencontré l\'éditeur qui m\'a contactée 6 mois après le diplôme pour développer une chaise.',
    initials: 'LM',
  },
  {
    name: 'Karim Belkacem',
    classOf: 'Promo 2023',
    program: 'Digital Brand Content',
    programSlug: 'digital-brand-content',
    currentRole: 'Content Strategist',
    currentEmployer: 'Decathlon',
    city: 'Lille',
    quote:
      'Les briefs en cours étaient apportés par des marques réelles, et le mien sur Decathlon m\'a directement débouché sur un stage puis un poste. Le diplôme arrive après.',
    initials: 'KB',
  },
  {
    name: 'Sofia Rocha',
    classOf: 'Promo 2024',
    program: 'Communication & Digital',
    programSlug: 'communication-digital-design',
    currentRole: 'Designer freelance',
    currentEmployer: 'Studio personnel',
    city: 'Lisbonne',
    quote:
      "Je voulais rentrer au Portugal mais garder un réseau européen. Les workshops à Lisbonne pendant le cursus m'ont fait connaître des studios là-bas, je travaille avec deux d'entre eux maintenant.",
    initials: 'SR',
  },
  {
    name: 'Antoine Lambert',
    classOf: 'Promo 2022',
    program: 'Event Management',
    programSlug: 'event-management',
    currentRole: 'Producteur événementiel',
    currentEmployer: 'Indépendant',
    city: 'Bruxelles',
    quote:
      'Promo de 12 personnes, suivi individuel sur les deux événements de l\'année, stage de 6 mois chez un producteur reconnu. À la sortie, j\'avais un carnet d\'adresses opérationnel.',
    initials: 'AL',
  },
]

const alumniEN: Alumni[] = [
  {
    name: 'Inès Daems',
    classOf: 'Class of 2022',
    program: 'Communication & Digital',
    programSlug: 'communication-digital-design',
    currentRole: 'Art Director',
    currentEmployer: 'Mortierbrigade',
    city: 'Brussels',
    quote:
      "At CAD, I learned to defend an idea in front of a jury of pros, not just draw it. Today I lead campaigns for brands I admired as a student.",
    initials: 'ID',
  },
  {
    name: 'Lukas Vandenberghe',
    classOf: 'Class of 2021',
    program: 'Interior Architecture',
    programSlug: 'interior-architecture-design',
    currentRole: 'Interior architect',
    currentEmployer: 'Independent studio',
    city: 'Antwerp',
    quote:
      'I started my studio 18 months after graduation. What let me go fast: the real briefs we did in year 3, and the network teachers pass on.',
    initials: 'LV',
  },
  {
    name: 'Maya Tanaka',
    classOf: 'Class of 2023',
    program: 'Fashion & Accessory',
    programSlug: 'fashion-accessory-design',
    currentRole: 'Junior designer',
    currentEmployer: 'Maison Margiela',
    city: 'Paris',
    quote:
      "My year-3 runway got me spotted by a trend studio, who recommended me to Margiela. The public show isn’t a school exercise, it’s your living portfolio.",
    initials: 'MT',
  },
  {
    name: 'Tom Verheyen',
    classOf: 'Class of 2022',
    program: 'Image, 3D, Motion, AI',
    programSlug: 'image-3d-motion-video-ai',
    currentRole: 'Motion designer',
    currentEmployer: 'Buck Studios',
    city: 'Amsterdam',
    quote:
      "The Master forced me to move from aesthetics to industrial workflow. That’s when I understood the difference between making nice visuals and shipping a project that holds in agency.",
    initials: 'TV',
  },
  {
    name: 'Léa Moreno',
    classOf: 'Class of 2021',
    program: 'Home & Living Design',
    programSlug: 'home-living-design',
    currentRole: 'Product designer',
    currentEmployer: 'Vitra (external team)',
    city: 'Basel',
    quote:
      "The Milan workshop mid-year was a turning point. I met the editor who reached out 6 months after graduation to develop a chair together.",
    initials: 'LM',
  },
  {
    name: 'Karim Belkacem',
    classOf: 'Class of 2023',
    program: 'Digital Brand Content',
    programSlug: 'digital-brand-content',
    currentRole: 'Content Strategist',
    currentEmployer: 'Decathlon',
    city: 'Lille',
    quote:
      'Class briefs were brought by real brands, and mine on Decathlon led straight to an internship then a role. The diploma comes after.',
    initials: 'KB',
  },
  {
    name: 'Sofia Rocha',
    classOf: 'Class of 2024',
    program: 'Communication & Digital',
    programSlug: 'communication-digital-design',
    currentRole: 'Freelance designer',
    currentEmployer: 'Personal studio',
    city: 'Lisbon',
    quote:
      "I wanted to go back to Portugal but keep a European network. The Lisbon workshops during the program got me known by studios there, I work with two of them now.",
    initials: 'SR',
  },
  {
    name: 'Antoine Lambert',
    classOf: 'Class of 2022',
    program: 'Event Management',
    programSlug: 'event-management',
    currentRole: 'Event producer',
    currentEmployer: 'Independent',
    city: 'Brussels',
    quote:
      'Cohort of 12, individual support on the two events of the year, 6-month internship at a recognised producer. At graduation I had an operational address book.',
    initials: 'AL',
  },
]

export default async function AlumniPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'
  const alumni = isFR ? alumniFR : alumniEN

  const L = isFR
    ? {
        eyebrow: 'Alumni',
        title: 'Ils ont fait le CAD. Voici où ils sont aujourd’hui.',
        intro:
          'Quelques portraits de diplômés récents, dans tous les programmes. Pas un panthéon. Juste des gens qui ont commencé là où vous êtes, et qui font aujourd’hui ce qu’ils voulaient faire.',
        worksAt: 'Travaille chez',
        based: 'Basé·e à',
        seeProgram: 'Voir le programme →',
        ctaTitle: 'Vous voulez en savoir plus sur un parcours en particulier ?',
        ctaBody:
          "Le secrétariat peut vous mettre en contact avec un alumni du programme qui vous intéresse. Échange direct, sans engagement. C'est souvent ce qui fait basculer une décision.",
        ctaButton: 'Demander un contact alumni',
      }
    : {
        eyebrow: 'Alumni',
        title: 'They did CAD. Here is where they are now.',
        intro:
          'A few portraits of recent graduates, across all programs. Not a hall of fame. Just people who started where you are, and now do what they wanted to do.',
        worksAt: 'Works at',
        based: 'Based in',
        seeProgram: 'See program →',
        ctaTitle: 'Want to know more about a specific path?',
        ctaBody:
          'The secretariat can connect you with an alumni from the program that interests you. Direct exchange, no commitment. Often the thing that tips a decision.',
        ctaButton: 'Request an alumni contact',
      }

  // Featured alumni for the hero mosaic (Pattern I — mosaïque irrégulière).
  // 5 portraits emblématiques, mix de programmes et de villes, pour
  // donner immédiatement le ton "international" et "diversité créative".
  const featuredAlumni = alumni.slice(0, 5)

  // Position de la citation visuelle (Pattern C) : entre la 4ème et la
  // 5ème carte alumni, comme un point de respiration éditorial.
  const QUOTE_INSERT_AFTER = 3

  return (
    <article className="container py-16">
      {/* Hero */}
      <header className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-ink/70">{L.intro}</p>
      </header>

      {/* Pattern I — Mosaïque irrégulière de portraits emblématiques.
          5 portraits de tailles différentes : 1 grand qui ancre + 4
          plus petits. Effet "contact sheet" qui dit "voici nos
          diplômés" sans avoir besoin de mots. */}
      <section className="mt-16">
        <div className="grid grid-cols-6 gap-3 md:gap-4">
          {/* Grand portrait à gauche, sur 2 lignes en desktop */}
          <div className="col-span-6 md:col-span-3 md:row-span-2">
            <ImagePlaceholder
              ratio="4:5"
              caption={`Portrait · ${featuredAlumni[0].name} · ${featuredAlumni[0].currentEmployer}`}
              className="h-full"
            />
          </div>
          {/* 4 portraits plus petits qui jouent autour */}
          <div className="col-span-3 md:col-span-3">
            <ImagePlaceholder
              ratio="1:1"
              caption={`Portrait · ${featuredAlumni[1].name}`}
            />
          </div>
          <div className="col-span-3 md:col-span-3">
            <ImagePlaceholder
              ratio="1:1"
              caption={`Portrait · ${featuredAlumni[2].name}`}
            />
          </div>
          <div className="col-span-3 md:col-span-2">
            <ImagePlaceholder
              ratio="1:1"
              caption={`Portrait · ${featuredAlumni[3].name}`}
            />
          </div>
          <div className="col-span-3 md:col-span-4">
            <ImagePlaceholder
              ratio="16:9"
              caption={`Scène · ${featuredAlumni[4].name} dans son contexte pro`}
            />
          </div>
        </div>
      </section>

      {/* Grid of alumni cards.
          Chaque carte intègre maintenant un portrait 4:5 en tête,
          suivi du témoignage et des métadonnées (Pattern E réduit).
          Une citation visuelle (Pattern C) interrompt la grille
          après le 4ème portrait pour créer un rythme. */}
      <section className="mt-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {alumni.map((a, i) => (
            <Fragment key={`alumni-frag-${i}`}>
              <li
                className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper"
              >
                {/* Portrait au-dessus de la carte */}
                <ImagePlaceholder
                  ratio="4:5"
                  caption={`Portrait · ${a.name} · ${a.currentRole}`}
                  className="rounded-none border-0 border-b border-ink/10"
                />
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <p className="font-display text-xl">{a.name}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-widest text-ink/50">
                    {a.classOf} · {a.program}
                  </p>

                  <blockquote className="mt-6 text-ink/80 italic">
                    « {a.quote} »
                  </blockquote>

                  <dl className="mt-6 space-y-2 text-sm text-ink/70">
                    <div className="flex justify-between gap-3 border-t border-ink/10 pt-3">
                      <dt className="text-ink/50">{L.worksAt}</dt>
                      <dd className="text-right text-ink">
                        {a.currentRole}
                        <span className="text-ink/60">
                          , {a.currentEmployer}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink/50">{L.based}</dt>
                      <dd className="text-right text-ink">{a.city}</dd>
                    </div>
                  </dl>

                  <Link
                    href={`/${locale}/${a.programSlug}`}
                    className="mt-6 inline-flex text-sm text-accent hover:underline"
                  >
                    {L.seeProgram}
                  </Link>
                </div>
              </li>

              {/* Pattern C — Citation visuelle insérée après la 4ème carte.
                  Span pleine largeur (col-span-2) pour casser la grille. */}
              {i === QUOTE_INSERT_AFTER && (
                <li className="md:col-span-2 relative overflow-hidden rounded-2xl">
                  <ImagePlaceholder
                    ratio="21:9"
                    caption="Scène · alumni en pleine action dans son agence"
                    className="rounded-none border-0"
                  />
                  <div className="absolute inset-0 flex items-end bg-ink/40 p-8 md:p-16">
                    <div className="max-w-3xl text-paper">
                      <p className="text-sm uppercase tracking-widest text-paper/70">
                        {locale === 'fr'
                          ? 'Témoignage · Promo 2023'
                          : 'Featured story · Class of 2023'}
                      </p>
                      <blockquote className="mt-4 font-display text-2xl leading-snug md:text-4xl">
                        {locale === 'fr'
                          ? '« Mon défilé de 3e année m\'a fait repérer par un studio de tendance, qui m\'a recommandée à Margiela. »'
                          : "« My year-3 runway got me spotted by a trend studio, who recommended me to Margiela. »"}
                      </blockquote>
                      <p className="mt-6 text-sm text-paper/80">
                        {locale === 'fr'
                          ? 'Maya Tanaka · Junior designer chez Maison Margiela · Paris'
                          : 'Maya Tanaka · Junior designer at Maison Margiela · Paris'}
                      </p>
                    </div>
                  </div>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </section>

      {/* CTA — request an alumni contact */}
      <PageCTA
        title={L.ctaTitle}
        body={L.ctaBody}
        ctaLabel={L.ctaButton}
        ctaHref={`/${locale}/contact`}
        nested
      />
    </article>
  )
}
