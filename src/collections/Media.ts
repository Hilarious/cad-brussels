import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import sharp from 'sharp'

// =============================================================================
// beforeChange hook — compression Sharp de l'image originale
// -----------------------------------------------------------------------------
// Motivation : l'audit SEO Digistage janvier 2026 a mesuré que le site
// WordPress actuel a un poids total d'images de 101.71 MB (target ≤ 5 MB)
// avec 6 images individuelles > 6 MB. Sans garde-fou côté Payload, les
// éditeurs (Eric, Fabienne) pourraient uploader des monster JPEGs de 8 MB
// qui exploseraient Core Web Vitals.
//
// Cette moulinette :
//   1. Auto-oriente selon l'EXIF (photos smartphone en portrait)
//   2. Cap la dimension max à 1600px (largeur ou hauteur, ratio préservé)
//   3. Convertit en JPEG progressif quality 82 avec mozjpeg (encodeur
//      optimisé qui produit ~15% de moins que libjpeg par défaut)
//   4. Renomme l'extension si nécessaire (PNG → JPG, HEIC → JPG)
//
// SVG et fichiers non-image (PDF, MP4) sont laissés intacts. Le format
// AVIF/WebP est généré automatiquement par next/image côté serveur au
// moment du rendu — pas besoin de le pré-générer ici.
//
// Cette compression s'applique à l'ORIGINAL. Payload génère ensuite les
// derivatives (thumbnail, card, hero) définies dans `imageSizes`.
// =============================================================================
const compressOriginal: CollectionBeforeChangeHook = async ({
  req,
  operation,
  data,
}) => {
  if (operation !== 'create' && operation !== 'update') return data

  // Payload attache le fichier upload sur req.file
  const file = req.file as
    | { data?: Buffer; mimetype?: string; size?: number; name?: string }
    | undefined

  if (!file?.data || !file.mimetype) return data
  // Ignore les non-images (PDF, MP4 passent tel quel)
  if (!file.mimetype.startsWith('image/')) return data
  // Ignore les SVG (vectoriel, pas de compression raster à faire)
  if (file.mimetype === 'image/svg+xml') return data
  // Ignore les GIF (animation, pas trivial à re-encoder — laisser passer)
  if (file.mimetype === 'image/gif') return data

  try {
    const before = file.size ?? file.data.length

    const compressed = await sharp(file.data)
      .rotate() // applique l'orientation EXIF puis la supprime
      .resize(1600, 1600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 82,
        mozjpeg: true, // encodeur avancé, gain ~15% vs libjpeg standard
        progressive: true, // rendu progressif = perçu comme plus rapide
      })
      .toBuffer()

    // Remplace le buffer d'upload avant que Payload ne persiste
    file.data = compressed
    file.size = compressed.length
    file.mimetype = 'image/jpeg'

    // Force l'extension .jpg côté filename si l'original était PNG/HEIC/WebP
    if (
      data &&
      typeof data === 'object' &&
      'filename' in data &&
      typeof (data as { filename?: string }).filename === 'string'
    ) {
      const d = data as { filename: string }
      d.filename = d.filename.replace(/\.(png|heic|heif|webp|tif|tiff|bmp)$/i, '.jpg')
    }
    if (file.name) {
      file.name = file.name.replace(/\.(png|heic|heif|webp|tif|tiff|bmp)$/i, '.jpg')
    }

    const after = compressed.length
    const savedPct = before > 0 ? Math.round(((before - after) / before) * 100) : 0
    req.payload.logger.info(
      {
        collection: 'media',
        before: `${(before / 1024).toFixed(0)} kB`,
        after: `${(after / 1024).toFixed(0)} kB`,
        saved: `${savedPct}%`,
      },
      'Media upload compressed via Sharp',
    )
  } catch (err) {
    // Ne pas planter l'upload sur une erreur de compression : logger et
    // laisser passer le fichier original. Mieux vaut un upload lourd
    // qu'un upload échoué côté éditeur.
    req.payload.logger.error({ err }, 'Sharp compression failed, original preserved')
  }

  return data
}

// =============================================================================
// Media collection
// =============================================================================
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [compressOriginal],
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
    // Derivatives générés par Payload/Sharp au moment de l'upload. Servent
    // à next/image qui choisit la plus petite qui couvre le viewport.
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 240, fit: 'cover' },
      { name: 'card', width: 768, height: 512, fit: 'cover' },
      { name: 'hero', width: 1920, height: 1080, fit: 'cover' },
    ],
    // WebP pour les derivatives (l'original reste en JPEG q82 via le hook).
    // next/image gère ensuite la négociation Accept: image/avif côté client.
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Texte alternatif pour l’accessibilité et le SEO (obligatoire).',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Crédit photo / source.' },
    },
  ],
}
