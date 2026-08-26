type Platform = 'youtube' | 'instagram' | 'facebook' | 'linkedin' | 'vimeo' | 'behance'

// Ordre d'affichage voulu : YouTube, Instagram, Facebook, LinkedIn en
// priorité (Vimeo/Behance en fin si un jour renseignés), quel que soit
// l'ordre de saisie dans le CMS.
const ORDER: Platform[] = ['youtube', 'instagram', 'facebook', 'linkedin', 'vimeo', 'behance']

function Glyph({ platform }: { platform: Platform }) {
  switch (platform) {
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white" aria-hidden="true">
          <polygon points="9,7 9,17 18,12" />
        </svg>
      )
    case 'instagram':
      return (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="white"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="2.5" y="2.5" width="19" height="19" rx="6" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.1" fill="white" stroke="none" />
        </svg>
      )
    case 'facebook':
      return (
        <span className="text-base font-bold leading-none" aria-hidden="true">
          f
        </span>
      )
    case 'linkedin':
      return (
        <span className="text-xs font-bold leading-none" aria-hidden="true">
          in
        </span>
      )
    case 'vimeo':
      return (
        <span className="text-sm font-bold leading-none" aria-hidden="true">
          V
        </span>
      )
    case 'behance':
      return (
        <span className="text-xs font-bold leading-none" aria-hidden="true">
          Bē
        </span>
      )
  }
}

const BRAND: Record<Platform, { bg: string; label: string }> = {
  youtube: { bg: '#FF0000', label: 'YouTube' },
  instagram: {
    bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
    label: 'Instagram',
  },
  facebook: { bg: '#1877F2', label: 'Facebook' },
  linkedin: { bg: '#0A66C2', label: 'LinkedIn' },
  vimeo: { bg: '#1AB7EA', label: 'Vimeo' },
  behance: { bg: '#1769FF', label: 'Behance' },
}

export function SocialIcons({
  links,
}: {
  links: { platform?: Platform | null; url?: string | null }[]
}) {
  const valid = links.filter(
    (l): l is { platform: Platform; url: string } => !!l.platform && !!l.url && l.platform in BRAND,
  )
  const sorted = [...valid].sort((a, b) => ORDER.indexOf(a.platform) - ORDER.indexOf(b.platform))

  if (sorted.length === 0) return null

  return (
    <ul className="flex items-center gap-2">
      {sorted.map((l, i) => {
        const brand = BRAND[l.platform]
        return (
          <li key={`${l.platform}-${i}`}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={brand.label}
              className="tap flex h-9 w-9 items-center justify-center rounded-full text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: brand.bg }}
            >
              <Glyph platform={l.platform} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
