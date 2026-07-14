import { chromium } from '@playwright/test'

const PAGES = ['/fr', '/fr/admissions', '/fr/contact', '/fr/alumni', '/fr/professeurs', '/fr/news']

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })

const targets = new Map() // signature -> {count, h, w, inline, cls, txt}
const texts = new Map()

for (const path of PAGES) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' })

  const r = await page.evaluate(() => {
    const out = { targets: [], texts: [] }

    for (const el of document.querySelectorAll('a, button')) {
      const rect = el.getBoundingClientRect()
      if (!rect.height || !rect.width) continue
      if (rect.height >= 44) continue

      // Un lien est "inline" s'il est enveloppé de texte : son parent contient
      // d'autres nœuds texte non vides à côté de lui. C'est l'exception WCAG.
      // Inline = le lien est réellement noyé dans une phrase : son parent porte
      // du texte à côté de lui. `display: inline` ne suffit pas : un lien seul
      // dans un <li> de menu est display:inline mais reste une cible autonome.
      const parent = el.parentElement
      let siblingText = ''
      for (const n of parent?.childNodes ?? []) {
        if (n !== el && n.nodeType === 3) siblingText += n.textContent.trim()
      }
      const inline = siblingText.replace(/[·→\s]/g, '').length > 0

      out.targets.push({
        h: Math.round(rect.height),
        inline,
        cls: (el.className?.toString() || '').slice(0, 70),
        txt: (el.textContent || '').trim().slice(0, 28),
        tag: el.tagName.toLowerCase(),
      })
    }

    for (const el of document.querySelectorAll('p,li,span,a,dt,dd,figcaption,small')) {
      const fs = parseFloat(getComputedStyle(el).fontSize)
      const t = (el.textContent || '').trim()
      if (fs > 0 && fs < 12 && t.length > 3 && el.children.length === 0) {
        out.texts.push({
          px: fs,
          cls: (el.className?.toString() || '').slice(0, 60),
          txt: t.slice(0, 28),
        })
      }
    }
    return out
  })

  for (const t of r.targets) {
    const key = `${t.inline ? 'INLINE' : 'AUTONOME'}|${t.h}|${t.cls}`
    const e = targets.get(key) ?? { ...t, count: 0 }
    e.count++
    targets.set(key, e)
  }
  for (const t of r.texts) {
    const key = `${t.px}|${t.cls}`
    const e = texts.get(key) ?? { ...t, count: 0 }
    e.count++
    texts.set(key, e)
  }
}

const all = [...targets.values()]
const auto = all.filter((t) => !t.inline).sort((a, b) => b.count - a.count)
const inl = all.filter((t) => t.inline)

console.log(`\n===== CIBLES TACTILES AUTONOMES < 44px (à corriger) =====`)
console.log(`${auto.reduce((s, t) => s + t.count, 0)} occurrences, ${auto.length} types distincts\n`)
for (const t of auto) console.log(`  x${String(t.count).padStart(3)}  ${t.h}px  <${t.tag}> "${t.txt}"\n         [${t.cls}]`)

console.log(`\n===== LIENS INLINE DANS DU TEXTE (exemptés WCAG, à ne pas toucher) =====`)
console.log(`${inl.reduce((s, t) => s + t.count, 0)} occurrences, ${inl.length} types\n`)
for (const t of inl.slice(0, 5)) console.log(`  x${String(t.count).padStart(3)}  ${t.h}px  "${t.txt}"`)

console.log(`\n===== TEXTES < 12px =====`)
for (const t of [...texts.values()].sort((a, b) => b.count - a.count))
  console.log(`  x${String(t.count).padStart(3)}  ${t.px}px  "${t.txt}"\n         [${t.cls}]`)

await browser.close()
