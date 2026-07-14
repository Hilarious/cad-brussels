import type { ReactNode } from 'react'

/**
 * <Marquee> — Bande défilante horizontale infinie.
 *
 * Animation CSS pure (pas de JS) : les enfants défilent à vitesse
 * constante de la droite vers la gauche. Pour créer l'effet infini,
 * les enfants sont automatiquement dupliqués (2 copies côte à côte
 * qui se relayent).
 *
 * Convention :
 *  - Vitesse standard `speed="normal"` (60s pour un tour complet)
 *  - `speed="slow"` (120s) pour contenu contemplatif (projets art)
 *  - `speed="fast"` (30s) pour effet plus énergique (ticker)
 *  - L'animation respecte prefers-reduced-motion (s'arrête si user le demande)
 *
 * Usage :
 *
 *   <Marquee speed="slow">
 *     {projets.map(p => <ProjectCard key={p.id} {...p} />)}
 *   </Marquee>
 */
type Speed = 'fast' | 'normal' | 'slow'

const speedMap: Record<Speed, string> = {
  fast: '30s',
  normal: '60s',
  slow: '120s',
}

export function Marquee({
  children,
  speed = 'normal',
  className = '',
}: {
  children: ReactNode
  speed?: Speed
  className?: string
}) {
  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={
        {
          // CSS variable lue par l'animation @keyframes
          '--marquee-duration': speedMap[speed],
        } as React.CSSProperties
      }
    >
      {/*
       * Two-track marquee : two identical tracks side by side, both
       * translating left by 50% of the container width. When the first
       * track exits the viewport on the left, the second one is already
       * in position. Effectively seamless infinite scroll.
       */}
      <div className="flex w-max animate-marquee gap-6 motion-reduce:animate-none">
        {/* Track 1 */}
        <div className="flex shrink-0 gap-6">{children}</div>
        {/* Track 2 — identical clone, aria-hidden to avoid duplication
            for screen readers */}
        <div aria-hidden="true" className="flex shrink-0 gap-6">
          {children}
        </div>
      </div>
    </div>
  )
}
