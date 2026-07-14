import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * <PageCTA> — Standardized end-of-page call-to-action block.
 *
 * Used for the "outro" CTA at the bottom of pages that need a custom
 * destination (not the generic admissions funnel — for that, use
 * <AdmissionCTA> instead).
 *
 * Examples of when to use <PageCTA>:
 *  - Lifelong Learning hub → "Une question, une demande sur-mesure ?"
 *    pointing to /contact
 *  - Frais → "Une question sur les frais ?" pointing to /contact
 *  - Étudier à Bruxelles → "Question sur la vie à Bruxelles ?"
 *    pointing to /contact
 *  - Professeurs → "Vous voulez en savoir plus sur un·e prof ?"
 *  - Alumni → "Demander un contact alumni"
 *
 * The block uses the page's accent color via the cascade from .theme-*.
 * The CTA button reverses to ink-on-paper so it stays legible on any
 * accent (Pink, Orange, Navy, Mint, etc.).
 *
 * For 100% editorial flexibility (an extra secondary link, a footnote,
 * custom buttons), pass children — they render below the body.
 */
type Tone =
  /** Vivid accent background (default). Use when the page is themed
   *  and you want the CTA to feel energetic. */
  | 'accent'
  /** Soft, neutral background. Use when the CTA is informational and
   *  the page already has a strong accent block above. */
  | 'soft'

export function PageCTA({
  title,
  body,
  ctaLabel,
  ctaHref,
  ctaExternal = false,
  tone = 'accent',
  nested = false,
  children,
}: {
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  ctaExternal?: boolean
  tone?: Tone
  /**
   * Set to `true` when the CTA is rendered INSIDE an element that
   * already provides the page container (e.g. inside an `<article
   * className="container">`). The component drops its own container
   * and just renders the colored card with vertical margin.
   */
  nested?: boolean
  children?: ReactNode
}) {
  const wrapper =
    tone === 'accent'
      ? 'bg-accent text-paper'
      : 'border border-ink/10 bg-paper text-ink'

  const buttonClasses =
    tone === 'accent'
      ? 'rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-paper hover:text-ink'
      : 'rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-accent'

  const bodyTone = tone === 'accent' ? 'text-paper/85' : 'text-ink/70'

  const card = (
    <div className={`rounded-2xl p-8 md:p-12 ${wrapper}`}>
      <div className="md:flex md:items-end md:justify-between md:gap-12">
        <div className="md:flex-1">
          <h2 className="text-balance font-display text-2xl md:text-3xl">
            {title}
          </h2>
          <p className={`mt-4 max-w-2xl ${bodyTone}`}>{body}</p>
          {children}
        </div>
        <div className="mt-6 md:mt-0 md:shrink-0">
          {ctaExternal ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
            >
              {ctaLabel}
            </a>
          ) : (
            <Link href={ctaHref} className={buttonClasses}>
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  )

  // When nested, skip the container wrapper — the parent provides it.
  if (nested) {
    return <section className="mt-20">{card}</section>
  }

  return <section className="container py-16">{card}</section>
}
