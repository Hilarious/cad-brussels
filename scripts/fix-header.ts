/**
 * Force-rewrite the header global in BOTH locales,
 * with verification after each write to detect Payload merge issues
 * before they reach production.
 *
 * Usage: pnpm fix:header
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const headerFR = {
  navItems: [
    {
      label: 'Bachelor',
      path: '/fr/programmes',
      children: [
        { label: 'Tous les Bachelors', path: '/fr/programmes' },
        { label: "Architecture d'intérieur", path: '/fr/interior-architecture-design' },
        { label: 'Communication & Digital', path: '/fr/communication-digital-design' },
        { label: 'Mode & Accessoires', path: '/fr/fashion-accessory-design' },
      ],
    },
    {
      label: 'Master',
      path: '/fr/masters',
      children: [
        { label: 'Tous les Masters', path: '/fr/masters' },
        { label: "Architecture d'intérieur · 2 ans", path: '/fr/interior-architecture-design-master' },
        { label: 'Home & Living', path: '/fr/home-living-design' },
        { label: 'Digital Brand Content', path: '/fr/digital-brand-content' },
        { label: 'Image, 3D, Motion, IA', path: '/fr/image-3d-motion-video-ai' },
        { label: 'Event Management', path: '/fr/event-management' },
        { label: 'Fashion Management', path: '/fr/fashion-management' },
      ],
    },
    {
      label: 'Lifelong Learning',
      path: '/fr/lifelong-learning',
      children: [
        { label: 'Tous les modules', path: '/fr/lifelong-learning' },
        {
          label: 'Generative AI · Créatifs',
          path: '/fr/lifelong-learning/generative-ai-creative',
        },
        {
          label: 'IA appliquée · Architecture & espace',
          path: '/fr/lifelong-learning/applied-ai-spatial-design',
        },
      ],
    },
    { label: 'Événements', path: '/fr/events' },
    { label: 'Actualités', path: '/fr/news' },
    {
      label: 'À propos',
      path: '/fr/about',
      children: [
        { label: "L'école", path: '/fr/about' },
        { label: 'Pourquoi le CAD', path: '/fr/pourquoi-le-cad' },
        { label: 'Professeurs', path: '/fr/professeurs' },
        { label: 'Alumni', path: '/fr/alumni' },
        { label: 'International', path: '/fr/around-the-world' },
        { label: 'Étudier à Bruxelles', path: '/fr/etudier-a-bruxelles' },
        { label: 'Ouverture & Culture', path: '/fr/openness-and-culture' },
      ],
    },
    { label: 'Contact', path: '/fr/contact' },
  ],
  cta: { label: 'Admissions', path: '/fr/admissions' },
}

const headerEN = {
  navItems: [
    {
      label: 'Bachelor',
      path: '/en/programmes',
      children: [
        { label: 'All Bachelors', path: '/en/programmes' },
        { label: 'Interior Architecture', path: '/en/interior-architecture-design' },
        { label: 'Communication & Digital', path: '/en/communication-digital-design' },
        { label: 'Fashion & Accessory', path: '/en/fashion-accessory-design' },
      ],
    },
    {
      label: 'Master',
      path: '/en/masters',
      children: [
        { label: 'All Masters', path: '/en/masters' },
        { label: 'Interior Architecture · 2 years', path: '/en/interior-architecture-design-master' },
        { label: 'Home & Living', path: '/en/home-living-design' },
        { label: 'Digital Brand Content', path: '/en/digital-brand-content' },
        { label: 'Image, 3D, Motion, AI', path: '/en/image-3d-motion-video-ai' },
        { label: 'Event Management', path: '/en/event-management' },
        { label: 'Fashion Management', path: '/en/fashion-management' },
      ],
    },
    {
      label: 'Lifelong Learning',
      path: '/en/lifelong-learning',
      children: [
        { label: 'All modules', path: '/en/lifelong-learning' },
        {
          label: 'Generative AI · Creatives',
          path: '/en/lifelong-learning/generative-ai-creative',
        },
        {
          label: 'Applied AI · Architecture & space',
          path: '/en/lifelong-learning/applied-ai-spatial-design',
        },
      ],
    },
    { label: 'Events', path: '/en/events' },
    { label: 'News', path: '/en/news' },
    {
      label: 'About',
      path: '/en/about',
      children: [
        { label: 'The school', path: '/en/about' },
        { label: 'Why CAD', path: '/en/pourquoi-le-cad' },
        { label: 'Faculty', path: '/en/professeurs' },
        { label: 'Alumni', path: '/en/alumni' },
        { label: 'International', path: '/en/around-the-world' },
        { label: 'Studying in Brussels', path: '/en/etudier-a-bruxelles' },
        { label: 'Openness & Culture', path: '/en/openness-and-culture' },
      ],
    },
    { label: 'Contact', path: '/en/contact' },
  ],
  cta: { label: 'Admissions', path: '/en/admissions' },
}

async function main() {
  const payload = await getPayload({ config })

  // Write FR
  await payload.updateGlobal({ slug: 'header', data: headerFR, locale: 'fr' })
  const verifyFR = await payload.findGlobal({ slug: 'header', locale: 'fr', depth: 0 })
  const frCount = verifyFR.navItems?.length ?? 0
  if (frCount === 0) {
    throw new Error('FR header write resulted in empty navItems. Aborting.')
  }
  console.log(`✓ FR header written and verified (${frCount} items)`)

  // Write EN
  await payload.updateGlobal({ slug: 'header', data: headerEN, locale: 'en' })
  const verifyEN = await payload.findGlobal({ slug: 'header', locale: 'en', depth: 0 })
  const enCount = verifyEN.navItems?.length ?? 0
  if (enCount === 0) {
    throw new Error('EN header write resulted in empty navItems.')
  }
  console.log(`✓ EN header written and verified (${enCount} items)`)

  // Re-verify FR after EN write — this is THE key check, because the
  // historical bug was that writing EN silently emptied FR.
  const reVerifyFR = await payload.findGlobal({ slug: 'header', locale: 'fr', depth: 0 })
  const frCountAfter = reVerifyFR.navItems?.length ?? 0
  if (frCountAfter === 0) {
    throw new Error(
      'CRITICAL: FR header was emptied after EN write. ' +
      'This is the bug that motivated localized:true on navItems. ' +
      'Did you remember to regenerate the schema after editing Header.ts?',
    )
  }
  if (frCountAfter !== frCount) {
    console.warn(
      `⚠ FR item count changed from ${frCount} to ${frCountAfter} after EN write. ` +
      'Investigate.',
    )
  } else {
    console.log(`✓ FR header still has ${frCountAfter} items after EN write`)
  }

  console.log('\n✅ Header fixed in FR and EN, verified independent.')
  process.exit(0)
}

main().catch((e) => {
  console.error('✗ Failed:', e)
  process.exit(1)
})
