/**
 * Programs catalog — source unique de vérité pour les métadonnées de
 * chaque programme du CAD (label, niveau, durée, description courte).
 *
 * Consommé par :
 *   - `<RelatedPrograms>` (composant cartes "autres programmes")
 *   - Route dynamique `[...slug]/page.tsx` (JSON-LD Schema.org Course)
 *   - Header dropdown (si on regénère plus tard)
 *   - Sitemap (à venir)
 *
 * Le slug DOIT correspondre au slug Payload seedé dans `scripts/seed.ts`
 * et `scripts/seed-extras.ts`. Toute modification ici doit être répercutée
 * dans les seeds ET dans `src/lib/program-themes.ts` (mapping thème).
 */

export type ProgramLevel = 'bachelor' | 'master' | 'specialisation'

export type Program = {
  slug: string
  labelFR: string
  labelEN: string
  descFR: string
  descEN: string
  taglineFR: string
  taglineEN: string
  level: ProgramLevel
  /** Duration in ISO 8601 (schema.org timeRequired). Ex: 'P3Y' = 3 years. */
  duration: string
}

export const PROGRAMS: readonly Program[] = [
  // --------------------------------------------------------------- Bachelors
  {
    slug: 'interior-architecture-design',
    labelFR: 'Architecture d’intérieur',
    labelEN: 'Interior Architecture & Design',
    descFR: 'Bachelor 3 ans',
    descEN: 'Bachelor 3 years',
    taglineFR:
      'Concevez des espaces sensibles et durables : logement, retail, scénographie, mobilier.',
    taglineEN:
      'Design meaningful, sustainable spaces: housing, retail, scenography, furniture.',
    level: 'bachelor',
    duration: 'P3Y',
  },
  {
    slug: 'communication-digital-design',
    labelFR: 'Communication & Digital',
    labelEN: 'Communication & Digital Design',
    descFR: 'Bachelor 3 ans',
    descEN: 'Bachelor 3 years',
    taglineFR:
      'Branding, direction artistique, UX/UI, motion — le langage visuel de la marque contemporaine.',
    taglineEN:
      'Branding, art direction, UX/UI, motion — the visual language of contemporary brands.',
    level: 'bachelor',
    duration: 'P3Y',
  },
  {
    slug: 'fashion-accessory-design',
    labelFR: 'Mode & Accessoires',
    labelEN: 'Fashion & Accessory Design',
    descFR: 'Bachelor 3 ans',
    descEN: 'Bachelor 3 years',
    taglineFR:
      'Silhouette, matière, défilé. Une école de mode belge ancrée dans le métier et les jurys pros.',
    taglineEN:
      'Silhouette, material, runway. A Belgian fashion school rooted in craft and pro juries.',
    level: 'bachelor',
    duration: 'P3Y',
  },

  // ----------------------------------------------------------------- Masters
  {
    slug: 'interior-architecture-design-master',
    labelFR: 'Interior Architecture 2 ans',
    labelEN: 'Interior Architecture 2 years',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    taglineFR:
      'Approfondissement du Bachelor : recherche, expertise, spécialisation matériaux et scénographie.',
    taglineEN:
      'Deepening after the Bachelor: research, expertise, materials and scenography.',
    level: 'master',
    duration: 'P2Y',
  },
  {
    slug: 'home-living-design',
    labelFR: 'Home & Living Design',
    labelEN: 'Home & Living Design',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    taglineFR:
      'Design produit, mobilier et objet, en lien avec les éditeurs belges et européens.',
    taglineEN:
      'Product design, furniture and objects, connected to Belgian and European editors.',
    level: 'master',
    duration: 'P2Y',
  },
  {
    slug: 'digital-brand-content',
    labelFR: 'Digital Brand Content',
    labelEN: 'Digital Brand Content',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    taglineFR:
      'Direction de contenu, stratégie de marque digitale, écosystème social et éditorial.',
    taglineEN:
      'Content direction, digital brand strategy, social and editorial ecosystem.',
    level: 'master',
    duration: 'P2Y',
  },
  {
    slug: 'image-3d-motion-video-ai',
    labelFR: 'Image 3D · Motion · AI',
    labelEN: 'Image 3D · Motion · AI',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    taglineFR:
      'Image de synthèse, motion design, IA générative, Unreal Engine — nouveaux métiers de l’image.',
    taglineEN:
      '3D rendering, motion design, generative AI, Unreal Engine — new craft of images.',
    level: 'master',
    duration: 'P2Y',
  },
  {
    slug: 'event-management',
    labelFR: 'Event Management',
    labelEN: 'Event Management',
    descFR: 'Master 2 ans',
    descEN: 'Master 2 years',
    taglineFR:
      'Concevoir, produire, opérer des événements culturels et corporate à Bruxelles et à l’international.',
    taglineEN:
      'Design, produce and operate cultural and corporate events in Brussels and abroad.',
    level: 'master',
    duration: 'P2Y',
  },

  // ------------------------------------------------------ Spécialisation
  {
    slug: 'fashion-management',
    labelFR: 'Fashion Management',
    labelEN: 'Fashion Management',
    descFR: 'Spécialisation',
    descEN: 'Specialisation',
    taglineFR:
      'Marketing de la mode, gestion de collection, retail et direction commerciale des maisons.',
    taglineEN:
      'Fashion marketing, collection management, retail and commercial direction.',
    level: 'specialisation',
    duration: 'P1Y',
  },
]

/**
 * Retrouve un programme par son slug. Renvoie undefined si le slug n'est
 * pas dans le catalogue (ex : hubs `/programmes`, `/masters`, ou pages
 * éditoriales comme `/about`).
 */
export function programBySlug(slug: string | undefined | null): Program | undefined {
  if (!slug) return undefined
  return PROGRAMS.find((p) => p.slug === slug)
}

/**
 * Est-ce que ce slug est un programme (pas un hub, pas une page éditoriale) ?
 */
export function isProgramSlug(slug: string | undefined | null): boolean {
  return !!programBySlug(slug)
}
