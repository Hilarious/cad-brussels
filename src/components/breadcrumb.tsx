import Link from 'next/link'

/**
 * <Breadcrumb> — chemin de navigation sur les sous-pages.
 *
 * Deux rôles :
 * 1. UX : montrer où l'on est dans la hiérarchie, permettre de remonter en 1 clic
 * 2. SEO : injecter un `<script type="application/ld+json">` avec un
 *    schema.org `BreadcrumbList` — génère les rich snippets breadcrumb
 *    dans les résultats Google (chapelet de mots-clés cliquables au
 *    lieu de l'URL brute). Impact CTR mesurable.
 *
 * Le dernier item est toujours affiché comme texte (pas de Link), c'est
 * la page courante. Les précédents sont tous cliquables.
 *
 * Le composant est SSR / RSC — pas de JS client, aucun impact bundle.
 *
 * Usage :
 *   <Breadcrumb
 *     locale={locale}
 *     items={[
 *       { label: 'Admissions', href: '/admissions' },
 *       { label: 'Frais de scolarité' }, // dernier item = page courante
 *     ]}
 *   />
 *
 * Le composant ajoute automatiquement l'item "Accueil" au début (lié
 * vers `/[locale]`). Pas besoin de le passer dans `items`.
 */

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumb({
  locale,
  items,
  className = '',
}: {
  locale: string
  items: BreadcrumbItem[]
  className?: string
}) {
  const isFR = locale === 'fr'
  const homeLabel = isFR ? 'Accueil' : 'Home'
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://cad.be'

  // Prepend Accueil / Home for the visual breadcrumb.
  const fullPath: BreadcrumbItem[] = [
    { label: homeLabel, href: `/${locale}` },
    ...items,
  ]

  // Build JSON-LD BreadcrumbList schema. Each item MUST have @id and name.
  // The last item omits @id per schema.org best practice (current page).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullPath.map((item, i) => {
      const isLast = i === fullPath.length - 1
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: item.label,
        ...(item.href && !isLast
          ? { item: `${siteUrl}${item.href}` }
          : {}),
      }
    }),
  }

  return (
    <nav
      aria-label={isFR ? 'Fil d’Ariane' : 'Breadcrumb'}
      className={`text-sm ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2 text-ink/60">
        {fullPath.map((item, i) => {
          const isLast = i === fullPath.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-ink/30">
                  ›
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="text-ink">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="tap hover:text-accent hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
      {/* Injected server-side, no client JS. Google picks it up on crawl. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  )
}
