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
        title: "Formation IA générative pour pros · CAD Brussels",
        description:
          "10 séances de 2h pour reprendre le contrôle créatif sur l'IA générative. Pour agences, designers et pros de la communication. Cours du soir à Bruxelles.",
      }
    : {
        title: 'Generative AI training for creative pros · CAD Brussels',
        description:
          'Ten 2-hour evening sessions to regain creative control over generative AI. For agencies, designers and communication professionals. Evening classes in Brussels.',
      }
}

export default async function GenAICreative({
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
        eyebrow: 'Module IA · Communication & design digital',
        title: "Generative AI for Creative Professionals",
        intro:
          "Un module pensé pour les agences créatives, communication et digitales qui veulent dépasser l'effet wow des outils d'IA générative et reprendre la main sur leur direction artistique.",
        positioningTitle: 'Le positionnement',
        positioning:
          "L'IA générative est partout. La plupart des pros savent maintenant qu'on peut générer une image, un visuel, une vidéo. Mais peu savent comment la diriger avec précision pour servir une intention, une marque, un concept. Ce module part de là : vous savez prompter, vous voulez maintenant produire des résultats qui ressemblent à votre travail, pas à n'importe quel résultat.",
        outcomesTitle: 'Ce que vous emportez en partant',
        outcomes: [
          'Une méthodologie claire pour intégrer l’IA dans un brief client, du concept à la livraison.',
          'Des projets concrets, terminés, prêts à montrer en portfolio ou en réunion d’équipe.',
          'Une compréhension réaliste de ce que l’IA peut, et surtout ne peut pas, faire dans un contexte pro.',
          'Des reflexes pour piloter un workflow IA tout en gardant la maîtrise créative.',
        ],
        forWhomTitle: 'Pour qui',
        forWhom: [
          'Directeurs et directrices artistiques, designers seniors et juniors',
          'Concepteurs-rédacteurs, planners, chefs de projet en agence',
          'Freelances en branding, communication, digital',
          'Équipes communication internes en marque ou institution',
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
          "Chaque séance s'articule autour d'un cas réel : un brief, un livrable, une contrainte. On travaille avec les outils du marché (et ceux qui sortiront pendant le module, c'est le jeu) en mettant l'accent sur la direction, pas sur la technique pure. Vous repartez avec une vraie pratique, pas une démo.",
        ctaTitle: 'Intéressé·e par cette session ?',
        ctaBody:
          "Écrivez-nous pour connaître les dates de la prochaine session, le tarif et les modalités d'inscription. Les places sont limitées pour garder un accompagnement de qualité.",
        ctaButton: 'Demander les infos',
      }
    : {
        backLabel: 'Lifelong Learning',
        eyebrow: 'AI module · Communication & digital design',
        title: 'Generative AI for Creative Professionals',
        intro:
          'A module built for creative, communication and digital agencies that want to move beyond the wow effect of generative AI tools and take back control over their art direction.',
        positioningTitle: 'Positioning',
        positioning:
          'Generative AI is everywhere. Most pros now know they can generate an image, a visual, a video. Few know how to direct it with precision to serve an intent, a brand, a concept. This module starts there: you know how to prompt, now you want results that look like your work, not generic output.',
        outcomesTitle: 'What you walk away with',
        outcomes: [
          'A clear methodology to integrate AI into a client brief, from concept to delivery.',
          'Concrete, finished projects, ready to show in your portfolio or team meeting.',
          'A realistic understanding of what AI can, and crucially cannot, do in a pro context.',
          'Reflexes to drive an AI workflow while keeping creative control.',
        ],
        forWhomTitle: 'Who it’s for',
        forWhom: [
          'Art directors, senior and junior designers',
          'Copywriters, planners, agency project leads',
          'Freelancers in branding, communication, digital',
          'In-house communication teams in brands or institutions',
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
          "Each session revolves around a real case: a brief, a deliverable, a constraint. We use industry tools (and the ones released during the module, that's the game) with a focus on direction, not pure technique. You leave with practice, not a demo.",
        ctaTitle: 'Interested in this session?',
        ctaBody:
          'Drop us a line for the next session dates, fees and enrolment details. Spots are limited to keep mentoring quality high.',
        ctaButton: 'Request info',
      }

  return (
    <article className="theme-lifelong container py-16">
      <Link
        href={`/${locale}/lifelong-learning`}
        className="text-sm text-ink/60 hover:text-accent"
      >
        ← {L.backLabel}
      </Link>

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

      {/* CTA — standardized via <PageCTA>, inherits theme-lifelong accent.
          `nested` because we're inside <article container>. */}
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
