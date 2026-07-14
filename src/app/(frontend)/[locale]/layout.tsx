import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import '@/app/(frontend)/globals.css'

// Outfit — the single CAD Brussels digital typeface, per the Digital
// Guidelines validated with Thomas Durieux (print) and Eric Vanden
// Broeck (Dean). Used for ALL digital surfaces: body + display.
// next/font/google self-hosts the font (no FOUT, no privacy leak to
// Google Fonts CDN, optimized subset only).
const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://cad.be',
  ),
  title: {
    default: 'CAD Brussels, College of Art & Design',
    template: '%s, CAD Brussels',
  },
  description:
    'École supérieure de design à Bruxelles depuis 1961. Bachelor, Master et formations continues en architecture d’intérieur, design digital et mode.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as (typeof locales)[number])) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={outfit.variable}>
      <body className="bg-paper font-sans text-ink antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteHeader locale={locale} />
          <main id="main">{children}</main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
