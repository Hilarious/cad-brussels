import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/Hero/config'
import { RichTextBlock } from '../blocks/RichText/config'
import { CTABlock } from '../blocks/CTA/config'
import { StatsBlock } from '../blocks/Stats/config'
import { FeatureListBlock } from '../blocks/FeatureList/config'
import { QuoteBlock } from '../blocks/Quote/config'
import { FAQBlock } from '../blocks/FAQ/config'
import { seoField } from '../lib/fields/seo'
import { slugField } from '../lib/fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) =>
        `${process.env.NEXT_PUBLIC_SITE_URL}/${locale?.code ?? 'fr'}/${
          data?.slug === 'home' ? '' : data?.slug ?? ''
        }`,
    },
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: { description: 'Page parente (pour la hiérarchie de menu).' },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      // IMPORTANT — layout is fully localized at the array level.
      // See globals/Header.ts for the rationale: Payload v3 has a
      // known quirk with non-localized arrays containing localized
      // fields, where updating one locale can silently empty the
      // other locale's localized values. Localizing the whole array
      // ensures each locale stores its own independent copy.
      localized: true,
      blocks: [
        HeroBlock,
        RichTextBlock,
        FeatureListBlock,
        StatsBlock,
        QuoteBlock,
        FAQBlock,
        CTABlock,
      ],
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
