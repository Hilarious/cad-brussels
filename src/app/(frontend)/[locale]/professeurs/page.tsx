import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { RelatedContent } from '@/components/related-content'
import { getPayload } from 'payload'
import { PROFESSEURS_ACTUELS } from '@/lib/professeurs-actuels'
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
        title: 'Professeurs au CAD Brussels, des professionnels en activité',
        description:
          'Une cinquantaine de professeurs, tous en activité dans leur métier : designers, architectes, directeurs artistiques, motion designers, créateurs de mode. Voici qui enseigne au CAD.',
      }
    : {
        title: 'Faculty at CAD Brussels, working professionals',
        description:
          'About fifty teachers, all active in their craft: designers, architects, art directors, motion designers, fashion creators. Meet the people who teach at CAD.',
      }
}

// ---------------------------------------------------------------- faculty data
// Note: profiles are placeholder representations of the kind of profiles
// that teach at CAD (working professionals from agencies, studios, firms,
// houses, freelancers). Replace with real teachers
// once the school has consent and proper biographies. Structure is
// intentionally consistent so a future Payload `Faculty` collection
// can plug in here.
type FacultyMember = {
  name: string
  initials: string
  subject: string
  programs: string[]
  parallelRole: string
  parallelEmployer: string
  city: string
}

