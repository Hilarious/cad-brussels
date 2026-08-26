/**
 * Copie du français vers l'anglais, champ par champ, sans jamais écraser.
 *
 * Le problème résolu : dans l'admin, chaque langue a son onglet. Traduire
 * une page demande de basculer de l'un à l'autre pour chaque champ, en
 * cherchant à l'aveugle lesquels sont encore vides. Le remède est de
 * partir de champs remplis, quitte à les corriger, plutôt que de champs
 * vides.
 *
 * ── La règle qui rend l'opération sûre ─────────────────────────────
 * On ne remplit QUE ce qui est vide côté anglais. Jamais de
 * remplacement. Sans cette règle, une correction faite à la main
 * disparaîtrait au prochain appui sur le bouton, ce qui serait pire que
 * la friction de départ.
 *
 * Volontairement PAS de traduction automatique ici. Une machine qui
 * traduit « premier cycle » vers l'anglais a toutes les chances de
 * produire « Bachelor », soit exactement l'appellation que le CAD n'a
 * pas le droit d'employer. La copie, elle, ne peut rien inventer.
 * Si l'on ajoute un jour la traduction, sa sortie devra passer par
 * `assainirLibelle()` de `src/lib/appellations.ts`.
 */

/** Champs techniques ou d'identité qu'une copie ne doit jamais toucher. */
const CLES_IGNOREES = new Set([
  'id',
  'createdAt',
  'updatedAt',
  '_status',
  // Adresses de pages : une URL anglaise n'est pas une URL française, et
  // recopier un slug créerait deux pages à la même adresse.
  'slug',
  'path',
  'url',
  'href',
  // Champs de fichiers, gérés par Payload lui-même.
  'filename',
  'mimeType',
  'filesize',
  'width',
  'height',
  'sizes',
  'thumbnailURL',
  'focalX',
  'focalY',
])

function estObjetSimple(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Un document de texte riche Lexical réduit à un paragraphe vide. */
function estTexteRicheVide(v: Record<string, unknown>): boolean {
  const racine = v.root as { children?: unknown[] } | undefined
  if (!racine || !Array.isArray(racine.children)) return true
  return racine.children.every((noeud) => {
    const n = noeud as { children?: unknown[] }
    if (!Array.isArray(n.children)) return true
    return n.children.every((enfant) => {
      const e = enfant as { text?: string }
      return typeof e.text !== 'string' || e.text.trim() === ''
    })
  })
}

export function estVide(v: unknown): boolean {
  if (v === null || v === undefined) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  if (estObjetSimple(v)) {
    if ('root' in v) return estTexteRicheVide(v)
    return Object.keys(v).length === 0
  }
  return false
}

export type ResultatFusion = {
  /** Uniquement les champs à écrire. Vide si rien à faire. */
  correctif: Record<string, unknown>
  /** Nombre de champs remplis, pour le retour à l'éditeur. */
  remplis: number
  /** Chemins remplis, pour le journal et la vérification. */
  chemins: string[]
}

/**
 * Compare le document français au document anglais et renvoie le
 * correctif à appliquer sur l'anglais.
 *
 * Trois comportements, dans cet ordre :
 *  - anglais vide et français rempli  → on copie
 *  - les deux sont des objets remplis → on descend d'un niveau
 *  - anglais rempli                   → on ne touche à rien
 *
 * Cas des listes : si l'anglais a déjà des lignes, on n'y touche pas du
 * tout, même partiellement. Fusionner ligne à ligne supposerait que les
 * deux langues ont le même nombre de lignes dans le même ordre, ce que
 * rien ne garantit dès qu'un éditeur en a ajouté ou déplacé une.
 */
export function fusionnerVersAnglais(
  fr: Record<string, unknown> | null | undefined,
  en: Record<string, unknown> | null | undefined,
  prefixe = '',
): ResultatFusion {
  const correctif: Record<string, unknown> = {}
  const chemins: string[] = []

  for (const [cle, valeurFr] of Object.entries(fr ?? {})) {
    if (CLES_IGNOREES.has(cle)) continue
    if (estVide(valeurFr)) continue

    const chemin = prefixe ? `${prefixe}.${cle}` : cle
    const valeurEn = (en ?? {})[cle]

    if (estVide(valeurEn)) {
      correctif[cle] = valeurFr
      chemins.push(chemin)
      continue
    }

    // Deux objets remplis : on descend, sauf le texte riche qui se
    // traite d'un bloc (descendre dans un arbre Lexical n'aurait pas de
    // sens, ses clés sont de la structure, pas des champs).
    if (
      estObjetSimple(valeurFr) &&
      estObjetSimple(valeurEn) &&
      !('root' in valeurFr)
    ) {
      const sous = fusionnerVersAnglais(valeurFr, valeurEn, chemin)
      if (sous.remplis > 0) {
        correctif[cle] = { ...valeurEn, ...sous.correctif }
        chemins.push(...sous.chemins)
      }
    }
  }

  return { correctif, remplis: chemins.length, chemins }
}
