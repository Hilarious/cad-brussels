import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { LanguageSwitcher } from './language-switcher'
import { NavItem } from './nav-item'
import { MobileMenu } from './mobile-menu'
import { Logo } from './logo'
import { localized } from '@/lib/localize'
import { assainirLibelle } from '@/lib/appellations'

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
        <Logo locale={locale} variant="header" size="lg" />

        {/* Nav at `text-base` (17px) for readability — used to be too
            small at `text-sm`.

            Le seuil est `xl` (1280px). Il a d'abord été `md` (768px) puis
            `lg` (1024px), mais 1024px ne suffisait pas non plus : mesuré
            sur la production, la barre réclame environ 1245px (logo 169,
            navigation 718, langue et CTA 198, gouttières 64, marges du
            conteneur 96). En dessous, les intitulés se coupaient en deux
            lignes. En dessous de 1280px, c'est <MobileMenu> qui prend le
            relais.

            `gap-6` et non `gap-8` : les 24px suffisent à séparer les
            entrées et rendent les 40px qui manquaient pour tenir à 1280.
            Ce calcul suppose 6 entrées ; en ajouter une dans le CMS peut
            faire repasser la barre au-dessus du seuil. */}
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-6 text-base">
            {navItems.map((item, i) => (
              <NavItem
                key={`${item.path}-${i}`}
                label={assainirLibelle(item.label)}
                href={localized(item.path, locale)}
                submenu={(item.children ?? []).map((c) => ({
                  label: assainirLibelle(c.label),
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
              className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition duration-200 hover:-translate-y-0.5 hover:bg-accent hover:shadow-md hover:shadow-accent/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:inline-flex"
            >
              {assainirLibelle(cta.label)}
            </Link>
          )}

          <MobileMenu
            navItems={navItems.map((item) => ({
              label: assainirLibelle(item.label),
              href: localized(item.path, locale),
              children: (item.children ?? []).map((c) => ({
                label: assainirLibelle(c.label),
                href: localized(c.path, locale),
              })),
            }))}
            cta={
              cta?.label && cta?.path
                ? { label: assainirLibelle(cta.label), href: localized(cta.path, locale) }
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
