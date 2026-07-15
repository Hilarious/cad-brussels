import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { ApplicationForm } from '@/components/application-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Candidater au CAD Brussels, formulaire de pré-inscription',
        description:
          "Pré-inscription en ligne pour les Bachelor et Master du CAD Brussels. Formulaire en 5 minutes, réponse de l'équipe Admissions sous 48h.",
      }
    : {
        title: 'Apply to CAD Brussels, pre-registration form',
        description:
          'Online pre-registration for CAD Brussels Bachelor and Master programs. Five-minute form, response from the Admissions team within 48h.',
      }
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        backLabel: 'Admissions',
        eyebrow: 'Pré-inscription',
        title: 'Candidater au CAD',
        intro:
          "Le formulaire prend ~5 minutes. Pas de portfolio à joindre à ce stade. Pas de frais à payer. On revient vers vous sous 48h pour la suite.",
        helpTitle: 'Avant de commencer, deux choses',
        helpPoints: [
          {
            title: 'Pas besoin d’avoir tout figé',
            body: "Vous pouvez hésiter encore entre deux programmes ou ne pas avoir votre portfolio prêt. La motivation est ce qui compte ici, le reste se précise pendant l'entretien.",
          },
          {
            title: 'Aucun engagement à ce stade',
            body: 'Postuler ne vous engage à rien. C\'est juste le début d\'une conversation. Vous pourrez confirmer ou non votre inscription après notre échange.',
          },
        ],
        formTitle: 'Le formulaire',
      }
    : {
        backLabel: 'Admissions',
        eyebrow: 'Pre-registration',
        title: 'Apply to CAD',
        intro:
          'The form takes ~5 minutes. No portfolio required at this stage. No fees to pay. We get back to you within 48h for the next step.',
        helpTitle: 'Two things before you start',
        helpPoints: [
          {
            title: 'You don’t need to have it all figured out',
            body: 'You may still be hesitating between two programs, or not have your portfolio ready. Motivation is what matters here, the rest gets clearer during the interview.',
          },
          {
            title: 'No commitment yet',
            body: 'Applying does not commit you to anything. It is just the start of a conversation. You can confirm or not your enrolment after we have spoken.',
          },
        ],
        formTitle: 'The form',
      }

  return (
    <article className="container py-16">
      <Link
        href={`/${locale}/admissions`}
        className="tap text-sm text-ink/60 hover:text-accent"
      >
        ← {L.backLabel}
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 text-lg text-ink/70">{L.intro}</p>
      </header>

      {/* Reassurance */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl md:text-3xl">{L.helpTitle}</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {L.helpPoints.map((p, i) => (
            <li key={i} className="rounded-2xl border border-ink/10 p-6">
              <h3 className="font-display text-lg">{p.title}</h3>
              <p className="mt-3 text-ink/70">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Form */}
      <section className="mt-20 max-w-3xl">
        <h2 className="font-display text-2xl md:text-3xl">{L.formTitle}</h2>
        <div className="mt-8">
          <ApplicationForm locale={locale} />
        </div>
      </section>
    </article>
  )
}
