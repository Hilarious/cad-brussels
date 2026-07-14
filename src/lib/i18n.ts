import { getRequestConfig } from 'next-intl/server'

export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

const isLocale = (value: string | undefined): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value)

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is the locale resolved by the next-intl middleware.
  // We must always return an explicit `locale` (next-intl ≥ 3.22).
  const requested = await requestLocale
  const locale: Locale = isLocale(requested) ? requested : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
