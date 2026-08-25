import Link from 'next/link'

/**
 * <ProgramsPathway> — le parcours d'études en deux temps, sur l'accueil.
 *
 * Remplace à la fois la roue circulaire du site WordPress (image bitmap :
 * texte invisible pour les moteurs, illisible sur téléphone, et porteuse
 * des appellations que le CAD ne peut pas employer) et la grille de
 * 4 cartes maigres qui l'avait provisoirement remplacée ici.
 *
 * Contenu aligné sur l'offre publiée par cad.be (la roue « the sum of
 * all talents »), reformulée sans appellation protégée : premier cycle,
 * deuxième cycle, spécialisation, ECTS.
 *
 * Décisions validées par Audry (25/08/2026) :
 *  - « Furniture & Product Design » est le nom valide du programme
 *    (le prototype disait « Home & Living Design »).
 *  - Le mint officiel (#00FF80) est illisible en filet sur fond clair :
 *    assombri en #00CC66 pour ce seul usage.
 *
 * À confirmer avec Eric :
 *  - cad.be nomme la spécialisation « Fashion Business », le prototype
 *    « Fashion Management ». On suit cad.be ici.
 *  - Le deuxième cycle « Interior Architecture » 1 an n'a pas encore de
 *    page dédiée : sa carte renvoie vers le hub /postgraduate.
 */

type PathwayCard = {
  /** Slug de la page cible (sans préfixe de langue). */
  href: string
  nameFR: string
  nameEN: string
  metaFR: string
  metaEN: string
  /** Couleur de filière (charte Thomas Durieux, juin 2024). */
  color: string
}

const CYCLE_ONE: PathwayCard[] = [
  {
    href: 'interior-architecture-design',
    nameFR: 'Interior Architecture & Design',
    nameEN: 'Interior Architecture & Design',
    metaFR: '3 ans · 180 ECTS',
    metaEN: '3 years · 180 ECTS',
    color: '#2F346D',
  },
  {
    href: 'communication-digital-design',
    nameFR: 'Communication & Digital Design',
    nameEN: 'Communication & Digital Design',
    metaFR: '3 ans · 180 ECTS',
    metaEN: '3 years · 180 ECTS',
    color: '#8000FF',
  },
  {
    href: 'fashion-accessory-design',
    nameFR: 'Fashion & Accessory Design',
    nameEN: 'Fashion & Accessory Design',
    metaFR: '3 ans · 180 ECTS',
    metaEN: '3 years · 180 ECTS',
    color: '#FF277F',
  },
]

const CYCLE_TWO: PathwayCard[] = [
  {
    href: 'postgraduate',
    nameFR: 'Interior Architecture',
    nameEN: 'Interior Architecture',
    metaFR: '1 an · 60 ECTS · stage 6 mois',
    metaEN: '1 year · 60 ECTS · 6-month internship',
    color: '#2F346D',
  },
  {
    href: 'home-living-design',
    nameFR: 'Furniture & Product Design',
    nameEN: 'Furniture & Product Design',
    metaFR: '1 an · 60 ECTS · stage 6 mois',
    metaEN: '1 year · 60 ECTS · 6-month internship',
    color: '#00CC66', // mint charte assombri, cf. note d'en-tête
  },
  {
    href: 'image-3d-motion-video-ai',
    nameFR: 'Image · 3D, Motion & Video, A.I.',
    nameEN: 'Image · 3D, Motion & Video, A.I.',
    metaFR: '1 an · 60 ECTS · stage 6 mois',
    metaEN: '1 year · 60 ECTS · 6-month internship',
    color: '#0080FF',
  },
  {
    href: 'digital-brand-content',
    nameFR: 'Digital Brand Content',
    nameEN: 'Digital Brand Content',
    metaFR: '1 an · 60 ECTS · stage 6 mois',
    metaEN: '1 year · 60 ECTS · 6-month internship',
    color: '#8000FF',
  },
  {
    href: 'event-management',
    nameFR: 'Event Management',
    nameEN: 'Event Management',
    metaFR: '1 an · 60 ECTS · stage 6 mois',
    metaEN: '1 year · 60 ECTS · 6-month internship',
    color: '#FF8000',
  },
]

/** L'œil, seul élément repris de la roue : « on forme le regard ». */
function Eye({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 104 104"
      aria-hidden="true"
      className={className}
      role="presentation"
    >
      <circle cx="52" cy="52" r="50" fill="currentColor" />
      <circle cx="63" cy="41" r="15" fill="#F4F4F0" />
      <circle cx="66" cy="38" r="6" fill="currentColor" />
    </svg>
  )
}

