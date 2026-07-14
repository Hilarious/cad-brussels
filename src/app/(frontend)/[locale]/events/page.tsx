import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { EventCard } from '@/components/event-card'
import { AdmissionCTA } from '@/components/admission-cta'

export const revalidate = 60 // ISR: refresh every minute

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'events' })

  const payload = await getPayload({ config })
  const events = await payload.find({
    collection: 'events',
    locale: locale as 'fr' | 'en',
    where: {
      and: [
        { status: { equals: 'published' } },
        { startDate: { greater_than_equal: new Date().toISOString() } },
      ],
    },
    sort: 'startDate',
    limit: 50,
  })

  return (
    // Events listing themed with Orange (Master Event Management accent),
    // makes the calendar feel energetic and event-y.
    <div className="theme-event">
      <section className="container py-20 md:py-28">
        <p className="text-sm uppercase tracking-widest text-accent">
          {locale === 'fr' ? 'Agenda' : 'Calendar'}
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/70">{t('subtitle')}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.docs.length === 0 ? (
            <p className="text-ink/60">{t('noEvents')}</p>
          ) : (
            events.docs.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} />
            ))
          )}
        </div>
      </section>

      <AdmissionCTA
        locale={locale}
        variant="primary"
        heading={
          locale === 'fr'
            ? 'Open Day passé ? Vous pouvez aussi venir hors agenda.'
            : 'Missed the Open Day? You can still come on your own.'
        }
      />
    </div>
  )
}
