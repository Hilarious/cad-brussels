import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { LanguageSwitcher } from './language-switcher'
import { NavItem } from './nav-item'
import { Logo } from './logo'

/** Prepend `/${locale}` to internal paths; leave external URLs intact.
 *  Also handles legacy data where the locale prefix was already saved
 *  ("/fr/contact" → "/fr/contact" instead of "/fr/fr/contact"). */
const localized = (path: string | null | undefined, locale: string) => {
  if (!path) return '#'
  if (/^https?:\/\//i.test(path)) return path
  // Already locale-prefixed? Use as-is, but swap to the current locale.
  const localePrefixMatch = path.match(/^\/(fr|en)(\/.*|$)/)
  if (localePrefixMatch) return `/${locale}${localePrefixMatch[2] || ''}`
  if (path.startsWith('/')) return `/${locale}${path}`
  return path
}

export async function SiteHeader({ locale }: { locale: string }) {
  const payload = await getPayload({ config })
  const header = await payload.findGlobal({
    slug: 'header',
    locale: locale as 'fr' | 'en',
    depth: 0,
  })

  const navItems = header.navItems ?? []
  const cta = header.cta

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
      <div className="container flex h-20 items-center justify-between gap-8">
        {/* Logo 65 ans : édition anniversaire 2026, visible sur le
            header pendant la campagne. Bascule vers variant="monogram"
            ou "wordmark" en fin de campagne. */}
        <Logo locale={locale} variant="65" size="md" />

        {/* Nav at `text-base` (17px) for readability — used to be too
            small at `text-sm`. Gap-8 keeps comfortable spacing between
            the 7 menu items + dropdowns. */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-base">
            {navItems.map((item, i) => (
              <NavItem
                key={`${item.path}-${i}`}
                label={item.label}
                href={localized(item.path, locale)}
                children={(item.children ?? []).map((c) => ({
                  label: c.label,
                  href: localized(c.path, locale),
                }))}
              />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          {cta?.label && cta?.path && (
            <Link
              href={localized(cta.path, locale)}
              className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent md:inline-flex"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
