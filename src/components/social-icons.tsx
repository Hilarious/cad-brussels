type Platform = 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'vimeo' | 'behance'

// Couleurs de marque officielles — un badge par plateforme suffit à
// rendre le lien reconnaissable au premier coup d'œil, sans reproduire
// le logo exact (risque de déformation en petite taille).
const BRAND: Record<Platform, { bg: string; label: string; glyph: string }> = {
  facebook: { bg: '#1877F2', label: 'Facebook', glyph: 'f' },
  instagram: { bg: '#E1306C', label: 'Instagram', glyph: '◎' },
  linkedin: { bg: '#0A66C2', label: 'LinkedIn', glyph: 'in' },
  youtube: { bg: '#FF0000', label: 'YouTube', glyph: '▶' },
  vimeo: { bg: '#1AB7EA', label: 'Vimeo', glyph: 'V' },
  behance: { bg: '#1769FF', label: 'Behance', glyph: 'Bē' },
}

export function SocialIcons({
  links,
}: {
  links: { platform?: Platform | null; url?: string | null }[]
}) {
  const valid = links.filter(
    (l): l is { platform: Platform; url: string } => !!l.platform && !!l.url && l.platform in BRAND,
  )

  if (valid.length === 0) return null

  return (
    <ul className="flex items-center gap-2">
      {valid.map((l, i) => {
        const brand = BRAND[l.platform]
        return (
          <li key={`${l.platform}-${i}`}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={brand.label}
              className="tap flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: brand.bg }}
            >
              {brand.glyph}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
