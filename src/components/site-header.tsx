import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { LanguageSwitcher } from './language-switcher'
import { NavItem } from './nav-item'
import { MobileMenu } from './mobile-menu'
import { Logo } from './logo'
import { localized } from '@/lib/localize'

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
            the 7 menu items + dropdowns.

            Le seuil est `lg` (1024px) et non `md` (768px) : les 7 entrées
            plus le CTA et le sélecteur de langue ne tiennent pas dans 768px.
            Sous `md`, la barre débordait de ~283px et forçait un défilement
            horizontal sur toutes les pages en tablette. En dessous de 1024px,
            c'est <MobileMenu> qui prend le relais. */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-base">
            {navItems.map((item, i) => (
              <NavItem
                key={`${item.path}-${i}`}
                label={item.label}
                href={localized(item.path, locale)}
                submenu={(item.children ?? []).map((c) => ({
                  label: c.label,
                  href: localized(c.path, locale),
                }))}
              />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          {/* Visible dès `md` : le CTA de candidature est le principal levier de
              conversion du site, il n'a pas à être enterré dans le menu replié
              sur tablette. Sous `md`, il reste accessible en bas du panneau. */}
          {cta?.label && cta?.path && (
            <Link
              href={localized(cta.path, locale)}
              className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-accent md:inline-flex"
            >
              {cta.label}
            </Link>
          )}

          <MobileMenu
            navItems={navItems.map((item) => ({
              label: item.label,
              href: localized(item.path, locale),
              children: (item.children ?? []).map((c) => ({
                label: c.label,
                href: localized(c.path, locale),
              })),
            }))}
            cta={
              cta?.label && cta?.path
                ? { label: cta.label, href: localized(cta.path, locale) }
                : null
            }
            labels={
              locale === 'fr'
                ? { open: 'Ouvrir le menu', close: 'Fermer le menu', menu: 'Navigation principale' }
                : { open: 'Open menu', close: 'Close menu', menu: 'Primary navigation' }
            }
          />
        </div>
      </div>
    </header>
  )
}
