import type { Field } from 'payload'

const toSlug = (value: string) =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const slugField = (): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  // Slug is INTENTIONALLY NOT localized. One page = one global slug,
  // shared across locales. The same /about page exists in /fr/about
  // and /en/about. If we ever want truly localized URLs (/fr/a-propos
  // vs /en/about), we'll add a separate `localizedSlug` field rather
  // than localizing this one — keeping the technical key stable matters.
  admin: {
    position: 'sidebar',
    description: 'URL de la page. Auto-généré depuis le titre si vide.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) {
          return toSlug(value)
        }
        if (typeof data?.title === 'string' && data.title.length > 0) {
          return toSlug(data.title)
        }
        return value
      },
    ],
  },
})
