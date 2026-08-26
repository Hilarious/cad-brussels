import type { Field } from 'payload'

/**
 * Bouton « Copier le français vers l'anglais », à poser en tête des
 * collections et globals traduisibles.
 *
 * Champ de type `ui` : il n'existe que dans l'admin, ne stocke rien et
 * ne crée donc aucune colonne. L'ajouter ne demande pas de migration de
 * base.
 *
 * Le composant ne s'affiche que sur l'onglet anglais, voir
 * `src/components/admin/BoutonCopierVersEn.tsx`.
 */
export const champCopierVersEn = (): Field => ({
  name: 'copierVersEn',
  type: 'ui',
  admin: {
    components: {
      Field: '/components/admin/BoutonCopierVersEn#BoutonCopierVersEn',
    },
  },
})
