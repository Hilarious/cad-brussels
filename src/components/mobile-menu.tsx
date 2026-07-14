'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type NavChild = {
  label: string | null | undefined
  href: string
}

type NavEntry = {
  label: string | null | undefined
  href: string
  children: NavChild[]
}

type Props = {
  navItems: NavEntry[]
  cta?: { label: string; href: string } | null
  /** Libellés accessibles, fournis par le serveur pour rester traduits. */
  labels: { open: string; close: string; menu: string }
}

/**
 * <MobileMenu> — navigation repliée sous le point de bascule `lg` (1024px).
 *
 * Le menu du bureau ne tient pas sous 1024px : il débordait de l'écran sur
 * tablette. En dessous, on affiche donc ce panneau plein écran, ouvert par
 * le bouton habituel à trois barres.
 *
 * Les sous-menus sont dépliés d'emblée plutôt que cachés derrière un second
 * geste : la liste tient dans la hauteur d'un téléphone, et un accordéon
 * ajouterait un tap inutile avant d'atteindre un programme, qui est
 * justement ce qu'un candidat vient chercher.
 */
export function MobileMenu({ navItems, cta, labels }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Refermer après navigation : sans cela, le panneau resterait ouvert
  // par-dessus la page d'arrivée.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Empêcher la page de défiler derrière le panneau ouvert, et permettre
  // la fermeture au clavier (Échap).
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? labels.close : labels.open}
        // 44px de côté : cible tactile recommandée par Apple et Google.
        className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5"
      >
        <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
          {open ? (
            <path
              d="M2 2l18 12M20 2L2 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M0 1.5h22M0 8h22M0 14.5h22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu-panel"
          // Positionné en `absolute` sous le header (`top-full`), et non en
          // `fixed` : le header porte `backdrop-blur`, et un backdrop-filter
          // fait de l'élément le bloc conteneur de ses descendants `fixed`.
          // Un `fixed inset-x-0 top-20 bottom-0` se serait donc calé sur les
          // 80px du header au lieu du viewport, avec une hauteur nulle.
          //
          // `5rem` = h-20, la hauteur du header. Le body est verrouillé quand
          // le panneau est ouvert, donc rien ne défile derrière.
          className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-ink/10 bg-paper"
        >
          <nav aria-label={labels.menu} className="container py-6">
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <li key={`${item.href}-${i}`} className="border-b border-ink/5 py-1">
                  <Link
                    href={item.href}
                    className="block py-3 text-2xl font-light hover:text-accent"
                  >
                    {item.label}
                  </Link>

                  {item.children.length > 0 && (
                    <ul className="mb-2 flex flex-col gap-1 pl-4">
                      {item.children.map((child, j) => (
                        <li key={`${child.href}-${j}`}>
                          <Link
                            href={child.href}
                            className="flex min-h-11 items-center text-base text-ink/70 hover:text-accent"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {cta && (
              <Link
                href={cta.href}
                className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-5 text-base font-medium text-paper hover:bg-accent"
              >
                {cta.label}
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
