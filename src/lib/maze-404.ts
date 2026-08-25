/**
 * Le labyrinthe de la page 404. Fichier généré, ne pas modifier à la main.
 *
 * Huit portes sur le pourtour, une seule rejoint le centre du « d » du
 * monogramme CAD. Les sept autres ouvrent sur de vrais dédales, mais
 * fermés : aucun couloir ne les relie au cœur.
 *
 * Pour le régénérer : `python3 scripts/generate-maze.py`. Le script
 * explique la construction et vérifie, avant d'écrire, qu'une seule
 * porte reste atteignable depuis le centre.
 *
 * La solution n'est volontairement pas publiée ici : le jeu déduit la
 * victoire de la position du pion, jamais d'un chemin pré-calculé. Rien
 * de ce qui part au navigateur ne désigne la bonne porte.
 */

/** Côté de la grille, en cases. */
export const MAZE_SIZE = 21

/** Côté de la chambre centrale, où trône le monogramme. */
export const MAZE_ROOM = 5

/** Coordonnée du centre, en x comme en y : la case d'arrivée. */
export const MAZE_CENTER = 10

/** Bits de mur, dans le sens des aiguilles d'une montre. */
export const WALL = { N: 1, E: 2, S: 4, W: 8 } as const

/**
 * Une valeur par case, lue en lignes (index = y * MAZE_SIZE + x).
 * Chaque valeur est le masque des murs encore debout autour de la case.
 */
export const MAZE_CELLS: number[] = [
  13, 5, 3, 13, 1, 4, 5, 7, 9, 3, 9, 1, 5, 3, 9, 4, 3, 13, 1, 1, 7,
  9, 7, 12, 3, 8, 5, 5, 5, 6, 12, 6, 10, 9, 6, 8, 3, 12, 3, 14, 12, 3,
  8, 3, 9, 6, 12, 3, 9, 7, 9, 5, 5, 6, 12, 3, 14, 12, 3, 10, 9, 5, 2,
  10, 10, 12, 3, 13, 4, 2, 9, 6, 9, 5, 1, 3, 12, 3, 9, 6, 12, 6, 11, 10,
  10, 8, 7, 12, 3, 13, 6, 10, 11, 10, 11, 10, 10, 9, 6, 12, 3, 9, 3, 8, 6,
  2, 12, 5, 3, 12, 5, 5, 6, 8, 4, 6, 10, 10, 10, 13, 1, 6, 10, 14, 10, 9,
  10, 9, 7, 8, 1, 7, 9, 3, 10, 11, 9, 6, 14, 12, 3, 12, 3, 12, 1, 4, 6,
  12, 2, 9, 6, 10, 9, 6, 12, 4, 6, 12, 5, 5, 3, 12, 3, 8, 3, 10, 9, 3,
  13, 6, 10, 9, 6, 12, 5, 3, 9, 1, 1, 1, 3, 8, 7, 10, 14, 10, 14, 10, 10,
  9, 3, 10, 10, 9, 7, 9, 6, 8, 0, 0, 0, 2, 12, 3, 12, 3, 10, 9, 6, 10,
  10, 8, 6, 12, 2, 9, 6, 11, 8, 0, 0, 0, 0, 3, 12, 3, 10, 12, 4, 7, 10,
  10, 14, 9, 3, 14, 12, 3, 10, 8, 0, 0, 0, 2, 10, 11, 12, 6, 9, 5, 3, 10,
  10, 9, 6, 12, 1, 7, 10, 10, 12, 4, 4, 4, 6, 10, 12, 5, 5, 6, 11, 12, 2,
  10, 10, 9, 3, 12, 3, 10, 12, 1, 1, 5, 5, 3, 8, 3, 13, 1, 7, 8, 5, 6,
  10, 10, 10, 12, 3, 10, 12, 3, 14, 10, 9, 5, 6, 14, 12, 3, 12, 3, 12, 5, 3,
  0, 6, 12, 3, 10, 10, 9, 6, 9, 6, 12, 5, 5, 5, 3, 12, 3, 8, 1, 7, 8,
  12, 3, 9, 6, 12, 6, 10, 13, 2, 13, 5, 5, 5, 3, 12, 3, 10, 10, 12, 3, 10,
  9, 6, 10, 9, 5, 3, 12, 3, 12, 1, 5, 5, 3, 10, 9, 6, 10, 12, 3, 10, 10,
  14, 9, 6, 10, 9, 4, 7, 12, 3, 14, 9, 3, 10, 10, 12, 5, 6, 9, 6, 12, 6,
  9, 6, 9, 6, 12, 3, 9, 3, 12, 5, 6, 10, 10, 10, 9, 3, 9, 6, 9, 3, 11,
  12, 5, 4, 5, 7, 8, 6, 12, 5, 5, 7, 12, 6, 12, 6, 8, 4, 5, 6, 12, 6,
]

export type MazeDoor = { x: number; y: number; side: 'N' | 'E' | 'S' | 'W' }

/** Les huit portes, dans le sens horaire en partant du nord. */
export const MAZE_DOORS: MazeDoor[] = [
  { x: 5, y: 0, side: 'N' },
  { x: 15, y: 0, side: 'N' },
  { x: 20, y: 5, side: 'E' },
  { x: 20, y: 15, side: 'E' },
  { x: 5, y: 20, side: 'S' },
  { x: 15, y: 20, side: 'S' },
  { x: 0, y: 5, side: 'W' },
  { x: 0, y: 15, side: 'W' },
]

/** Reste-t-il un mur sur ce côté de cette case ? */
export function hasWall(x: number, y: number, dir: number): boolean {
  return (MAZE_CELLS[y * MAZE_SIZE + x] & dir) !== 0
}
