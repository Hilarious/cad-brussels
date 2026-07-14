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
      // 6 colonnes max pour densifier le maillage interne :
      // Bachelors, Masters, Admissions, École, Follow us + marge.
      // Recommandation audit SEO Digistage 2026 (les pages "gagnantes"
      // ont 154 liens internes vs 33 en moyenne, le footer est
      // le levier universel).
      maxRows: 6,
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
