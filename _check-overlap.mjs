import { chromium } from '@playwright/test'

const PAGES = ['/fr', '/fr/alumni']
const WIDTH = 1440

// On pilote le Chrome déjà installé sur la machine plutôt que le Chromium
// téléchargé par Playwright, dont le cache local était corrompu.
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: WIDTH, height: 1000 } })

let totalOverlaps = 0

for (const path of PAGES) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' })

  const boxes = await page.$$eval('[role="img"]', (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return {
        label: (el.getAttribute('aria-label') || '').slice(0, 46),
        x: Math.round(r.x),
        y: Math.round(r.y + window.scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
      }
    }),
  )

  // Deux rectangles se chevauchent si leurs projections se croisent sur les deux axes.
  // Tolérance de 1px pour absorber les arrondis sub-pixel du navigateur.
  const T = 1
  const overlaps = []
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i]
      const b = boxes[j]
      const dx = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
      const dy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
      if (dx > T && dy > T) overlaps.push({ a, b, dx, dy })
    }
  }

  console.log(`\n=== ${path} (${boxes.length} emplacements d'image, largeur ${WIDTH}px) ===`)
  if (overlaps.length === 0) {
    console.log('  Aucun chevauchement.')
  } else {
    totalOverlaps += overlaps.length
    for (const o of overlaps) {
      console.log(`  CHEVAUCHEMENT de ${o.dx}px x ${o.dy}px :`)
      console.log(`    - ${o.a.label}  [${o.a.w}x${o.a.h} en x=${o.a.x}]`)
      console.log(`    - ${o.b.label}  [${o.b.w}x${o.b.h} en x=${o.b.x}]`)
    }
  }

  // Débordement hors du conteneur parent (la tuile sort de sa colonne).
  const spills = await page.$$eval('[role="img"]', (els) =>
    els
      .map((el) => {
        const r = el.getBoundingClientRect()
        const p = el.parentElement.getBoundingClientRect()
        const spill = Math.round(r.right - p.right)
        return { label: (el.getAttribute('aria-label') || '').slice(0, 46), spill }
      })
      .filter((s) => s.spill > 1),
  )
  if (spills.length) {
    totalOverlaps += spills.length
    console.log('  Tuiles qui débordent de leur colonne :')
    for (const s of spills) console.log(`    - ${s.label} dépasse de ${s.spill}px`)
  }
}

await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle' })
await page.screenshot({ path: process.argv[2] || 'mosaique.png', fullPage: false, clip: { x: 0, y: 0, width: WIDTH, height: 1400 } })

await browser.close()
console.log(`\n>>> ${totalOverlaps === 0 ? 'OK, aucun problème de mise en page.' : totalOverlaps + ' problème(s) détecté(s).'}`)
process.exit(totalOverlaps === 0 ? 0 : 1)
