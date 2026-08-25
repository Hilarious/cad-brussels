import { Maze404Page } from '@/components/maze-404-page'

/**
 * La page 404 du site : un labyrinthe à huit portes dont une seule rejoint
 * le centre du « d » du monogramme. Le jeu vit dans un composant client,
 * cette page ne fait que l'accueillir.
 *
 * Next rend `not-found.tsx` sans les paramètres de route, d'où la lecture de
 * la langue dans l'URL, côté client (voir Maze404Page).
 */
export default function NotFound() {
  return <Maze404Page />
}
