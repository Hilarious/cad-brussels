import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
  },
  /**
   * `useAPIKey` ajoute à chaque compte un champ « API Key » dans l'admin.
   * Une clé permet d'écrire dans le contenu sans mot de passe et, surtout,
   * se révoque d'un clic depuis la fiche du compte. C'est ce qui permet de
   * confier un accès d'écriture temporaire pour un chantier de migration
   * sans partager les identifiants de la base, qui eux ouvrent tout et
   * définitivement.
   *
   * La clé hérite des droits du compte : la générer sur un compte Editor
   * plutôt qu'Admin limite d'autant ce qu'elle permet.
   */
  auth: {
    useAPIKey: true,
  },
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
