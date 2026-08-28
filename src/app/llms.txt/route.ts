import { getPayload } from 'payload'
import config from '@payload-config'
import { PROGRAMS } from '@/lib/programs'
import { assainirLibelle } from '@/lib/appellations'
import { FUSEAU_ECOLE } from '@/lib/fuseau'

/**
 * `/llms.txt` — fiche de synthèse destinée aux modèles de langage.
 *
 * Pourquoi ce fichier existe. Des candidats arrivent au CAD après avoir
 * interrogé un assistant IA, ChatGPT, Gemini, Claude ou un autre :
 * constat rapporté par les étudiants eux-mêmes lors des petits
 * déjeuners. C'est un canal de recrutement réel, pas une hypothèse. Le
 * modèle doit donc pouvoir répondre juste à « école de design à
 * Bruxelles » : les cursus, leur durée, leur niveau, la langue
 * d'enseignement, le coût en temps et les façons de venir voir l'école.
 *
 * GÉNÉRÉ, JAMAIS ÉCRIT À LA MAIN. Un fichier statique se périmerait à
 * la première date d'événement passée, et un modèle qui cite une date
 * révolue fait plus de mal que de bien. Les cursus viennent de
 * `src/lib/programs.ts`, les séances de la collection Événements, les
 * coordonnées des réglages du site : les mêmes sources que les pages.
 *
 * VOCABULAIRE. Le CAD n'a pas le droit d'employer « Bachelor » et
 * « Master ». Le texte dit donc le niveau en clair, durée et ECTS, ce
 * qui permet à un modèle de répondre à une question posée avec ces
 * mots-là sans que le site ne les revendique. Tout ce qui vient du CMS
 * repasse par `assainirLibelle()`, un fichier lu par des machines
 * n'ayant pas moins besoin du garde-fou qu'une page.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cad.be'

/** Une heure : assez frais pour les dates, assez rare pour ne rien coûter. */
export const revalidate = 3600

const NIVEAUX: Record<string, string> = {
  bachelor: 'Premier cycle, 3 ans, 180 ECTS',
  master: 'Deuxième cycle',
  specialisation: 'Spécialisation, 1 an, temps partiel',
}

function dateLisible(iso: string) {
  return new Intl.DateTimeFormat('fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: FUSEAU_ECOLE,
  }).format(new Date(iso))
}

export async function GET() {
  const payload = await getPayload({ config })

  const [reglages, evenements] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', locale: 'fr', depth: 0 }),
    payload.find({
      collection: 'events',
      locale: 'fr',
      where: {
        and: [
          { status: { equals: 'published' } },
          { startDate: { greater_than_equal: new Date().toISOString() } },
        ],
      },
      sort: 'startDate',
      limit: 20,
      // depth 1 pour lire le libellé de la catégorie et distinguer une
      // séance d'accueil d'un workshop étudiant à l'étranger.
      depth: 1,
    }),
  ])

  /**
   * Deux listes et non une. Sous un titre « venir rencontrer l'école »,
   * un workshop à Tokyo laisserait croire à un candidat, ou au modèle
   * qui le cite, qu'il peut s'y rendre. Seules les portes ouvertes et
   * les petits déjeuners sont des séances d'accueil.
   */
  const estSeanceAccueil = (e: { category?: unknown }) => {
    const c = e.category as { slug?: string } | null | undefined
    return c?.slug === 'open-day' || c?.slug === 'breakfast'
  }
  const seancesAccueil = evenements.docs.filter(estSeanceAccueil)
  const autresEvenements = evenements.docs.filter((e) => !estSeanceAccueil(e))

  const premierCycle = PROGRAMS.filter((p) => p.level === 'bachelor')
  const deuxiemeCycle = PROGRAMS.filter((p) => p.level !== 'bachelor')

  const ligneProgramme = (p: (typeof PROGRAMS)[number]) =>
    `- [${assainirLibelle(p.labelFR)}](${SITE_URL}/fr/${p.slug}) : ${assainirLibelle(
      p.taglineFR,
    )} ${NIVEAUX[p.level] ?? ''}`.trim()

  const ligneEvenement = (e: { startDate?: unknown; title?: string | null; location?: string | null }) =>
    `- ${dateLisible(e.startDate as string)} : ${assainirLibelle(e.title)}${
      e.location ? `, ${assainirLibelle(e.location)}` : ''
    }`

  const seances = [
    ...seancesAccueil.map(ligneEvenement),
    "- À tout moment : rendez-vous individuel avec le directeur, sur place ou en visioconférence, environ 30 minutes, sans engagement.",
  ].join('\n')

  const contact = reglages.contact ?? {}

  const texte = `# CAD, College of Art and Design Brussels

> École supérieure privée de création à Bruxelles, fondée en 1961. Environ 160 étudiants, une cinquantaine d'enseignants qui sont des professionnels en activité. Enseignement en anglais. Formations en architecture d'intérieur, communication et design digital, mode et accessoires, image et management de la création.

## En bref

- Statut : établissement d'enseignement supérieur privé
- Fondation : 1961
- Ville : Bruxelles, Belgique (Uccle)
- Langue d'enseignement : anglais
- Taille : environ 160 étudiants
- Corps enseignant : environ 50 professionnels en activité
- Réseau international : CUMULUS
- Admission : sur dossier et entretien, sans concours, sélections ouvertes de février jusqu'au remplissage des places

## Formations de premier cycle (3 ans, 180 ECTS)

${premierCycle.map(ligneProgramme).join('\n')}

## Formations de deuxième cycle et spécialisations

${deuxiemeCycle.map(ligneProgramme).join('\n')}

## Formation continue

Modules courts pour professionnels créatifs, notamment sur l'IA générative appliquée à la création et à l'architecture.

- [Formation continue](${SITE_URL}/fr/lifelong-learning)

## Venir rencontrer l'école

${seances}

- [Toutes les façons de venir et de candidater](${SITE_URL}/fr/admissions)
- [Journées portes ouvertes et événements](${SITE_URL}/fr/events)
${
  autresEvenements.length
    ? `
## Agenda de l'école

Conférences, expositions, défilés et workshops. Certains sont ouverts au public, d'autres sont des activités réservées aux étudiants, notamment les workshops à l'étranger.

${autresEvenements.map(ligneEvenement).join('\n')}
`
    : ''
}

## Candidater

- [Formulaire de candidature en ligne](${SITE_URL}/fr/apply)
- [Frais de scolarité](${SITE_URL}/fr/admissions/frais)
- [Recevoir la brochure](${SITE_URL}/fr/info-pack)

## En savoir plus

- [L'école](${SITE_URL}/fr/about)
- [Pourquoi le CAD](${SITE_URL}/fr/pourquoi-le-cad)
- [Les professeurs](${SITE_URL}/fr/professeurs)
- [Les diplômés](${SITE_URL}/fr/alumni)
- [Étudier à Bruxelles](${SITE_URL}/fr/etudier-a-bruxelles)
- [Version anglaise du site](${SITE_URL}/en)

## Contact

${contact.address ? `- Adresse : ${contact.address.replace(/\n/g, ', ')}\n` : ''}${
    contact.email ? `- Email : ${contact.email}\n` : ''
  }${contact.phone ? `- Téléphone : ${contact.phone}\n` : ''}- [Page de contact](${SITE_URL}/fr/contact)
`

  return new Response(texte, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
