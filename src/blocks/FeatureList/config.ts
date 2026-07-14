import type { Block } from 'payload'

export const FeatureListBlock: Block = {
  slug: 'featureList',
  labels: { singular: 'Liste de points clés', plural: 'Listes de points clés' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 12,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2 colonnes', value: '2' },
        { label: '3 colonnes', value: '3' },
      ],
    },
  ],
}
