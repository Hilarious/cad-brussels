import Link from 'next/link'
import Image from 'next/image'
import type { Page, Media } from '@/payload-types'
import { assainirLibelle } from '@/lib/appellations'

type Block = NonNullable<Page['layout']>[number]

export function RenderBlocks({
  blocks,
  locale,
}: {
  blocks: Block[]
  locale: string
}) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={i} block={block} />
          case 'richText':
            return <RichTextBlock key={i} block={block} />
          case 'cta':
            return <CTABlock key={i} block={block} locale={locale} />
          case 'stats':
            return <StatsBlock key={i} block={block} />
          case 'featureList':
            return <FeatureListBlock key={i} block={block} />
          case 'quote':
            return <QuoteBlock key={i} block={block} />
          case 'faq':
            return <FAQBlock key={i} block={block} />
          case 'compareTable':
            return <CompareTableBlock key={i} block={block} />
          case 'steps':
            return <StepsBlock key={i} block={block} />
          case 'priceGrid':
            return <PriceGridBlock key={i} block={block} />
          case 'accordion':
            return <AccordionBlock key={i} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}

// ---- Hero ---------------------------------------------------------------

function HeroBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'hero' }>
}) {
  const image =
    block.image && typeof block.image === 'object'
      ? (block.image as Media)
      : null

  const variant = block.variant ?? 'text'
  const showImage = !!image?.url && variant !== 'text'

  // Centered text-only hero
  if (!showImage) {
    return (
      <section className="container py-20 md:py-28">
        <div className="max-w-4xl">
          {block.eyebrow && (
            <p className="text-sm uppercase tracking-widest text-accent">
              {assainirLibelle(block.eyebrow)}
            </p>
          )}
          <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
            {assainirLibelle(block.heading)}
          </h1>
          {block.subheading && (
            <p className="mt-6 max-w-2xl text-lg text-ink/70">
              {assainirLibelle(block.subheading)}
            </p>
          )}
          {block.cta?.href && block.cta?.label && (
            <Link
              href={block.cta.href}
              className="mt-10 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-accent"
            >
              {block.cta.label}
            </Link>
          )}
        </div>
      </section>
    )
  }

  // Split: image + text
  return (
    <section className="container py-20 md:py-28">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          {block.eyebrow && (
            <p className="text-sm uppercase tracking-widest text-accent">
              {assainirLibelle(block.eyebrow)}
            </p>
          )}
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            {assainirLibelle(block.heading)}
          </h1>
          {block.subheading && (
            <p className="mt-6 text-lg text-ink/70">{assainirLibelle(block.subheading)}</p>
          )}
          {block.cta?.href && block.cta?.label && (
            <Link
              href={block.cta.href}
              className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-accent"
            >
              {block.cta.label}
            </Link>
          )}
        </div>
        {image?.url && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink/5">
            <Image
              src={image.url}
              alt={image.alt ?? ''}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}

// ---- RichText -----------------------------------------------------------

type LexicalTextNode = { type?: string; text?: string; format?: number }
type LexicalNode = {
  type?: string
  tag?: string
  children?: LexicalNode[]
  text?: string
  format?: number
}

/** Render Lexical inline nodes (text + formatting marks). */
function renderInline(nodes: LexicalNode[] | undefined): React.ReactNode {
  if (!nodes) return null
  return nodes.map((n, i) => {
    if (n.type === 'text' || typeof n.text === 'string') {
      // Garde-fou appellations : le corps des pages vient du CMS, donc
      // de la base, qui porte encore Bachelor et Master en production.
      const text = assainirLibelle(n.text ?? '')
      const f = (n as LexicalTextNode).format ?? 0
      let el: React.ReactNode = text
      // Lexical bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
      if (f & 1) el = <strong key={`b-${i}`}>{el}</strong>
      if (f & 2) el = <em key={`i-${i}`}>{el}</em>
      if (f & 8) el = <u key={`u-${i}`}>{el}</u>
      return <span key={i}>{el}</span>
    }
    return null
  })
}

function RichTextBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'richText' }>
}) {
  const root = (block.content as { root?: { children?: LexicalNode[] } })?.root
  const children = root?.children ?? []

  return (
    <section className="container py-10">
      <div
        className={
          block.width === 'full' ? 'max-w-none' : 'mx-auto max-w-[70ch]'
        }
      >
        {children.map((node, i) => {
          if (node.type === 'paragraph') {
            const inline = renderInline(node.children)
            // Skip empty paragraphs
            const hasContent = (node.children ?? []).some(
              (c) => (c.text ?? '').trim().length > 0,
            )
            if (!hasContent) return null
            return (
              <p
                key={i}
                className="mb-5 text-[17px] leading-relaxed text-ink/80 last:mb-0"
              >
                {inline}
              </p>
            )
          }
          if (node.type === 'heading') {
            const tag = (node.tag ?? 'h2') as 'h2' | 'h3' | 'h4'
            const cls =
              tag === 'h2'
                ? 'mt-10 mb-4 font-display text-3xl'
                : tag === 'h3'
                  ? 'mt-8 mb-3 font-display text-2xl'
                  : 'mt-6 mb-2 font-medium text-lg'
            const Tag = tag
            return (
              <Tag key={i} className={cls}>
                {renderInline(node.children)}
              </Tag>
            )
          }
          if (node.type === 'list') {
            const isOrdered = (node.tag ?? '').toLowerCase() === 'ol'
            const Tag = (isOrdered ? 'ol' : 'ul') as 'ol' | 'ul'
            return (
              <Tag
                key={i}
                className={`mb-5 ml-5 space-y-1 text-[17px] text-ink/80 ${
                  isOrdered ? 'list-decimal' : 'list-disc'
                }`}
              >
                {(node.children ?? []).map((li, j) => (
                  <li key={j}>{renderInline(li.children)}</li>
                ))}
              </Tag>
            )
          }
          return null
        })}
      </div>
    </section>
  )
}

