import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'subheading', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'image',
      options: [
        { label: 'Image plein écran', value: 'image' },
        { label: 'Texte centré', value: 'text' },
        { label: 'Split (texte + image)', value: 'split' },
      ],
    },
  ],
}
