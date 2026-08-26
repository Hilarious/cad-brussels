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

/**
 * Rafraîchissement posé ICI, sur le gabarit commun, et pas page par page.
 *
 * L'en-tête et le pied de page sont rendus par ce gabarit et viennent du
 * CMS. Or 21 des 30 pages du site ne déclaraient aucun rafraîchissement :
 * elles étaient figées à la date du dernier déploiement, donc une
 * modification du menu faite dans l'admin n'y apparaissait jamais. C'est
 * ce qui donnait deux navigations différentes selon la page, l'accueil à
 * jour et /myfuture restée à l'ancienne (constaté le 26/08/2026).
 *
 * Le réglage posé sur le gabarit vaut pour toutes les pages qui n'en
 * déclarent pas, ce qui règle les 21 d'un coup. Les pages qui déclarent
 * déjà 60 secondes gardent la même valeur, rien ne change pour elles.
 */
export const revalidate = 60

/**
 * Métadonnées racine, déclinées par langue.
 *
 * Était auparavant un `export const metadata` statique : la version
 * anglaise du site héritait donc de la description française. Chaque
 * langue a désormais la sienne, plus les balises `hreflang` qui
 * signalent aux moteurs que /fr et /en sont deux versions d'un même
 * site, et les balises Open Graph utilisées à l'aperçu d'un partage.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isFR = locale === 'fr'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cad.be'

  const title = isFR
    ? 'CAD Brussels, école de design à Bruxelles'
    : 'CAD Brussels, College of Art & Design'
  const description = isFR
    ? 'École de design privée à Bruxelles depuis 1961. Architecture d’intérieur, communication & digital, mode. Cursus en anglais, 160 étudiants, encadrement par des professionnels en activité.'
    : 'Private design school in Brussels since 1961. Interior architecture, communication & digital, fashion. Taught in English, 160 students, mentored by working professionals.'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: '%s, CAD Brussels',
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: '/fr',
        en: '/en',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'CAD Brussels',
      locale: isFR ? 'fr_BE' : 'en_GB',
      url: `${siteUrl}/${locale}`,
      title,
      description,
      images: [
        {
          url: isFR ? '/og/cad-fr.png' : '/og/cad-en.png',
          width: 1200,
          height: 630,
          alt: 'CAD Brussels, College of Art & Design',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [isFR ? '/og/cad-fr.png' : '/og/cad-en.png'],
    },
  }
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
