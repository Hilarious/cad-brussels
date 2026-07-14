import Link from 'next/link'

/**
 * Reusable admission CTA block.
 *
 * Use at the bottom of pages where the visitor is engaged but has no
 * obvious next step toward applying. Three variants tune the tone:
 *
 *  - "primary"     : strong, opinionated. For Events, News, end of Home.
 *                    Big "Apply" + softer "Get the brochure" alternative.
 *  - "soft"        : low-pressure invitation. For pages where the visitor
 *                    is still gathering info (Étudier à Bruxelles guides,
 *                    Lifelong Learning continuing-ed pages).
 *  - "contextual"  : single-line nudge inside dense content. For news
 *                    articles, where a full block would feel intrusive.
 */
type Variant = 'primary' | 'soft' | 'contextual'

export function AdmissionCTA({
  locale,
  variant = 'primary',
  // Optional override of the heading; useful when context calls for a
  // tailored question (e.g., "You read this far. Time to take the leap?").
  heading,
}: {
  locale: string
  variant?: Variant
  heading?: string
}) {
  const isFR = locale === 'fr'

  const t = isFR
    ? {
        primaryHeading: heading ?? 'Prêt·e à nous rejoindre ?',
        primaryBody:
          'Quatre façons d’entrer en contact, du formulaire de candidature au Breakfast informel. Choisissez la vôtre.',
        primaryCta: 'Voir les portes d’admission',
        primarySecondary: 'Recevoir la brochure',

        softHeading: heading ?? 'Vous vous projetez au CAD ?',
        softBody:
          'Postuler en ligne, demander un entretien, venir à un Open Day, ou juste recevoir la brochure pour y réfléchir.',
        softCta: 'Découvrir les admissions →',

        contextualText: 'Vous voulez nous rejoindre ?',
        contextualCta: 'Voir comment candidater →',
      }
    : {
        primaryHeading: heading ?? 'Ready to join us?',
        primaryBody:
          'Four ways to reach out, from the application form to an informal Breakfast. Pick the one that fits you today.',
        primaryCta: 'See admission paths',
        primarySecondary: 'Get the brochure',

        softHeading: heading ?? 'Picturing yourself at CAD?',
        softBody:
          'Apply online, request a meeting, come to an Open Day, or just get the brochure to think it over.',
        softCta: 'Discover admissions →',

        contextualText: 'Want to join us?',
        contextualCta: 'See how to apply →',
      }

  if (variant === 'contextual') {
    return (
      <div className="mt-16 flex flex-wrap items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <p className="text-ink/80">
          <strong className="font-medium text-ink">{t.contextualText}</strong>
        </p>
        <Link
          href={`/${locale}/admissions`}
          className="text-sm text-accent hover:underline"
        >
          {t.contextualCta}
        </Link>
      </div>
    )
  }

  if (variant === 'soft') {
    return (
      <section className="container py-16">
        <div className="rounded-2xl border border-ink/10 bg-paper p-8 md:flex md:items-end md:justify-between md:gap-12 md:p-10">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl md:text-3xl">
              {t.softHeading}
            </h2>
            <p className="mt-3 text-ink/70">{t.softBody}</p>
          </div>
          <Link
            href={`/${locale}/admissions`}
            className="mt-6 tap shrink-0 rounded-full border border-ink/20 px-6 text-sm hover:border-accent hover:text-accent md:mt-0"
          >
            {t.softCta}
          </Link>
        </div>
      </section>
    )
  }

  // primary
  //
  // Background uses the page's accent color (via the .theme-* class on a
  // parent). This makes the block vibrant and signals which program /
  // moment the visitor is on — black bloc was visually heavy and didn't
  // feel CAD. The CTA button reverses to ink-on-paper to stay readable
  // on any accent color (Pink, Orange, Navy, Mint, etc.).
  return (
    <section className="container py-20">
      <div className="rounded-2xl bg-accent p-8 text-paper md:p-12">
        <div className="md:flex md:items-end md:justify-between md:gap-12">
          <div>
            {/* `text-balance` équilibre les lignes quand le titre passe à la
                ligne. Pas de `whitespace-nowrap` ici : le heading est
                surchargeable (cf. prop `heading`), et un titre long comme
                celui de la page Événements ne rentrait alors plus dans la
                rangée flex à 1280px, poussant tout le bloc hors de l'écran. */}
            <h2 className="text-balance font-display text-3xl md:text-4xl">
              {t.primaryHeading}
            </h2>
            <p className="mt-4 max-w-2xl text-paper/85">{t.primaryBody}</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-0 md:shrink-0">
            <Link
              href={`/${locale}/admissions`}
              className="tap rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-paper hover:text-ink"
            >
              {t.primaryCta}
            </Link>
            <Link
              href={`/${locale}/info-pack`}
              className="tap text-sm text-paper/90 underline-offset-4 hover:underline"
            >
              {t.primarySecondary} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
