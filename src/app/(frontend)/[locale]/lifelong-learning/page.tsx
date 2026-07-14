import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: "Lifelong Learning au CAD, formations IA pour professionnels créatifs",
        description:
          "Cours du soir en intelligence artificielle pour designers, agences créatives et architectes. Modules courts, projets réels, encadrement par des professionnels en activité.",
      }
    : {
        title: 'Lifelong Learning at CAD, AI training for creative professionals',
        description:
          'Evening classes in artificial intelligence for designers, creative agencies and architects. Short modules, real projects, mentored by working professionals.',
      }
}

export default async function LifelongLearningHub({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        eyebrow: 'Lifelong Learning',
        title: "Continuer à apprendre, pour rester un·e professionnel·le pertinent·e.",
        intro:
          "Les Lifelong Learning du CAD sont des modules courts pensés pour les professionnels en activité qui veulent rester en avance dans un paysage créatif en pleine mutation. Cours du soir, projets réels, méthodes concrètes.",
        whyTitle: 'À qui ça s’adresse',
        whyBody:
          "Designers, directeurs artistiques, architectes, chefs de projet, freelances, équipes en agence : toute personne qui produit ou pilote de la création visuelle et veut intégrer l'IA dans son workflow sans perdre la main sur sa direction artistique. Pas besoin de savoir coder. Pas de discours marketing. On vient pour repartir avec des projets concrets et une méthode claire.",
        formatTitle: 'Le format',
        formatBody:
          "10 séances de 2h, en soirée, en présentiel à Bruxelles. Chaque module se conclut par un projet personnel mené tout au long du cours, présenté en fin de session. Les groupes restent petits pour garder la qualité de l'accompagnement.",
        sectionsTitle: 'Les modules disponibles',
        sections: [
          {
            slug: 'generative-ai-creative',
            audience: 'Communication, design digital, branding',
            title: 'Generative AI for Creative Professionals',
            desc: "Pour les agences créatives et les pros de la communication qui veulent dépasser l'effet wow et reprendre le contrôle créatif sur les outils d'IA générative.",
            cta: 'Voir le module',
          },
          {
            slug: 'applied-ai-spatial-design',
            audience: 'Architecture, design d’espace, design produit',
            title: 'IA appliquée : Architecture, Design d’espace & Produit',
            desc: 'Pour passer du concept à la visualisation, guider l’IA avec précision sur les ambiances et les matériaux, et accélérer la phase d’idéation sans perdre l’intention design.',
            cta: 'Voir le module',
          },
        ],
        ctaTitle: "Une question, une demande sur-mesure pour votre équipe ?",
        ctaBody:
          "Les modules existants peuvent aussi être adaptés en intra-entreprise pour vos équipes. Écrivez-nous, on en discute.",
        ctaButton: 'Nous contacter',
      }
    : {
        eyebrow: 'Lifelong Learning',
        title: 'Keep learning. Stay relevant.',
        intro:
          'CAD Lifelong Learning programs are short modules designed for working professionals who want to stay ahead in a fast-changing creative landscape. Evening classes, real projects, hands-on methodology.',
        whyTitle: 'Who it’s for',
        whyBody:
          'Designers, art directors, architects, project leads, freelancers and agency teams: anyone who produces or directs creative work and wants to integrate AI into their workflow without losing creative control. No coding required. No marketing fluff. You come in to leave with concrete projects and a clear method.',
        formatTitle: 'Format',
        formatBody:
          'Ten 2-hour evening sessions, on site in Brussels. Each module concludes with a personal project carried throughout the course and presented at the end. Small groups to keep mentoring quality high.',
        sectionsTitle: 'Available modules',
        sections: [
          {
            slug: 'generative-ai-creative',
            audience: 'Communication, digital design, branding',
            title: 'Generative AI for Creative Professionals',
            desc: 'For creative agencies and communication pros who want to move beyond the wow effect and regain creative control over generative AI tools.',
            cta: 'See module',
          },
          {
            slug: 'applied-ai-spatial-design',
            audience: 'Architecture, spatial design, product design',
            title: 'Applied AI: Architecture, Spatial & Product Design',
            desc: 'Move from concept to visualization, guide AI with precision on atmosphere and materials, and accelerate ideation without losing design intent.',
            cta: 'See module',
          },
        ],
        ctaTitle: 'A question, or a custom program for your team?',
        ctaBody:
          'Modules can be adapted in-house for your team. Drop us a line, we will figure it out together.',
        ctaButton: 'Contact us',
      }

  return (
    <div className="theme-lifelong">
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

      {/* Audience */}
      <section className="container py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl">{L.whyTitle}</h2>
          <p className="mt-6 text-ink/80">{L.whyBody}</p>
        </div>
      </section>

      {/* Format */}
      <section className="container py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl">{L.formatTitle}</h2>
          <p className="mt-6 text-ink/80">{L.formatBody}</p>
        </div>
      </section>

      {/* Modules */}
      <section className="container py-16">
        <h2 className="font-display text-3xl md:text-4xl">{L.sectionsTitle}</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {L.sections.map((section, i) => (
            <li key={i}>
              <Link
                href={`/${locale}/lifelong-learning/${section.slug}`}
                className="group block h-full rounded-2xl border border-ink/10 bg-paper p-6 transition hover:border-accent/40"
              >
                <p className="text-sm uppercase tracking-widest text-accent">
                  {section.audience}
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

      {/* CTA — uses the shared <PageCTA> for visual consistency
          across all "outro" blocks. Inherits theme-lifelong accent. */}
      <PageCTA
        title={L.ctaTitle}
        body={L.ctaBody}
        ctaLabel={L.ctaButton}
        ctaHref={`/${locale}/contact`}
      />
    </div>
  )
}
