/**
 * Garde-fou sur les appellations académiques protégées.
 *
 * Le CAD n'est pas autorisé à employer « Bachelor » et « Master » : il
 * dit « Undergraduate » et « Postgraduate ». Le code du site respecte
 * cette règle, mais les libellés de navigation et de pied de page
 * viennent de Payload, donc de la base :
 *
 *  - la base de production porte encore les anciens libellés (elle n'a
 *    pas pu être migrée, cf. POSTGRES_URL manquante) ;
 *  - et rien n'empêche quelqu'un de ressaisir « Master » dans l'admin
 *    un jour, ce qui remettrait l'appellation en ligne sans que
 *    personne s'en aperçoive.
 *
 * D'où cette correction AU RENDU : quelle que soit la valeur stockée,
 * aucune appellation protégée ne peut s'afficher. Le garde-fou reste
 * utile après la migration de la base, c'est sa raison d'être
 * principale : sur une contrainte réglementaire, mieux vaut une règle
 * tenue par le code qu'une consigne de saisie.
 *
 * Ne touche QUE les formes capitalisées, donc l'appellation. Le verbe
 * anglais « to master » et les mots communs comme « masterclass »
 * passent intacts.
 *
 * NOTE : ne corrige pas les adresses de pages. En production, la page
 * du hub a encore le slug `masters` ; réécrire le chemin ici enverrait
 * les visiteurs sur une page inexistante. Les URL se règleront avec la
 * migration de la base.
 */

/** Du plus spécifique au plus général : l'ordre compte. */
const REGLES: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bTous les Masters\b/g, 'Tous les postgraduates'],
  [/\bTous les Bachelors\b/g, 'Tous les undergraduates'],
  [/\bVoir tous les Masters\b/g, 'Voir tous les postgraduates'],
  [/\bVoir tous les Bachelors\b/g, 'Voir tous les undergraduates'],
  [/\bAll Masters\b/g, 'All postgraduates'],
  [/\bAll Bachelors\b/g, 'All undergraduates'],
  [/\bSee all Masters\b/g, 'See all postgraduates'],
  [/\bSee all Bachelors\b/g, 'See all undergraduates'],
  [/\bMasters\b/g, 'Postgraduates'],
  [/\bMaster\b/g, 'Postgraduate'],
  [/\bBachelors\b/g, 'Undergraduates'],
  [/\bBachelor\b/g, 'Undergraduate'],
  // Renommage de programme validé le 25/08/2026
  [/\bHome & Living Design\b/g, 'Furniture & Product Design'],
  [/\bHome & Living\b/g, 'Furniture & Product Design'],
]

/**
 * Corrige un libellé venant du CMS. Renvoie la valeur telle quelle si
 * elle ne contient aucune appellation protégée (cas courant).
 */
export function assainirLibelle<T extends string | null | undefined>(libelle: T): T {
  if (!libelle) return libelle
  let sortie: string = libelle
  for (const [motif, remplacement] of REGLES) {
    if (motif.test(sortie)) sortie = sortie.replace(motif, remplacement)
    motif.lastIndex = 0 // les regex /g gardent un état entre appels
  }
  return sortie as T
}
