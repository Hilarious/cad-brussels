import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { AdmissionCTA } from '@/components/admission-cta'
import { PageCTA } from '@/components/page-cta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Étudier à Bruxelles, le guide complet pour étudiants au CAD',
        description:
          'Logement, visa, transports, coût de la vie. Tout ce qu’un futur étudiant du CAD doit savoir avant de venir vivre à Bruxelles.',
      }
    : {
        title: 'Studying in Brussels, the complete guide for CAD students',
        description:
          'Housing, visa, transport, cost of living. Everything a future CAD student needs to know before moving to Brussels.',
      }
}

export default async function HubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        eyebrow: 'Étudier à Bruxelles',
        title: 'Vivre, étudier, créer à Bruxelles.',
        intro:
          "Bruxelles est l'une des capitales européennes les plus accessibles, multilingues et créatives du continent. Voici tout ce qu'il faut savoir avant de venir étudier au CAD : logement, démarches, vie pratique, budget.",
        whyTitle: 'Pourquoi choisir Bruxelles',
        whyBody:
          "Carrefour de trois cultures (francophone, néerlandophone, internationale), capitale de l'Union européenne, scène design en pleine ébullition, coût de la vie maîtrisé : Bruxelles offre l'équilibre parfait entre rayonnement international et qualité de vie quotidienne. À 1h25 de Paris, 1h50 de Londres, 3h d'Amsterdam en train direct.",
        sectionsTitle: 'Trois sujets à préparer avant votre arrivée',
        sections: [
          {
            slug: 'se-loger',
            title: 'Se loger à Bruxelles',
            desc: 'Kot étudiant, studio, colocation : où chercher, quels prix, quels quartiers privilégier près du CAD à Uccle.',
            cta: 'Lire le guide logement',
          },
          {
            slug: 'visa',
            title: 'Visa et démarches administratives',
            desc: 'UE et hors UE : visa étudiant D, inscription à la commune, ouverture de compte bancaire, sécurité sociale.',
            cta: 'Lire le guide visa',
          },
          {
            slug: 'vie-pratique',
            title: 'Vie pratique et budget',
            desc: 'Transports STIB, vélo, courses, sorties, santé. Combien prévoir par mois pour vivre confortablement.',
            cta: 'Lire le guide pratique',
          },
        ],
        statsTitle: 'Bruxelles en chiffres',
        stats: [
          { value: '~750€', label: 'Loyer mensuel pour un studio meublé' },
          { value: '~1 100€', label: 'Budget mensuel total recommandé' },
          { value: '12€', label: 'Abonnement transport mensuel jeune (STIB)' },
          { value: '1h25', label: 'Train direct Bruxelles-Paris' },
          { value: '25 min', label: 'Tram du campus CAD au centre-ville' },
          { value: '180+', label: 'Nationalités représentées à Bruxelles' },
        ],
        ctaTitle: 'Une question pratique sur votre arrivée ?',
        ctaBody:
          "Le secrétariat du CAD accompagne chaque étudiant international, dès l'admission confirmée, sur toutes les démarches : visa, logement, inscription à la commune, ouverture de compte.",
        ctaButton: 'Contacter le secrétariat',
      }
    : {
        eyebrow: 'Studying in Brussels',
        title: 'Live, study, create in Brussels.',
        intro:
          "Brussels is one of the most accessible, multilingual and creative European capitals on the continent. Here's everything you need to know before coming to study at CAD: housing, paperwork, daily life, budget.",
        whyTitle: 'Why choose Brussels',
        whyBody:
          "Crossroads of three cultures (French-speaking, Dutch-speaking, international), capital of the European Union, a thriving design scene, manageable cost of living: Brussels offers the perfect balance between international reach and everyday quality of life. 1h25 to Paris, 1h50 to London, 3h to Amsterdam by direct train.",
        sectionsTitle: 'Three topics to prepare before your arrival',
        sections: [
          {
            // Slugs des sous-pages restent en FR pour les deux locales :
            // les dossiers physiques sont `se-loger/`, `visa/`, `vie-pratique/`.
            // Voir helper subSlug() ci-dessous si on traduit un jour les URLs.
            slug: 'se-loger',
            title: 'Housing in Brussels',
            desc: 'Student room (kot), studio, shared flat: where to search, what to pay, best neighbourhoods near the CAD campus in Uccle.',
            cta: 'Read the housing guide',
          },
          {
            slug: 'visa',
            title: 'Visa and administrative steps',
            desc: 'EU and non-EU: student visa D, town hall registration, opening a bank account, healthcare.',
            cta: 'Read the visa guide',
          },
          {
            slug: 'vie-pratique',
            title: 'Daily life and budget',
            desc: 'STIB transport, cycling, groceries, going out, healthcare. How much to budget per month to live comfortably.',
            cta: 'Read the daily life guide',
          },
        ],
        statsTitle: 'Brussels in numbers',
        stats: [
          { value: '~€750', label: 'Monthly rent for a furnished studio' },
          { value: '~€1,100', label: 'Recommended total monthly budget' },
          { value: '€12', label: 'Monthly youth transport pass (STIB)' },
          { value: '1h25', label: 'Direct train Brussels to Paris' },
          { value: '25 min', label: 'Tram from CAD campus to downtown' },
          { value: '180+', label: 'Nationalities living in Brussels' },
        ],
        ctaTitle: 'Practical question about your arrival?',
        ctaBody:
          "The CAD secretariat assists every international student, once admission is confirmed, with all formalities: visa, housing, town hall registration, bank account.",
        ctaButton: 'Contact the secretariat',
      }

  return (
    <>
      {/* Hero */}
      <section className="container py-20 md:py-28">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/70">{L.intro}</p>
      </section>

      {/* Why Brussels */}
      <section className="container py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl">{L.whyTitle}</h2>
          <p className="mt-6 text-ink/80">{L.whyBody}</p>
        </div>
      </section>

      {/* Three sub-topics as deep-link cards */}
      <section className="container py-16">
        <h2 className="font-display text-3xl md:text-4xl">
          {L.sectionsTitle}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {L.sections.map((section, i) => (
            <li key={i}>
              <Link
                href={`/${locale}/etudier-a-bruxelles/${section.slug}`}
                className="group block h-full rounded-2xl border border-ink/10 bg-paper p-6 transition hover:border-accent/40"
              >
                <p className="text-sm uppercase tracking-widest text-accent">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-2xl leading-snug">
                  {section.title}
                </h3>
                <p className="mt-3 text-ink/70">{section.desc}</p>
                <p className="mt-6 text-sm text-accent group-hover:underline">
                  {section.cta} →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Stats grid */}
      <section className="container py-16">
        <h2 className="font-display text-3xl md:text-4xl">{L.statsTitle}</h2>
        <dl className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {L.stats.map((s, i) => (
            <div key={i}>
              <dt className="font-display text-4xl text-ink md:text-5xl">
                {s.value}
              </dt>
              <dd className="mt-2 text-sm uppercase tracking-widest text-ink/60">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contact secretariat CTA */}
      <PageCTA
        title={L.ctaTitle}
        body={L.ctaBody}
        ctaLabel={L.ctaButton}
        ctaHref={`/${locale}/contact`}
      />

      {/* Soft admission nudge — for visitors who got this far through
          the practical guides and might already be ready to apply. */}
      <AdmissionCTA locale={locale} variant="soft" />

      {/* Schema.org for AI engines / Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: L.title,
            description: L.intro,
            author: {
              '@type': 'EducationalOrganization',
              name: 'CAD Brussels',
              url: 'https://cad.be',
            },
            publisher: {
              '@type': 'EducationalOrganization',
              name: 'CAD Brussels',
            },
            inLanguage: locale,
            about: ['Brussels', 'Studying abroad', 'Student housing', 'Student visa'],
          }),
        }}
      />
    </>
  )
}
