import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NewsletterForm } from './newsletter-form'
import { Logo } from './logo'

const localized = (path: string | null | undefined, locale: string) => {
  if (!path) return '#'
  if (/^https?:\/\//i.test(path)) return path
  const localePrefixMatch = path.match(/^\/(fr|en)(\/.*|$)/)
  if (localePrefixMatch) return `/${locale}${localePrefixMatch[2] || ''}`
  if (path.startsWith('/')) return `/${locale}${path}`
  return path
}

export async function SiteFooter({ locale }: { locale: string }) {
  const payload = await getPayload({ config })
  const [footer, settings] = await Promise.all([
    payload.findGlobal({
      slug: 'footer',
      locale: locale as 'fr' | 'en',
      depth: 0,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      locale: locale as 'fr' | 'en',
      depth: 0,
    }),
  ])

  const columns = footer.columns ?? []
  const legal = footer.legal ?? []
  const year = new Date().getFullYear()
  const isFR = locale === 'fr'

  return (
    <footer className="mt-24 border-t border-ink/10 bg-paper">
      {/* Newsletter band — compact, single line on desktop */}
      <div className="border-b border-ink/10">
        <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="md:max-w-sm">
            <p className="font-display text-lg text-ink">
              {isFR
                ? 'Une fois par mois, l’essentiel.'
                : 'Once a month, what matters.'}
            </p>
            <p className="mt-1 text-sm text-ink/60">
              {isFR ? 'Événements, admissions, modules. ' : 'Events, admissions, modules. '}
              <Link
                href={`/${locale}/newsletter`}
                className="text-accent hover:underline"
              >
                {isFR ? 'En savoir plus →' : 'Learn more →'}
              </Link>
            </p>
          </div>
          <div className="md:flex-1 md:max-w-md">
            <NewsletterForm locale={locale} variant="compact" />
          </div>
        </div>
      </div>

      {/* Site map */}
      <div className="container grid gap-12 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          {/* Footer : wordmark complet, signature institutionnelle stable
              indépendamment des campagnes anniversaire. */}
          <Logo locale={locale} variant="wordmark" size="lg" noLink />
          <p className="mt-2 max-w-sm text-sm text-ink/60">{settings.tagline}</p>
          <div className="mt-6 space-y-1 text-sm text-ink/70">
            {settings.contact?.address && (
              <p className="whitespace-pre-line">{settings.contact.address}</p>
            )}
            {settings.contact?.email && (
              <p>
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="hover:text-accent"
                >
                  {settings.contact.email}
                </a>
              </p>
            )}
            {settings.contact?.phone && (
              <p>
                <a
                  href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                  className="hover:text-accent"
                >
                  {settings.contact.phone}
                </a>
              </p>
            )}
          </div>
        </div>

        {columns.map((col, i) => (
          <div key={`col-${i}`}>
            <p className="text-sm font-medium uppercase tracking-widest text-ink/50">
              {col.title}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {(col.links ?? []).map((link, j) => (
                <li key={`link-${j}`}>
                  <Link
                    href={localized(link.path, locale)}
                    className="text-ink/80 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 py-6 text-xs text-ink/60">
        <p>
          {footer.copyright ?? `© ${year} CAD Brussels`} · {year}
        </p>
        <ul className="flex flex-wrap gap-4">
          {legal.map((item, i) => (
            <li key={`legal-${i}`}>
              <Link
                href={localized(item.path, locale)}
                className="hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
