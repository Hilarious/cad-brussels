/**
 * <ImagePlaceholder> — Cadre vide signalé comme emplacement d'image.
 *
 * Usage : placeholders dans les pages en attendant les vraies photos.
 * Le cadre montre clairement la zone réservée, le ratio attendu, et
 * une légende qui sert de brief au photographe.
 *
 * Remplacement futur : substituer chaque `<ImagePlaceholder>` par
 * un `<Image src={...} alt={...} />` de next/image avec les bonnes
 * dimensions. Le ratio est conservé, le layout ne bouge pas.
 *
 *   <ImagePlaceholder ratio="16:9" caption="Hero · étudiants atelier mode" />
 *   <ImagePlaceholder ratio="2:3" caption="Portrait · prof architecture" />
 *   <ImagePlaceholder ratio="1:1" caption="Détail · maquette espace" />
 */
type Ratio =
  | '21:9'  // ultra-wide cinema
  | '16:9'  // standard wide
  | '4:3'   // classique éditorial
  | '3:2'   // photo print
  | '1:1'   // carré social
  | '4:5'   // portrait Instagram
  | '2:3'   // portrait éditorial
  | '3:4'   // portrait magazine

const ratioMap: Record<Ratio, string> = {
  '21:9': 'aspect-[21/9]',
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
  '2:3': 'aspect-[2/3]',
  '3:4': 'aspect-[3/4]',
}

export function ImagePlaceholder({
  ratio = '4:3',
  caption,
  className = '',
}: {
  ratio?: Ratio
  /** Brief minimal pour le photographe : sujet · contexte. */
  caption: string
  className?: string
}) {
  return (
    // `w-full` est indispensable : sans largeur définie, un appelant qui impose
    // aussi la hauteur (h-full dans une cellule row-span-2) laisse l'aspect-ratio
    // déduire la largeur, qui déborde alors de sa colonne et recouvre les voisines.
    // Avec les deux dimensions définies, l'aspect-ratio est ignoré, comme voulu.
    <div
      className={`relative flex w-full items-end overflow-hidden rounded-lg border border-dashed border-ink/30 bg-ink/[0.03] ${ratioMap[ratio]} ${className}`}
      role="img"
      aria-label={`Emplacement d'image : ${caption}`}
    >
      {/* Croix discrète au centre pour signaler "à remplir" */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="text-3xl font-light text-ink/15">+</span>
      </div>

      {/* Métadonnées en bas : ratio + brief */}
      <div className="relative z-10 flex w-full items-end justify-between gap-3 p-3 text-xs uppercase tracking-widest text-ink/50">
        <span className="font-medium">{caption}</span>
        <span className="shrink-0 rounded border border-ink/15 px-1.5 py-0.5 font-mono normal-case text-ink/40">
          {ratio}
        </span>
      </div>
    </div>
  )
}
