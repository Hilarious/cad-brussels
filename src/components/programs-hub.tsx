import Link from 'next/link'
import { ImagePlaceholder } from './image-placeholder'

/**
 * <ProgramsHub> — Cartes immersives plein écran pour les hubs programmes.
 *
 * Affiche une grande carte par programme, fond couleur de thème, image
 * emblématique en grand, titre en font-display énorme. Effet « ouverture
 * de chapitre » : le candidat sent la différence visuelle immédiate
 * entre chaque programme.
 *
 * Injecté via `[...slug]/page.tsx` quand le slug correspond à un hub
 * (`programmes` pour les Bachelors, `masters` pour les Masters). Renvoie
 * null pour les autres slugs.
 *
 * Décision Audry, mai 2026 : « cartes immersives plein écran », format
 * cinéma. Chaque carte alterne image gauche / texte droite (1) puis
 * texte gauche / image droite (2), etc., pour créer un rythme visuel
 * à la lecture. Sur mobile, l'image passe au-dessus du texte.
 *
 * Source de vérité couleurs : charte Thomas Durieux + tailwind.config.ts
 * (cad-navy, cad-violet, cad-pink, cad-azure, cad-mint, cad-orange,
 * cad-magenta).
 */

type Program = {
  /** Slug CMS pour le Link href */
  slug: string
  /** Numéro d'ordre affiché en grande typo eyebrow */
  index: string
  /** Titre du programme (court, sans "Bachelor en…") */
  title: { fr: string; en: string }
  /** Diplôme + durée, affiché en sous-titre */
  degree: { fr: string; en: string }
  /** Pitch éditorial court (2-3 lignes max) */
  tagline: { fr: string; en: string }
  /** Trois mots-clés signature du programme */
  keywords: { fr: string[]; en: string[] }
  /** Background color CAD officielle pour la carte */
  bgClass: string
  /** Couleur du texte sur ce fond (paper si fond sombre, ink si fond clair) */
  textClass: string
  /** Brief photographe pour l'image */
  imageCaption: string
}

const BACHELORS: Program[] = [
  {
    slug: 'interior-architecture-design',
    index: '01',
    title: { fr: 'Architecture d’intérieur & Design', en: 'Interior Architecture & Design' },
    degree: { fr: 'Bachelor · 3 ans', en: 'Bachelor · 3 years' },
    tagline: {
      fr: "Concevoir des lieux où la vie se passe. Pensée spatiale, matériaux, lumière, scénographie du quotidien.",
      en: 'Designing spaces where life happens. Spatial thinking, materials, light, choreography of the everyday.',
    },
    keywords: {
      fr: ['Espace', 'Matières', 'Scénographie'],
      en: ['Space', 'Materials', 'Scenography'],
    },
    bgClass: 'bg-cad-navy',
    textClass: 'text-paper',
    imageCaption: 'Atelier maquette espace · étudiant·e Bachelor Architecture intérieure',
  },
  {
    slug: 'communication-digital-design',
    index: '02',
    title: { fr: 'Communication & Digital Design', en: 'Communication & Digital Design' },
    degree: { fr: 'Bachelor · 3 ans', en: 'Bachelor · 3 years' },
    tagline: {
      fr: "Raconter, signer, déployer une identité sur tous les supports. Direction artistique, branding, motion, expérience numérique.",
      en: 'Telling, signing, deploying an identity across all media. Art direction, branding, motion, digital experience.',
    },
    keywords: {
      fr: ['Identité', 'Récit', 'Interfaces'],
      en: ['Identity', 'Narrative', 'Interfaces'],
    },
    bgClass: 'bg-cad-violet',
    textClass: 'text-paper',
    imageCaption: 'Écran direction artistique · projet identité visuelle étudiant·e',
  },
  {
    slug: 'fashion-accessory-design',
    index: '03',
    title: { fr: 'Mode & Accessoires', en: 'Fashion & Accessory Design' },
    degree: { fr: 'Bachelor · 3 ans', en: 'Bachelor · 3 years' },
    tagline: {
      fr: "Dessiner, couper, monter, présenter une collection. De l'idée au défilé, du croquis au stylisme.",
      en: 'Drawing, cutting, assembling, presenting a collection. From the idea to the runway, from the sketch to styling.',
    },
    keywords: {
      fr: ['Patronage', 'Stylisme', 'Défilé'],
      en: ['Pattern-making', 'Styling', 'Runway'],
    },
    bgClass: 'bg-cad-pink',
    textClass: 'text-paper',
    imageCaption: 'Atelier mode · main qui drape un tissu sur mannequin de couture',
  },
]

