/**
 * Program → theme class mapping.
 *
 * Maps a CMS slug (or a hand-coded page key) to the CSS theme class
 * declared in `globals.css`. Applying this class on a wrapper element
 * swaps `var(--accent)` for the program's official CAD color, which
 * cascades through every `text-accent` / `bg-accent` / `border-accent`
 * descendant — Tailwind classes don't need to change.
 *
 * Source of truth for color → program pairing: charte Thomas Durieux
 * (June 2024), validated by Eric Vanden Broeck (Dean).
 *
 *   Undergraduate Interior Architecture       → Navy
 *   Undergraduate Communication & Digital     → Violet
 *   Undergraduate Fashion & Accessory         → Pink
 *   Master Interior Architecture 2 ans   → Navy
 *   Postgraduate Home & Living                 → Mint
 *   Postgraduate Digital Brand Content         → Violet
 *   Postgraduate Image 3D Motion Video AI      → Azure
 *   Postgraduate Event Management              → Orange
 *   Spécialisation Fashion Management    → Pink
 *   Lifelong Learning (hub + modules)    → Magenta
 *   Édition 65 ans                       → Pink
 *   Journées Portes Ouvertes             → Red
 */
const SLUG_TO_THEME: Record<string, string> = {
  // Undergraduates
  'interior-architecture-design': 'theme-interior',
  'communication-digital-design': 'theme-communication',
  'fashion-accessory-design': 'theme-fashion',
  // Masters
  'interior-architecture-design-postgraduate': 'theme-interior',
  'home-living-design': 'theme-home-living',
  'digital-brand-content': 'theme-communication',
  'image-3d-motion-video-ai': 'theme-image-3d',
  'event-management': 'theme-event',
  // Specialisation
  'fashion-management': 'theme-fashion',
  // Hubs (use the dominant accent of the group)
  programmes: 'theme-fashion',
  postgraduate: 'theme-image-3d',
}

/**
 * Returns the theme class for a given slug, or an empty string if no
 * theme is defined. Safe to spread into className without conditional.
 */
export function themeForSlug(slug: string | undefined | null): string {
  if (!slug) return ''
  return SLUG_TO_THEME[slug] ?? ''
}
