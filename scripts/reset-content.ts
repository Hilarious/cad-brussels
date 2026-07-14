/**
 * Purge pages, posts, and events whose slug is null/empty.
 * Used after a schema migration that dropped localized slugs.
 *
 * Usage:  pnpm tsx scripts/reset-content.ts
 *         (or via the package script: pnpm reset:content)
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  for (const collection of ['pages', 'posts', 'events'] as const) {
    const all = await payload.find({
      // @ts-expect-error generic narrowing
      collection,
      limit: 1000,
      depth: 0,
      locale: 'fr',
    })
    let removed = 0
    for (const doc of all.docs) {
      const slug = (doc as { slug?: string | null }).slug
      if (!slug) {
        await payload.delete({
          // @ts-expect-error generic narrowing
          collection,
          id: doc.id,
        })
        removed += 1
      }
    }
    console.log(`✓ ${collection}: removed ${removed} slug-less docs (kept ${all.totalDocs - removed})`)
  }

  console.log('\n✅ Reset complete. Run `pnpm seed:all` to repopulate.')
  process.exit(0)
}

main().catch((e) => {
  console.error('✗ Failed:', e)
  process.exit(1)
})
