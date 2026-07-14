import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'Appel à l’action', plural: 'Appels à l’action' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'body', type: 'textarea', localized: true },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primaire', value: 'primary' },
            { label: 'Secondaire', value: 'secondary' },
          ],
        },
      ],
    },
  ],
}
