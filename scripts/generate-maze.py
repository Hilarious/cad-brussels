#!/usr/bin/env python3
"""Génère le labyrinthe de la page 404, dans src/lib/maze-404.ts.

Contrainte de départ : huit portes sur le pourtour, une seule mène au
centre du « d » du monogramme CAD.

Méthode. On construit d'abord un labyrinthe parfait, c'est à dire un
arbre couvrant : entre deux cases quelconques, il existe un chemin et
un seul. On élit ensuite comme bonne porte celle dont le trajet vers le
centre est le plus long, puis, pour chacune des sept autres, on coupe
l'arête par laquelle sa branche rejoint le trajet gagnant. La branche
entière se détache : elle reste un vrai dédale, avec ses embranchements
et ses impasses, mais plus aucun couloir ne la relie au cœur. Le trajet
gagnant, lui, n'est jamais touché.

Un parcours final depuis le centre vérifie qu'une seule porte demeure
atteignable. Sans cette vérification, rien ne garantirait la promesse
faite au joueur.

Usage, depuis la racine du projet :

    python3 scripts/generate-maze.py
"""
import json
import random

N = 21          # côté de la grille, en cases
ROOM = 5        # côté de la chambre centrale : le monogramme y tient en entier

# Graine figée : le labyrinthe est le même pour tout le monde. Celle-ci a été
# retenue après balayage parce qu'elle donne un long trajet gagnant (138 cases)
# et aucune fausse région trop petite : la plus courte fait encore 107 cases,
# de quoi y croire un bon moment avant de comprendre qu'on s'est trompé de porte.
random.seed(209)

