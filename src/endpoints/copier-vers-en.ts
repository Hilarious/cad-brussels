import type { Endpoint, PayloadRequest } from 'payload'
import { fusionnerVersAnglais } from '@/lib/copie-locale'

/**
 * Remplit la version anglaise d'un document à partir du français, pour
 * les seuls champs encore vides. Voir `src/lib/copie-locale.ts` pour la
 * règle de fusion et sa justification.
 *
 * Réservé aux utilisateurs connectés à l'admin : la copie écrit dans le
 * contenu publié.
 */
export const copierVersEn: Endpoint = {
  path: '/copier-vers-en',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ erreur: 'Connexion requise.' }, { status: 401 })
    }

    let corps: { collection?: string; id?: string | number; global?: string }
    try {
      corps = (await req.json?.()) ?? {}
    } catch {
      return Response.json({ erreur: 'Corps de requête illisible.' }, { status: 400 })
    }

    const { collection, id, global } = corps

    try {
      // ── Cas d'un global (en-tête, pied de page, réglages) ──────────
      if (global) {
        const [fr, en] = await Promise.all([
          req.payload.findGlobal({ slug: global as never, locale: 'fr', depth: 0 }),
          req.payload.findGlobal({ slug: global as never, locale: 'en', depth: 0 }),
        ])

        const { correctif, remplis, chemins } = fusionnerVersAnglais(
          fr as Record<string, unknown>,
          en as Record<string, unknown>,
        )
        if (remplis === 0) return Response.json({ remplis: 0, chemins: [] })

        await req.payload.updateGlobal({
          slug: global as never,
          locale: 'en',
          data: correctif as never,
          depth: 0,
        })
        return Response.json({ remplis, chemins })
      }

      // ── Cas d'un document de collection ────────────────────────────
      if (!collection || id === undefined) {
        return Response.json(
          { erreur: 'Il faut une collection et un identifiant, ou un global.' },
          { status: 400 },
        )
      }

      const [fr, en] = await Promise.all([
        req.payload.findByID({ collection: collection as never, id, locale: 'fr', depth: 0 }),
        req.payload.findByID({ collection: collection as never, id, locale: 'en', depth: 0 }),
      ])

      const { correctif, remplis, chemins } = fusionnerVersAnglais(
        fr as Record<string, unknown>,
        en as Record<string, unknown>,
      )
      if (remplis === 0) return Response.json({ remplis: 0, chemins: [] })

      // Un document en brouillon doit le rester : sans cette précaution,
      // la copie publierait au passage une page que personne n'a
      // relue.
      const enBrouillon = (en as { _status?: string })?._status === 'draft'

      await req.payload.update({
        collection: collection as never,
        id,
        locale: 'en',
        data: correctif as never,
        depth: 0,
        draft: enBrouillon,
      })

      return Response.json({ remplis, chemins })
    } catch (e) {
      req.payload.logger.error({ err: e }, 'copier-vers-en a échoué')
      return Response.json(
        { erreur: e instanceof Error ? e.message : 'Erreur inconnue.' },
        { status: 500 },
      )
    }
  },
}