export function ProgramsPathway({ locale }: { locale: string }) {
  const fr = locale === 'fr'

  return (
    <section className="container py-16">
      {/* En-tête de section */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl md:text-4xl">
            {fr ? (
              <>
                Le parcours CAD, <strong className="font-semibold">d’un coup d’œil.</strong>
              </>
            ) : (
              <>
                The CAD pathway, <strong className="font-semibold">at a glance.</strong>
              </>
            )}
          </h2>
          <p className="mt-3 max-w-xl text-sm font-light text-ink/65">
            {fr
              ? 'Trois programmes pour fonder votre pratique, sept pour la spécialiser. Tous en anglais, tous en atelier.'
              : 'Three programmes to ground your practice, seven to specialise it. All in English, all studio-based.'}
          </p>
        </div>
        <Link
          href={`/${locale}/programmes`}
          className="tap shrink-0 text-sm text-ink/70 hover:text-accent"
        >
          {fr ? 'Tout voir' : 'See all'} →
        </Link>
      </div>

      {/* Le chemin : cycle 1 → l'œil → cycle 2 */}
      <div className="grid gap-7 lg:grid-cols-[5fr_auto_7fr] lg:gap-10">
        {/* ── Temps 1 ── */}
        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-semibold uppercase tracking-widest">
            {fr ? '01 · Premier cycle' : '01 · First cycle'}
          </p>
          <p className="mb-5 mt-1 text-xs text-ink/55">
            {fr ? '3 ans · 180 ECTS · plein temps' : '3 years · 180 ECTS · full-time'}
          </p>
          <ul className="grid flex-1 content-between gap-3.5">
            {CYCLE_ONE.map((p) => (
              <li key={p.href} className="min-w-0">
                <Link
                  href={`/${locale}/${p.href}`}
                  className="block rounded-xl border border-ink/10 bg-white p-5 transition hover:border-accent/40"
                  style={{ borderLeft: `5px solid ${p.color}` }}
                >
                  <p className="font-display text-lg leading-snug">
                    {fr ? p.nameFR : p.nameEN}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-ink/55">
                    {fr ? p.metaFR : p.metaEN}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Le pivot : l'œil entre les deux temps ── */}
        <div
          aria-hidden="true"
          className="flex items-center gap-3 lg:flex-col lg:justify-center"
        >
          <span className="h-px flex-1 bg-ink/10 lg:h-auto lg:w-px lg:flex-1" />
          <Eye className="h-12 w-12 text-ink lg:h-14 lg:w-14" />
          <span className="h-px flex-1 bg-ink/10 lg:h-auto lg:w-px lg:flex-1" />
        </div>

        {/* ── Temps 2 ── */}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest">
            {fr ? '02 · Deuxième cycle' : '02 · Second cycle'}
          </p>
          <p className="mb-5 mt-1 text-xs text-ink/55">
            {fr
              ? '1 ou 2 ans · 60 à 120 ECTS · stage inclus'
              : '1 or 2 years · 60 to 120 ECTS · internship included'}
          </p>
          <ul className="grid gap-3.5 sm:grid-cols-2">
            {/* Le 2 ans, mis en avant : double diplôme avec Nantes */}
            <li className="min-w-0 sm:col-span-2">
              <Link
                href={`/${locale}/interior-architecture-design-postgraduate`}
                className="block rounded-xl bg-cad-navy p-5 text-white transition hover:opacity-90"
              >
                <p className="font-display text-lg leading-snug">
                  Interior Architecture &amp; Design
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/70">
                  {fr ? '2 ans · 120 ECTS' : '2 years · 120 ECTS'}
                </p>
                <span className="mt-3 inline-block rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider">
                  {fr
                    ? 'Double diplôme · L’École de Design Nantes Atlantique'
                    : 'Double degree · L’École de Design Nantes Atlantique'}
                </span>
              </Link>
            </li>
            {CYCLE_TWO.map((p) => (
              <li key={p.nameEN} className="min-w-0">
                <Link
                  href={`/${locale}/${p.href}`}
                  className="block h-full rounded-xl border border-ink/10 bg-white p-5 transition hover:border-accent/40"
                  style={{ borderLeft: `5px solid ${p.color}` }}
                >
                  <p className="font-display text-lg leading-snug">
                    {fr ? p.nameFR : p.nameEN}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-ink/55">
                    {fr ? p.metaFR : p.metaEN}
                  </p>
                </Link>
              </li>
            ))}
            {/* La spécialisation, à part : temps partiel, cadre pointillé */}
            <li className="min-w-0">
              <Link
                href={`/${locale}/fashion-management`}
                className="block h-full rounded-xl border-2 border-dashed border-cad-pink p-5 transition hover:bg-white"
                style={{ borderLeft: '5px solid #FF277F' }}
              >
                <p className="font-display text-lg leading-snug">Fashion Business</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink/55">
                  {fr
                    ? '1 an · temps partiel · stage 4 mois'
                    : '1 year · part-time · 4-month internship'}
                </p>
                <span className="mt-3 inline-block rounded-full border border-ink/15 px-3 py-1 text-[11px] uppercase tracking-wider text-ink/70">
                  {fr ? 'Spécialisation' : 'Specialisation'}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Repères transverses */}
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink/55">
        {(fr
          ? ['Cours en anglais', '160 étudiants au total', 'Entrée sur dossier et entretien']
          : ['Taught in English', '160 students in total', 'Entry on portfolio and interview']
        ).map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
