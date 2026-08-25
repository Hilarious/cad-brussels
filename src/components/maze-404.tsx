'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  MAZE_CENTER,
  MAZE_DOORS,
  MAZE_ROOM,
  MAZE_SIZE,
  WALL,
  hasWall,
} from '@/lib/maze-404'

/**
 * Le jeu de la page 404.
 *
 * Huit portes, une seule rejoint le centre du « d ». Le joueur choisit sa
 * porte, puis avance case par case au clavier, au doigt ou au pavé tactile.
 *
 * Le composant ne connaît pas la solution : il ne sait qu'une chose, la
 * position du pion, et déclare la victoire quand elle atteint le centre. La
 * géométrie du labyrinthe fait le reste (voir scripts/generate-maze.py).
 */

// ─── Géométrie du dessin ────────────────────────────────────────────────
const CELL = 24
const BOARD = MAZE_SIZE * CELL // 504
const MARGIN = 20 // marge extérieure, pour les marqueurs de porte

// Le monogramme est calé pour que son contre-point, le petit disque du « d »,
// tombe exactement sur la case d'arrivée. Ces deux ratios ont été mesurés sur
// le fichier d'origine : le centre du disque est à 57,29 % de la largeur et
// 49,94 % de la hauteur.
const HOLE_X = 0.5729
const HOLE_Y = 0.4994
const LOGO_RATIO = 1626 / 1420
const LOGO_W = MAZE_ROOM * CELL - 16
const LOGO_H = LOGO_W * LOGO_RATIO
const GOAL_PX = (MAZE_CENTER + 0.5) * CELL
const LOGO_X = GOAL_PX - HOLE_X * LOGO_W
const LOGO_Y = GOAL_PX - HOLE_Y * LOGO_H

type Point = { x: number; y: number }

/**
 * Toute la partie tient dans un seul état, mis à jour par une fonction pure.
 * La découper en quatre `useState` obligeait `move` à en modifier plusieurs
 * depuis l'updater du chemin : React ne garantit pas l'ordre dans ce cas, et
 * deux touches pressées coup sur coup en perdaient une au passage.
 */
type Game = {
  path: Point[] // les cases parcourues, de la porte au pion
  steps: number
  won: boolean
  tried: number // portes essayées depuis l'arrivée sur la page
}

const EMPTY: Game = { path: [], steps: 0, won: false, tried: 0 }

const MOVES: Record<string, { dx: number; dy: number; wall: number }> = {
  up: { dx: 0, dy: -1, wall: WALL.N },
  right: { dx: 1, dy: 0, wall: WALL.E },
  down: { dx: 0, dy: 1, wall: WALL.S },
  left: { dx: -1, dy: 0, wall: WALL.W },
}

// Clavier : flèches, WASD (qwerty) et ZQSD (azerty).
const KEYS: Record<string, keyof typeof MOVES> = {
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  w: 'up',
  z: 'up',
  d: 'right',
  s: 'down',
  a: 'left',
  q: 'left',
}

const T = {
  fr: {
    kicker: 'Erreur 404',
    title: 'Vous voilà perdu.',
    lead:
      'Cette page n’existe pas, ou plus. Puisque vous êtes là : huit portes, un seul chemin jusqu’au cœur du « d ». Les sept autres tournent en rond.',
    pick: 'Choisissez une porte pour entrer.',
    steps: 'pas',
    doors: 'portes essayées',
    retry: 'Changer de porte',
    hint:
      'Une seule des huit portes rejoint le centre. Si vous tournez en rond, c’est que ce n’était pas la bonne.',
    wonTitle: 'Vous y êtes.',
    wonLead: 'Le cœur du « d ». Sept portes sur huit ne menaient nulle part.',
    prizeKicker: 'Et vous avez gagné quelque chose',
    prizeTitle: 'Un café avec le directeur.',
    prizeLead:
      'Eric Vanden Broeck, directeur du CAD, vous offre un café dans le jardin de l’école. Une demi-heure pour parler de votre projet, sans dossier à préparer et sans engagement.',
    prizeClaim: 'Réclamer mon café',
    prizeNote:
      'Écrivez-nous, votre message part déjà rempli avec votre score. Offre valable une fois par personne.',
    home: 'Retour à l’accueil',
    contact: 'Nous écrire',
    controls: 'Flèches du clavier, ZQSD, ou le pavé ci-dessous.',
    doorLabel: (n: number) => `Entrer par la porte ${n}`,
    boardLabel:
      'Labyrinthe : huit portes sur le pourtour, une seule mène au centre du monogramme CAD.',
    up: 'Haut',
    down: 'Bas',
    left: 'Gauche',
    right: 'Droite',
  },
  en: {
    kicker: 'Error 404',
    title: 'You are lost.',
    lead:
      'This page does not exist, or no longer does. While you are here: eight doors, one single path to the heart of the “d”. The other seven go nowhere.',
    pick: 'Pick a door to step in.',
    steps: 'steps',
    doors: 'doors tried',
    retry: 'Try another door',
    hint:
      'Only one of the eight doors reaches the centre. If you are going in circles, this was not the one.',
    wonTitle: 'You made it.',
    wonLead: 'The heart of the “d”. Seven doors out of eight led nowhere.',
    prizeKicker: 'And you have won something',
    prizeTitle: 'A coffee with the director.',
    prizeLead:
      'Eric Vanden Broeck, director of CAD, is buying you a coffee in the school garden. Half an hour to talk about your project, no portfolio to prepare, no strings attached.',
    prizeClaim: 'Claim my coffee',
    prizeNote:
      'Write to us, your message comes pre-filled with your score. One coffee per person.',
    home: 'Back to home',
    contact: 'Get in touch',
    controls: 'Arrow keys, WASD, or the pad below.',
    doorLabel: (n: number) => `Enter through door ${n}`,
    boardLabel:
      'Maze: eight doors around the edge, only one reaches the centre of the CAD monogram.',
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right',
  },
}

