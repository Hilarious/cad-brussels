import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreakfastForm } from '@/components/breakfast-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Summer Breakfast · CAD Brussels',
        description:
          'Tous les mercredis de juillet à septembre, café et croissants dans le jardin du CAD. Rencontrez des profs, des étudiants, posez vos questions. Sans engagement.',
      }
    : {
        title: 'Summer Breakfast · CAD Brussels',
        description:
          'Every Wednesday from July to September, coffee and croissants in the CAD garden. Meet faculty, current students, ask your questions. No commitment.',
      }
}

export default async function BreakfastPage({
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
        eyebrow: 'Summer Breakfast',
        title: 'Un petit-déjeuner dans le jardin, pour faire connaissance.',
        intro:
          "Pas un Open Day. Pas un entretien. Juste un petit-déjeuner. Tous les mercredis de l'été, on ouvre les portes du CAD à celles et ceux qui veulent comprendre l'école avant de candidater.",

        // Why this format exists
        whyTitle: "Pourquoi un petit-déjeuner ?",
        whyBody:
          "Parce qu'une école, ça se sent autant que ça se visite. Le matin, dans le jardin, avec un café à la main et des étudiants qui passent leur weekend à finir leur projet à côté : c'est là qu'on comprend vraiment où on met les pieds. Pas dans un PowerPoint corporate.",

        // What happens during a breakfast
        whatTitle: "Ce qui se passe pendant 1h30",
        whatSteps: [
          {
            time: '9h00',
            title: 'Accueil dans le jardin',
            body: "Café, croissants, fruits. Vous arrivez quand vous voulez entre 9h et 9h15. L'équipe vous accueille à l'entrée.",
          },
          {
            time: '9h20',
            title: 'Tour de table',
            body: "Chacun se présente, dit ce qui l'amène. Pas de discours, pas de pitch d'école. Juste des gens autour d'une table.",
          },
          {
            time: '9h40',
            title: 'Visite des ateliers',
            body: "On vous fait visiter les ateliers en activité. C'est l'été, certains étudiants sont là pour finaliser leur projet de fin d'année. Vous voyez le travail réel.",
          },
          {
            time: '10h10',
            title: 'Questions à volonté',
            body: "Profs présents, étudiants présents, directeur souvent là. Tout est sur la table : portfolio, frais, débouchés, anecdotes, doutes.",
          },
          {
            time: '10h30',
            title: 'Vous repartez',
            body: "Avec une idée bien plus claire. Souvent une réponse à votre question. Parfois une décision presque prise.",
          },
        ],

        // Who you'll meet
        whoTitle: 'Qui vous allez rencontrer',
        whoBody:
          "L'équipe varie chaque mercredi, mais on essaie d'avoir au moins : un membre de l'équipe pédagogique de la filière qui vous intéresse, deux à trois étudiants en cours de cursus, et le directeur quand son agenda le permet. Petit groupe (5 à 10 personnes maximum) pour que chacun ait le temps de parler.",

        // Practical info
        practicalTitle: 'Infos pratiques',
        practical: [
          { label: 'Quand', value: 'Tous les mercredis, de 9h00 à 10h30' },
          { label: 'Saison', value: 'Du 2 juillet au 10 septembre 2026' },
          { label: 'Où', value: '25 rue Roberts-Jones, 1180 Uccle' },
          { label: 'Tarif', value: 'Gratuit, sans engagement' },
          { label: 'À prévoir', value: 'Rien. On a tout sur place.' },
          { label: 'Accompagnant·e', value: 'Bienvenu·e (parent, ami·e)' },
        ],

        // Form section
        formEyebrow: 'Réservation',
        formTitle: 'Choisissez votre mercredi.',
        formIntro:
          "Réponse confirmée dans la journée. Si le mercredi choisi est complet, on vous propose une autre date. Vous pouvez annuler à tout moment, on est très chill là-dessus.",

        // Cross-link
        crossTitle: 'Ce n’est pas le bon format pour vous ?',
        crossBody:
          "Le Breakfast est volontairement informel. Si vous voulez quelque chose de plus structuré, voyez les autres portes d'admission.",
        crossCta: 'Voir les 4 portes d’admission',
      }
    : {
        backLabel: 'Admissions',
        eyebrow: 'Summer Breakfast',
        title: 'A breakfast in the garden, to get to know each other.',
        intro:
          'Not an Open Day. Not an interview. Just breakfast. Every Wednesday in summer, we open the CAD doors to those who want to understand the school before applying.',

        whyTitle: 'Why breakfast?',
        whyBody:
          'Because a school is something you feel as much as you visit. In the morning, in the garden, with a coffee in hand and students dropping by to finish their projects nearby: that is where you really get what you are getting into. Not in a corporate PowerPoint.',

        whatTitle: 'What happens over 90 minutes',
        whatSteps: [
          {
            time: '9:00',
            title: 'Welcome in the garden',
            body: 'Coffee, croissants, fruit. Come whenever between 9:00 and 9:15. The team welcomes you at the entrance.',
          },
          {
            time: '9:20',
            title: 'Round table',
            body: 'Everyone introduces themselves, says what brought them here. No speeches, no school pitch. Just people around a table.',
          },
          {
            time: '9:40',
            title: 'Studio tour',
            body: 'We walk you through the live studios. It is summer, some students are still there to finalise their final-year project. You see the real work.',
          },
          {
            time: '10:10',
            title: 'Open Q&A',
            body: 'Faculty members are there, students are there, the director often is. Everything is on the table: portfolio, fees, outcomes, anecdotes, doubts.',
          },
          {
            time: '10:30',
            title: 'You head out',
            body: 'With a much clearer picture. Often an answer to your question. Sometimes a decision almost made.',
          },
        ],

        whoTitle: 'Who you’ll meet',
        whoBody:
          'The team varies each Wednesday, but we try to have at least: one faculty member from the program that interests you, two to three current students, and the director when his agenda allows. Small group (5 to 10 people max) so everyone has time to speak.',

        practicalTitle: 'Practical info',
        practical: [
          { label: 'When', value: 'Every Wednesday, 9:00 to 10:30' },
          { label: 'Season', value: 'From July 2 to September 10, 2026' },
          { label: 'Where', value: '25 rue Roberts-Jones, 1180 Uccle' },
          { label: 'Price', value: 'Free, no commitment' },
          { label: 'What to bring', value: 'Nothing. We have it all here.' },
          { label: 'Companion', value: 'Welcome (parent, friend)' },
        ],

        formEyebrow: 'Booking',
        formTitle: 'Pick your Wednesday.',
        formIntro:
          'Confirmation within the day. If your chosen Wednesday is full, we propose another date. You can cancel any time, we are very chill about it.',

        crossTitle: 'Not the right format for you?',
        crossBody:
          'The Breakfast is intentionally informal. If you want something more structured, see the other admission paths.',
        crossCta: 'See the 4 admission paths',
      }

  return (
    <article className="container py-16">
      <Link
        href={`/${locale}/admissions`}
        className="tap text-sm text-ink/60 hover:text-accent"
      >
        ← {L.backLabel}
      </Link>

      {/* Hero */}
      <header className="mt-8 max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-ink/70">{L.intro}</p>
      </header>

      {/* Why + Who side by side on desktop */}
      <section className="mt-20 grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">{L.whyTitle}</h2>
          <p className="mt-4 text-ink/80">{L.whyBody}</p>
        </div>
        <div>
          <h2 className="font-display text-2xl md:text-3xl">{L.whoTitle}</h2>
          <p className="mt-4 text-ink/80">{L.whoBody}</p>
        </div>
      </section>

      {/* What happens — timeline */}
      <section className="mt-20">
        <h2 className="max-w-3xl font-display text-3xl md:text-4xl">
          {L.whatTitle}
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-[auto_1fr] md:gap-x-10">
          {L.whatSteps.map((step, i) => (
            <li
              key={i}
              className="contents"
            >
              <div className="flex items-baseline gap-4 md:flex-col md:items-start md:gap-1 md:border-t md:border-ink/10 md:pt-6">
                <p className="font-display text-3xl text-accent">{step.time}</p>
              </div>
              <div className="md:border-t md:border-ink/10 md:pt-6">
                <h3 className="font-display text-xl">{step.title}</h3>
                <p className="mt-2 text-ink/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Practical info — full width grid */}
      <section className="mt-20 rounded-2xl border border-ink/10 bg-paper p-8 md:p-12">
        <h2 className="font-display text-2xl md:text-3xl">
          {L.practicalTitle}
        </h2>
        <dl className="mt-8 grid gap-4 md:grid-cols-3">
          {L.practical.map((p, i) => (
            <div key={i} className="rounded-xl border border-ink/10 p-4">
              <dt className="text-xs uppercase tracking-widest text-ink/50">
                {p.label}
              </dt>
              <dd className="mt-1 text-ink/80">{p.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Form */}
      <section className="mt-24 max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.formEyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          {L.formTitle}
        </h2>
        <p className="mt-4 text-ink/70">{L.formIntro}</p>
        <div className="mt-10">
          <BreakfastForm locale={locale} />
        </div>
      </section>

      {/* Cross-link to other admission paths */}
      <section className="mt-20 max-w-3xl rounded-2xl border border-ink/10 p-8">
        <h2 className="font-display text-xl">{L.crossTitle}</h2>
        <p className="mt-2 text-ink/70">{L.crossBody}</p>
        <Link
          href={`/${locale}/admissions`}
          className="mt-4 tap text-sm text-accent hover:underline"
        >
          {L.crossCta} →
        </Link>
      </section>

      {/* Schema.org Event for Google + LLM citations */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'Summer Breakfast · CAD Brussels',
            description: L.intro,
            eventSchedule: {
              '@type': 'Schedule',
              repeatFrequency: 'P1W',
              byDay: 'http://schema.org/Wednesday',
              startDate: '2026-07-02',
              endDate: '2026-09-10',
              startTime: '09:00',
              endTime: '10:30',
            },
            location: {
              '@type': 'Place',
              name: 'CAD Brussels',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '25 rue Roberts-Jones',
                postalCode: '1180',
                addressLocality: 'Uccle',
                addressCountry: 'BE',
              },
            },
            organizer: {
              '@type': 'EducationalOrganization',
              name: 'CAD Brussels',
              url: 'https://cad.be',
            },
            isAccessibleForFree: true,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              url: `https://cad.be/${locale}/breakfast`,
            },
          }),
        }}
      />
    </article>
  )
}
