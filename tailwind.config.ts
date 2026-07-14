import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    // CAD Brussels uses a 12-column grid as its structural backbone.
    // The container caps at 1400px (2xl) with consistent horizontal
    // padding. Inside the container, any 12-column grid uses gap-x-6
    // (24px gutters) by default — see the <Grid> component for the
    // declarative API.
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '2rem', xl: '3rem' },
      screens: { '2xl': '1400px' },
    },
    extend: {
      // Standard CAD gutter for 12-column grids.
      // Tailwind's `gap-6` = 1.5rem = 24px which matches the design system.
      // Mobile collapses to gap-4 (16px) to preserve breathing room.
      colors: {
        // ─── Semantic tokens ──────────────────────────────────────
        // These three are the only ones used directly across the
        // codebase (text-ink, bg-paper, text-accent). They map to
        // the official CAD palette below.
        //
        // `ink`    : #0A0A0A is a softer black for screen readability
        //            (the print charter uses pure #000 but #0A0A0A
        //            gives better contrast in dark UI).
        // `paper`  : #F4F4F0 is a warm off-white closer to the brand's
        //            print stock feel.
        // `accent` : defaults to Pink (the 65-year anniversary accent),
        //            but is intentionally swappable per program/page
        //            via CSS variables (see globals.css for overrides).
        // RGB-component CSS variables let Tailwind handle opacity via
        // `bg-accent/40`, `text-ink/70`, etc. Values are declared in
        // globals.css as space-separated RGB triplets.
        ink: 'rgb(var(--ink) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
        },

        // ─── Official CAD palette ─────────────────────────────────
        // 14 colors from Thomas Durieux's charter (June 2024).
        // Use `bg-cad-pink`, `text-cad-navy`, etc. Reserve direct usage
        // for places where the accent token doesn't fit (program-specific
        // sections, illustrations, infographics, etc.).
        cad: {
          black:   '#000000',
          white:   '#FFFFFF',
          cyan:    '#00FFFF',
          navy:    '#2F346D',
          orange:  '#FF8000',
          violet:  '#8000FF',
          pink:    '#FF277F',
          magenta: '#FF00FF',
          azure:   '#0080FF',
          red:     '#FF1F20',
          lime:    '#80FF00',
          yellow:  '#FFFF00',
          blue:    '#0000FF',
          mint:    '#00FF80',
        },
      },
      fontFamily: {
        // Outfit is the SINGLE digital typeface across the site,
        // per the validated Digital Guidelines. Both `font-sans` and
        // `font-display` resolve to Outfit — display weight is
        // controlled via font-weight utilities (font-light, font-bold).
        // The print charter (Geogrotesque + Oldblend) is intentionally
        // not used in the digital build.
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // CAD reading-comfort overrides for the two most-used scale steps.
        // Outfit at 14px (Tailwind default `text-sm`) is too thin for body
        // copy on the cards (Alumni, Programs, etc.). Bumping `sm` to 15px
        // and `base` to 17px (~+6%) gains noticeable readability without
        // breaking any layout — line-heights scale with the new sizes.
        // Other steps (xs, lg, xl, etc.) stay on the Tailwind default.
        sm: ['0.9375rem', { lineHeight: '1.5rem' }],   // 15px / 24px
        base: ['1.0625rem', { lineHeight: '1.65rem' }], // 17px / ~26px
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
          },
        },
      },
      // Animations CSS : marquee horizontal infini pour les bandes
      // défilantes de projets étudiants (cf. <Marquee>).
      // L'animation translate de 0 à -50% car le contenu est dupliqué
      // (deux pistes identiques côte à côte), créant un loop sans saut.
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 60s) linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
