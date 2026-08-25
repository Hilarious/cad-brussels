'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

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
 * ── Le mouvement (demande d'Audry, 25/08/2026 : « du juice ») ────────
 * Trois registres, tous coupés par prefers-reduced-motion :
 *
 *  1. L'œil suit le curseur. C'est LE geste de la section : l'école
 *     forme le regard, et le regard suit le visiteur. Sans souris
 *     (téléphone), l'œil cligne simplement de temps en temps.
 *  2. Entrée chorégraphiée au scroll : les cartes du premier cycle,
 *     puis l'œil, puis le deuxième cycle en cascade. L'ordre de
 *     lecture EST le parcours d'études.
 *  3. Au survol, la carte se soulève et son filet de couleur s'épaissit.
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

/** Retard d'apparition (ms) par étape de la chorégraphie d'entrée. */
const REVEAL = {
  header: 0,
  cycleOneCard: (i: number) => 80 + i * 90,
  pivot: 380,
  cycleTwoBig: 470,
  cycleTwoCard: (i: number) => 560 + i * 80,
  foot: 1050,
}

/**
 * L'œil, seul élément repris de la roue. La pupille suit le curseur
 * (écoute globale, calcul dans un requestAnimationFrame pour ne rien
 * coûter au scroll) et l'ensemble cligne périodiquement via la
 * keyframe `cad-blink` déclarée dans globals.css.
 */
function Eye({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pupilRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0

    const onMove = (e: MouseEvent) => {
      const svg = svgRef.current
      if (!svg) return
      const box = svg.getBoundingClientRect()
      const cx = box.left + box.width / 2
      const cy = box.top + box.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy) || 1
      // Amplitude max : 7 unités SVG. La pupille reste dans le globe.
      const amp = Math.min(dist / 40, 7)
      targetX = (dx / dist) * amp
      targetY = (dy / dist) * amp
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      // Lissage : la pupille glisse vers la cible au lieu de sauter.
      curX += (targetX - curX) * 0.18
      curY += (targetY - curY) * 0.18
      pupilRef.current?.setAttribute('transform', `translate(${curX} ${curY})`)
      raf =
        Math.abs(targetX - curX) + Math.abs(targetY - curY) > 0.05
          ? requestAnimationFrame(tick)
          : 0
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 104 104"
      aria-hidden="true"
      className={`cad-blink ${className ?? ''}`}
      role="presentation"
    >
      <circle cx="52" cy="52" r="50" fill="currentColor" />
      <g ref={pupilRef}>
        <circle cx="63" cy="41" r="15" fill="#F4F4F0" />
        <circle cx="66" cy="38" r="6" fill="currentColor" />
      </g>
    </svg>
  )
}

/** Classes communes de l'apparition : invisible → en place une fois vu. */
const revealCls =
  'transition-all duration-500 ease-out ' +
  'group-data-[inview=false]/pathway:translate-y-4 group-data-[inview=false]/pathway:opacity-0 ' +
  'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'

function Card({
  p,
  fr,
  locale,
  delay,
}: {
  p: PathwayCard
  fr: boolean
  locale: string
  delay: number
}) {
  return (
    <li className={`min-w-0 ${revealCls}`} style={{ transitionDelay: `${delay}ms` }}>
      <Link
        href={`/${locale}/${p.href}`}
        className="group/card relative block h-full overflow-hidden rounded-xl border border-ink/10 bg-white p-5 pl-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/10 motion-reduce:hover:translate-y-0"
      >
        {/* Filet de filière : s'épaissit au survol */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1.5 transition-all duration-300 group-hover/card:w-2.5"
          style={{ backgroundColor: p.color }}
        />
        <p className="font-display text-lg leading-snug">{fr ? p.nameFR : p.nameEN}</p>
        <p className="mt-1 text-xs uppercase tracking-wider text-ink/55">
          {fr ? p.metaFR : p.metaEN}
        </p>
      </Link>
    </li>
  )
}

export function ProgramsPathway({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // Déclenche la chorégraphie d'entrée à la première apparition à l'écran.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-inview={inView}
      className="group/pathway container py-16"
    >
      {/* En-tête de section */}
      <div
        className={`mb-10 flex items-end justify-between ${revealCls}`}
        style={{ transitionDelay: `${REVEAL.header}ms` }}
      >
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
          className="tap group/all shrink-0 text-sm text-ink/70 hover:text-accent"
        >
          {fr ? 'Tout voir' : 'See all'}{' '}
          <span className="inline-block transition-transform duration-300 group-hover/all:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Le chemin : cycle 1 → l'œil → cycle 2 */}
      <div className="grid gap-7 lg:grid-cols-[5fr_auto_7fr] lg:gap-10">
        {/* ── Temps 1 ── */}
        <div className="flex min-w-0 flex-col">
          <p
            className={`text-xs font-semibold uppercase tracking-widest ${revealCls}`}
            style={{ transitionDelay: `${REVEAL.cycleOneCard(0)}ms` }}
          >
            {fr ? '01 · Premier cycle' : '01 · First cycle'}
          </p>
          <p
            className={`mb-5 mt-1 text-xs text-ink/55 ${revealCls}`}
            style={{ transitionDelay: `${REVEAL.cycleOneCard(0)}ms` }}
          >
            {fr ? '3 ans · 180 ECTS · plein temps' : '3 years · 180 ECTS · full-time'}
          </p>
          <ul className="grid flex-1 content-between gap-3.5">
            {CYCLE_ONE.map((p, i) => (
              <Card
                key={p.href}
                p={p}
                fr={fr}
                locale={locale}
                delay={REVEAL.cycleOneCard(i)}
              />
            ))}
          </ul>
        </div>

        {/* ── Le pivot : l'œil entre les deux temps ── */}
        <div
          aria-hidden="true"
          className={`flex items-center gap-3 lg:flex-col lg:justify-center ${revealCls}`}
          style={{ transitionDelay: `${REVEAL.pivot}ms` }}
        >
          <span className="h-px flex-1 bg-ink/10 lg:h-auto lg:w-px lg:flex-1" />
          <Eye className="h-12 w-12 text-ink lg:h-14 lg:w-14" />
          <span className="h-px flex-1 bg-ink/10 lg:h-auto lg:w-px lg:flex-1" />
        </div>

        {/* ── Temps 2 ── */}
        <div className="min-w-0">
          <p
            className={`text-xs font-semibold uppercase tracking-widest ${revealCls}`}
            style={{ transitionDelay: `${REVEAL.cycleTwoBig}ms` }}
          >
            {fr ? '02 · Deuxième cycle' : '02 · Second cycle'}
          </p>
          <p
            className={`mb-5 mt-1 text-xs text-ink/55 ${revealCls}`}
            style={{ transitionDelay: `${REVEAL.cycleTwoBig}ms` }}
          >
            {fr
              ? '1 ou 2 ans · 60 à 120 ECTS · stage inclus'
              : '1 or 2 years · 60 to 120 ECTS · internship included'}
          </p>
          <ul className="grid gap-3.5 sm:grid-cols-2">
            {/* Le 2 ans, mis en avant : double diplôme avec Nantes */}
            <li
              className={`min-w-0 sm:col-span-2 ${revealCls}`}
              style={{ transitionDelay: `${REVEAL.cycleTwoBig}ms` }}
            >
              <Link
                href={`/${locale}/interior-architecture-design-postgraduate`}
                className="block rounded-xl bg-cad-navy p-5 text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cad-navy/30 motion-reduce:hover:translate-y-0"
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
            {CYCLE_TWO.map((p, i) => (
              <Card
                key={p.nameEN}
                p={p}
                fr={fr}
                locale={locale}
                delay={REVEAL.cycleTwoCard(i)}
              />
            ))}
            {/* La spécialisation, à part : temps partiel, cadre pointillé */}
            <li
              className={`min-w-0 ${revealCls}`}
              style={{ transitionDelay: `${REVEAL.cycleTwoCard(CYCLE_TWO.length)}ms` }}
            >
              <Link
                href={`/${locale}/fashion-management`}
                className="group/card relative block h-full overflow-hidden rounded-xl border-2 border-dashed border-cad-pink p-5 pl-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-cad-pink/15 motion-reduce:hover:translate-y-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1.5 bg-cad-pink transition-all duration-300 group-hover/card:w-2.5"
                />
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
      <ul
        className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink/55 ${revealCls}`}
        style={{ transitionDelay: `${REVEAL.foot}ms` }}
      >
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
