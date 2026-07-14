'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { locales } from '@/lib/i18n'

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const t = useTranslations('language')
  const pathname = usePathname() ?? '/'
  // Strip current locale prefix
  const rest = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/'
  const other = currentLocale === 'fr' ? 'en' : 'fr'

  return (
    <Link
      href={`/${other}${rest}`}
      className="tap text-sm font-medium uppercase tracking-wide text-ink/70 hover:text-accent"
      aria-label={`Switch language to ${other.toUpperCase()}`}
    >
      {t('switchTo')}
    </Link>
  )
}