// ---- Stats --------------------------------------------------------------

function StatsBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'stats' }>
}) {
  const items = block.items ?? []
  return (
    <section className="container py-16">
      {(block.eyebrow || block.heading) && (
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {block.eyebrow && (
            <p className="text-sm uppercase tracking-widest text-accent">
              {assainirLibelle(block.eyebrow)}
            </p>
          )}
          {block.heading && (
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {assainirLibelle(block.heading)}
            </h2>
          )}
        </div>
      )}
      <dl
        className={`grid gap-x-8 gap-y-10 sm:grid-cols-2 ${
          items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        }`}
      >
        {items.map((it, i) => (
          <div key={i} className="text-center">
            <dt className="font-display text-5xl text-ink md:text-6xl">
              {assainirLibelle(it.value)}
            </dt>
            <dd className="mt-2 text-sm uppercase tracking-widest text-ink/60">
              {assainirLibelle(it.label)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// ---- Feature List -------------------------------------------------------

function FeatureListBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'featureList' }>
}) {
  const items = block.items ?? []
  const cols = block.columns === '3' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  return (
    <section className="container py-16">
      {(block.eyebrow || block.heading) && (
        <div className="mb-12 max-w-3xl">
          {block.eyebrow && (
            <p className="text-sm uppercase tracking-widest text-accent">
              {assainirLibelle(block.eyebrow)}
            </p>
          )}
          {block.heading && (
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {assainirLibelle(block.heading)}
            </h2>
          )}
        </div>
      )}
      <ul className={`grid gap-8 sm:grid-cols-2 ${cols}`}>
        {items.map((it, i) => (
          <li
            key={i}
            className="rounded-2xl border border-ink/10 bg-paper p-6 transition hover:border-accent/40"
          >
            <p className="text-2xl font-display">
              <span className="text-accent/80">0{i + 1}</span>{' '}
              <span className="ml-2">{assainirLibelle(it.title)}</span>
            </p>
            {it.description && (
              <p className="mt-3 text-ink/70">{assainirLibelle(it.description)}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

// ---- Quote --------------------------------------------------------------

function QuoteBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'quote' }>
}) {
  const img =
    block.authorImage && typeof block.authorImage === 'object'
      ? (block.authorImage as Media)
      : null
  return (
    <section className="container py-16">
      <figure className="mx-auto max-w-3xl text-center">
        {block.eyebrow && (
          <p className="text-sm uppercase tracking-widest text-accent">
            {assainirLibelle(block.eyebrow)}
          </p>
        )}
        <blockquote className="mt-6 font-display text-2xl leading-snug md:text-3xl">
          “{block.quote}”
        </blockquote>
        <figcaption className="mt-8 flex items-center justify-center gap-4 text-sm">
          {img?.url && (
            <span className="relative inline-block h-12 w-12 overflow-hidden rounded-full bg-ink/5">
              <Image
                src={img.url}
                alt={img.alt ?? block.authorName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
          )}
          <span>
            <span className="font-medium">{block.authorName}</span>
            {block.authorRole && (
              <span className="block text-ink/60">{block.authorRole}</span>
            )}
          </span>
        </figcaption>
      </figure>
    </section>
  )
}

// ---- FAQ ----------------------------------------------------------------

function FAQBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'faq' }>
}) {
  const items = block.items ?? []
  return (
    <section className="container py-16">
      {(block.eyebrow || block.heading) && (
        <div className="mb-10 max-w-3xl">
          {block.eyebrow && (
            <p className="text-sm uppercase tracking-widest text-accent">
              {assainirLibelle(block.eyebrow)}
            </p>
          )}
          {block.heading && (
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {assainirLibelle(block.heading)}
            </h2>
          )}
        </div>
      )}
      <ul className="mx-auto max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
        {items.map((it, i) => (
          <li key={i}>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <span className="font-display text-lg md:text-xl">
                  {it.question}
                </span>
                <span className="mt-1 text-2xl text-ink/40 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-prose text-ink/70">{it.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ---- CTA ----------------------------------------------------------------

function CTABlock({
  block,
  locale,
}: {
  block: Extract<Block, { blockType: 'cta' }>
  locale: string
}) {
  // Aligned with <PageCTA tone="accent">: vibrant accent background that
  // inherits the page's program color via the .theme-* cascade. Primary
  // button reverses to ink-on-paper so it stays legible on any accent
  // (Pink, Orange, Navy, Mint, Magenta, etc.). Secondary buttons get a
  // paper outline that contrasts well with the accent backdrop.
  return (
    <section className="container py-16">
      <div className="rounded-2xl bg-accent p-8 text-paper md:p-12">
        <div className="md:flex md:items-end md:justify-between md:gap-12">
          <div className="md:flex-1">
            <h2 className="text-balance font-display text-2xl md:text-3xl">
              {assainirLibelle(block.heading)}
            </h2>
            {block.body && (
              <p className="mt-4 max-w-2xl text-paper/85">{assainirLibelle(block.body)}</p>
            )}
          </div>
          {(block.buttons ?? []).length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-0 md:shrink-0">
              {(block.buttons ?? []).map((b, i) => (
                <Link
                  key={i}
                  href={b.href ?? `/${locale}`}
                  className={
                    b.style === 'primary'
                      ? 'rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-paper hover:text-ink'
                      : 'text-sm text-paper/90 underline-offset-4 hover:underline'
                  }
                >
                  {b.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


// ---- Tableau comparatif -------------------------------------------------
//
// Deux lectures du même contenu selon la largeur : un vrai tableau à partir
// de `md`, et une pile de cartes en dessous. Un tableau à deux colonnes de
// valeurs devient illisible sur un téléphone, où la colonne de droite se
// réduit à deux caractères par ligne.

function CompareTableBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'compareTable' }>
}) {
  const rows = block.rows ?? []
  if (!rows.length) return null

  return (
    <section className="container py-16">
      {block.eyebrow && (
        <p className="text-sm uppercase tracking-widest text-accent">
          {assainirLibelle(block.eyebrow)}
        </p>
      )}
      {block.heading && (
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          {assainirLibelle(block.heading)}
        </h2>
      )}

      {/* Tableau, à partir de md */}
      <div className="mt-10 hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/15">
              <th className="py-3 pr-6 text-xs font-medium uppercase tracking-widest text-ink/50">
                &nbsp;
              </th>
              <th className="py-3 pr-6 font-display text-lg">
                {assainirLibelle(block.columnA)}
              </th>
              <th className="py-3 font-display text-lg text-ink/60">
                {assainirLibelle(block.columnB)}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-ink/10 align-top">
                <td className="py-4 pr-6 text-sm font-medium">
                  {assainirLibelle(r.criterion)}
                </td>
                <td className="py-4 pr-6 text-sm">{assainirLibelle(r.valueA)}</td>
                <td className="py-4 text-sm text-ink/60">
                  {assainirLibelle(r.valueB)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartes empilées, en dessous de md */}
      <ul className="mt-8 grid gap-4 md:hidden">
        {rows.map((r, i) => (
          <li key={i} className="rounded-2xl border border-ink/10 p-5">
            <p className="text-xs uppercase tracking-widest text-ink/50">
              {assainirLibelle(r.criterion)}
            </p>
            <p className="mt-3 text-sm">
              <span className="font-medium">{assainirLibelle(block.columnA)}</span>
              {' · '}
              {assainirLibelle(r.valueA)}
            </p>
            <p className="mt-1 text-sm text-ink/60">
              <span className="font-medium">{assainirLibelle(block.columnB)}</span>
              {' · '}
              {assainirLibelle(r.valueB)}
            </p>
          </li>
        ))}
      </ul>

      {block.note && (
        <p className="mt-6 max-w-2xl border-l-2 border-accent pl-4 text-sm text-ink/65">
          {assainirLibelle(block.note)}
        </p>
      )}
    </section>
  )
}

// ---- Étapes numérotées --------------------------------------------------
//
// La numérotation vient de l'ordre d'affichage, jamais d'un champ saisi :
// réordonner les étapes dans l'admin suffit, sans renuméroter à la main.

function StepsBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'steps' }>
}) {
  const items = block.items ?? []
  if (!items.length) return null

  return (
    <section className="container py-16">
      {block.eyebrow && (
        <p className="text-sm uppercase tracking-widest text-accent">
          {assainirLibelle(block.eyebrow)}
        </p>
      )}
      {block.heading && (
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          {assainirLibelle(block.heading)}
        </h2>
      )}
      <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <li key={i} className="border-t-2 border-ink pt-4">
            <p className="font-display text-4xl text-accent">{i + 1}</p>
            <p className="mt-2 font-display text-lg leading-snug">
              {assainirLibelle(it.title)}
            </p>
            <p className="mt-2 text-sm text-ink/70">{assainirLibelle(it.body)}</p>
            {it.meta && (
              <p className="mt-3 text-xs uppercase tracking-widest text-ink/50">
                {assainirLibelle(it.meta)}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

// ---- Grille tarifaire ---------------------------------------------------

function PriceGridBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'priceGrid' }>
}) {
  const items = block.items ?? []
  if (!items.length) return null

  return (
    <section className="container py-16">
      {block.eyebrow && (
        <p className="text-sm uppercase tracking-widest text-accent">
          {assainirLibelle(block.eyebrow)}
        </p>
      )}
      {block.heading && (
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          {assainirLibelle(block.heading)}
        </h2>
      )}
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <li
            key={i}
            className={
              it.highlight
                ? 'rounded-2xl bg-ink p-6 text-paper'
                : 'rounded-2xl border border-ink/10 p-6'
            }
          >
            <p
              className={
                it.highlight
                  ? 'text-xs uppercase tracking-widest text-paper/70'
                  : 'text-xs uppercase tracking-widest text-ink/55'
              }
            >
              {assainirLibelle(it.label)}
            </p>
            <p className="mt-3 font-display text-3xl">
              {assainirLibelle(it.amount)}
              {it.period && (
                <span
                  className={
                    it.highlight
                      ? 'ml-2 text-base font-normal text-paper/70'
                      : 'ml-2 text-base font-normal text-ink/55'
                  }
                >
                  {assainirLibelle(it.period)}
                </span>
              )}
            </p>
            {it.detail && (
              <p
                className={
                  it.highlight
                    ? 'mt-3 text-sm text-paper/80'
                    : 'mt-3 text-sm text-ink/70'
                }
              >
                {assainirLibelle(it.detail)}
              </p>
            )}
          </li>
        ))}
      </ul>
      {block.note && (
        <p className="mt-6 max-w-2xl text-sm text-ink/60">
          {assainirLibelle(block.note)}
        </p>
      )}
    </section>
  )
}

// ---- Accordéon ----------------------------------------------------------
//
// <details> natif plutôt qu'un composant client : le contenu reste dans la
// page pour les moteurs et la recherche du navigateur, même replié, et le
// bloc ne coûte aucun JavaScript.

function AccordionBlock({
  block,
}: {
  block: Extract<Block, { blockType: 'accordion' }>
}) {
  const items = block.items ?? []
  if (!items.length) return null

  return (
    <section className="container py-16">
      {block.eyebrow && (
        <p className="text-sm uppercase tracking-widest text-accent">
          {assainirLibelle(block.eyebrow)}
        </p>
      )}
      {block.heading && (
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          {assainirLibelle(block.heading)}
        </h2>
      )}
      <div className="mt-8 max-w-3xl">
        {items.map((it, i) => (
          <details
            key={i}
            open={it.openByDefault ?? false}
            className="group border-b border-ink/10 py-4"
          >
            <summary className="tap flex cursor-pointer items-center justify-between gap-6 font-display text-lg leading-snug marker:content-none">
              {assainirLibelle(it.title)}
              <span
                aria-hidden="true"
                className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm text-ink/70">
              {assainirLibelle(it.body)}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
