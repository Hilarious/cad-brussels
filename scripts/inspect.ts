/**
 * Inspect what Payload actually stored after seeding.
 * Useful for debugging rendering issues — prints the layout of every page
 * and the description of every event in both locales.
 *
 * Usage:  pnpm inspect
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

async function inspect() {
  const payload = await getPayload({ config })

  console.log('━━━ PAGES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  for (const locale of ['fr', 'en'] as const) {
    const pages = await payload.find({
      collection: 'pages',
      locale,
      limit: 100,
      depth: 0,
    })
    console.log(`\n[${locale.toUpperCase()}] ${pages.totalDocs} pages`)
    for (const p of pages.docs) {
      const blocks = (p.layout ?? []).map((b) => b.blockType).join(' → ')
      console.log(`   • ${p.slug}  (${p.status})  layout: [${blocks}]`)
      // Detail for fashion-accessory-design
      if (p.slug === 'fashion-accessory-design') {
        console.log('     ── full layout ──')
        for (const b of p.layout ?? []) {
          console.log('     ', JSON.stringify(b, null, 2).slice(0, 800))
        }
      }
    }
  }

  console.log('\n━━━ HEADER GLOBAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  for (const locale of ['fr', 'en'] as const) {
    const h = await payload.findGlobal({
      slug: 'header',
      locale,
      depth: 0,
    })
    console.log(`\n[${locale.toUpperCase()}]`)
    console.log(`   navItems count: ${h.navItems?.length ?? 0}`)
    for (const item of h.navItems ?? []) {
      const label = item.label ?? '(no label)'
      const path = (item as { path?: string }).path ?? '(no path)'
      console.log(`     • ${label} → ${path}`)
      const children = (item as { children?: Array<{ label?: string; path?: string }> }).children
      for (const child of children ?? []) {
        console.log(`         ◦ ${child.label ?? '(no label)'} → ${child.path ?? '(no path)'}`)
      }
    }
    const cta = h.cta as { label?: string; path?: string } | undefined
    console.log(`   cta: ${cta?.label ?? '(none)'} → ${cta?.path ?? '(none)'}`)
  }

  console.log('\n━━━ EVENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  for (const locale of ['fr', 'en'] as const) {
    const events = await payload.find({
      collection: 'events',
      locale,
      limit: 50,
      depth: 0,
    })
    console.log(`\n[${locale.toUpperCase()}] ${events.totalDocs} events`)
    for (const e of events.docs) {
      console.log(
        `   • ${e.slug}  ${e.startDate}  cat=${e.category}  status=${e.status}`,
      )
    }
  }

  process.exit(0)
}

inspect().catch((e) => {
  console.error(e)
  process.exit(1)
})
