import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ContactForm } from '@/components/contact-form'
import { Grid, Col } from '@/components/grid'

// Topics that can be pre-filled via /contact?topic=xxx — keep this list
// in sync with the links emitted from /admissions and other CTAs.
type ContactTopic = 'meeting' | 'breakfast' | 'open-day' | 'lifelong' | 'partnership'

const TOPIC_PREFILL: Record<
  ContactTopic,
  { fr: { subject: string; message: string }; en: { subject: string; message: string }; banner: { fr: string; en: string } }
> = {
  meeting: {
    fr: {
      subject: 'Demande d’entretien individuel avec le directeur',
      message:
        'Bonjour,\n\nJe souhaiterais prendre un rendez-vous individuel avec le directeur pour parler de mon profil et de mon projet d’études au CAD.\n\nQuelques précisions sur où j’en suis :\n\n',
    },
    en: {
      subject: 'Request for an individual meeting with the director',
      message:
        'Hi,\n\nI would like to book an individual meeting with the director to discuss my profile and my study plans at CAD.\n\nA bit of context on where I am:\n\n',
    },
    banner: {
      fr: 'Vous venez de la page admissions pour demander un entretien individuel.',
      en: 'You came from the admissions page to request an individual meeting.',
    },
  },
  breakfast: {
    fr: {
      subject: 'Réservation pour un Breakfast du mercredi',
      message:
        'Bonjour,\n\nJe souhaiterais venir à l’un des prochains Breakfast du mercredi pour découvrir le CAD de manière informelle et poser quelques questions.\n\nMa date préférée serait :\n\n',
    },
    en: {
      subject: 'Booking for a Wednesday Breakfast',
      message:
        'Hi,\n\nI would like to come to one of the upcoming Wednesday Breakfasts to discover CAD in an informal setting and ask a few questions.\n\nMy preferred date would be:\n\n',
    },
    banner: {
      fr: 'Vous venez de la page admissions pour réserver un Breakfast du mercredi.',
      en: 'You came from the admissions page to book a Wednesday Breakfast.',
    },
  },
  'open-day': {
    fr: {
      subject: 'Question sur les prochaines journées portes ouvertes',
      message:
        'Bonjour,\n\nJ’ai une question concernant les prochaines journées portes ouvertes :\n\n',
    },
    en: {
      subject: 'Question about upcoming Open Days',
      message:
        'Hi,\n\nI have a question about the next Open Days:\n\n',
    },
    banner: {
      fr: 'Vous nous écrivez à propos des journées portes ouvertes.',
      en: 'You are writing about Open Days.',
    },
  },
  lifelong: {
    fr: {
      subject: 'Question sur un module Lifelong Learning',
      message:
        'Bonjour,\n\nJe suis intéressé·e par un module Lifelong Learning et j’aimerais en savoir plus :\n\n',
    },
    en: {
      subject: 'Question about a Lifelong Learning module',
      message:
        'Hi,\n\nI am interested in a Lifelong Learning module and would like to know more:\n\n',
    },
    banner: {
      fr: 'Vous nous écrivez à propos d’un module Lifelong Learning.',
      en: 'You are writing about a Lifelong Learning module.',
    },
  },
  partnership: {
    fr: {
      subject: 'Proposition de partenariat ou de collaboration',
      message:
        'Bonjour,\n\nNous souhaiterions explorer une collaboration avec le CAD :\n\n',
    },
    en: {
      subject: 'Partnership or collaboration proposal',
      message:
        'Hi,\n\nWe would like to explore a collaboration with CAD:\n\n',
    },
    banner: {
      fr: 'Vous nous écrivez pour une proposition de partenariat.',
      en: 'You are writing about a partnership proposal.',
    },
  },
}

function isValidTopic(t: string | undefined): t is ContactTopic {
  return (
    t === 'meeting' ||
    t === 'breakfast' ||
    t === 'open-day' ||
    t === 'lifelong' ||
    t === 'partnership'
  )
}

