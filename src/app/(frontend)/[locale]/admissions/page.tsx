import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'

// Pre-registration is now an in-site form at /apply. Path is locale-aware.
const applyPath = (locale: string) => `/${locale}/apply`

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Admissions au CAD Brussels, 4 façons de nous rejoindre',
        description:
          "Postuler, prendre un entretien, venir à un Open Day ou à un Breakfast. Le parcours d'admission au CAD, expliqué simplement.",
      }
    : {
        title: 'Admissions at CAD Brussels, 4 ways to join us',
        description:
          'Apply, book a meeting with the director, come to an Open Day or to a Wednesday Breakfast. The CAD admission process, explained simply.',
      }
}

export default async function AdmissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const applyHref = applyPath(locale)

  const L = isFR
    ? {
        eyebrow: 'Admissions',
        title: 'Vous voulez nous rejoindre ? Voilà comment.',
        intro:
          "Pas besoin d'un dossier parfait ni d'un portfolio finalisé pour commencer. On a quatre façons d'entrer en contact, choisissez celle qui vous correspond aujourd'hui.",
        // Reassurance section — the #1 blocker for 18–22yo
        reassureTitle: 'D’abord, une chose à savoir',
        reassureBody:
          "Vous n'avez pas besoin d'avoir tout prouvé pour candidater. Au CAD, on regarde une trajectoire, une curiosité, une envie de faire. Le portfolio peut être en construction. Le dossier peut avoir des trous. Ce qu'on cherche, c'est une personne qui a envie de devenir designer, pas un profil déjà fini.",
        reassurePoints: [
          {
            title: 'Le portfolio',
            body: "Pas besoin d'être pro. Des dessins, des photos, des projets scolaires, des expérimentations. On veut voir comment vous regardez, pas si vous savez déjà tout faire.",
          },
          {
            title: 'Le parcours scolaire',
            body: "Bachelor, baccalauréat européen, équivalence : on accepte beaucoup de formats. Si vous doutez, on en parle. Personne n'est recalé sur un dossier scolaire.",
          },
          {
            title: 'L’hésitation',
            body: "C'est même bon signe. Hésiter, c'est se poser les bonnes questions. On préfère un candidat qui hésite à un candidat qui ne s'est rien demandé.",
          },
        ],
        // Four routes, ranked by commitment level
        routesTitle: 'Quatre façons d’entrer en contact',
        routesIntro:
          'Du plus engageant au plus informel. Vous pouvez aussi commencer par le bas et finir par le haut, beaucoup le font.',
        routes: [
          {
            level: '01',
            title: 'Postuler directement',
            tag: 'Engagement fort',
            body: "Si vous êtes prêt·e, le formulaire de pré-inscription prend ~10 minutes. On revient vers vous sous 5 jours ouvrés pour la suite (entretien et confirmation).",
            cta: { label: 'Postuler en ligne', href: applyHref, external: false, primary: true },
          },
          {
            level: '02',
            title: 'Un entretien avec le directeur',
            tag: 'Décision en cours',
            body: "Vous avez des questions précises sur votre profil, votre parcours, votre choix de cursus ? Un entretien individuel avec le directeur, sur place ou en visio, ~30 minutes. Sans engagement.",
            cta: { label: 'Demander un entretien', href: `/${locale}/contact?topic=meeting`, primary: false },
          },
          {
            level: '03',
            title: 'Une journée portes ouvertes',
            tag: 'Découverte collective',
            body: "Visiter l'école, rencontrer les profs et les étudiants, voir les ateliers en activité, comprendre comment on travaille ici. Plusieurs Open Days par an.",
            cta: { label: 'Voir les prochains Open Days', href: `/${locale}/events?category=open-day`, primary: false },
          },
          {
            level: '04',
            title: 'Le Summer Breakfast',
            tag: 'Sans engagement',
            body: "Petit-déjeuner dans le jardin du CAD, tous les mercredis de l'été (juillet-septembre). Café, croissants, profs et étudiants présents. Format pensé pour celles et ceux qui hésitent encore.",
            cta: { label: 'Voir le Summer Breakfast', href: `/${locale}/breakfast`, primary: false },
          },
        ],
        // Process timeline — what happens after applying
        processTitle: 'Une fois que vous avez postulé, ce qui se passe',
        processSteps: [
          {
            n: '1',
            label: 'Réception du dossier',
            body: 'Confirmation par email sous 48h. On commence à regarder votre dossier.',
          },
          {
            n: '2',
            label: 'Entretien',
            body: "Visio ou présentiel, ~45 minutes avec un membre de l'équipe pédagogique. On parle de votre projet, on regarde votre portfolio ensemble.",
          },
          {
            n: '3',
            label: 'Réponse',
            body: "Sous 7 jours après l'entretien. Acceptation, demande d'éléments complémentaires, ou orientation vers un autre cursus si pertinent.",
          },
          {
            n: '4',
            label: 'Inscription',
            body: 'Confirmation de votre place et démarches administratives (visa, logement, frais de scolarité).',
          },
        ],
        // Secondary CTA at the bottom
        ctaTitle: 'Vous préférez recevoir la brochure et y réfléchir ?',
        ctaBody:
          "On envoie un info-pack complet (programmes, frais, témoignages, journée type) sans engagement. Vous nous écrivez ensuite si vous voulez avancer.",
        ctaButton: 'Recevoir la brochure',
      }
    : {
        eyebrow: 'Admissions',
        title: 'Want to join us? Here is how.',
        intro:
          "You don't need a perfect file or a polished portfolio to start. We have four ways to get in touch, pick the one that fits you today.",
        reassureTitle: 'First, one thing to know',
        reassureBody:
          "You don't need to have proven everything to apply. At CAD, we look at a trajectory, a curiosity, a desire to make things. Portfolios can be in progress. Files can have gaps. What we look for is a person who wants to become a designer, not a profile that's already finished.",
        reassurePoints: [
          {
            title: 'Portfolio',
            body: "No need to be pro. Drawings, photos, school projects, experiments. We want to see how you look, not whether you already know everything.",
          },
          {
            title: 'Academic background',
            body: 'Bachelor, European Baccalaureate, equivalence: we accept many formats. If in doubt, let us discuss. No one is rejected on transcripts alone.',
          },
          {
            title: 'Hesitation',
            body: 'That is actually a good sign. Hesitating means asking the right questions. We prefer a candidate who hesitates over one who never wondered.',
          },
        ],
        routesTitle: 'Four ways to reach out',
        routesIntro:
          'From most committed to most informal. You can also start from the bottom and end at the top, many do.',
        routes: [
          {
            level: '01',
            title: 'Apply directly',
            tag: 'Strong commitment',
            body: 'If you are ready, the pre-registration form takes ~10 minutes. We get back to you within 5 working days for the next step (interview and confirmation).',
            cta: { label: 'Apply online', href: applyHref, external: false, primary: true },
          },
          {
            level: '02',
            title: 'Meet the director',
            tag: 'Making up your mind',
            body: 'Specific questions about your profile, background, choice of program? An individual meeting with the director, on site or video call, ~30 minutes. No commitment.',
            cta: { label: 'Request a meeting', href: `/${locale}/contact?topic=meeting`, primary: false },
          },
          {
            level: '03',
            title: 'An Open Day',
            tag: 'Group discovery',
            body: 'Visit the school, meet faculty and students, see the workshops in action, understand how we work here. Several Open Days per year.',
            cta: { label: 'See upcoming Open Days', href: `/${locale}/events?category=open-day`, primary: false },
          },
          {
            level: '04',
            title: 'Summer Breakfast',
            tag: 'No commitment',
            body: 'Breakfast in the CAD garden, every Wednesday in summer (July to September). Coffee, croissants, faculty and students present. Built for those who are still hesitating.',
            cta: { label: 'See the Summer Breakfast', href: `/${locale}/breakfast`, primary: false },
          },
        ],
        processTitle: 'Once you apply, here is what happens',
        processSteps: [
          {
            n: '1',
            label: 'File received',
            body: 'Email confirmation within 48h. We start reviewing your application.',
          },
          {
            n: '2',
            label: 'Interview',
            body: 'Video call or on site, ~45 minutes with a faculty member. We talk about your project, look at your portfolio together.',
          },
          {
            n: '3',
            label: 'Answer',
            body: 'Within 7 days after the interview. Acceptance, request for additional material, or redirection to a different program if relevant.',
          },
          {
            n: '4',
            label: 'Enrollment',
            body: 'Place confirmation and administrative steps (visa, housing, tuition).',
          },
        ],
        ctaTitle: 'Prefer to get the brochure and think it over?',
        ctaBody:
          "We send a complete info-pack (programs, fees, testimonials, a day in the life) with no commitment. You write back when you're ready to move forward.",
        ctaButton: 'Get the brochure',
      }

  return (
    <>
      {/* Hero */}
      <section className="container py-20 md:py-28">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/70">{L.intro}</p>

        {/* Primary CTA right under hero — "Apply now" is one click away */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href={applyHref}
            className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper hover:bg-accent"
          >
            {isFR ? 'Postuler en ligne' : 'Apply online'}
          </Link>
          <Link
            href={`/${locale}/admissions/frais`}
            className="tap text-sm text-ink/70 hover:text-accent"
          >
            {isFR ? 'Voir les frais de scolarité →' : 'See tuition fees →'}
          </Link>
          <Link
            href={`/${locale}/info-pack`}
            className="tap text-sm text-ink/70 hover:text-accent"
          >
            {isFR
              ? 'Ou recevez la brochure et réfléchissez →'
              : 'Or get the brochure and think it over →'}
          </Link>
        </div>
      </section>

      {/* Reassurance — 3 cards addressing the #1 blocker (am I good enough?) */}
      <section className="container py-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl">
            {L.reassureTitle}
          </h2>
          <p className="mt-6 text-ink/80">{L.reassureBody}</p>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {L.reassurePoints.map((p, i) => (
            <li
              key={i}
              className="rounded-2xl border border-ink/10 bg-paper p-6"
            >
              <h3 className="font-display text-xl">{p.title}</h3>
              <p className="mt-3 text-ink/70">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Four routes — ranked by commitment level */}
      <section className="container py-16">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl">
            {L.routesTitle}
          </h2>
          <p className="mt-6 text-ink/80">{L.routesIntro}</p>
        </div>
        <ul className="mt-12 space-y-4">
          {L.routes.map((r) => (
            <li
              key={r.level}
              className="grid gap-6 rounded-2xl border border-ink/10 bg-paper p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:p-8"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2">
                <p className="font-display text-3xl text-accent">{r.level}</p>
                <p className="text-xs uppercase tracking-widest text-ink/50">
                  {r.tag}
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl">{r.title}</h3>
                <p className="mt-2 text-ink/70">{r.body}</p>
              </div>
              <div>
                {r.cta.external ? (
                  <a
                    href={r.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      r.cta.primary
                        ? 'inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-paper hover:bg-accent'
                        : 'inline-flex rounded-full border border-ink/20 px-5 py-2.5 text-sm hover:border-accent hover:text-accent'
                    }
                  >
                    {r.cta.label}
                  </a>
                ) : (
                  <Link
                    href={r.cta.href}
                    className={
                      r.cta.primary
                        ? 'inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-paper hover:bg-accent'
                        : 'inline-flex rounded-full border border-ink/20 px-5 py-2.5 text-sm hover:border-accent hover:text-accent'
                    }
                  >
                    {r.cta.label}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Process timeline */}
      <section className="container py-16">
        <h2 className="max-w-3xl font-display text-3xl md:text-4xl">
          {L.processTitle}
        </h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-4 md:gap-8">
          {L.processSteps.map((s, i) => (
            <li
              key={i}
              className="relative border-t border-ink/10 pt-6"
            >
              <p className="font-display text-3xl text-accent">{s.n}</p>
              <h3 className="mt-3 font-display text-lg">{s.label}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tuition fees teaser — visible at the right moment, just after
          the process is explained. Candidates ALWAYS look up fees, and
          knowing the answer is one click away builds trust. */}
      <section className="container py-12">
        <div className="rounded-2xl border border-ink/10 bg-paper p-8 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div className="md:max-w-xl">
            <p className="text-sm uppercase tracking-widest text-ink/50">
              {isFR ? 'Frais de scolarité' : 'Tuition fees'}
            </p>
            <p className="mt-3 font-display text-2xl md:text-3xl">
              {isFR
                ? 'Bachelor & Master · 9 500 €/an UE, 11 000 €/an hors UE'
                : 'Bachelor & Master · €9,500/yr EU, €11,000/yr non-EU'}
            </p>
            <p className="mt-3 text-sm text-ink/60">
              {isFR
                ? "Tarif identique Bachelor et Master, garanti pour la durée du cursus. Échéancier en 3 fois pour les étudiants UE. Frais d'inscription 300 € inclus."
                : 'Same fee for Bachelor and Master, locked for the program duration. Three-instalment schedule for EU students. €300 registration fee included.'}
            </p>
          </div>
          <Link
            href={`/${locale}/admissions/frais`}
            className="mt-6 inline-flex shrink-0 rounded-full border border-ink/20 px-5 py-2.5 text-sm hover:border-accent hover:text-accent md:mt-0"
          >
            {isFR ? 'Voir le détail' : 'See details'} →
          </Link>
        </div>
      </section>

      {/* Secondary CTA — info-pack for the still-hesitant.
          Uses tone=soft because the page already has a vibrant primary
          CTA above (apply / brochure). Two vibrant blocs in a row
          would overload the visitor. */}
      <PageCTA
        title={L.ctaTitle}
        body={L.ctaBody}
        ctaLabel={L.ctaButton}
        ctaHref={`/${locale}/info-pack`}
        tone="soft"
      />
    </>
  )
}
