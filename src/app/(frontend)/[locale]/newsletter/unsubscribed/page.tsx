import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'

export default async function UnsubscribedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        eyebrow: 'Désinscription effectuée',
        title: 'Vous ne recevrez plus la newsletter.',
        body: 'Votre adresse a été retirée de notre liste de diffusion. Si c’était une erreur, vous pouvez vous réinscrire à tout moment.',
        cta1: { label: 'Retour à la home', href: `/${locale}` },
        cta2: { label: 'Me réinscrire', href: `/${locale}/newsletter` },
      }
    : {
        eyebrow: 'Unsubscribed',
        title: "You'll no longer receive the newsletter.",
        body: 'Your address has been removed from our mailing list. If that was a mistake, you can subscribe again any time.',
        cta1: { label: 'Back to home', href: `/${locale}` },
        cta2: { label: 'Subscribe again', href: `/${locale}/newsletter` },
      }

  return (
    <section className="container py-20 md:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
          {L.title}
        </h1>
        <p className="mt-6 text-lg text-ink/70">{L.body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href={L.cta1.href}
            className="rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-accent"
          >
            {L.cta1.label}
          </Link>
          <Link
            href={L.cta2.href}
            className="rounded-full border border-ink/20 px-6 py-3 text-sm hover:border-accent hover:text-accent"
          >
            {L.cta2.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
