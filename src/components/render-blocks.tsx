import Link from 'next/link'
import Image from 'next/image'
import type { Page, Media } from '@/payload-types'

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
              {block.eyebrow}
            </p>
          )}
          <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
            {block.heading}
          </h1>
          {block.subheading && (
            <p className="mt-6 max-w-2xl text-lg text-ink/70">
              {block.subheading}
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
              {block.eyebrow}
            </p>
          )}
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            {block.heading}
          </h1>
          {block.subheading && (
            <p className="mt-6 text-lg text-ink/70">{block.subheading}</p>
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
      const text = n.text ?? ''
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
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {block.heading}
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
              {it.value}
            </dt>
            <dd className="mt-2 text-sm uppercase tracking-widest text-ink/60">
              {it.label}
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
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {block.heading}
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
              <span className="ml-2">{it.title}</span>
            </p>
            {it.description && (
              <p className="mt-3 text-ink/70">{it.description}</p>
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
            {block.eyebrow}
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
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {block.heading}
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
              {block.heading}
            </h2>
            {block.body && (
              <p className="mt-4 max-w-2xl text-paper/85">{block.body}</p>
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
