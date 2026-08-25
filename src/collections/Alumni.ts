import type { CollectionConfig } from 'payload'

/**
 * Alumni — les portraits de diplômés.
 *
 * Remplace le tableau écrit en dur dans la page. Le CAD peut désormais
 * ajouter un diplômé sans passer par nous, ce qui est l'intérêt même de
 * la bascule : ces portraits vieillissent vite et se complètent au fil
 * des promotions.
 *
 * Ce qui est traduit et ce qui ne l'est pas : un nom de personne, un
 * employeur et une ville s'écrivent pareil dans les deux langues, les
 * traduire n'aurait aucun sens et doublerait le travail de saisie.
 * Seuls la citation, l'intitulé de poste et le nom du programme le sont.
 *
 * La photo reste facultative : tant que l'école n'a pas les images et
 * les autorisations, l'affichage retombe sur les initiales.
 */
export const Alumni: CollectionConfig = {
  slug: 'alumni',
  labels: { singular: 'Alumni', plural: 'Alumni' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'classOf', 'currentEmployer', 'status'],
    group: 'Contenu',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'classOf',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Ex : Promo 2022' },
    },
    {
      name: 'program',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Nom du programme suivi, tel qu’affiché.' },
    },
    {
      name: 'programSlug',
      type: 'text',
      admin: {
        description:
          'Adresse de la page programme, pour créer le lien. Ex : communication-digital-design',
      },
    },
    { name: 'currentRole', type: 'text', required: true, localized: true },
    { name: 'currentEmployer', type: 'text', required: true },
    { name: 'city', type: 'text' },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Le témoignage, à la première personne.' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Facultatif. Sans photo, les initiales s’affichent.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Ordre d’affichage. Le plus petit vient en premier.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Publié', value: 'published' },
        { label: 'Brouillon', value: 'draft' },
      ],
    },
  ],
}