const facultyFR: FacultyMember[] = PROFESSEURS_ACTUELS.map((p) => ({
  name: p.name,
  initials: p.name
    .split(' ')
    .map((mot) => mot[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase(),
  subject: '',
  programs: [],
  parallelRole: p.parallelRole,
  parallelEmployer: p.parallelEmployer,
  city: '',
}))

// Les rôles viennent de l'ancien site, déjà rédigés en anglais pour la
// plupart : même liste dans les deux langues tant que l'école n'a pas
// rempli la collection Faculty.
const facultyEN: FacultyMember[] = facultyFR

export default async function FacultyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'
  // Même principe que pour les alumni : le CMS d'abord, les données en
  // dur en repli tant que la collection n'est pas alimentée.
  const payload = await getPayload({ config })
  // La requête est protégée : tant que la migration de schéma n'est pas
  // passée en production, la table n'existe pas et Postgres renvoie une
  // erreur 42P01 qui faisait échouer le build entier. On retombe alors
  // sur les données écrites en dur, exactement comme si la collection
  // était vide.
  const enBase = await payload
    .find({
      collection: 'faculty',
      locale: locale as 'fr' | 'en',
      where: { status: { equals: 'published' } },
      sort: 'order',
      limit: 200,
      depth: 1,
    })
    .catch(() => ({ docs: [] as never[] }))

  const faculty: FacultyMember[] = enBase.docs.length
    ? enBase.docs.map((m) => ({
        name: m.name,
        initials: m.name
          .split(' ')
          .map((mot) => mot[0] ?? '')
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        subject: m.subject,
        programs: (m.programs ?? []).map((pr) => pr.label),
        parallelRole: m.parallelRole,
        parallelEmployer: m.parallelEmployer,
        city: m.city ?? '',
      }))
    : isFR
      ? facultyFR
      : facultyEN

  const L = isFR
    ? {
        eyebrow: 'Professeurs',
        title: 'Des professionnels, pas des académiciens.',
        intro:
          "Une cinquantaine de professeurs enseignent au CAD. Tous travaillent en parallèle dans leur métier : agence, studio, cabinet, maison, freelance. Ils sont au contact direct des clients, du marché, des contraintes réelles. Et c'est cette expérience-là qu'ils transmettent en cours, le soir même.",
        why:
          "Pourquoi cette règle ? Parce que le design évolue trop vite pour être enseigné par des théoriciens. Les outils d'aujourd'hui (IA, Figma, Unreal) n'existaient pas il y a 5 ans. Et un brief client, une deadline, une présentation à un comité de marque, ça ne s'apprend pas dans un manuel. Ça se transmet par ceux qui le vivent.",
        teaches: 'Enseigne',
        worksAt: 'En parallèle',
        based: 'Basé·e à',
        for: 'Pour',
        ctaTitle: 'Vous voulez en savoir plus sur un·e prof ?',
        ctaBody:
          "Le secrétariat peut organiser un échange court avec un·e enseignant·e du programme qui vous intéresse, par mail ou en visio. C'est souvent le moyen le plus efficace de comprendre la pédagogie réelle.",
        ctaButton: 'Demander un échange',
      }
    : {
        eyebrow: 'Faculty',
        title: 'Working professionals, not academics.',
        intro:
          'About fifty teachers teach at CAD. All work in parallel in their craft: agency, studio, firm, house, freelance. They are in direct contact with clients, the market, the real constraints. And that’s the experience they bring to class, the same evening.',
        why:
          'Why this rule? Because design evolves too fast to be taught by theorists. Today’s tools (AI, Figma, Unreal) didn’t exist 5 years ago. And a client brief, a deadline, a presentation to a brand committee, you don’t learn that in a textbook. It is passed on by those who live it.',
        teaches: 'Teaches',
        worksAt: 'Also',
        based: 'Based in',
        for: 'For',
        ctaTitle: 'Want to know more about a specific teacher?',
        ctaBody:
          'The secretariat can arrange a short exchange with a teacher from the program that interests you, by email or video call. Often the most efficient way to understand the actual pedagogy.',
        ctaButton: 'Request an exchange',
      }

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

      {/* Pattern A — Image full-bleed après le hero pour donner immédiatement
          le ton "atelier vivant". Vue d'un cours en train de se passer,
          prof + étudiants en interaction. */}
      <section className="-mx-4 mt-16 md:-mx-8 xl:-mx-12">
        <ImagePlaceholder
          ratio="21:9"
          caption={
            isFR
              ? 'Scène · prof corrigeant un projet étudiant en atelier'
              : 'Scene · faculty member reviewing a student project in the studio'
          }
          className="rounded-none border-0"
        />
      </section>

      {/* Why this rule — pulled out as a key argument */}
      <section className="mt-16 max-w-3xl rounded-2xl border border-ink/10 bg-paper p-8">
        <p className="text-ink/80">{L.why}</p>
      </section>

      {/* Faculty grid.
          Chaque carte intègre maintenant un portrait 2:3 en tête,
          remplaçant l'avatar initiales. Ratio portrait éditorial
          classique, en cohérence avec le brief photographe. */}
      <section className="mt-20">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {faculty.map((m, i) => (
            <li
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper"
            >
              {/* Portrait éditorial 2:3 en tête de carte */}
              <ImagePlaceholder
                ratio="2:3"
                caption={`Portrait · ${m.name} · ${m.parallelRole}`}
                className="rounded-none border-0 border-b border-ink/10"
              />
              <div className="flex flex-1 flex-col p-6">
                <div>
                  <p className="font-display text-lg leading-tight">
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-widest text-ink/50">
                    {m.city}
                  </p>
                </div>

              <dl className="mt-6 space-y-3 text-sm">
                {m.subject && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-ink/50">
                      {L.teaches}
                    </dt>
                    <dd className="mt-1 text-ink">{m.subject}</dd>
                  </div>
                )}
                {m.programs.length > 0 && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-ink/50">
                      {L.for}
                    </dt>
                    <dd className="mt-1 text-ink/70">{m.programs.join(' · ')}</dd>
                  </div>
                )}
                {m.parallelRole && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-ink/50">
                      {L.worksAt}
                    </dt>
                    <dd className="mt-1 text-ink/70">
                      {m.parallelRole}
                      {m.parallelEmployer && (
                        <span className="text-ink/50">, {m.parallelEmployer}</span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Maillage éditorial — bloc "à découvrir aussi" pour renforcer
          le maillage interne contextuel. */}
      <RelatedContent locale={locale} />

      {/* CTA */}
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
