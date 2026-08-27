import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cad.be'

/**
 * Les robots des IA ne sont pas exclus, et c'est délibéré : des
 * candidats arrivent au CAD après avoir interrogé ChatGPT, rapporté par
 * les étudiants eux-mêmes lors des petits déjeuners. Les bloquer
 * couperait un canal de recrutement qui produit déjà.
 *
 * `/llms.txt` est signalé ici, c'est la seule façon pour un modèle de
 * savoir qu'il existe.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
