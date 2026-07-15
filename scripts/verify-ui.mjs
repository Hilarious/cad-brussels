/**
 * Vérificateur d'interface — ouvre réellement le site et le mesure.
 *
 * Le CI compile le code, ce qui ne dit RIEN de la mise en page : un menu absent
 * sur mobile, une page qui défile latéralement sur iPad ou deux images qui se
 * recouvrent compilent parfaitement. Ces bugs ne se voient qu'en regardant la
 * page. Ce script regarde à notre place.
 *
 * Il découvre les pages en suivant les liens depuis l'accueil (FR + EN), donc
 * une page nouvellement créée est couverte sans rien changer ici.
 *
 * Usage :  pnpm verify:ui            (serveur déjà lancé sur :3000)
 *          pnpm verify               (lance le serveur, vérifie, l'arrête)
 *
 * Sort en code 1 si un problème est détecté, ce qui fait échouer le CI.
 */
import { chromium } from '@playwright/test'

const BASE = process.env.VERIFY_URL ?? 'http://localhost:3000'
const MAX_PAGES = 40

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, touch: true },
  { name: 'tablette', width: 768, height: 1024, touch: true },
  { name: 'portable', width: 1280, height: 800, touch: false },
  { name: 'grand écran', width: 1920, height: 1080, touch: false },
]

// ─── Règles vérifiées ───────────────────────────────────────────────
// 1. Défilement horizontal    : le contenu déborde de la fenêtre
// 2. Chevauchement d'images   : deux emplacements se recouvrent
// 3. Cible tactile < 44px     : trop petite pour un doigt (Apple HIG / WCAG AAA)
// 4. Texte < 12px             : illisible sur mobile
// 5. Page en erreur           : statut HTTP >= 400
// ────────────────────────────────────────────────────────────────────

function inspect({ viewportWidth, isTouch }) {
  const problems = []
  const vw = viewportWidth

  // 1. Défilement horizontal.
  const overflow = document.documentElement.scrollWidth - vw
  if (overflow > 2) {
    // On nomme le coupable : l'élément le plus large qui sort à droite, en
    // ignorant ceux volontairement clippés par un parent en overflow hidden.
    let worst = null
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (getComputedStyle(el).position === 'fixed') continue
      let clipped = false
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX
        if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') {
          clipped = true
          break
        }
      }
      if (clipped) continue
      const over = Math.round(r.right - vw)
      if (over > 2 && (!worst || over > worst.over)) {
        worst = {
          over,
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.toString() || '').slice(0, 60),
        }
      }
    }
    problems.push({
      rule: 'defilement-horizontal',
      detail: `le contenu déborde de ${overflow}px${
        worst ? ` — coupable probable : <${worst.tag} class="${worst.cls}">` : ''
      }`,
    })
  }

  // 2. Chevauchement des emplacements d'image.
  const imgs = [...document.querySelectorAll('[role="img"]')].map((el) => {
    const r = el.getBoundingClientRect()
    return {
      x: r.x,
      y: r.y + window.scrollY,
      w: r.width,
      h: r.height,
      label: (el.getAttribute('aria-label') || '').slice(0, 40),
    }
  })
  for (let i = 0; i < imgs.length; i++) {
    for (let j = i + 1; j < imgs.length; j++) {
      const a = imgs[i]
      const b = imgs[j]
      const dx = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
      const dy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
      if (dx > 1 && dy > 1) {
        problems.push({
          rule: 'images-superposees',
          detail: `"${a.label}" recouvre "${b.label}" sur ${Math.round(dx)}x${Math.round(dy)}px`,
        })
      }
    }
  }

  // 3. Cibles tactiles. Uniquement sur les tailles tactiles : la règle des 44px
  //    vise le doigt, pas la souris.
  //
  //    Un lien noyé dans une phrase est EXEMPTÉ (WCAG 2.5.5) : lui imposer 44px
  //    casserait l'interlignage du paragraphe. On considère un lien comme inline
  //    seulement si son parent est un élément de texte (p, li, span...) ET qu'il
  //    reste des lettres autour de lui une fois la ponctuation retirée. Sans
  //    cette double condition, un fil d'Ariane ("Accueil › Contact") passerait
  //    pour de la prose à cause de son séparateur.
  if (isTouch) {
    const PROSE = new Set(['P', 'LI', 'SPAN', 'DD', 'DT', 'BLOCKQUOTE', 'EM', 'STRONG', 'LABEL'])
    for (const el of document.querySelectorAll('a, button')) {
      const r = el.getBoundingClientRect()
      if (!r.height || !r.width || r.height >= 44) continue

      const parent = el.parentElement
      const linkText = (el.textContent || '').trim()
      const around = (parent?.textContent || '')
        .replace(linkText, '')
        .replace(/[^\p{L}\p{N}]/gu, '')
      const isInline = PROSE.has(parent?.tagName ?? '') && around.length > 0
      if (isInline) continue

      problems.push({
        rule: 'cible-tactile-trop-petite',
        detail: `"${linkText.slice(0, 30)}" ne fait que ${Math.round(r.height)}px de haut (44px requis)`,
      })
    }
  }

  // 4. Texte trop petit.
  for (const el of document.querySelectorAll('p,li,span,a,dt,dd,figcaption,small')) {
    if (el.children.length > 0) continue
    const fs = parseFloat(getComputedStyle(el).fontSize)
    const txt = (el.textContent || '').trim()
    if (fs > 0 && fs < 12 && txt.length > 3) {
      problems.push({
        rule: 'texte-trop-petit',
        detail: `"${txt.slice(0, 30)}" en ${fs}px (12px minimum)`,
      })
    }
  }

  return problems
}

