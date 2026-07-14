import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'
import { Breadcrumb } from '@/components/breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: "IA pour Architecture et Design d'espace · CAD Brussels",
        description:
          "Module IA pour architectes, designers d’espace et de produit. Du concept à la visualisation, ambiances et matériaux maîtrisés. 10 séances de 2h à Bruxelles.",
      }
    : {
        title: 'Applied AI for Architecture & Spatial Design · CAD Brussels',
        description:
          'AI module for architects, spatial and product designers. From concept to visualization, controlled atmospheres and materials. Ten 2-hour evening sessions in Brussels.',
      }
}

export default async function AppliedAISpatial({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        backLabel: 'Lifelong Learning',
        eyebrow: 'Module IA · Architecture, design d’espace & produit',
        title: "IA appliquée : Architecture, Design d'espace et Produit",
        intro:
          "Un module pour passer du concept à la visualisation, guider l'IA avec précision sur l'esthétique, les matériaux et les ambiances, et accélérer la phase d'idéation tout en gardant l'intention design intacte.",
        positioningTitle: 'Le positionnement',
        positioning:
          "L'IA n'est pas un gadget de présentation. Bien dirigée, elle devient un outil de production scalable, capable d'accompagner aussi bien l'expérimentation pure que la livraison de visuels prêts pour un client. Ce module enseigne à la traiter comme un·e designer junior : à briefer, à corriger, à itérer avec.",
        outcomesTitle: 'Ce que vous emportez en partant',
        outcomes: [
          "Transformer une idée spatiale floue en concept visuel clair, lisible par un client ou une équipe.",
          "Produire des visualisations d'intérieur et de produit avec ambiances, matériaux et contenu animé.",
          "Comprendre ce que l'IA fait réellement et comment la diriger plutôt que la subir.",
          "Collaborer avec l'IA comme avec un·e designer junior : briefer, recadrer, itérer.",
        ],
        scenariosTitle: 'Sur quoi vous travaillez concrètement',
        scenarios: [
          'À partir d’un croquis main levée, générer une série de variations cohérentes.',
          'À partir d’un plan ou d’une photo, produire une narration visuelle avec atmosphère contrôlée.',
          'À partir d’un brief client, tester rapidement plusieurs directions avant maquette.',
          'Produire un contenu animé court pour défendre un projet en présentation.',
        ],
        forWhomTitle: 'Pour qui',
        forWhom: [
          'Architectes, architectes d’intérieur',
          'Designers d’espace, scénographes, retail designers',
          'Designers produit, designers industriels',
          'Bureaux d’études et studios qui livrent du visuel client',
        ],
        formatTitle: 'Format',
        format: [
          { label: 'Durée', value: '10 séances de 2h, en soirée' },
          { label: 'Lieu', value: 'CAD Brussels, Uccle' },
          { label: 'Langue', value: 'Français' },
          { label: 'Niveau', value: 'Pro en activité, pas besoin de coder' },
          { label: 'Évaluation', value: 'Projet personnel filé, présenté en fin de module' },
        ],
        approachTitle: 'L’approche pédagogique',
        approach:
          "Chaque séance part d'une situation créative réelle : un croquis, une photo, un plan, un brief. On apprend à diriger l'IA, pas à la subir, pour produire un visuel ou un contenu animé qui tient debout en présentation client.",
        ctaTitle: 'Intéressé·e par cette session ?',
        ctaBody:
          "Écrivez-nous pour connaître les dates de la prochaine session, le tarif et les modalités d'inscription. Les places sont limitées pour garder un accompagnement de qualité.",
        ctaButton: 'Demander les infos',
      }
    : {
        backLabel: 'Lifelong Learning',
        eyebrow: 'AI module · Architecture, spatial & product design',
        title: 'Applied AI: Architecture, Spatial & Product Design',
        intro:
          'A module to move from concept to visualization, guide AI with precision on aesthetics, materials and atmospheres, and accelerate ideation while keeping design intent intact.',
        positioningTitle: 'Positioning',
        positioning:
          'AI is not a presentation gimmick. Properly directed, it becomes a scalable production tool, capable of supporting both pure experimentation and the delivery of client-ready visuals. This module teaches you to treat it like a junior designer: brief it, correct it, iterate with it.',
        outcomesTitle: 'What you walk away with',
        outcomes: [
          'Turn a vague spatial idea into a clear visual concept, readable by a client or a team.',
          'Produce interior and product visualizations with controlled atmospheres, materials and animated content.',
          'Understand what AI actually does and how to direct it rather than be carried by it.',
          'Collaborate with AI as you would with a junior designer: brief, reframe, iterate.',
        ],
        scenariosTitle: 'What you actually work on',
        scenarios: [
          'From a hand sketch, generate a series of coherent variations.',
          'From a plan or a photo, produce a visual narrative with controlled atmosphere.',
          'From a client brief, quickly test several directions before mockup.',
          'Produce a short animated content to defend a project in presentation.',
        ],
        forWhomTitle: 'Who it’s for',
        forWhom: [
          'Architects, interior architects',
          'Spatial designers, scenographers, retail designers',
          'Product designers, industrial designers',
          'Studios and design offices that deliver client-facing visuals',
        ],
        formatTitle: 'Format',
        format: [
          { label: 'Duration', value: 'Ten 2-hour evening sessions' },
          { label: 'Location', value: 'CAD Brussels, Uccle' },
          { label: 'Language', value: 'French' },
          { label: 'Level', value: 'Working pros, no coding required' },
          { label: 'Assessment', value: 'Personal project carried through, presented at the end' },
        ],
        approachTitle: 'Teaching approach',
        approach:
          'Each session starts from a real creative situation: a sketch, a photo, a plan, a brief. You learn to direct AI, not be carried by it, to produce a visual or animated content that holds up in client presentation.',
        ctaTitle: 'Interested in this session?',
        ctaBody:
          'Drop us a line for the next session dates, fees and enrolment details. Spots are limited to keep mentoring quality high.',
        ctaButton: 'Request info',
      }

  return (
    <article className="theme-lifelong container py-16">
      <Breadcrumb
        locale={locale}
        items={[
          { label: L.backLabel, href: `/${locale}/lifelong-learning` },
          { label: L.eyebrow },
        ]}
      />

      {/* Hero */}
      <header className="mt-8 max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-ink/70">{L.intro}</p>
      </header>

      {/* Positioning + Approach side by side on desktop */}
      <section className="mt-20 grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            {L.positioningTitle}
          </h2>
          <p className="mt-4 text-ink/80">{L.positioning}</p>
        </div>
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            {L.approachTitle}
          </h2>
          <p className="mt-4 text-ink/80">{L.approach}</p>
        </div>
      </section>

      {/* Outcomes — wider, more breathing room */}
      <section className="mt-20">
        <h2 className="max-w-3xl font-display text-3xl md:text-4xl">
          {L.outcomesTitle}
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2 md:gap-x-12">
          {L.outcomes.map((o, i) => (
            <li
              key={i}
              className="flex gap-4 border-t border-ink/10 pt-6 text-ink/80"
            >
              <span className="font-display text-2xl text-accent">
                0{i + 1}
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Scenarios — distinct visual block, full width */}
      <section className="mt-20 rounded-2xl border border-ink/10 bg-paper p-8 md:p-12">
        <h2 className="max-w-3xl font-display text-2xl md:text-3xl">
          {L.scenariosTitle}
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-x-12">
          {L.scenarios.map((s, i) => (
            <li key={i} className="flex gap-3 text-ink/80">
              <span className="mt-1 text-accent">·</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* For whom + Format side by side on desktop */}
      <section className="mt-20 grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            {L.forWhomTitle}
          </h2>
          <ul className="mt-6 space-y-3">
            {L.forWhom.map((w, i) => (
              <li key={i} className="flex gap-3 text-ink/80">
                <span className="text-accent">·</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            {L.formatTitle}
          </h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {L.format.map((f, i) => (
              <div key={i} className="rounded-xl border border-ink/10 p-4">
                <dt className="text-xs uppercase tracking-widest text-ink/50">
                  {f.label}
                </dt>
                <dd className="mt-1 text-ink/80">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA — standardized via <PageCTA>, inherits theme-lifelong accent. */}
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
