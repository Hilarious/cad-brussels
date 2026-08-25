/**
 * Géométrie du regard de l'œil du parcours d'études.
 *
 * Le dessin : globe de rayon 50 centré en (52, 52), pupille blanche de
 * rayon 15 dessinée en (63, 41). Elle est donc DÉCALÉE de 11 unités à
 * droite et 11 vers le haut, soit 15,6 unités du centre : au repos,
 * l'œil regarde déjà en haut à droite. C'est le parti pris graphique,
 * on le garde.
 *
 * Le piège que ce décalage tend, et qui a été corrigé ici : borner le
 * DÉPLACEMENT (l'ancien `Math.min(dist / 40, 7)`) produit un mouvement
 * mathématiquement symétrique mais visuellement faux. Vers la droite la
 * pupille s'éloigne encore du centre et le geste saute aux yeux ; vers
 * la gauche elle ne fait que revenir au centre sans jamais le dépasser,
 * ce qui se lit comme une simple remise en place, pas comme un regard.
 *
 * La correction : on ne borne plus le déplacement, on calcule la
 * position VISÉE dans le globe, mesurée depuis son centre. La course
 * vers la gauche et le bas devient naturellement plus ample que vers la
 * droite et le haut, puisqu'on part d'un repos décalé en haut à droite,
 * et l'œil traverse réellement pour regarder les blocs de gauche.
 *
 * Marge disponible : le centre de la pupille peut s'écarter jusqu'à
 * 50 - 15 = 35 unités du centre sans que le blanc déborde du globe.
 * COURSE reste sous cette limite avec une marge confortable.
 */

/** Centre du globe, en unités du viewBox. */
export const CENTRE = 52
/** Rayon du globe. */
export const RAYON_GLOBE = 50
/** Rayon de la pupille blanche. */
export const RAYON_PUPILLE = 15
/** Position de repos de la pupille, telle que dessinée dans le SVG. */
export const REPOS = { x: 63, y: 41 } as const
/**
 * Écart maximal du centre de la pupille au centre du globe.
 * Plafond géométrique : 35. On s'arrête à 24, ce qui laisse 11 unités
 * de marge et garde un œil expressif sans devenir cartoonesque.
 */
export const COURSE = 24
/**
 * Distance du curseur (en pixels) à laquelle la course est déjà pleine.
 * Au-delà, l'œil regarde à fond dans la direction du curseur.
 */
export const DISTANCE_PLEINE_COURSE = 40

/**
 * Translation à appliquer au groupe de la pupille pour qu'elle regarde
 * un curseur situé à (dx, dy) du centre de l'œil, en pixels écran.
 *
 * Renvoie des unités du viewBox, à passer tel quel à `transform`.
 */
export function regardVers(dx: number, dy: number): { x: number; y: number } {
  const distance = Math.hypot(dx, dy)
  if (distance === 0) return { x: 0, y: 0 }

  // Position visée dans le globe, depuis son centre.
  const portee = Math.min(distance / DISTANCE_PLEINE_COURSE, 1) * COURSE
  const viseX = (dx / distance) * portee
  const viseY = (dy / distance) * portee

  // Le SVG translate la pupille depuis sa position dessinée, pas depuis
  // le centre : on retire donc son décalage de repos.
  return {
    x: viseX - (REPOS.x - CENTRE),
    y: viseY - (REPOS.y - CENTRE),
  }
}

/**
 * Distance entre le centre de la pupille et celui du globe une fois la
 * translation appliquée. Sert à vérifier que la pupille ne déborde
 * jamais : doit rester sous `RAYON_GLOBE - RAYON_PUPILLE`.
 */
export function ecartDuCentre(translation: { x: number; y: number }): number {
  return Math.hypot(
    REPOS.x + translation.x - CENTRE,
    REPOS.y + translation.y - CENTRE,
  )
}
