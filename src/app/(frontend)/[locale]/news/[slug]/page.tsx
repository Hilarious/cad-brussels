import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AdmissionCTA } from '@/components/admission-cta'

export const revalidate = 60

async function fetchPost(locale: string, slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'posts',
    locale: locale as 'fr' | 'en',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await fetchPost(locale, slug)
  if (!post) return {}
  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt ?? undefined,
  }
}

type LexicalNode = {
  type?: string
  children?: LexicalNode[]
  text?: string
}

function renderRichText(content: unknown) {
  const root = (content as { root?: { children?: LexicalNode[] } })?.root
  const paragraphs: string[] = []
  for (const node of root?.children ?? []) {
    if (node.type === 'paragraph') {
      const text = (node.children ?? [])
        .map((c) => c.text ?? '')
        .join('')
        .trim()
      if (text) paragraphs.push(text)
    }
  }
  return paragraphs
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await fetchPost(locale, slug)
  if (!post) notFound()

  const paragraphs = renderRichText(post.content)
  const date = new Date(post.publishedAt ?? post.updatedAt)

  return (
    <article className="container py-16">
      <Link
        href={`/${locale}/news`}
        className="text-sm text-ink/60 hover:text-accent"
      >
        ← {locale === 'fr' ? 'Toutes les actualités' : 'All news'}
      </Link>

      <header className="mx-auto mt-8 max-w-3xl">
        <time
          dateTime={post.publishedAt ?? post.updatedAt}
          className="text-sm uppercase tracking-widest text-accent"
        >
          {date.toLocaleDateString(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </time>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-6 text-lg text-ink/70">{post.excerpt}</p>
        )}
      </header>

      <div className="mx-auto mt-10 max-w-[70ch]">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="mb-5 text-[17px] leading-relaxed text-ink/80 last:mb-0"
          >
            {p}
          </p>
        ))}

        {/* Inline contextual CTA — discreet enough not to interrupt
            reading, visible enough to convert engaged readers. */}
        <AdmissionCTA locale={locale} variant="contextual" />
      </div>
    </article>
  )
}
