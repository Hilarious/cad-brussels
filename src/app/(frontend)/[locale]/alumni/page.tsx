import Link from 'next/link'
import { Fragment } from 'react'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { RelatedContent } from '@/components/related-content'
import { getPayload } from 'payload'
import config from '@payload-config'

// Contenu venant du CMS (alumni/professeurs) : rafraichir sans exiger
// de redeploiement, comme les autres pages qui lisent Payload.
export const revalidate = 60

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

// Anciens étudiants repris de l'ancien site cad.be (page « Nos anciens
// étudiants »), le 22/09/2026. Les parcours, employeurs et témoignages
// sont à fournir par l'école dans l'admin, collection Alumni.
const alumniFR: Alumni[] = [
  { name: 'Benedetta Farruggio', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'BF' },
  { name: 'Thomas de Crombrugghe', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'TD' },
  { name: 'Marie Touzot', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'MT' },
  { name: 'Hans Haugaard', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'HH' },
  { name: 'Raïs de Weirdt', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'RD' },
  { name: 'Andrea Oerter', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'AO' },
  { name: 'Sibylle de Meeus', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'SD' },
  { name: 'Alexandra Grohol', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'AG' },
  { name: 'Matthieu Van Beneden', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'MV' },
  { name: 'Karine Szekeres', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'KS' },
  { name: 'Laurent Couche', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'LC' },
  { name: 'Elisabeth Schwarz', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'ES' },
  { name: 'Gauthier Guillaume', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'GG' },
  { name: 'Zazie Maquet', classOf: '', program: '', programSlug: '', currentRole: '', currentEmployer: '', city: '', quote: '', initials: 'ZM' },
]

const alumniEN: Alumni[] = alumniFR

export default async function AlumniPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  // Les portraits viennent désormais du CMS. Tant que la collection est
  // vide (base pas encore alimentée), on retombe sur les données écrites
  // en dur, pour que la page ne se vide jamais en cours de migration.
  const payload = await getPayload({ config })
  // La requête est protégée : tant que la migration de schéma n'est pas
  // passée en production, la table n'existe pas et Postgres renvoie une
  // erreur 42P01 qui faisait échouer le build entier. On retombe alors
  // sur les données écrites en dur, exactement comme si la collection
  // était vide.
  const enBase = await payload
    .find({
      collection: 'alumni',
      locale: locale as 'fr' | 'en',
      where: { status: { equals: 'published' } },
      sort: 'order',
      limit: 100,
      depth: 1,
    })
    .catch(() => ({ docs: [] as never[] }))

  const alumni: Alumni[] = enBase.docs.length
    ? enBase.docs.map((d) => ({
        name: d.name,
        classOf: d.classOf,
        program: d.program,
        programSlug: d.programSlug ?? '',
        currentRole: d.currentRole,
        currentEmployer: d.currentEmployer,
        city: d.city ?? '',
        quote: d.quote,
        initials: d.name
          .split(' ')
          .map((mot) => mot[0] ?? '')
          .slice(0, 2)
          .join('')
          .toUpperCase(),
      }))
    : isFR
      ? alumniFR
      : alumniEN

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
  // La mosaïque du haut réclame cinq portraits. Le contenu venant
  // désormais du CMS, l'école peut très bien n'en publier que deux :
  // sans ce garde-fou, la page plante en production dès qu'il en manque.
  // On complète en rebouclant sur la liste plutôt que de casser la grille.
  const base = alumni.length ? alumni : []
  const featuredAlumni = Array.from(
    { length: 5 },
    (_, i) => base[i % Math.max(base.length, 1)],
  ).filter(Boolean)


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
              caption={`Portrait · ${featuredAlumni[0]?.name ?? ''} · ${featuredAlumni[0]?.currentEmployer ?? ''}`}
              className="h-full"
            />
          </div>
          {/* 4 portraits plus petits qui jouent autour */}
          <div className="col-span-3 md:col-span-3">
            <ImagePlaceholder
              ratio="1:1"
              caption={`Portrait · ${featuredAlumni[1]?.name ?? ''}`}
            />
          </div>
          <div className="col-span-3 md:col-span-3">
            <ImagePlaceholder
              ratio="1:1"
              caption={`Portrait · ${featuredAlumni[2]?.name ?? ''}`}
            />
          </div>
          <div className="col-span-3 md:col-span-2">
            <ImagePlaceholder
              ratio="1:1"
              caption={`Portrait · ${featuredAlumni[3]?.name ?? ''}`}
            />
          </div>
          <div className="col-span-3 md:col-span-4">
            <ImagePlaceholder
              ratio="16:9"
              caption={`Scène · ${featuredAlumni[4]?.name ?? ''} dans son contexte pro`}
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
                  {(a.classOf || a.program) && (
                    <p className="mt-0.5 text-xs uppercase tracking-widest text-ink/50">
                      {[a.classOf, a.program].filter(Boolean).join(' · ')}
                    </p>
                  )}

                  {a.quote && (
                    <blockquote className="mt-6 text-ink/80 italic">
                      « {a.quote} »
                    </blockquote>
                  )}

                  {(a.currentRole || a.city) && (
                    <dl className="mt-6 space-y-2 text-sm text-ink/70">
                      {a.currentRole && (
                        <div className="flex justify-between gap-3 border-t border-ink/10 pt-3">
                          <dt className="text-ink/50">{L.worksAt}</dt>
                          <dd className="text-right text-ink">
                            {a.currentRole}
                            {a.currentEmployer && (
                              <span className="text-ink/60">, {a.currentEmployer}</span>
                            )}
                          </dd>
                        </div>
                      )}
                      {a.city && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-ink/50">{L.based}</dt>
                          <dd className="text-right text-ink">{a.city}</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  {a.programSlug && (
                    <Link
                      href={`/${locale}/${a.programSlug}`}
                      className="mt-6 tap text-sm text-accent hover:underline"
                    >
                      {L.seeProgram}
                    </Link>
                  )}
                </div>
              </li>
            </Fragment>
          ))}
        </ul>
      </section>

      {/* Maillage éditorial — bloc "à découvrir aussi" avec événements
          à venir + dernières actualités. Renforce le maillage interne
          (facteur SEO #1 selon l'audit Digistage). */}
      <RelatedContent locale={locale} />

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
