import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { LeadForm } from '@/components/lead-form'

export default async function InfoPackPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        eyebrow: 'Demande d’informations',
        title: 'Recevez la brochure, ou venez nous rendre visite.',
        intro:
          'Dites-nous ce qui vous intéresse, un programme, une visite, une candidature, et le secrétariat vous recontacte sous 48 heures ouvrées avec une réponse personnalisée.',
        casualPrompt: 'Vous voulez juste suivre nos actualités ?',
        casualLink: 'Inscrivez-vous à la newsletter →',
      }
    : {
        eyebrow: 'Information request',
        title: 'Get the brochure, or come and visit us.',
        intro:
          'Tell us what you’re interested in: a program, a visit, an application. The secretariat will get back to you within 2 working days with a tailored answer.',
        casualPrompt: 'Just want to follow our news?',
        casualLink: 'Subscribe to the newsletter →',
      }

  return (
    <section className="container py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/70">{L.intro}</p>

        <p className="mt-4 text-sm text-ink/60">
          {L.casualPrompt}{' '}
          <Link
            href={`/${locale}/newsletter`}
            className="text-accent hover:underline"
          >
            {L.casualLink}
          </Link>
        </p>

        <div className="mt-12 rounded-2xl border border-ink/10 bg-paper p-6 md:p-10">
          <LeadForm locale={locale} />
        </div>
      </div>
    </section>
  )
}
