import type { Field } from 'payload'

export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: { position: 'sidebar' },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
      admin: { description: 'Optimal : 50–60 caractères.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
      admin: { description: 'Optimal : 150–160 caractères.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image utilisée pour le partage social (1200x630).' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Empêcher l’indexation par les moteurs de recherche.' },
    },
  ],
})