C = N // 2
room = {(x, y) for y in range(C - ROOM // 2, C + ROOM // 2 + 1)
               for x in range(C - ROOM // 2, C + ROOM // 2 + 1)}

N_, E_, S_, W_ = 1, 2, 4, 8
DIRS = [(0, -1, N_, S_), (1, 0, E_, W_), (0, 1, S_, N_), (-1, 0, W_, E_)]

walls = {(x, y): 15 for y in range(N) for x in range(N)}
adj = {c: set() for c in walls}


def carve(a, b, da, db):
    """Ouvre le mur entre deux cases voisines."""
    walls[a] &= ~da
    walls[b] &= ~db
    adj[a].add(b)
    adj[b].add(a)


# 1. Labyrinthe parfait sur tout ce qui n'est pas la chambre centrale.
start = (0, 0)
seen = {start}
stack = [start]
while stack:
    x, y = stack[-1]
    opts = []
    for dx, dy, da, db in DIRS:
        nx, ny = x + dx, y + dy
        if 0 <= nx < N and 0 <= ny < N and (nx, ny) not in room and (nx, ny) not in seen:
            opts.append((nx, ny, da, db))
    if not opts:
        stack.pop()
        continue
    nx, ny, da, db = random.choice(opts)
    carve((x, y), (nx, ny), da, db)
    seen.add((nx, ny))
    stack.append((nx, ny))
assert len(seen) == N * N - len(room), "labyrinthe incomplet"

# 2. La chambre est dégagée à l'intérieur, et n'a qu'une seule porte.
for (x, y) in room:
    for dx, dy, da, db in DIRS:
        n = (x + dx, y + dy)
        if n in room:
            walls[(x, y)] &= ~da
            adj[(x, y)].add(n)

door_cells = [(x, y) for (x, y) in room
              if x in (C - ROOM // 2, C + ROOM // 2) or y in (C - ROOM // 2, C + ROOM // 2)]
door = random.choice(door_cells)
opts = []
for dx, dy, da, db in DIRS:
    n = (door[0] + dx, door[1] + dy)
    if 0 <= n[0] < N and 0 <= n[1] < N and n not in room:
        opts.append((n, da, db))
outside, da, db = random.choice(opts)
carve(door, outside, da, db)

# 3. Huit positions de porte, deux par côté. Elles restent provisoires : une
#    porte posée pile sur le trajet gagnant ne pourrait pas être coupée, on la
#    fait alors glisser le long du bord.
q = N // 4
CAND = [
    ('N', N_, lambda t: (t, 0)),
    ('E', E_, lambda t: (N - 1, t)),
    ('S', S_, lambda t: (t, N - 1)),
    ('W', W_, lambda t: (0, t)),
]
slots = []
for side, da, at in CAND:
    for t in (q, N - 1 - q):
        slots.append({'side': side, 'dir': da, 'at': at, 't': t})


def path_to_center(src):
    """Le chemin unique de src au centre, ou None si la case en est détachée."""
    prev, stack = {src: None}, [src]
    while stack:
        c = stack.pop()
        if c == (C, C):
            out = []
            while c is not None:
                out.append(c)
                c = prev[c]
            return out[::-1]
        for n in adj[c]:
            if n not in prev:
                prev[n] = c
                stack.append(n)
    return None


# 4. La bonne porte est celle dont le trajet vers le centre est le plus long.
paths = {i: path_to_center(sl['at'](sl['t'])) for i, sl in enumerate(slots)}
correct = max(paths, key=lambda i: len(paths[i]))
winning = paths[correct]
on_path = set(winning)


def cut(p):
    """Détache la branche qui porte cette porte, sans toucher au trajet gagnant.

    Renvoie False si la porte est elle-même posée sur le trajet gagnant : il
    n'y a alors rien à couper qui ne casserait pas la solution.
    """
    child = None
    for cell in p:
        if cell in on_path:
            break
        child = cell
    if child is None:
        return False
    parent = p[p.index(child) + 1]
    for dx, dy, da, db in DIRS:
        if (child[0] + dx, child[1] + dy) == parent:
            walls[child] |= da
            walls[parent] |= db
            adj[child].discard(parent)
            adj[parent].discard(child)
    return True


# 5. On coupe les sept autres branches.
taken = {slots[correct]['at'](slots[correct]['t'])}
for i, sl in enumerate(slots):
    if i == correct:
        continue
    for shift in [0, 1, -1, 2, -2, 3, -3, 4, -4]:
        t = sl['t'] + shift
        if not (2 <= t <= N - 3):
            continue
        cell = sl['at'](t)
        if cell in taken:
            continue
        pth = path_to_center(cell)
        # pth vaut None quand la case appartient déjà à une région détachée par
        # une coupe précédente : elle fait alors une fausse porte idéale.
        if pth is not None and not cut(pth):
            continue
        sl['t'] = t
        taken.add(cell)
        break
    else:
        raise SystemExit(f"aucune position coupable pour la porte {i}")

entries = []
for sl in slots:
    x, y = sl['at'](sl['t'])
    walls[(x, y)] &= ~sl['dir']
    entries.append({'x': x, 'y': y, 'side': sl['side']})

# 6. Vérifications. La promesse du jeu tient à ces trois assertions.
seen, stack = {(C, C)}, [(C, C)]
while stack:
    c = stack.pop()
    for n in adj[c]:
        if n not in seen:
            seen.add(n)
            stack.append(n)
reachable = [i for i, e in enumerate(entries) if (e['x'], e['y']) in seen]
assert reachable == [correct], f"portes atteignables depuis le centre : {reachable}"
assert path_to_center((entries[correct]['x'], entries[correct]['y'])) is not None

for (x, y) in walls:
    for dx, dy, da, db in DIRS:
        n = (x + dx, y + dy)
        if 0 <= n[0] < N and 0 <= n[1] < N:
            assert bool(walls[(x, y)] & da) == bool(walls[n] & db), f"mur asymétrique en {(x, y)}"


def region(src):
    """Nombre de cases accessibles depuis cette porte."""
    s, st = {src}, [src]
    while st:
        c = st.pop()
        for n in adj[c]:
            if n not in s:
                s.add(n)
                st.append(n)
    return len(s)


sizes = {i: region((e['x'], e['y'])) for i, e in enumerate(entries)}
print(f"bonne porte : {correct} {entries[correct]}, trajet de {len(winning)} cases")
print("cases accessibles par porte :", sizes)

rows = "\n".join(
    "  " + ", ".join(str(walls[(x, y)]) for x in range(N)) + ","
    for y in range(N)
)
doors = ",\n".join(
    f"  {{ x: {e['x']}, y: {e['y']}, side: '{e['side']}' }}" for e in entries
)

TS = f'''/**
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
export const MAZE_SIZE = {N}

/** Côté de la chambre centrale, où trône le monogramme. */
export const MAZE_ROOM = {ROOM}

/** Coordonnée du centre, en x comme en y : la case d'arrivée. */
export const MAZE_CENTER = {C}

/** Bits de mur, dans le sens des aiguilles d'une montre. */
export const WALL = {{ N: 1, E: 2, S: 4, W: 8 }} as const

/**
 * Une valeur par case, lue en lignes (index = y * MAZE_SIZE + x).
 * Chaque valeur est le masque des murs encore debout autour de la case.
 */
export const MAZE_CELLS: number[] = [
{rows}
]

export type MazeDoor = {{ x: number; y: number; side: 'N' | 'E' | 'S' | 'W' }}

/** Les huit portes, dans le sens horaire en partant du nord. */
export const MAZE_DOORS: MazeDoor[] = [
{doors},
]

/** Reste-t-il un mur sur ce côté de cette case ? */
export function hasWall(x: number, y: number, dir: number): boolean {{
  return (MAZE_CELLS[y * MAZE_SIZE + x] & dir) !== 0
}}
'''

with open('src/lib/maze-404.ts', 'w', encoding='utf-8') as f:
    f.write(TS)
print("écrit : src/lib/maze-404.ts")
