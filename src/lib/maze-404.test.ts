import { describe, it, expect } from 'vitest'
import {
  MAZE_CELLS,
  MAZE_CENTER,
  MAZE_DOORS,
  MAZE_ROOM,
  MAZE_SIZE,
  WALL,
  hasWall,
} from './maze-404'

/**
 * Ces tests gardent la promesse faite au joueur sur la page 404 : huit portes,
 * une seule mène au centre du « d ». Le labyrinthe étant généré par un script
 * (scripts/generate-maze.py), c'est ici qu'on vérifie que le fichier livré au
 * navigateur tient encore cette promesse après chaque régénération.
 */

type Cell = { x: number; y: number }

const SIDES = [
  { dx: 0, dy: -1, wall: WALL.N },
  { dx: 1, dy: 0, wall: WALL.E },
  { dx: 0, dy: 1, wall: WALL.S },
  { dx: -1, dy: 0, wall: WALL.W },
]

/** Toutes les cases accessibles depuis une case donnée, murs respectés. */
function flood(from: Cell): Set<string> {
  const seen = new Set([`${from.x},${from.y}`])
  const stack: Cell[] = [from]
  while (stack.length) {
    const c = stack.pop()!
    for (const { dx, dy, wall } of SIDES) {
      if (hasWall(c.x, c.y, wall)) continue
      const n = { x: c.x + dx, y: c.y + dy }
      if (n.x < 0 || n.y < 0 || n.x >= MAZE_SIZE || n.y >= MAZE_SIZE) continue
      const k = `${n.x},${n.y}`
      if (seen.has(k)) continue
      seen.add(k)
      stack.push(n)
    }
  }
  return seen
}

describe('le labyrinthe de la 404', () => {
  it('a une grille complète', () => {
    expect(MAZE_CELLS).toHaveLength(MAZE_SIZE * MAZE_SIZE)
  })

  it('a huit portes, toutes sur le pourtour', () => {
    expect(MAZE_DOORS).toHaveLength(8)
    for (const d of MAZE_DOORS) {
      const onEdge =
        d.x === 0 || d.y === 0 || d.x === MAZE_SIZE - 1 || d.y === MAZE_SIZE - 1
      expect(onEdge).toBe(true)
    }
  })

  it('ouvre bien le mur extérieur de chaque porte', () => {
    const outward = { N: WALL.N, E: WALL.E, S: WALL.S, W: WALL.W }
    for (const d of MAZE_DOORS) {
      expect(hasWall(d.x, d.y, outward[d.side])).toBe(false)
    }
  })

  it("n'a aucun mur contradictoire entre deux cases voisines", () => {
    const opposite = [WALL.S, WALL.W, WALL.N, WALL.E]
    for (let y = 0; y < MAZE_SIZE; y++) {
      for (let x = 0; x < MAZE_SIZE; x++) {
        SIDES.forEach(({ dx, dy, wall }, i) => {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= MAZE_SIZE || ny >= MAZE_SIZE) return
          expect(hasWall(x, y, wall)).toBe(hasWall(nx, ny, opposite[i]))
        })
      }
    }
  })

  it('ne laisse qu’une seule porte rejoindre le centre', () => {
    const winners = MAZE_DOORS.filter((d) =>
      flood(d).has(`${MAZE_CENTER},${MAZE_CENTER}`),
    )
    expect(winners).toHaveLength(1)
  })

  it('laisse assez de couloir derrière chaque fausse porte pour y croire', () => {
    // Une fausse porte qui bute sur un mur au bout de trois cases se repère
    // tout de suite. On veut de vrais dédales, pas des placards.
    for (const d of MAZE_DOORS) {
      expect(flood(d).size).toBeGreaterThan(50)
    }
  })

  it('garde la chambre centrale dégagée', () => {
    const half = Math.floor(MAZE_ROOM / 2)
    const reachable = flood({ x: MAZE_CENTER, y: MAZE_CENTER })
    for (let y = MAZE_CENTER - half; y <= MAZE_CENTER + half; y++) {
      for (let x = MAZE_CENTER - half; x <= MAZE_CENTER + half; x++) {
        expect(reachable.has(`${x},${y}`)).toBe(true)
      }
    }
  })
})
