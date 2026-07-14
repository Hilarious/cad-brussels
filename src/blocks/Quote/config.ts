import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Citation / Témoignage', plural: 'Citations / Témoignages' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorRole', type: 'text', localized: true },
    { name: 'authorImage', type: 'upload', relationTo: 'media' },
  ],
}