export const revalidate = 60

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ topic?: string }>
}) {
  const { locale } = await params
  const { topic } = await searchParams
  setRequestLocale(locale)

  // Topic pre-fill (from /admissions or other CTAs)
  const safeTopic = isValidTopic(topic) ? topic : null
  const prefill = safeTopic ? TOPIC_PREFILL[safeTopic] : null
  const isFRLocale = locale === 'fr'
  const prefillSubject = prefill
    ? isFRLocale
      ? prefill.fr.subject
      : prefill.en.subject
    : undefined
  const prefillMessage = prefill
    ? isFRLocale
      ? prefill.fr.message
      : prefill.en.message
    : undefined
  const prefillBanner = prefill
    ? isFRLocale
      ? prefill.banner.fr
      : prefill.banner.en
    : undefined

  // Pull contact info from Site Settings (editable in Payload)
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    locale: locale as 'fr' | 'en',
    depth: 0,
  })

  const isFR = locale === 'fr'

  // Localized labels (kept inline rather than i18n keys for speed; the
  // editorial text comes from cad.be's actual contact page).
  const L = isFR
    ? {
        eyebrow: 'Parlons',
        title: 'Une question ? On vous répond.',
        intro:
          'Vous hésitez entre plusieurs filières ? Vous ne savez pas encore exactement quel design est fait pour vous ? C’est normal, et c’est même pour ça qu’on est là. Écrivez-nous, on prend le temps de vous répondre sous 48 h.',
        // sections
        addressTitle: 'Nous trouver',
        hoursTitle: 'Horaires',
        servicesTitle: 'Services dédiés',
        socialTitle: 'Suivez-nous',
        formTitle: 'Formulaire de contact',
        // labels
        address: 'Adresse',
        email: 'Email',
        phone: 'Téléphone',
        // hours
        schoolHours: 'École ouverte',
        schoolHoursValue: 'Du lundi au vendredi, de 9h à 17h30',
        secHoursLabel: 'Secrétariat',
        secHoursAm: 'Matin : 9h30-12h30',
        secHoursPm: 'Après-midi : 13h30-17h30',
        secHoursDays: 'Du lundi au vendredi',
        // services
        admissions: {
          title: 'Admissions',
          desc: 'Dossier de candidature, entretien, portfolio.',
          email: 'admissions@cad.be',
        },
        lifelong: {
          title: 'Lifelong Learning',
          desc: 'Formation continue pour professionnels créatifs.',
          email: 'lifelong@cad.be',
        },
        partners: {
          title: 'Partenariats',
          desc: 'Workshops, conférences, briefs d’agence.',
          email: 'partners@cad.be',
        },
        press: {
          title: 'Presse',
          desc: 'Visuels, demandes d’interview, communiqués.',
          email: 'press@cad.be',
        },
        // map
        directions: 'Plan d’accès',
        directionsLink: 'Ouvrir dans Google Maps',
        transit:
          'Tram 4 et 92 (arrêt Vanderkindere) · Bus 60 (Cavell). Parking visiteurs limité, privilégiez les transports en commun.',
      }
    : {
        eyebrow: 'Let’s talk',
        title: 'Got a question? We’re listening.',
        intro:
          'Hesitating between programs? Not sure yet which kind of design is the right fit for you? That’s normal, and that’s exactly why we’re here. Drop us a line, we’ll take the time to reply within 2 working days.',
        addressTitle: 'Find us',
        hoursTitle: 'Opening hours',
        servicesTitle: 'Dedicated services',
        socialTitle: 'Follow us',
        formTitle: 'Contact form',
        address: 'Address',
        email: 'Email',
        phone: 'Phone',
        schoolHours: 'School open',
        schoolHoursValue: 'Monday to Friday, 9am-5:30pm',
        secHoursLabel: 'Secretariat',
        secHoursAm: 'Morning: 9:30am-12:30pm',
        secHoursPm: 'Afternoon: 1:30pm-5:30pm',
        secHoursDays: 'Monday to Friday',
        admissions: {
          title: 'Admissions',
          desc: 'Application file, interview, portfolio.',
          email: 'admissions@cad.be',
        },
        lifelong: {
          title: 'Lifelong Learning',
          desc: 'Continuing education for creative professionals.',
          email: 'lifelong@cad.be',
        },
        partners: {
          title: 'Partnerships',
          desc: 'Workshops, lectures, agency briefs.',
          email: 'partners@cad.be',
        },
        press: {
          title: 'Press',
          desc: 'Imagery, interviews, press releases.',
          email: 'press@cad.be',
        },
        directions: 'Directions',
        directionsLink: 'Open in Google Maps',
        transit:
          'Tram 4 and 92 (Vanderkindere stop) · Bus 60 (Cavell). Limited visitor parking, public transport recommended.',
      }

  const services = [L.admissions, L.lifelong, L.partners, L.press]
  const social = settings.social ?? []

  // Address in lines (from site-settings; with sensible default)
  const addressLines =
    settings.contact?.address?.split('\n').filter(Boolean) ?? [
      '25 rue Roberts-Jones',
      '1180 Bruxelles',
      'Belgique',
    ]
  const phone = settings.contact?.phone ?? '+32 (0)2 640 40 32'
  const email = settings.contact?.email ?? 'secretariat@cad.be'
  const mapsUrl =
    'https://www.google.com/maps/place/25+Rue+Roberts-Jones,+1180+Uccle,+Belgium'

  return (
    <>
      {/* Hero — titre + intro à gauche (7 col), carte de contact rapide
          à droite (5 col). Les infos vitales (adresse, email, tél) sont
          au-dessus de la ligne de flottaison sur desktop. */}
      <section className="container py-20 md:py-28">
        <Grid>
          <Col span={7} spanMd={8}>
            <p className="text-sm uppercase tracking-widest text-accent">
              {L.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
              {L.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/70">{L.intro}</p>
          </Col>

          {/* Carte de contact rapide — visible immédiatement.
              <aside> conservé à l'intérieur du <Col> : le <Col> porte la
              colonne, l'<aside> porte la sémantique. */}
          <Col span={5} spanMd={8}>
            <aside className="h-full rounded-2xl border border-ink/10 bg-paper p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-widest text-ink/50">
              {L.addressTitle}
            </p>
            <address className="mt-3 not-italic text-lg text-ink">
              {addressLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </address>
            <div className="mt-5 space-y-1.5">
              <a
                href={`mailto:${email}`}
                className="block text-ink/80 hover:text-accent"
              >
                {email}
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="block text-ink/80 hover:text-accent"
              >
                {phone}
              </a>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex text-sm text-accent hover:underline"
            >
              {L.directionsLink} →
            </a>
            </aside>
          </Col>
        </Grid>
      </section>

      {/* Détails complémentaires : horaires + transports + social.
          La carte adresse déjà remontée dans le hero n'est plus
          dupliquée ici — on commence directement par les horaires. */}
      <section className="container grid gap-12 py-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-ink/50">
            {L.addressTitle}
          </p>
          <address className="mt-4 not-italic text-lg text-ink/90">
            {addressLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </address>
          <div className="mt-6 space-y-1 text-sm">
            <a
              href={`mailto:${email}`}
              className="block text-ink/80 hover:text-accent"
            >
              {email}
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="block text-ink/80 hover:text-accent"
            >
              {phone}
            </a>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex text-sm text-accent hover:underline"
          >
            {L.directionsLink} →
          </a>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-ink/50">
            {L.hoursTitle}
          </p>
          <dl className="mt-4 space-y-5 text-sm">
            <div>
              <dt className="font-medium">{L.schoolHours}</dt>
              <dd className="mt-1 text-ink/70">{L.schoolHoursValue}</dd>
            </div>
            <div>
              <dt className="font-medium">{L.secHoursLabel}</dt>
              <dd className="mt-1 text-ink/70">
                {L.secHoursAm}
                <br />
                {L.secHoursPm}
                <br />
                <span className="text-ink/50">{L.secHoursDays}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-ink/50">
            {L.directions}
          </p>
          <p className="mt-4 text-sm text-ink/70">{L.transit}</p>
          {social.length > 0 && (
            <>
              <p className="mt-8 text-sm font-medium uppercase tracking-widest text-ink/50">
                {L.socialTitle}
              </p>
              <ul className="mt-3 flex flex-wrap gap-3 text-sm">
                {social.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-ink/20 px-3 py-1 capitalize hover:border-accent hover:text-accent"
                    >
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* Dedicated services */}
      <section className="container py-12">
        <p className="text-sm font-medium uppercase tracking-widest text-ink/50">
          {L.servicesTitle}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, i) => (
            <li
              key={i}
              className="rounded-2xl border border-ink/10 p-6 transition hover:border-accent/40"
            >
              <p className="font-display text-lg">{svc.title}</p>
              <p className="mt-2 text-sm text-ink/60">{svc.desc}</p>
              <a
                href={`mailto:${svc.email}`}
                className="mt-4 block text-sm text-accent hover:underline"
              >
                {svc.email}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Map embed */}
      <section className="container py-12">
        <div className="overflow-hidden rounded-2xl border border-ink/10">
          <iframe
            title="CAD Brussels, 25 rue Roberts-Jones, 1180 Uccle"
            src="https://www.openstreetmap.org/export/embed.html?bbox=4.349%2C50.792%2C4.371%2C50.806&layer=mapnik&marker=50.799%2C4.360"
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Form */}
      <section className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-widest text-accent">
              {L.formTitle}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {isFR
                ? 'Dites-nous ce qui vous intéresse.'
                : 'Tell us what draws you in.'}
            </h2>
            <p className="mt-4 max-w-md text-ink/70">
              {isFR
                ? 'Une envie, un doute, une intuition pour un programme ? Une question pratique sur l’admission ou la vie à Bruxelles ? Tout est recevable. Pas besoin de tout savoir avant d’écrire : c’est justement à ça que sert l’échange.'
                : 'An urge, a doubt, an instinct for a program? A practical question about admission or life in Brussels? Everything is welcome. You don’t need to have it all figured out before writing: that’s exactly what the conversation is for.'}
            </p>
          </div>
          <div>
            {prefillBanner && (
              <div className="mb-6 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm text-ink/80">
                <p className="flex items-start gap-2">
                  <span className="text-accent">→</span>
                  <span>
                    {prefillBanner}{' '}
                    {isFR
                      ? 'Le sujet est déjà rempli, complétez le message à votre rythme.'
                      : 'The subject is pre-filled, complete the message at your pace.'}
                  </span>
                </p>
              </div>
            )}
            <ContactForm
              locale={locale}
              defaultSubject={prefillSubject}
              defaultMessage={prefillMessage}
            />
          </div>
        </div>
      </section>
    </>
  )
}