/** Tous les murs encore debout, en un seul tracé. */
function buildWalls(): string {
  const seg: string[] = []
  for (let y = 0; y < MAZE_SIZE; y++) {
    for (let x = 0; x < MAZE_SIZE; x++) {
      const px = x * CELL
      const py = y * CELL
      // On ne dessine que le nord et l'ouest de chaque case : le sud d'une case
      // est le nord de sa voisine. Les deux bords manquants sont rattrapés sur
      // la dernière ligne et la dernière colonne.
      if (hasWall(x, y, WALL.N)) seg.push(`M${px} ${py}h${CELL}`)
      if (hasWall(x, y, WALL.W)) seg.push(`M${px} ${py}v${CELL}`)
      if (y === MAZE_SIZE - 1 && hasWall(x, y, WALL.S))
        seg.push(`M${px} ${py + CELL}h${CELL}`)
      if (x === MAZE_SIZE - 1 && hasWall(x, y, WALL.E))
        seg.push(`M${px + CELL} ${py}v${CELL}`)
    }
  }
  return seg.join('')
}

/** Le marqueur d'une porte : sa pointe, et la case où le pion se posera. */
function doorGeometry(door: (typeof MAZE_DOORS)[number]) {
  const cx = (door.x + 0.5) * CELL
  const cy = (door.y + 0.5) * CELL
  const out = CELL * 0.62
  switch (door.side) {
    case 'N':
      return { x: cx, y: -out, rotate: 90 }
    case 'S':
      return { x: cx, y: BOARD + out, rotate: -90 }
    case 'W':
      return { x: -out, y: cy, rotate: 0 }
    default:
      return { x: BOARD + out, y: cy, rotate: 180 }
  }
}

