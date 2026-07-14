import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'
import { Grid, Col } from '@/components/grid'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { JsonLd } from '@/components/json-ld'
import { educationalOrganization } from '@/lib/schema'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'À propos du CAD Brussels, école de design depuis 1961',
        description:
          "Le CAD est une école d'art et de design privée fondée en 1961 à Bruxelles. 160 étudiants, 50 professeurs en activité, plus de 90% d'insertion professionnelle. Pédagogie pratique, taille humaine, ouverture internationale.",
      }
    : {
        title: 'About CAD Brussels, design school since 1961',
        description:
          'CAD is a private art and design school founded in 1961 in Brussels. 160 students, 50 working professionals as teachers, over 90% employment after graduation. Hands-on pedagogy, human scale, international reach.',
      }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        eyebrow: 'Notre école',
        title: 'Une école de design fondée en 1961, à Bruxelles.',
        intro:
          "Le CAD est l'une des rares écoles d'art en Europe continentale à proposer une pédagogie pratique de très haut niveau, dispensée par des professionnels en activité. Voici notre histoire, notre approche, et ce qui fait notre singularité.",

        // Pattern A — hero full-bleed brief
        heroPhotoCaption:
          'Vue · campus CAD à Uccle, jardin et bâtiment principal',

        // Bloc identité
        identityTitle: 'Une école à taille humaine, à Bruxelles',
        identityBody: [
          "Le CAD est situé à Uccle, dans un quartier résidentiel verdoyant du sud de Bruxelles, à 15 minutes en tram du centre. Le campus accueille environ 160 étudiants venus du monde entier, encadrés par une cinquantaine de professeurs, tous en activité dans leur métier.",
          "C'est volontairement une petite école. Pas d'amphi de 400 places. Pas de file d'attente pour parler à un prof. Chaque étudiant est connu, suivi, accompagné. Cette taille permet l'exigence qu'on revendique.",
        ],

        // Stats officielles
        statsTitle: 'En chiffres',
        stats: [
          { value: '1961', label: 'Année de fondation' },
          { value: '160', label: 'Étudiants au total' },
          { value: '50', label: 'Professeurs en activité' },
          { value: '+90%', label: 'Insertion pro après diplôme' },
          { value: '30+', label: 'Nationalités sur le campus' },
          { value: '200+', label: 'Écoles partenaires CUMULUS' },
        ],

        // Pédagogie — Pattern G (image décalée)
        pedagogyEyebrow: 'Pédagogie',
        pedagogyTitle: 'La pratique avant la théorie.',
        pedagogyBody: [
          "Notre approche est dite « anglo-saxonne » : la pratique prime sur la théorie. Vous travaillerez sur des projets réels, encadré·e par des designers en activité dans leur secteur, pour devenir opérationnel·le dès votre sortie.",
          "Les profs ne sont pas des académiciens détachés du métier. Ce sont des designers, architectes, directeurs artistiques en agence, en studio, en cabinet, en maison ou en freelance. Ils corrigent vos projets le mardi soir avec leur expérience du lundi en agence.",
        ],
        pedagogyPhotoCaption: 'Atelier · cours de projet en action',

        // International — Pattern D (mosaïque)
        internationalEyebrow: 'International',
        internationalTitle: "Ouverte sur le monde depuis l'origine.",
        internationalBody:
          "Le CAD est membre de l'Association CUMULUS depuis juin 2013, qui réunit environ 200 écoles d'art publiques et privées à travers le monde. Workshops annuels à Milan, Shanghai, São Paulo, Lisbonne et Tokyo. 30+ nationalités sur le campus. Le design ne s'apprend pas en vase clos.",
        intlPhotos: [
          'Workshop Shanghai · étudiants en visite Tongji',
          'Salone del Mobile Milan · Home & Living en immersion',
          'Workshop São Paulo · IED Sampa, collaboration mode',
          'Cours sur le campus · groupe multinational en discussion',
        ],

        // Citation directeur — Pattern C (citation visuelle)
        quoteEyebrow: 'Mot du directeur',
        quoteText:
          "Au CAD, on ne forme pas seulement des designers. On forme des regards, des esprits, des cultures. La technique vient ensuite, naturellement. C'est l'engagement qu'on prend depuis 1961.",
        quoteAuthor: 'Eric Vanden Broeck',
        quoteRole: "Directeur du CAD",
        quotePhotoCaption: 'Portrait · Eric Vanden Broeck, dans le hall du CAD',

        // Reassurance parents
        parentsTitle: 'Pour les parents qui hésitent',
        parentsBody:
          "C'est une décision lourde de choisir une école privée. On le sait. On a écrit une page entière pour répondre aux questions qu'on nous pose le plus souvent : frais, débouchés, encadrement, différences avec les écoles publiques.",
        parentsCta: 'Lire « Pourquoi le CAD »',
        parentsCtaHref: `/${locale}/pourquoi-le-cad`,

        // Final CTA
        ctaTitle: 'Venez voir par vous-même.',
        ctaBody:
          "Open Day, Summer Breakfast, ou entretien individuel avec le directeur. Trois façons de découvrir le CAD avant de candidater. Sans engagement.",
        ctaButton: 'Voir les portes d’admission',
        ctaHref: `/${locale}/admissions`,
      }
    : {
        eyebrow: 'Our school',
        title: 'A design school founded in 1961, in Brussels.',
        intro:
          'CAD is one of the few art colleges in continental Europe offering a practice-based education taught by working professionals. Our history, our approach, and what makes us singular.',

        heroPhotoCaption: 'View · CAD campus in Uccle, garden and main building',

        identityTitle: 'A human-scale school in Brussels',
        identityBody: [
          "CAD is located in Uccle, a leafy residential neighbourhood in the south of Brussels, 15 minutes by tram from the centre. The campus welcomes around 160 students from all over the world, mentored by some fifty teachers, all of whom practise in their field.",
          "It's intentionally a small school. No 400-seat lecture halls. No queue to talk to a teacher. Every student is known, supported, mentored. This scale allows the rigour we claim.",
        ],

        statsTitle: 'In numbers',
        stats: [
          { value: '1961', label: 'Founded' },
          { value: '160', label: 'Students total' },
          { value: '50', label: 'Working teachers' },
          { value: '+90%', label: 'Employment after graduation' },
          { value: '30+', label: 'Nationalities on campus' },
          { value: '200+', label: 'CUMULUS partner schools' },
        ],

        pedagogyEyebrow: 'Pedagogy',
        pedagogyTitle: 'Practice before theory.',
        pedagogyBody: [
          "Our approach is « Anglo-Saxon »: practice comes before theory. You will work on real projects, mentored by designers active in their field, ready to step into the profession upon graduation.",
          "Faculty are not academics detached from the field. They are designers, architects, art directors in agencies, studios, firms, houses or freelance. They review your work on Tuesday evening with their Monday-in-agency experience.",
        ],
        pedagogyPhotoCaption: 'Studio · project class in action',

        internationalEyebrow: 'International',
        internationalTitle: 'Open to the world since the beginning.',
        internationalBody:
          "CAD has been a member of the CUMULUS Association since June 2013, gathering around 200 public and private art colleges worldwide. Yearly workshops in Milan, Shanghai, São Paulo, Lisbon and Tokyo. 30+ nationalities on campus. Design isn't learned in a vacuum.",
        intlPhotos: [
          'Workshop Shanghai · students visiting Tongji',
          'Salone del Mobile Milan · Home & Living immersion',
          'Workshop São Paulo · IED Sampa, fashion collaboration',
          'On-campus class · multinational group in discussion',
        ],

        quoteEyebrow: 'A word from the director',
        quoteText:
          "At CAD, we don't only train designers. We train eyes, minds, cultures. Technique comes after, naturally. That's the commitment we've kept since 1961.",
        quoteAuthor: 'Eric Vanden Broeck',
        quoteRole: 'Director of CAD',
        quotePhotoCaption: 'Portrait · Eric Vanden Broeck, in the CAD hall',

        parentsTitle: 'For hesitating parents',
        parentsBody:
          "Choosing a private school is a big decision. We know. We've written a whole page answering the questions parents ask us most often: fees, outcomes, mentoring, differences with public schools.",
        parentsCta: 'Read « Why CAD »',
        parentsCtaHref: `/${locale}/pourquoi-le-cad`,

        ctaTitle: 'Come see for yourself.',
        ctaBody:
          'Open Day, Summer Breakfast, or an individual meeting with the director. Three ways to discover CAD before applying. No commitment.',
        ctaButton: 'See admission paths',
        ctaHref: `/${locale}/admissions`,
      }

  return (
    <article className="container py-16">
      {/* JSON-LD EducationalOrganization — la fiche officielle du CAD.
          Ce bloc est le plus important du site pour Google et les LLMs
          (source de la Knowledge Graph, des sitelinks, et de tous les
          rich snippets institutionnels). Doublonner avec la homepage
          renforce le signal. */}
      <JsonLd data={educationalOrganization()} />

      {/* Hero */}
      <header className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-ink/70">{L.intro}</p>
      </header>

      {/* Pattern A — Image full-bleed du campus, juste après le hero.
          Signature visuelle immédiate : voici l'école, voici où ça se
          passe. Pour les parents, c'est rassurant et concret. */}
      <section className="-mx-4 mt-16 md:-mx-8 xl:-mx-12">
        <ImagePlaceholder
          ratio="21:9"
          caption={L.heroPhotoCaption}
          className="rounded-none border-0"
        />
      </section>

      {/* Section identité — Pattern B léger (intro + détail) */}
      <section className="mt-20">
        <Grid>
          <Col span={5} spanMd={8}>
            <h2 className="font-display text-3xl md:text-4xl">
              {L.identityTitle}
            </h2>
          </Col>
          {/* offset={6} : le texte démarre colonne 7, laissant une colonne
              vide après le titre. C'est le décalage éditorial voulu. */}
          <Col span={6} offset={6} spanMd={8}>
            <div className="space-y-4 text-ink/80">
              {L.identityBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Col>
        </Grid>
      </section>

      {/* Stats officielles — 6 chiffres en grille 3 colonnes. Rassurance
          pure pour parents : ils peuvent comparer ces chiffres avec
          n'importe quelle autre école. */}
      <section className="mt-24 rounded-2xl border border-ink/10 bg-paper p-8 md:p-12">
        <p className="text-sm uppercase tracking-widest text-ink/50">
          {L.statsTitle}
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
          {L.stats.map((s, i) => (
            <li key={i}>
              <p className="font-display text-4xl text-ink md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-ink/60">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Pattern G — Pédagogie avec image décalée hors cadre.
          L'image sort à droite pour signifier "on sort des codes". */}
      <section className="mt-24">
        <Grid>
          <Col span={5} spanMd={8} className="lg:pt-8">
            <p className="text-sm uppercase tracking-widest text-accent">
              {L.pedagogyEyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              {L.pedagogyTitle}
            </h2>
            <div className="mt-6 space-y-4 text-ink/80">
              {L.pedagogyBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Col>
          {/* Marge négative volontaire : l'image sort de la gouttière droite
              du conteneur pour "sortir des codes". Les valeurs suivent le
              padding du conteneur (2rem md, 3rem xl), cf. globals.css. */}
          <Col span={7} spanMd={8} className="lg:-mr-8 xl:-mr-12">
            <ImagePlaceholder
              ratio="3:2"
              caption={L.pedagogyPhotoCaption}
            />
          </Col>
        </Grid>
      </section>

      {/* Pattern D — International : mosaïque 4 images
          pour montrer l'ouverture concrètement (workshops, campus). */}
      <section className="mt-24">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-accent">
            {L.internationalEyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            {L.internationalTitle}
          </h2>
          <p className="mt-6 text-ink/80">{L.internationalBody}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {L.intlPhotos.map((caption, i) => (
            <ImagePlaceholder
              key={i}
              ratio="1:1"
              caption={caption}
            />
          ))}
        </div>
      </section>

      {/* Pattern C — Citation visuelle du directeur.
          Image en arrière-plan avec overlay, mot du directeur en
          superposition. Signature humaine forte pour la page About. */}
      <section className="-mx-4 mt-24 md:-mx-8 xl:-mx-12">
        <div className="relative overflow-hidden">
          <ImagePlaceholder
            ratio="21:9"
            caption={L.quotePhotoCaption}
            className="rounded-none border-0"
          />
          <div className="absolute inset-0 flex items-end bg-ink/40 p-8 md:p-16">
            <div className="max-w-3xl text-paper">
              <p className="text-sm uppercase tracking-widest text-paper/70">
                {L.quoteEyebrow}
              </p>
              <blockquote className="mt-4 font-display text-2xl leading-snug md:text-4xl">
                « {L.quoteText} »
              </blockquote>
              <p className="mt-6 text-sm text-paper/80">
                {L.quoteAuthor} · {L.quoteRole}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc parents — lien explicite vers Pourquoi le CAD */}
      <section className="mt-24 max-w-3xl rounded-2xl border border-ink/10 p-8">
        <h2 className="font-display text-xl">{L.parentsTitle}</h2>
        <p className="mt-3 text-ink/70">{L.parentsBody}</p>
        <Link
          href={L.parentsCtaHref}
          className="mt-4 tap text-sm text-accent hover:underline"
        >
          {L.parentsCta} →
        </Link>
      </section>

      {/* CTA final — venir voir l'école */}
      <PageCTA
        title={L.ctaTitle}
        body={L.ctaBody}
        ctaLabel={L.ctaButton}
        ctaHref={L.ctaHref}
        nested
      />
    </article>
  )
}
