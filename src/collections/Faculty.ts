import type { CollectionConfig } from 'payload'

/**
 * Professeurs — les fiches de l'équipe pédagogique.
 *
 * Remplace le tableau écrit en dur dans la page. L'argument de l'école
 * est que ses professeurs sont des professionnels en activité : leur
 * activité parallèle change, et la page doit pouvoir suivre sans nous.
 *
 * Même règle de traduction que pour les alumni : les noms de personnes,
 * d'employeurs et de villes ne sont pas traduits, les intitulés si.
 */
export const Faculty: CollectionConfig = {
  slug: 'faculty',
  labels: { singular: 'Professeur', plural: 'Professeurs' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject', 'parallelEmployer', 'status'],
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
      name: 'subject',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Ce qu’il ou elle enseigne. Ex : Atelier de projet' },
    },
    {
      name: 'programs',
      type: 'array',
      labels: { singular: 'Programme', plural: 'Programmes' },
      fields: [{ name: 'label', type: 'text', required: true, localized: true }],
      admin: { description: 'Les programmes où intervient cette personne.' },
    },
    {
      name: 'parallelRole',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Son métier en dehors de l’école.' },
    },
    { name: 'parallelEmployer', type: 'text', required: true },
    { name: 'city', type: 'text' },
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
