import Link from 'next/link'
import Image from 'next/image'

/**
 * Logo CAD Brussels — composant centralisé pour toutes les surfaces.
 *
 * Trois assets officiels (charte Thomas Durieux 2024) sont disponibles
 * dans /public/logo/ :
 *
 *   - cad-monogram.png    → monogramme « d » avec 3 cercles concentriques.
 *                            Compact, signature visuelle. Idéal mobile.
 *   - cad-logo-full.png   → wordmark complet « cad » + zone noire latérale.
 *                            Institutionnel. Footer et pages signatures.
 *   - cad-logo-65.png     → édition anniversaire 65 ans (« d65 » rose/bleu).
 *                            Éphémère, à utiliser sur le header pendant
 *                            la campagne anniversaire 2026.
 *
 * La sélection se fait par la prop `variant` :
 *   - "65"        (par défaut header) → cad-logo-65.png
 *   - "wordmark"  (footer, institutionnel) → cad-logo-full.png
 *   - "monogram"  (espaces compacts, mobile, favicon) → cad-monogram.png
 */
type Variant = '65' | 'wordmark' | 'monogram'

type Size = 'sm' | 'md' | 'lg'

// Dimensions calculées à partir des PNG d'origine
// (ratios respectés pour éviter toute déformation).
const assetMap: Record<
  Variant,
  { src: string; alt: { fr: string; en: string }; ratio: number }
> = {
  '65': {
    src: '/logo/cad-logo-65.png',
    alt: {
      fr: 'CAD Brussels, édition 65 ans',
      en: 'CAD Brussels, 65 years edition',
    },
    // 2600 × 1462 → ratio 1.78
    ratio: 1.78,
  },
  wordmark: {
    src: '/logo/cad-logo-full.png',
    alt: {
      fr: 'CAD Brussels',
      en: 'CAD Brussels',
    },
    // 2600 × 959 → ratio 2.71
    ratio: 2.71,
  },
  monogram: {
    src: '/logo/cad-monogram.png',
    alt: {
      fr: 'CAD',
      en: 'CAD',
    },
    // 2600 × 1462 → ratio 1.78 (en pratique carré utile)
    ratio: 1.0,
  },
}

// Hauteurs (px) par taille — la largeur est calculée via le ratio.
const heightMap: Record<Size, number> = {
  sm: 28,
  md: 40,
  lg: 64,
}

export function Logo({
  locale,
  variant = '65',
  size = 'md',
  noLink = false,
  className = '',
}: {
  locale: string
  variant?: Variant
  size?: Size
  noLink?: boolean
  className?: string
}) {
  const asset = assetMap[variant]
  const height = heightMap[size]
  const width = Math.round(height * asset.ratio)
  const alt = locale === 'fr' ? asset.alt.fr : asset.alt.en

  const content = (
    <Image
      src={asset.src}
      alt={alt}
      width={width}
      height={height}
      priority
      className="block h-auto w-auto"
      style={{ height: `${height}px` }}
    />
  )

  if (noLink) return <span className={className}>{content}</span>

  return (
    <Link
      href={`/${locale}`}
      className={`tap shrink-0 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
      aria-label={alt}
    >
      {content}
    </Link>
  )
}
