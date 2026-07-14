import { chromium } from '@playwright/test'

const PAGES = [
  '/fr',
  '/fr/pourquoi-le-cad',
  '/fr/admissions',
  '/fr/admissions/frais',
  '/fr/alumni',
  '/fr/professeurs',
  '/fr/about',
  '/fr/contact',
  '/fr/events',
  '/fr/news',
  '/fr/lifelong-learning',
  '/fr/etudier-a-bruxelles',
]

const VIEWPORTS = [
  { name: 'mobile  (390px, iPhone)', width: 390, height: 844 },
  { name: 'tablette (768px, iPad)', width: 768, height: 1024 },
  { name: 'portable (1280px)', width: 1280, height: 800 },
  { name: 'grand écran (1920px)', width: 1920, height: 1080 },
]

const browser = await chromium.launch({ channel: 'chrome' })
let problems = 0

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  console.log(`\n########  ${vp.name}  ########`)

  for (const path of PAGES) {
    await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' })

    const report = await page.evaluate((vw) => {
      // 1. La page déborde-t-elle horizontalement ? (scroll latéral = symptôme n°1
      //    d'un site non responsive : l'utilisateur doit glisser de gauche à droite)
      const docOverflow = document.documentElement.scrollWidth - vw

      // 2. Quels éléments sortent du cadre ?
      const culprits = []
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const over = Math.round(r.right - vw)
        if (over > 2) {
          const style = getComputedStyle(el)
          if (style.position === 'fixed') continue
          culprits.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className?.toString() || '').slice(0, 60),
            over,
            txt: (el.textContent || '').trim().slice(0, 30),
          })
        }
      }

      // 3. Chevauchement des emplacements d'image
      const imgs = [...document.querySelectorAll('[role="img"]')].map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.x, y: r.y + window.scrollY, w: r.width, h: r.height }
      })
      let overlaps = 0
      for (let i = 0; i < imgs.length; i++)
        for (let j = i + 1; j < imgs.length; j++) {
          const a = imgs[i], b = imgs[j]
          const dx = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
          const dy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
          if (dx > 1 && dy > 1) overlaps++
        }

      // 4. Zones tactiles trop petites (< 40px de haut) : recommandation Apple/Google = 44px
      const smallTargets = [...document.querySelectorAll('a, button')].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.height > 0 && r.height < 40 && r.width > 0
      }).length

      // 5. Texte trop petit sur mobile (< 12px)
      const tinyText = [...document.querySelectorAll('p, li, span, a')].filter((el) => {
        const fs = parseFloat(getComputedStyle(el).fontSize)
        return fs > 0 && fs < 12 && (el.textContent || '').trim().length > 3
      }).length

      return { docOverflow, culprits: culprits.slice(0, 4), overlaps, smallTargets, tinyText }
    }, vp.width)

    const flags = []
    if (report.docOverflow > 2) flags.push(`SCROLL LATÉRAL +${report.docOverflow}px`)
    if (report.overlaps) flags.push(`${report.overlaps} chevauchement(s) d'image`)
    if (report.tinyText) flags.push(`${report.tinyText} texte(s) < 12px`)
    if (vp.width < 768 && report.smallTargets > 0)
      flags.push(`${report.smallTargets} zone(s) tactile(s) < 40px`)

    if (flags.length) {
      problems += flags.length
      console.log(`  ${path.padEnd(30)} ${flags.join(' | ')}`)
      for (const c of report.culprits)
        console.log(`      déborde de ${c.over}px : <${c.tag}> "${c.txt}" [${c.cls}]`)
    } else {
      console.log(`  ${path.padEnd(30)} OK`)
    }
  }
  await page.close()
}

await browser.close()
console.log(`\n>>> ${problems === 0 ? 'Aucun problème détecté.' : problems + ' signalement(s).'}`)