export function Maze404({ locale }: { locale: 'fr' | 'en' }) {
  const t = T[locale]
  const walls = useMemo(buildWalls, [])
  const doors = useMemo(() => MAZE_DOORS.map(doorGeometry), [])

  const [game, setGame] = useState<Game>(EMPTY)
  const boardRef = useRef<SVGSVGElement>(null)

  const { path, steps, won, tried } = game
  const pos = path.length ? path[path.length - 1] : null
  const playing = pos !== null && !won

  const enter = useCallback((door: (typeof MAZE_DOORS)[number]) => {
    setGame((g) => ({
      path: [{ x: door.x, y: door.y }],
      steps: 0,
      won: false,
      tried: g.tried + 1,
    }))
  }, [])

  const reset = useCallback(() => {
    setGame((g) => ({ ...EMPTY, tried: g.tried }))
  }, [])

  const move = useCallback((dir: keyof typeof MOVES) => {
    setGame((g) => {
      if (!g.path.length || g.won) return g
      const cur = g.path[g.path.length - 1]
      const { dx, dy, wall } = MOVES[dir]
      if (hasWall(cur.x, cur.y, wall)) return g

      const next = { x: cur.x + dx, y: cur.y + dy }
      if (next.x < 0 || next.y < 0 || next.x >= MAZE_SIZE || next.y >= MAZE_SIZE)
        return g

      // Revenir sur ses pas efface la trace au lieu de la doubler.
      const before = g.path[g.path.length - 2]
      const path =
        before && before.x === next.x && before.y === next.y
          ? g.path.slice(0, -1)
          : [...g.path, next]

      return {
        ...g,
        path,
        steps: g.steps + 1,
        won: next.x === MAZE_CENTER && next.y === MAZE_CENTER,
      }
    })
  }, [])

  // Clavier. On n'écoute que pendant la partie, et on retient le défilement
  // de la page : les flèches appartiennent au jeu tant qu'il est en cours.
  useEffect(() => {
    if (!playing) return
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS[e.key] ?? KEYS[e.key.toLowerCase()]
      if (!dir) return
      e.preventDefault()
      move(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playing, move])

  // Doigt : un glissé dans une direction vaut un pas.
  useEffect(() => {
    const el = boardRef.current
    if (!el || !playing) return
    let from: { x: number; y: number } | null = null
    const start = (e: TouchEvent) => {
      const p = e.touches[0]
      from = { x: p.clientX, y: p.clientY }
    }
    const end = (e: TouchEvent) => {
      if (!from) return
      const p = e.changedTouches[0]
      const dx = p.clientX - from.x
      const dy = p.clientY - from.y
      from = null
      if (Math.hypot(dx, dy) < 24) return
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left')
      else move(dy > 0 ? 'down' : 'up')
    }
    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('touchend', end, { passive: true })
    return () => {
      el.removeEventListener('touchstart', start)
      el.removeEventListener('touchend', end)
    }
  }, [playing, move])

  const trace = path.map((p) => `${(p.x + 0.5) * CELL},${(p.y + 0.5) * CELL}`).join(' ')

  return (
    <div className="container py-10 md:py-20">
      {/* Trois blocs : le titre, le plateau, puis le reste du texte. Sur
          mobile ils s'empilent dans cet ordre, pour que le labyrinthe arrive
          juste sous le titre plutôt qu'au bout d'un long paragraphe. À partir
          de `lg`, le plateau passe à droite sur deux rangées et les deux blocs
          de texte se retrouvent l'un sous l'autre à sa gauche. */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:gap-y-6">
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="text-xs uppercase tracking-widest text-accent">
            {t.kicker}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            {won ? t.wonTitle : t.title}
          </h1>
        </div>

        {/* ─── Le labyrinthe ────────────────────────────────────── */}
        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <svg
            ref={boardRef}
            viewBox={`${-MARGIN} ${-MARGIN} ${BOARD + MARGIN * 2} ${BOARD + MARGIN * 2}`}
            className="mx-auto block w-full max-w-[560px] touch-none select-none"
            role="img"
            aria-label={t.boardLabel}
          >
            {/* Les murs. */}
            <path
              d={walls}
              fill="none"
              stroke="rgb(var(--ink))"
              strokeWidth={2}
              strokeLinecap="square"
            />

            {/* Le monogramme, au cœur. Filigrane tant que la partie dure. */}
            <image
              href="/logo/cad-monogram.png"
              x={LOGO_X}
              y={LOGO_Y}
              width={LOGO_W}
              height={LOGO_H}
              opacity={won ? 1 : 0.16}
              style={{ transition: 'opacity .6s ease' }}
            />

            {/* La case d'arrivée : le contre-point du « d ». */}
            <circle
              cx={GOAL_PX}
              cy={GOAL_PX}
              r={CELL * 0.3}
              fill={won ? 'rgb(var(--accent))' : 'none'}
              stroke="rgb(var(--accent))"
              strokeWidth={2}
              opacity={won ? 1 : 0.5}
            />

            {/* Les huit portes. Cliquables tant que le pion n'est pas entré. */}
            {doors.map((g, i) => (
              <g key={i} transform={`translate(${g.x} ${g.y}) rotate(${g.rotate})`}>
                <path
                  d={`M${-CELL * 0.18} ${-CELL * 0.26}L${CELL * 0.16} 0L${-CELL * 0.18} ${CELL * 0.26}`}
                  fill="none"
                  stroke="rgb(var(--accent))"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={pos ? 0.3 : 1}
                  style={{ transition: 'opacity .3s ease' }}
                />
                {!pos && (
                  // Zone de clic généreuse : le chevron seul ne ferait que
                  // 21 px de côté sur un téléphone, sous le minimum tactile.
                  // Les portes sont assez éloignées pour que ces carrés ne se
                  // chevauchent jamais.
                  <rect
                    x={-CELL * 1.4}
                    y={-CELL * 1.4}
                    width={CELL * 2.8}
                    height={CELL * 2.8}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={() => enter(MAZE_DOORS[i])}
                    role="button"
                    tabIndex={0}
                    aria-label={t.doorLabel(i + 1)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        enter(MAZE_DOORS[i])
                      }
                    }}
                  />
                )}
              </g>
            ))}

            {/* La trace parcourue, puis le pion. */}
            {path.length > 1 && (
              <polyline
                points={trace}
                fill="none"
                stroke="rgb(var(--accent))"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.35}
              />
            )}
            {pos && (
              <circle
                cx={(pos.x + 0.5) * CELL}
                cy={(pos.y + 0.5) * CELL}
                r={CELL * 0.26}
                fill="rgb(var(--accent))"
                style={{ transition: 'cx .09s linear, cy .09s linear' }}
              />
            )}
          </svg>

          {/* Pavé directionnel, pour le tactile et la souris. */}
          {playing && (
            <div className="mx-auto mt-6 grid w-[168px] grid-cols-3 gap-2 lg:hidden">
              <span />
              <PadButton label={t.up} onPress={() => move('up')}>↑</PadButton>
              <span />
              <PadButton label={t.left} onPress={() => move('left')}>←</PadButton>
              <PadButton label={t.down} onPress={() => move('down')}>↓</PadButton>
              <PadButton label={t.right} onPress={() => move('right')}>→</PadButton>
            </div>
          )}
        </div>

        {/* ─── Le reste du texte, et les portes de sortie ────────── */}
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-md text-ink/70">{won ? t.wonLead : t.lead}</p>

          {/* ── La récompense ────────────────────────────────────────
              Un café avec le directeur. Le bouton ouvre un message déjà
              rempli vers le secrétariat, avec le score en preuve : sans
              ce lien, la récompense ne serait qu'une phrase que
              personne ne saurait réclamer.
              À valider avec Eric Vanden Broeck avant mise en ligne
              publique : la page engage son agenda. */}
          {won && (
            <div className="mt-8 max-w-md rounded-2xl border-2 border-accent bg-accent/5 p-6">
              <p className="text-xs uppercase tracking-widest text-accent">
                {t.prizeKicker}
              </p>
              <p className="mt-2 font-display text-2xl leading-snug">
                {t.prizeTitle}
              </p>
              <p className="mt-3 text-sm text-ink/70">{t.prizeLead}</p>
              <a
                href={`mailto:secretariat@cad.be?subject=${encodeURIComponent(
                  locale === 'fr'
                    ? 'Labyrinthe 404 : je réclame mon café'
                    : 'Maze 404: claiming my coffee',
                )}&body=${encodeURIComponent(
                  locale === 'fr'
                    ? `Bonjour,\n\nJ'ai trouvé le centre du « d » sur votre page 404, en ${steps} pas et ${tried} porte(s) essayée(s).\n\nJe viens réclamer le café avec Eric Vanden Broeck.\n\nMon prénom et nom :\nMon téléphone :\nCe qui m'intéresse au CAD :\n\nMerci !`
                    : `Hello,\n\nI found the heart of the "d" on your 404 page, in ${steps} steps and ${tried} door(s) tried.\n\nI am here to claim the coffee with Eric Vanden Broeck.\n\nMy name:\nMy phone:\nWhat interests me at CAD:\n\nThank you!`,
                )}`}
                className="tap mt-5 inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-accent"
              >
                {t.prizeClaim}
              </a>
              <p className="mt-3 text-xs text-ink/55">{t.prizeNote}</p>
            </div>
          )}

          {!won && (
            <p className="mt-6 text-sm text-ink/60">
              {pos ? t.controls : t.pick}
            </p>
          )}

          {pos && !won && (
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="tabular-nums text-ink/60">
                <strong className="text-ink">{steps}</strong> {t.steps}
              </span>
              <span className="tabular-nums text-ink/60">
                <strong className="text-ink">{tried}</strong> {t.doors}
              </span>
              <button
                type="button"
                onClick={reset}
                className="tap underline underline-offset-4 hover:text-accent"
              >
                {t.retry}
              </button>
            </div>
          )}

          {steps > 70 && !won && (
            <p className="mt-6 max-w-md border-l-2 border-accent pl-4 text-sm text-ink/60">
              {t.hint}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/${locale}`}
              className="tap inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-accent"
            >
              {t.home}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="tap inline-flex items-center rounded-full border border-ink px-6 py-3 text-sm hover:border-accent hover:text-accent"
            >
              {t.contact}
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

function PadButton({
  label,
  onPress,
  children,
}: {
  label: string
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="tap flex h-12 items-center justify-center rounded-lg border border-ink/20 text-lg hover:border-accent hover:text-accent active:bg-accent active:text-paper"
    >
      {children}
    </button>
  )
}
