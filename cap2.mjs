import { chromium } from '@playwright/test'
import { mkdirSync } from 'fs'
const out = '/private/tmp/claude-501/-Users-audryvanessche-Documents-lucius/99d6fb38-9121-4c00-8671-b73e64bc7dd9/scratchpad/frames2'
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: {width:1280, height:860} })
let n = 0
const snap = async () => p.screenshot({ path: `${out}/f${String(n++).padStart(3,'0')}.png` })
await p.goto('http://localhost:3000/fr', { waitUntil: 'networkidle' })
await p.waitForTimeout(400)
// un cycle complet au repos : le reflet passera une fois (cycle 5,8 s)
for (let i=0;i<52;i++){ await snap(); await p.waitForTimeout(115) }
// survol : levee + ombre accent, puis bascule rose (hover:bg-accent)
const btn = p.locator('a.cta-juice').first()
const box = await btn.boundingBox()
await p.mouse.move(box.x+box.width/2, box.y+box.height/2, { steps: 8 })
for (let i=0;i<10;i++){ await snap(); await p.waitForTimeout(90) }
await b.close()
console.log('images :', n)
