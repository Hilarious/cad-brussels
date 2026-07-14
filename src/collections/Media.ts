import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 240, fit: 'cover' },
      { name: 'card', width: 768, height: 512, fit: 'cover' },
      { name: 'hero', width: 1920, height: 1080, fit: 'cover' },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Texte alternatif pour l’accessibilité et le SEO (obligatoire).',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Crédit photo / source.' },
    },
  ],
}
