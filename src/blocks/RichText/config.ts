import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Texte enrichi', plural: 'Textes enrichis' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Lecture (max 70ch)', value: 'prose' },
        { label: 'Pleine largeur', value: 'full' },
      ],
    },
  ],
}
