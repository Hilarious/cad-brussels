import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cad.be'

/**
 * NE PAS BLOQUER LES ROBOTS D'ASSISTANTS IA.
 *
 * La règle `*` les autorise, et c'est un choix, pas un oubli. Des
 * candidats arrivent au CAD après avoir interrogé un assistant, ChatGPT,
 * Gemini, Claude ou un autre : constat rapporté par les étudiants
 * eux-mêmes lors des petits déjeuners. Ajouter un `Disallow` pour
 * `GPTBot`, `Google-Extended`, `ClaudeBot`, `PerplexityBot` ou leurs
 * équivalents couperait un canal de recrutement qui produit déjà.
 *
 * Ce commentaire existe pour qu'un futur passage de nettoyage ne les
 * bloque pas « par prudence ».
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
