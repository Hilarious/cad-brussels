import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts')

// ============================================================================
// Content-Security-Policy
// ----------------------------------------------------------------------------
// Ajoutée en mode Report-Only pour lister toutes les violations sans bloquer.
// Une fois qu'on aura observé plusieurs semaines de production sans souci,
// bascule vers `Content-Security-Policy` (enforce) — voir le commentaire au
// bas de la config `headers()`.
//
// 'unsafe-inline' et 'unsafe-eval' sont TOLÉRÉS TEMPORAIREMENT pour l'admin
// Payload et le hot reload en dev. Sur le site public, on serrera avec
// nonces + `strict-dynamic` après l'observation Report-Only.
//
// Sources autorisées :
//   - self (nos assets Next)
//   - data: + blob: (images inline, previews)
//   - https: (CDN images tierces si besoin, Google Fonts fallback)
//   - fonts.gstatic.com / fonts.googleapis.com (Outfit via next/font, on
//     self-host mais on garde une porte de sortie)
//   - *.r2.cloudflarestorage.com + *.scw.cloud (media buckets S3-like)
// ============================================================================
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https:",
  "media-src 'self' https:",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // for Docker multi-stage build (see Dockerfile)
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      // S3 / R2 endpoint for media uploads
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.scw.cloud' },
      { protocol: 'https', hostname: 'cad.be' },
    ],
  },

  // ==========================================================================
  // Redirects 301
  // --------------------------------------------------------------------------
  // Migration WordPress → Next.js. Chaque redirect préserve le jus SEO des
  // 843 backlinks recensés dans l'audit Digistage janvier 2026.
  //
  // Organisation :
  //   1. Bachelors (3 programmes)
  //   2. Masters + spécialisation (6 pages)
  //   3. Pages institutionnelles (About, Admissions, Alumni, Pourquoi)
  //   4. Alias legacy (2024, ux-ui-design-thinking, etc.)
  //   5. Vieilles URLs marketing
  //   6. Portes ouvertes historiques → /events
  //   7. Redirects déjà existants (living-in-brussels, galerie)
  //
  // Convention : `permanent: true` = 308 dans Next 15 (équivalent 301 SEO).
  // Convention slugs : le nouveau schéma utilise des slugs anglais uniques
  // pour les deux locales (Payload multi-locale garde le même slug FR/EN).
  // Convention prefix : sur l'ancien WordPress, les URLs anglaises n'étaient
  // PAS préfixées (`/about-us`), les françaises l'étaient (`/fr/qui-sommes-nous`).
  // ==========================================================================
  async redirects() {
    // Helper local : produit une paire de redirects (FR + EN) pour un couple
    // de slugs, avec préfixe locale sur le nouveau chemin. Sur l'ancien, le
    // slug anglais est sans préfixe et le slug français est préfixé /fr.
    const legacy = (
      oldEN: string,
      oldFR: string,
      newSlug: string,
    ): Array<{ source: string; destination: string; permanent: true }> => [
      { source: oldEN, destination: `/en/${newSlug}`, permanent: true },
      { source: `${oldEN}/`, destination: `/en/${newSlug}`, permanent: true },
      { source: oldFR, destination: `/fr/${newSlug}`, permanent: true },
      { source: `${oldFR}/`, destination: `/fr/${newSlug}`, permanent: true },
    ]

    return [
      // ======================================================================
      // 1. BACHELORS — anciennes URLs WordPress
      // Audit : /fr/undergraduate-interior-architecture-design/ était en pos 2
      // Impressions 1 203 sur 3 mois. Ne PAS casser ces URLs.
      // ======================================================================
      ...legacy(
        '/undergraduate-interior-architecture-design',
        '/fr/undergraduate-interior-architecture-design',
        'interior-architecture-design',
      ),
      ...legacy(
        '/undergraduate-fashion-design',
        '/fr/undergraduate-fashion-design',
        'fashion-accessory-design',
      ),
      ...legacy(
        '/undergraduate-digital-design-art-direction',
        '/fr/undergraduate-digital-design-art-direction',
        'communication-digital-design',
      ),

      // ======================================================================
      // 2. MASTERS + SPÉCIALISATION
      // ======================================================================
      ...legacy(
        '/interior-architecture-design-postgraduate',
        '/fr/interior-architecture-design-postgraduate',
        'interior-architecture-design-master',
      ),
      ...legacy(
        '/postgraduate-interior-architecture-design',
        '/fr/postgraduate-interior-architecture-design',
        'interior-architecture-design-master',
      ),
      ...legacy(
        '/home-living-design',
        '/fr/home-living-design',
        'home-living-design',
      ),
      ...legacy(
        '/digital-brand-content',
        '/fr/digital-brand-content',
        'digital-brand-content',
      ),
      ...legacy(
        '/image-3d-motion-video-ai',
        '/fr/image-3d-motion-video-ai',
        'image-3d-motion-video-ai',
      ),
      ...legacy(
        '/event-management',
        '/fr/event-management',
        'event-management',
      ),
      ...legacy(
        '/fashion-management',
        '/fr/fashion-management',
        'fashion-management',
      ),

      // ======================================================================
      // 3. PAGES INSTITUTIONNELLES
      // ======================================================================
      // About us — /fr/qui-sommes-nous/ est top-24 mentions LLM
      ...legacy('/about-us', '/fr/qui-sommes-nous', 'about'),

      // Admissions — /fr/procedure-admission/ pos 4.5, top LLM
      ...legacy('/procedure-admission', '/fr/procedure-admission', 'admissions'),
      ...legacy('/admission-procedure', '/fr/procedure-admission', 'admissions'),

      // Alumni — /fr/anciens-etudiants/ pos 3.7
      ...legacy('/former-students', '/fr/anciens-etudiants', 'alumni'),
      ...legacy('/alumni-students', '/fr/anciens-etudiants', 'alumni'),

      // Pourquoi le CAD — /cad-strengths/ pos 4
      ...legacy(
        '/cad-strengths',
        '/fr/les-points-forts-du-college-of-art-and-design',
        'pourquoi-le-cad',
      ),
      ...legacy(
        '/why-cad',
        '/fr/les-points-forts-du-college-of-art-and-design-en-belgique',
        'pourquoi-le-cad',
      ),

      // Contact
      ...legacy('/contact-us', '/fr/nous-contacter', 'contact'),

      // ======================================================================
      // 4. ALIAS LEGACY (versionnés année, doublons WordPress)
      // ======================================================================
      // Programmes millésimés 2024
      ...legacy('/programs-2024', '/fr/programs-2024', 'programmes'),
      ...legacy('/programmes-2024', '/fr/programmes-2024', 'programmes'),

      // Anciens noms de programmes Communication / UX
      ...legacy(
        '/digital-ux-ui-2024',
        '/fr/ux-ui-design-thinking',
        'communication-digital-design',
      ),
      ...legacy(
        '/ux-ui-design-thinking',
        '/fr/design-thinking-ux-ui',
        'communication-digital-design',
      ),
      ...legacy(
        '/ux-ui-2024',
        '/fr/ux-ui-2024',
        'communication-digital-design',
      ),

      // Fashion legacy
      ...legacy(
        '/fashion-textile-design',
        '/fr/fashion-textile-design',
        'fashion-accessory-design',
      ),
      ...legacy(
        '/fashion-management-2024',
        '/fr/fashion-management-2024',
        'fashion-management',
      ),

      // Interior legacy
      ...legacy(
        '/interior-architecture-design-2024',
        '/fr/interior-architecture-design-2024',
        'interior-architecture-design',
      ),

      // ======================================================================
      // 5. URLS MARKETING HISTORIQUES (visibles dans backlinks Digistage)
      // ======================================================================
      // Le fameux slug orphelin "cad-brussels-_2022-fpold_safe" (top LLM mentions)
      ...legacy(
        '/cad-brussels-_2022-fpold_safe',
        '/fr/cad-brussels-_2022-fpold_safe',
        'about',
      ),
      ...legacy(
        '/cad-brussels-2022',
        '/fr/cad-brussels-2022',
        'about',
      ),

      // Design system / ouverture culturelle
      ...legacy(
        '/openness-and-culture',
        '/fr/ouverture-et-culture',
        'openness-and-culture',
      ),

      // Living in Brussels (déjà présent, on garde)
      { source: '/fr/living-in-brussels', destination: '/fr/etudier-a-bruxelles', permanent: true },
      { source: '/en/living-in-brussels', destination: '/en/etudier-a-bruxelles', permanent: true },
      { source: '/living-in-brussels', destination: '/en/etudier-a-bruxelles', permanent: true },
      { source: '/fr/vivre-a-bruxelles', destination: '/fr/etudier-a-bruxelles', permanent: true },

      // Galerie deprecated (mai 2026) — déjà présent, on garde
      { source: '/fr/galerie', destination: '/fr/programmes', permanent: true },
      { source: '/en/galerie', destination: '/en/programmes', permanent: true },
      { source: '/galerie', destination: '/en/programmes', permanent: true },
      { source: '/fr/gallery', destination: '/fr/programmes', permanent: true },
      { source: '/gallery', destination: '/en/programmes', permanent: true },

      // ======================================================================
      // 6. PORTES OUVERTES HISTORIQUES → /events
      // Attention : les URLs open-day-* pointaient vers des pages d'événements
      // ponctuels (Spring 2025, Autumn 2025, etc.). Redirect générique vers
      // le hub Events, Google appariera avec les événements futurs seedés.
      //
      // Note syntaxe Next.js : path-to-regexp interdit `:date*` sans
      // séparateur (fait planter la config). On utilise `:date` (single
      // segment) qui capture n'importe quel suffixe après le prefix.
      // ======================================================================
      { source: '/open-day-:date', destination: '/en/events', permanent: true },
      { source: '/fr/open-day-:date', destination: '/fr/events', permanent: true },
      { source: '/portes-ouvertes-:date', destination: '/en/events', permanent: true },
      { source: '/fr/portes-ouvertes-:date', destination: '/fr/events', permanent: true },
      { source: '/open-day', destination: '/en/events', permanent: true },
      { source: '/fr/journee-portes-ouvertes', destination: '/fr/events', permanent: true },

      // ======================================================================
      // 7. WordPress upload paths — on ne redirige PAS (404 propre car les
      // vieux fichiers sont sur wp-content/, remplacés par Payload S3)
      // Note : ces liens en backlinks passent à travers /wp-content/... qui
      // n'existent plus. Le fait de ne pas les rediriger donne un 404 propre.
      // Le seul cas géré : Digistage a détecté qu'ils sont "canonicalisés"
      // dans les backlinks, donc peu de valeur SEO. Accepter le 404.
      // ======================================================================
    ]
  },

  // ==========================================================================
  // Headers de sécurité + CSP Report-Only
  // ==========================================================================
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Sécurité classique
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Permissions Policy — bloque les APIs sensibles non utilisées
          {
            key: 'Permissions-Policy',
            value: [
              'accelerometer=()',
              'camera=()',
              'geolocation=()',
              'gyroscope=()',
              'magnetometer=()',
              'microphone=()',
              'payment=()',
              'usb=()',
            ].join(', '),
          },
          // CSP en mode Report-Only. Une fois qu'on aura observé plusieurs
          // semaines sans violation, on remplace la clé ci-dessous par
          // 'Content-Security-Policy' (enforce). Idéalement on ajoute alors
          // une directive `report-to` pointant vers /api/csp-report ou un
          // service tiers (Sentry, report-uri.com).
          //
          // TODO(prod-launch) : bascule en enforce après T+2 semaines de
          // Report-Only et review des rapports collectés.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: cspDirectives,
          },
        ],
      },
    ]
  },
}

export default withNextIntl(withPayload(nextConfig))