const MASTERS: Program[] = [
  {
    slug: 'interior-architecture-design-master',
    index: '01',
    title: { fr: 'Interior Architecture & Design', en: 'Interior Architecture & Design' },
    degree: { fr: 'Master · 2 ans', en: 'Master · 2 years' },
    tagline: {
      fr: "Approfondissement de la pensée spatiale, projet d'auteur, transition vers la pratique professionnelle.",
      en: 'Deepening spatial thinking, authored project, transition into professional practice.',
    },
    keywords: {
      fr: ['Projet d’auteur', 'Recherche', 'Pratique pro'],
      en: ['Authored project', 'Research', 'Professional practice'],
    },
    bgClass: 'bg-cad-navy',
    textClass: 'text-paper',
    imageCaption: 'Maquette finale Master · perspective intérieure travaillée à la lumière',
  },
  {
    slug: 'home-living-design',
    index: '02',
    title: { fr: 'Home & Living Design', en: 'Home & Living Design' },
    degree: { fr: 'Master · 2 ans', en: 'Master · 2 years' },
    tagline: {
      fr: "Penser l'habitat, le mobilier, l'objet domestique. Du brief industriel au prototype.",
      en: 'Thinking the home, the furniture, the domestic object. From the industrial brief to the prototype.',
    },
    keywords: {
      fr: ['Mobilier', 'Prototype', 'Édition'],
      en: ['Furniture', 'Prototype', 'Edition'],
    },
    bgClass: 'bg-cad-mint',
    textClass: 'text-ink',
    imageCaption: 'Prototype mobilier · étudiant·e Master Home & Living en atelier bois',
  },
  {
    slug: 'digital-brand-content',
    index: '03',
    title: { fr: 'Digital Brand Content', en: 'Digital Brand Content' },
    degree: { fr: 'Master · 2 ans', en: 'Master · 2 years' },
    tagline: {
      fr: "Stratégie de marque, contenu social, direction de campagne. Là où la création rencontre l'audience.",
      en: 'Brand strategy, social content, campaign direction. Where creation meets the audience.',
    },
    keywords: {
      fr: ['Stratégie', 'Campagne', 'Social'],
      en: ['Strategy', 'Campaign', 'Social'],
    },
    bgClass: 'bg-cad-violet',
    textClass: 'text-paper',
    imageCaption: 'Réunion brief campagne · planches stratégie sur mur d’atelier',
  },
  {
    slug: 'image-3d-motion-video-ai',
    index: '04',
    title: { fr: 'Image 3D, Motion, Vidéo & AI', en: 'Image 3D, Motion, Video & AI' },
    degree: { fr: 'Master · 2 ans', en: 'Master · 2 years' },
    tagline: {
      fr: "L'image en mouvement, du shoot au rendu 3D, des outils génératifs à la post-production. L'œil avant l'outil.",
      en: 'The moving image, from shoot to 3D render, from generative tools to post-production. The eye before the tool.',
    },
    keywords: {
      fr: ['Motion', '3D', 'AI'],
      en: ['Motion', '3D', 'AI'],
    },
    bgClass: 'bg-cad-azure',
    textClass: 'text-paper',
    imageCaption: 'Plateau tournage / setup 3D · étudiant·e devant écran de compositing',
  },
  {
    slug: 'event-management',
    index: '05',
    title: { fr: 'Event Management', en: 'Event Management' },
    degree: { fr: 'Master · 2 ans', en: 'Master · 2 years' },
    tagline: {
      fr: "Concevoir et produire des événements : scénographie, production, hospitality, communication.",
      en: 'Conceiving and producing events: scenography, production, hospitality, communication.',
    },
    keywords: {
      fr: ['Scénographie', 'Production', 'Hospitality'],
      en: ['Scenography', 'Production', 'Hospitality'],
    },
    bgClass: 'bg-cad-orange',
    textClass: 'text-paper',
    imageCaption: 'Montage scénographie événementiel · étudiant·e Master Event en production',
  },
  {
    slug: 'fashion-management',
    index: '06',
    title: { fr: 'Fashion Management', en: 'Fashion Management' },
    degree: { fr: 'Spécialisation · 1 an', en: 'Specialisation · 1 year' },
    tagline: {
      fr: "Le management des maisons de mode : production, retail, communication, e-commerce, durabilité.",
      en: 'Fashion house management: production, retail, communication, e-commerce, sustainability.',
    },
    keywords: {
      fr: ['Retail', 'Production', 'Durabilité'],
      en: ['Retail', 'Production', 'Sustainability'],
    },
    bgClass: 'bg-cad-pink',
    textClass: 'text-paper',
    imageCaption: 'Atelier showroom Fashion Management · planche merchandising / retail',
  },
]

