/**
 * <CtaTrace> — le contour d'un bouton qui se dessine.
 *
 * À poser en premier enfant d'un lien portant la classe `.cta-juice`
 * (le parent doit être `relative`, ce que `.cta-juice` garantit).
 *
 * Le geste : un petit cercle parcourt le contour de la pilule et
 * laisse un trait derrière lui, comme une mine de crayon. Le tracé
 * se tient un instant, puis s'efface par l'autre bout, et le cycle
 * reprend. Pour une école d'art, le bouton ne « brille » pas : il
 * se dessine. (Étapes précédentes : reflet balayant, jugé gratuit,
 * puis orbite seule ; le trait lui donne son sens.)
 *
 * Le cercle reprend le rôle de la pupille du parcours d'études :
 * même famille de gestes d'un bout à l'autre de la page.
 *
 * Technique — deux contraintes de navigateur à connaître avant de
 * toucher à `globals.css` :
 *  - `pathLength="1"` normalise la longueur du contour, donc un seul
 *    jeu de keyframes vaut pour un bouton de n'importe quelle largeur
 *    (les libellés changent avec la langue).
 *  - `rx="999"` est ramené par SVG à la moitié de la hauteur : on
 *    obtient une pilule sans connaître les dimensions.
 * Le SVG est encastré de 4px pour que son bord coïncide exactement
 * avec le rail du cercle (`offset-path: inset(4px …)`).
 */
export function CtaTrace() {
  return (
    <>
      <svg
        aria-hidden="true"
        className="cta-trace"
        preserveAspectRatio="none"
        focusable="false"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="999"
          ry="999"
          pathLength="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span aria-hidden="true" className="cta-orbit-dot" />
    </>
  )
}
