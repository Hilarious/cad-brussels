import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { assainirLibelle } from '@/lib/appellations'

/**
 * Sélecteur de séances — « Choisissez votre rendez-vous ».
 *
 * Remplace le panneau indicateur de la page admissions, qui listait
 * quatre façons d'entrer en contact renvoyant chacune vers une autre
 * page. Le visiteur devait ouvrir trois pages pour comparer trois dates.
 * Ici, les occasions de venir sont dans une seule liste, avec les trois
 * faits qui décident de la venue : quand, où, et combien de temps.
 *
 * Les séances viennent de la collection `events`, qui portait déjà tout
 * le nécessaire (date et heure de début, heure de fin donc la durée,
 * lieu, catégorie). Aucune structure nouvelle, donc aucune migration de
 * base : le CAD ajoute une date dans l'admin comme il ajoute un
 * événement, et elle apparaît ici.
 *
 * ── Deux partis pris ───────────────────────────────────────────────
 *
 * 1. Seules les catégories où l'on vient RENCONTRER l'école sont
 *    reprises. Un workshop à Tokyo ou un défilé sont de vrais
 *    événements, mais ce ne sont pas des séances d'information : les
 *    mélanger noierait la seule date qui intéresse un candidat. Le
 *    reste reste accessible sur la page Événements.
 *
 * 2. Le rendez-vous individuel est affiché EN PERMANENCE, et non en
 *    repli quand la liste est vide. C'est la porte de sortie de tout
 *    visiteur dont l'agenda ne colle à aucune date : sans elle, il n'a
 *    plus qu'à fermer l'onglet. Quand le calendrier est creux, elle
 *    devient d'ailleurs le chemin principal, pas le lot de consolation.
 */

/** Catégories considérées comme « venir rencontrer l'école ». */
const CATEGORIES_SEANCES = ['open-day', 'breakfast']

type Seance = {
  id: string | number
  titre: string
  debut: string
  fin: string | null
  lieu: string | null
  slug: string | null
}

function formaterDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-BE' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Brussels',
  }).format(new Date(iso))
}

function formaterCreneau(debut: string, fin: string | null, locale: string) {
  const heure = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-BE' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Brussels',
    }).format(new Date(iso))

  if (!fin) return heure(debut)

  // Une séance qui court sur plusieurs jours n'a pas de créneau horaire
  // lisible : « de 09:00 à 17:00 » sur deux semaines induirait en erreur.
  const memeJour =
    new Date(debut).toDateString() === new Date(fin).toDateString()
  if (!memeJour) return null

  return locale === 'fr'
    ? `De ${heure(debut)} à ${heure(fin)}`
    : `From ${heure(debut)} to ${heure(fin)}`
}

export async function SessionSelector({ locale }: { locale: string }) {
  const isFR = locale === 'fr'
  const payload = await getPayload({ config })

  // La catégorie est une relation : on récupère d'abord les identifiants
  // des catégories retenues, sinon le filtre porterait sur un objet.
  const categories = await payload.find({
    collection: 'categories',
    where: { slug: { in: CATEGORIES_SEANCES } },
    limit: 20,
    depth: 0,
  })
  const idsCategories = categories.docs.map((c) => c.id)

  let seances: Seance[] = []

  if (idsCategories.length > 0) {
    const resultat = await payload.find({
      collection: 'events',
      locale: locale as 'fr' | 'en',
      where: {
        and: [
          { status: { equals: 'published' } },
          { startDate: { greater_than_equal: new Date().toISOString() } },
          { category: { in: idsCategories } },
        ],
      },
      sort: 'startDate',
      limit: 8,
      depth: 0,
    })

    seances = resultat.docs.map((e) => ({
      id: e.id,
      titre: assainirLibelle(e.title) ?? '',
      debut: e.startDate as string,
      fin: (e.endDate as string) ?? null,
      lieu: assainirLibelle(e.location) ?? null,
      slug: (e.slug as string) ?? null,
    }))
  }

  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl">
        {isFR ? 'Choisissez votre rendez-vous.' : 'Choose your visit.'}
      </h2>
      <p className="mt-3 max-w-2xl text-ink/70">
        {isFR
          ? 'Les prochaines occasions de venir voir l’école, de vous faire une idée par vous-même et de poser vos questions. Aucune date ne vous convient ? La dernière carte est faite pour ça.'
          : 'The next chances to come and see the school, judge for yourself and ask your questions. No date suits you? The last card is there for that.'}
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {seances.map((s) => {
          const creneau = formaterCreneau(s.debut, s.fin, locale)
          return (
            <li key={s.id}>
              <Link
                href={s.slug ? `/${locale}/events/${s.slug}` : `/${locale}/events`}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-paper p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="font-display text-2xl text-accent">
                  {formaterDate(s.debut, locale)}
                </span>
                <span className="mt-2 text-sm font-medium leading-snug text-ink group-hover:text-accent">
                  {s.titre}
                </span>
                <span className="mt-3 space-y-1 text-xs text-ink/60">
                  {s.lieu && <span className="block">{s.lieu}</span>}
                  {creneau && <span className="block">{creneau}</span>}
                </span>
              </Link>
            </li>
          )
        })}

        {/* Porte de sortie, toujours présente. Voir le parti pris 2. */}
        <li>
          <Link
            href={`/${locale}/contact?topic=meeting`}
            className="group flex h-full flex-col rounded-2xl border border-dashed border-ink/25 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span className="font-display text-2xl text-ink">
              {isFR ? 'Quand vous voulez' : 'Whenever suits you'}
            </span>
            <span className="mt-2 text-sm font-medium leading-snug text-ink group-hover:text-accent">
              {isFR
                ? 'Un rendez-vous individuel avec le directeur'
                : 'A one-to-one meeting with the director'}
            </span>
            <span className="mt-3 space-y-1 text-xs text-ink/60">
              <span className="block">
                {isFR ? 'Sur place ou en visio' : 'On site or by video'}
              </span>
              <span className="block">
                {isFR ? 'Environ 30 minutes' : 'Around 30 minutes'}
              </span>
            </span>
          </Link>
        </li>
      </ul>

      {seances.length === 0 && (
        <p className="mt-4 text-sm text-ink/60">
          {isFR
            ? 'Les prochaines dates collectives sont en cours de calage. En attendant, le rendez-vous individuel reste ouvert.'
            : 'The next group dates are being confirmed. In the meantime, one-to-one meetings remain open.'}
        </p>
      )}

      <p className="mt-6 text-sm text-ink/60">
        {isFR ? 'Vous êtes déjà décidé·e ? ' : 'Already decided? '}
        <Link href={`/${locale}/apply`} className="text-accent hover:underline">
          {isFR ? 'Postuler en ligne →' : 'Apply online →'}
        </Link>
      </p>
    </div>
  )
}