const COPY = {
  fr: {
    discover: 'Découvrir le programme',
    keywordsLabel: 'Signatures',
  },
  en: {
    discover: 'Discover the program',
    keywordsLabel: 'Signatures',
  },
}

function ProgramCard({
  program,
  locale,
  position,
}: {
  program: Program
  locale: string
  /** Position dans la liste, sert à alterner image/texte pour le rythme visuel. */
  position: number
}) {
  const isFR = locale === 'fr'
  const t = isFR ? COPY.fr : COPY.en
  // Alternance : image à gauche pour les cartes paires, à droite pour les impaires.
  const imageOnRight = position % 2 === 1

  return (
    <article
      className={`${program.bgClass} ${program.textClass} relative overflow-hidden`}
    >
      <div className="container py-20 md:py-28">
        <div
          className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
            imageOnRight ? '' : 'md:[&>*:first-child]:order-2'
          }`}
        >
          {/* Bloc texte */}
          <div className="relative">
            {/* Numéro géant en filigrane derrière le titre */}
            <p
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -left-2 select-none font-display text-[12rem] leading-none opacity-10 md:-top-16 md:text-[16rem]"
            >
              {program.index}
            </p>
            <p
              className={`relative text-sm uppercase tracking-widest ${
                program.textClass === 'text-paper' ? 'text-paper/70' : 'text-ink/60'
              }`}
            >
              {program.degree[isFR ? 'fr' : 'en']}
            </p>
            <h2 className="relative mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
              {program.title[isFR ? 'fr' : 'en']}
            </h2>
            <p
              className={`relative mt-6 max-w-xl text-lg leading-relaxed ${
                program.textClass === 'text-paper' ? 'text-paper/85' : 'text-ink/75'
              }`}
            >
              {program.tagline[isFR ? 'fr' : 'en']}
            </p>
            {/* Mots-clés signature */}
            <ul className="relative mt-8 flex flex-wrap gap-2">
              {program.keywords[isFR ? 'fr' : 'en'].map((kw) => (
                <li
                  key={kw}
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${
                    program.textClass === 'text-paper'
                      ? 'border-paper/30 text-paper/80'
                      : 'border-ink/20 text-ink/70'
                  }`}
                >
                  {kw}
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/${program.slug}`}
              className={`relative mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm uppercase tracking-widest transition ${
                program.textClass === 'text-paper'
                  ? 'bg-paper text-ink hover:bg-paper/90'
                  : 'bg-ink text-paper hover:bg-ink/90'
              }`}
            >
              {t.discover} →
            </Link>
          </div>

          {/* Bloc image — grande, format portrait éditorial 4:5 */}
          <div className="relative">
            <ImagePlaceholder
              ratio="4:5"
              caption={program.imageCaption}
              className="bg-paper/10"
            />
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * <ProgramsHub> — point d'entrée injecté depuis la route CMS.
 *
 * Si `slug` correspond à un hub connu, affiche les cartes immersives.
 * Sinon, renvoie null pour ne pas polluer les autres pages.
 */
export function ProgramsHub({
  slug,
  locale,
}: {
  slug: string
  locale: string
}) {
  const isFR = locale === 'fr'
  let programs: Program[] | null = null
  let label = ''

  if (slug === 'programmes') {
    programs = BACHELORS
    label = isFR ? 'Les trois Bachelors du CAD' : 'The three CAD Bachelors'
  } else if (slug === 'masters' || slug === 'master') {
    programs = MASTERS
    label = isFR ? 'Les six Masters du CAD' : 'The six CAD Masters'
  }

  if (!programs) return null

  return (
    <section aria-label={label}>
      {programs.map((program, i) => (
        <ProgramCard
          key={program.slug}
          program={program}
          locale={locale}
          position={i}
        />
      ))}
    </section>
  )
}
