import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { NewsletterForm } from '@/components/newsletter-form'

export default async function NewsletterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { locale } = await params
  const { error } = await searchParams
  setRequestLocale(locale)

  const isFR = locale === 'fr'

  const L = isFR
    ? {
        eyebrow: 'Newsletter',
        title: 'Restez en contact avec le CAD.',
        intro:
          'Une fois par mois, l’essentiel : événements à venir, journées portes ouvertes, ouvertures d’admission, nouveaux modules Lifelong Learning, et coulisses des promotions en cours.',
        promise: 'Pas de spam. Désinscription en 1 clic.',
        seriousPrompt: 'Vous envisagez de nous rejoindre ?',
        seriousLink: 'Recevez la brochure et planifions un échange →',
        errors: {
          missing: 'Lien invalide. Veuillez recommencer votre inscription.',
          invalid: 'Ce lien a expiré ou n’est plus valide.',
        },
      }
    : {
        eyebrow: 'Newsletter',
        title: 'Stay in touch with CAD.',
        intro:
          'Once a month, what matters: upcoming events, open days, admission rounds, new Lifelong Learning modules, and behind-the-scenes from current cohorts.',
        promise: 'No spam. Unsubscribe in 1 click.',
        seriousPrompt: 'Considering joining us?',
        seriousLink: 'Get the brochure and let’s talk →',
        errors: {
          missing: 'Invalid link. Please subscribe again.',
          invalid: 'This link has expired or is no longer valid.',
        },
      }

  return (
    <section className="container py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
          {L.title}
        </h1>
        <p className="mt-6 text-lg text-ink/70">{L.intro}</p>
        <p className="mt-2 text-sm text-ink/50">{L.promise}</p>

        {error && (
          <p className="mt-6 rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error === 'invalid' ? L.errors.invalid : L.errors.missing}
          </p>
        )}

        <div className="mt-10 rounded-2xl border border-ink/10 bg-paper p-6 md:p-8">
          <NewsletterForm locale={locale} variant="full" />
        </div>

        <p className="mt-8 text-sm text-ink/60">
          {L.seriousPrompt}{' '}
          <Link
            href={`/${locale}/info-pack`}
            className="text-accent hover:underline"
          >
            {L.seriousLink}
          </Link>
        </p>
      </div>
    </section>
  )
}