// ─── Découverte des pages en suivant les liens ──────────────────────
async function discover(page) {
  const seen = new Set()
  const queue = ['/fr', '/en']
  const found = []

  while (queue.length && found.length < MAX_PAGES) {
    const path = queue.shift()
    if (seen.has(path)) continue
    seen.add(path)

    const res = await page.goto(BASE + path, { waitUntil: 'domcontentloaded' })
    const status = res?.status() ?? 0
    found.push({ path, status })
    if (status >= 400) continue

    const links = await page.$$eval('a[href]', (els) =>
      els.map((a) => a.getAttribute('href')).filter(Boolean),
    )
    for (const href of links) {
      if (!href.startsWith('/')) continue // externes, mailto:, tel:, ancres
      const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '')
      if (!/^\/(fr|en)(\/|$)/.test(clean)) continue
      if (!seen.has(clean) && !queue.includes(clean)) queue.push(clean)
    }
  }
  return found
}

// ─── Exécution ──────────────────────────────────────────────────────
const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' })
const scout = await browser.newPage({ viewport: { width: 1280, height: 800 } })

console.log(`Découverte des pages depuis ${BASE} ...`)
const pages = await discover(scout)
await scout.close()

const broken = pages.filter((p) => p.status >= 400)
const ok = pages.filter((p) => p.status < 400)
console.log(`${pages.length} pages trouvées (${broken.length} en erreur)\n`)

const report = [] // { path, viewport, rule, detail }

for (const b of broken) {
  report.push({ path: b.path, viewport: '—', rule: 'page-en-erreur', detail: `statut HTTP ${b.status}` })
}

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  for (const { path } of ok) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    const problems = await page.evaluate(inspect, { viewportWidth: vp.width, isTouch: vp.touch })
    for (const p of problems) report.push({ path, viewport: vp.name, ...p })
  }
  await page.close()
  console.log(`  ${vp.name.padEnd(12)} (${vp.width}px) — vérifié sur ${ok.length} pages`)
}

await browser.close()

// ─── Rapport ────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(70))

if (report.length === 0) {
  console.log(`OK. ${ok.length} pages x ${VIEWPORTS.length} largeurs, aucun problème.`)
  process.exit(0)
}

const byRule = new Map()
for (const r of report) {
  if (!byRule.has(r.rule)) byRule.set(r.rule, [])
  byRule.get(r.rule).push(r)
}

console.log(`${report.length} PROBLÈME(S) sur ${ok.length} pages x ${VIEWPORTS.length} largeurs\n`)
for (const [rule, items] of [...byRule.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${rule.toUpperCase().replace(/-/g, ' ')} — ${items.length}`)
  // On ne noie pas le rapport : 6 exemples par règle suffisent à agir.
  for (const it of items.slice(0, 6)) {
    console.log(`   ${it.path} [${it.viewport}] : ${it.detail}`)
  }
  if (items.length > 6) console.log(`   ... et ${items.length - 6} autre(s)`)
  console.log()
}

process.exit(1)
