import type { GlobalConfig } from 'payload'

/**
 * Header navigation.
 *
 * IMPORTANT — design decision:
 * The whole `navItems` array (and the `cta` group) is `localized: true`.
 * That means each locale stores its OWN INDEPENDENT copy of the array.
 *
 * Why this rather than a non-localized array with localized fields?
 * Because Payload v3 has a known quirk with non-localized arrays
 * containing localized fields: writing the array for one locale can
 * silently lose the localized values stored for another locale, leaving
 * the other locale's labels empty. We had this bug 3 times.
 *
 * With full localization at the array level:
 * - Each locale's nav is independent. Updating FR never touches EN.
 * - Slightly more storage, totally negligible for a nav (a few rows).
 * - Paths are stored with their locale prefix already (e.g. "/fr/programmes")
 *   so the front-end uses them as-is.
 */
export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'path', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'path', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      localized: true,
      fields: [
        { name: 'label', type: 'text' },
        { name: 'path', type: 'text' },
      ],
    },
  ],
}
