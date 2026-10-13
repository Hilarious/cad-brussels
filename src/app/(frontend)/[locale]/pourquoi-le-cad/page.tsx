import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Grid, Col } from '@/components/grid'
import { PageCTA } from '@/components/page-cta'
import { RelatedContent } from '@/components/related-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Pourquoi le CAD Brussels, école de design privée à Bruxelles',
        description:
          "Pédagogie pratique encadrée par des professionnels en activité, réseau CUMULUS de 200+ écoles d'art, taille humaine et insertion professionnelle. Pourquoi choisir le CAD pour un cursus créatif.",
      }
    : {
        title: 'Why CAD Brussels, private design school in Brussels',
        description:
          'Hands-on pedagogy mentored by working professionals, CUMULUS network of 200+ art schools, human-scale teaching and career outcomes. Why choose CAD for a creative degree.',
      }
}

export default async function WhyCadPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        eyebrow: 'Pourquoi le CAD',
        title: 'Pourquoi choisir une école privée à 9 500 € l’année ?',
        intro:
          'C’est une question légitime, et on préfère y répondre frontalement. Voici ce qui distingue le CAD d’une école subventionnée, et ce qui justifie l’investissement pour celles et ceux qui veulent vraiment vivre de leur métier créatif.',

        // Section 1 — what makes CAD different
        whatTitle: 'Cinq différences concrètes',
        whatPoints: [
          {
            number: '01',
            title: '160 étudiants au total, 50 professeurs en activité',
            body: "C'est le rapport le plus intime de Belgique pour une école de design. Pas d'amphi de 400. Pas de file d'attente pour parler à un prof. Chaque étudiant est connu, suivi, accompagné. C'est la différence entre apprendre dans la masse et apprendre dans une équipe.",
          },
          {
            number: '02',
            title: 'Encadrement par des professionnels en activité',
            body: "Les profs ne sont pas des académiciens détachés du métier. Ce sont des designers, architectes, directeurs artistiques en agence, en studio, en cabinet, en maison ou en freelance. Ils sont au contact direct des clients, du marché, des contraintes réelles. Et c'est cette expérience-là qu'ils transmettent en cours.",
          },
          {
            number: '03',
            title: 'Pédagogie « anglo-saxonne », pratique avant théorique',
            body: "Au CAD, on dessine, on coud, on prototype, on présente. La théorie sert la pratique, pas l'inverse. Vous passerez l'essentiel de votre temps en atelier-studio, sur des briefs posés par des professionnels en activité.",
          },
          {
            number: '04',
            title: 'Plus de 90 % d’insertion professionnelle',
            body: "Plus de 90 % de nos diplômés trouvent un emploi en Belgique ou à l'étranger dans l'année qui suit leur sortie. Ce n'est pas un hasard : la pédagogie est calibrée pour livrer des profils opérationnels, pas des théoriciens.",
          },
          {
            number: '05',
            title: 'Réseau international actif dès la première année',
            body: "Workshops à Milan, Shanghai, São Paulo, Cotonou, Berlin. 200+ écoles partenaires via le réseau CUMULUS. Stages possibles partout. Vous n'apprenez pas seulement à Bruxelles, vous apprenez avec le monde.",
          },
        ],

        // Pattern F — manifeste typo géant injecté entre les différences
        // 03 et 04. Sert de pivot visuel entre la pédagogie (01→03) et
        // la légitimité institutionnelle (04→06).
        pivotEyebrow: 'Posture',
        pivotTitleLine1: 'On forme',
        pivotTitleLine2: 'le regard.',
        pivotKicker:
          'Avant la technique. Avant les outils. Avant les logiciels. Le regard d\'abord.',

        // Section 3 — outcomes
        outcomesTitle: 'Et après le CAD ?',
        outcomesIntro:
          "Les diplômés du CAD travaillent dans des agences de design, des maisons de mode, des studios d'architecture, des médias et des marques. Voici quelques destinations typiques.",
        outcomesByProgram: [
          {
            program: 'Architecture d’intérieur',
            destinations: 'Agences d’architecture intérieure, studios de scénographie, retail design, agences hôtelières. Des diplômés travaillent par exemple chez Zoom Architecture.',
          },
          {
            program: 'Communication & Digital Design',
            destinations: 'Agences de pub et de design, studios brand & motion, équipes communication internes des marques, freelance international. Des diplômés travaillent par exemple chez Federate Agency, Rosa ou Egg Hunter.',
          },
          {
            program: 'Mode & Accessoires',
            destinations: 'Maisons de mode, marques bruxelloises émergentes, studios de tendance, création de marque indépendante. Des diplômés travaillent par exemple chez Céline, Longchamp ou Eres.',
          },
          {
            program: 'Postgraduate Image 3D Motion AI',
            destinations: 'Studios CGI, productions audiovisuelles, agences de réalité augmentée, équipes motion en agence, freelance vidéo, structures spécialisées en IA générative.',
          },
        ],

        // Section 4 — practical reassurance for parents
        practicalTitle: 'Pour les parents qui hésitent',
        practicalPoints: [
          {
            title: 'Un seul tarif, pas de surcoût caché',
            body: "Tarif identique pour les étudiants UE. Différencié pour hors UE en raison de la procédure visa. Tarif garanti pour la durée du cursus, sauf indexation si l'inflation dépasse 5%/an.",
          },
          {
            title: 'Échéancier en 3 fois pour les étudiants UE',
            body: "3 400 € à l'inscription, 3 050 € au 30 juin, 3 050 € au 15 septembre. Plan échelonné personnalisé possible pour certains résidents (+300 €).",
          },
          {
            title: 'Suivi individuel par le secrétariat',
            body: "Pour toutes les questions de visa, logement, démarches : le secrétariat répond sous 48h. Les familles internationales sont accompagnées spécifiquement pour la procédure visa étudiant.",
          },
          {
            title: 'Un statut privé assumé',
            body: "Le CAD est un établissement privé non subsidié, fondé en 1961. Cela explique le tarif. Cela explique aussi la souplesse pédagogique, la taille humaine, et l'autonomie des programmes.",
          },
        ],

        // CTA
        ctaTitle: 'Discutons-en directement',
        ctaBody:
          "La meilleure façon de savoir si le CAD vous convient (ou convient à votre ado), c'est de venir voir. Open Day, Summer Breakfast, ou entretien individuel avec le directeur, choisissez le format qui vous va.",
        ctaPrimary: 'Voir les 4 portes d’admission',
        ctaSecondary: 'Recevoir la brochure',
      }
    : {
        eyebrow: 'Why CAD',
        title: 'Why choose a private school at €9,500 per year?',
        intro:
          'It’s a fair question, and we prefer to answer it head-on. Here’s what distinguishes CAD from a state-funded school, and what justifies the investment for those who genuinely want to make a living from creative work.',

        whatTitle: 'Five concrete differences',
        whatPoints: [
          {
            number: '01',
            title: '160 students total, 50 working teachers',
            body: 'It’s the most intimate ratio in Belgium for an art college. No 400-seat lecture halls. No queue to talk to a teacher. Every student is known, supported, mentored. The difference between learning in a crowd and learning in a team.',
          },
          {
            number: '02',
            title: 'Mentored by working professionals',
            body: 'Faculty are not academics detached from the field. They are designers, architects, art directors working in agencies, studios, firms, houses or as freelancers. They are in direct contact with clients, the market, real-world constraints. And that’s the experience they bring to class, the same evening.',
          },
          {
            number: '03',
            title: '« Anglo-Saxon » pedagogy, practice before theory',
            body: 'At CAD, we draw, sew, prototype, present. Theory serves practice, not the other way around. You will spend most of your time in studio on real briefs from partner brands.',
          },
          {
            number: '04',
            title: 'Over 90% employment after graduation',
            body: 'Over 90% of our graduates find employment in Belgium or abroad within months of graduation. It’s not by chance: the pedagogy is calibrated to ship operational profiles, not theorists.',
          },
          {
            number: '05',
            title: 'Active international network from year one',
            body: 'Workshops in Milan, Shanghai, São Paulo, Lisbon, Tokyo. 200+ partner schools through the CUMULUS network. Internships available everywhere. You don’t only learn in Brussels, you learn with the world.',
          },
        ],

        // Pattern F — typographic manifesto pivot between differences 03 and 04.
        pivotEyebrow: 'Posture',
        pivotTitleLine1: 'We train',
        pivotTitleLine2: 'the eye.',
        pivotKicker:
          'Before technique. Before tools. Before software. The eye first.',

        outcomesTitle: 'And after CAD?',
        outcomesIntro:
          'CAD graduates work in design agencies, fashion houses, architecture studios, media and brands. A few typical destinations.',
        outcomesByProgram: [
          {
            program: 'Interior Architecture',
            destinations: 'Interior architecture practices, scenography studios, retail design, hospitality firms (Vudafieri-Saverino, B+B Studio, Lemay+Escobar, independent Belgian practices).',
          },
          {
            program: 'Communication & Digital Design',
            destinations: 'Advertising and design agencies (Mortierbrigade, BBDO, Wieden+Kennedy, Base Design), brand & motion studios, in-house teams at brands (Decathlon, Carrefour, etc.), international freelance.',
          },
          {
            program: 'Fashion & Accessory',
            destinations: 'Partner houses: Maison Margiela, AF Vandevorst, MM6. Emerging Brussels labels. Trend studios. Independent label creation.',
          },
          {
            program: 'Postgraduate Image 3D Motion AI',
            destinations: 'CGI studios, audiovisual productions, augmented reality agencies, motion teams in agency, video freelance, generative-AI specialised structures.',
          },
        ],

        practicalTitle: 'For hesitating parents',
        practicalPoints: [
          {
            title: 'One single fee scale',
            body: 'Same fee for all EU students. Differentiated for non-EU due to visa procedure. Fees locked for the program duration, except indexation if inflation exceeds 5%/year.',
          },
          {
            title: 'Three-instalment schedule for EU students',
            body: '€3,400 at registration, €3,050 by June 30, €3,050 by September 15. Personalised staggered plan possible for certain residents (+€300).',
          },
          {
            title: 'Individual support from the secretariat',
            body: 'For all visa, housing, paperwork questions: the secretariat replies within 48h. International families get specific support for the student visa procedure.',
          },
          {
            title: 'A clearly assumed private status',
            body: 'CAD is a private, non-subsidised institution founded in 1961. That explains the fee. It also explains the pedagogical flexibility, human scale, and program autonomy.',
          },
        ],

        ctaTitle: 'Let’s talk directly',
        ctaBody:
          'The best way to know if CAD fits you (or fits your child) is to come and see. Open Day, Summer Breakfast, or individual meeting with the director, pick the format that works.',
        ctaPrimary: 'See the 4 admission paths',
        ctaSecondary: 'Get the brochure',
      }

  return (
    <article className="container py-16">
      {/* Hero */}
      <header className="mt-4 max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-ink/70">{L.intro}</p>
      </header>

      {/* Six differences — numbered list, like a manifesto.
          Uses the 12-column grid: number on 2 cols, content on 9 cols
          (with 1 col offset between for breathing room).
          A Pattern F (typo manifeste) is injected after the 3rd item
          to break the rhythm and act as a pedagogical pivot. */}
      <section className="mt-20">
        <h2 className="max-w-3xl font-display text-3xl md:text-4xl">
          {L.whatTitle}
        </h2>
        <ol className="mt-12 space-y-8">
          {L.whatPoints.slice(0, 3).map((p, i) => (
            <li key={i} className="border-t border-ink/10 pt-8">
              <Grid>
                <Col span={2} spanMd={2}>
                  <p className="font-display text-4xl text-accent md:text-5xl">
                    {p.number}
                  </p>
                </Col>
                <Col span={9} offset={1} spanMd={6}>
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 text-ink/80">{p.body}</p>
                </Col>
              </Grid>
            </li>
          ))}
        </ol>
      </section>

      {/* Pattern F — Typo géante hors grille : manifeste pivot
          entre la pédagogie (différences 01-03) et la légitimité
          institutionnelle (04-06). Sort du container, déborde
          volontairement. Signe la posture "école d'art". */}
      <section
        aria-label={L.pivotEyebrow}
        className="-mx-4 mt-24 overflow-hidden bg-paper py-16 md:-mx-8 md:py-24 xl:-mx-12"
      >
        <div className="px-4 md:px-8 xl:px-12">
          <p className="text-sm uppercase tracking-widest text-accent">
            {L.pivotEyebrow}
          </p>
          <p className="mt-6 font-display text-[18vw] font-bold leading-[0.85] tracking-tight text-ink">
            {L.pivotTitleLine1}
            <br />
            {L.pivotTitleLine2}
          </p>
          <p className="mt-8 max-w-2xl text-lg text-ink/70">
            {L.pivotKicker}
          </p>
        </div>
      </section>

      {/* Suite des différences 04-06, après le pivot manifeste. */}
      <section className="mt-24">
        <ol className="space-y-8">
          {L.whatPoints.slice(3).map((p, i) => (
            <li
              key={`pivot-${i}`}
              className="border-t border-ink/10 pt-8"
            >
              <Grid>
                <Col span={2} spanMd={2}>
                  <p className="font-display text-4xl text-accent md:text-5xl">
                    {p.number}
                  </p>
                </Col>
                <Col span={9} offset={1} spanMd={6}>
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 text-ink/80">{p.body}</p>
                </Col>
              </Grid>
            </li>
          ))}
        </ol>
      </section>

      {/* Outcomes by program */}
      <section className="mt-24">
        <h2 className="max-w-3xl font-display text-3xl md:text-4xl">
          {L.outcomesTitle}
        </h2>
        <p className="mt-6 max-w-3xl text-ink/70">{L.outcomesIntro}</p>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {L.outcomesByProgram.map((o, i) => (
            <li
              key={i}
              className="rounded-2xl border border-ink/10 bg-paper p-6"
            >
              <h3 className="font-display text-xl">{o.program}</h3>
              <p className="mt-3 text-sm text-ink/70">{o.destinations}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Practical reassurance for parents */}
      <section className="mt-24 rounded-2xl border border-ink/10 bg-paper p-8 md:p-12">
        <h2 className="max-w-3xl font-display text-3xl md:text-4xl">
          {L.practicalTitle}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {L.practicalPoints.map((p, i) => (
            <li key={i}>
              <h3 className="font-display text-lg">{p.title}</h3>
              <p className="mt-2 text-ink/70">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Maillage éditorial — bloc "à découvrir aussi" pour maximiser
          les liens internes contextuels (levier SEO #1 selon Digistage). */}
      <RelatedContent locale={locale} />

      {/* Final CTA — standardized via <PageCTA>. Primary button is the
          built-in CTA; the secondary "Get the brochure" link is rendered
          via children, below the body text. */}
      <PageCTA
        title={L.ctaTitle}
        body={L.ctaBody}
        ctaLabel={L.ctaPrimary}
        ctaHref={`/${locale}/admissions`}
        nested
      >
        <Link
          href={`/${locale}/info-pack`}
          className="mt-4 tap text-sm text-paper/90 underline-offset-4 hover:underline"
        >
          {L.ctaSecondary} →
        </Link>
      </PageCTA>
    </article>
  )
}
