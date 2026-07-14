import type { GlobalConfig } from 'payload'

/** Same design as Header: arrays are fully localized to avoid the
 *  Payload v3 quirk where updating one locale can silently empty
 *  the other locale's array values. See Header.ts for full rationale. */
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [
    {
      name: 'columns',
      type: 'array',
      localized: true,
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            {
              name: 'path',
              type: 'text',
              required: true,
              admin: {
                description:
                  "Chemin interne (ex: '/about') ou URL externe (ex: 'https://...').",
              },
            },
          ],
        },
      ],
    },
    {
      name: 'legal',
      type: 'array',
      localized: true,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'path', type: 'text', required: true },
      ],
    },
    { name: 'copyright', type: 'text', localized: true },
  ],
}
