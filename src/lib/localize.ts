/**
 * Préfixe un chemin interne par `/${locale}`, en laissant les URL externes
 * intactes. Gère aussi les données héritées où le préfixe de langue était déjà
 * enregistré ("/fr/contact" reste "/fr/contact", pas "/fr/fr/contact"), et
 * bascule ce préfixe vers la langue courante.
 *
 * Extrait de site-header et site-footer, où il était dupliqué à l'identique.
 *
 *   localized('/contact', 'fr')      → '/fr/contact'
 *   localized('/en/about', 'fr')     → '/fr/about'   (bascule de langue)
 *   localized('https://x.com', 'fr') → 'https://x.com'
 *   localized(null, 'fr')            → '#'
 */
export function localized(
  path: string | null | undefined,
  locale: string,
): string {
  if (!path) return '#'
  if (/^https?:\/\//i.test(path)) return path
  // Déjà préfixé par une langue ? On garde le reste, mais avec la langue courante.
  const localePrefixMatch = path.match(/^\/(fr|en)(\/.*|$)/)
  if (localePrefixMatch) return `/${locale}${localePrefixMatch[2] || ''}`
  if (path.startsWith('/')) return `/${locale}${path}`
  return path
}
