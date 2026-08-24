import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { MyFutureGenerator } from '@/components/myfuture-generator'

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
    <main className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <MyFutureGenerator locale={locale} />
    </main>
  )
}
