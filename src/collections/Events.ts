import type { CollectionConfig } from 'payload'
import { seoField } from '../lib/fields/seo'
import { slugField } from '../lib/fields/slug'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'category', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      admin: { description: 'Ex. CAD, 25 rue Roberts-Jones, Uccle' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      filterOptions: () => ({ type: { equals: 'event' } }),
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'description', type: 'richText', localized: true },
    {
      name: 'registrationUrl',
      type: 'text',
      admin: {
        description: 'URL externe d’inscription (Eventbrite, Google Form, …)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Mettre en avant sur la home.' },
    },
    seoField(),
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
      ],
    },
  ],
}
