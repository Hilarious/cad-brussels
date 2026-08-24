import type { Metadata } from 'next'
import { Playfair_Display, Pinyon_Script } from 'next/font/google'
import { setRequestLocale } from 'next-intl/server'
import { MyFutureGenerator } from '@/components/myfuture-generator'

/**
 * Deux typographies chargées uniquement ici.
 *
 * Les Digital Guidelines imposent Outfit comme police unique du site, et
 * l'interface de cette page la respecte. Mais l'image produite n'est pas
 * une page de site : c'est de la matière de campagne, du même registre
 * que les t-shirts. Elle emprunte donc le vocabulaire streetwear, un
 * serif à fort contraste mêlé à une anglaise. Les polices ne servent
 * qu'au rendu sur canvas, jamais à l'habillage de la page.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-affiche-serif',
})

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-affiche-script',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Plus tard · CAD Brussels',
        description:
          "Complète la phrase, on en fait une image, tu l'envoies à tes parents. Papa, maman, plus tard, je serai...",
      }
    : {
        title: 'Later · CAD Brussels',
        description:
          'Fill in the blank, we turn it into an image, you send it to your parents. Mum, dad, later I will be...',
      }
}

export default async function MyFuturePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main
      className={`${playfair.variable} ${pinyon.variable} mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24`}
    >
      <MyFutureGenerator locale={locale} />
    </main>
  )
}
