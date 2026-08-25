/**
 * Retire la marque « dev » que Payload dépose dans payload_migrations
 * quand une base a été construite par sa création automatique de schéma
 * (mode push, utilisé en développement).
 *
 * Sans ce nettoyage, `payload migrate` détecte cette marque et ouvre une
 * confirmation interactive (« data loss will occur, proceed ? »), qui
 * reste bloquée indéfiniment dans un environnement sans terminal comme
 * le build Vercel : vérifié en situation le 26/08/2026, le processus ne
 * se résout jamais tout seul, il attend une réponse qui ne viendra pas.
 *
 * La marque n'est qu'un indicateur, pas du contenu réel : la retirer ne
 * touche à aucune donnée, elle empêche seulement la question de se poser.
 * Si la table n'existe pas encore (site jamais migré), on ne fait rien.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })

try {
  const exists: any = await payload.db.drizzle.execute(
    "SELECT 1 FROM information_schema.tables WHERE table_name = 'payload_migrations'",
  )
  const rows = exists.rows ?? exists
  if (!rows.length) {
    console.log('[clear-dev-sentinel] table payload_migrations absente, rien à faire.')
  } else {
    const r: any = await payload.db.drizzle.execute(
      'DELETE FROM payload_migrations WHERE batch = -1',
    )
    console.log(`[clear-dev-sentinel] marque dev retirée (${r.rowCount ?? 0} ligne(s)).`)
  }
} catch (err) {
  console.log('[clear-dev-sentinel] avertissement, on continue :', (err as Error).message)
}
process.exit(0)
