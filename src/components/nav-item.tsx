'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type NavChild = {
  label: string | null | undefined
  href: string
}

type Props = {
  label: string | null | undefined
  href: string
  children?: NavChild[]
}

/**
 * Single top-level nav item with optional dropdown.
 * Opens on hover, focus, or click. Closes on mouseleave with a small
 * delay so the user can travel to the dropdown without losing focus.
 * Keyboard accessible (Enter / Space toggles, Escape closes).
 */
export function NavItem({ label, href, children }: Props) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLLIElement>(null)
  const hasChildren = !!children && children.length > 0

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (hasChildren) setOpen(true)
  }
  function handleLeave() {
    if (!hasChildren) return
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }

  return (
    <li
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={href}
        className="inline-flex items-center gap-1 py-5 hover:text-accent"
        onFocus={handleEnter}
        aria-haspopup={hasChildren || undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        {label}
        {hasChildren && (
          <svg
            aria-hidden="true"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path
              d="M1 1l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Link>

      {hasChildren && (
        <div
          // The wrapper extends slightly above the dropdown to bridge the
          // gap between the link and the dropdown panel, so the mouse
          // never crosses an "empty" zone that would close the menu.
          className={`absolute left-0 top-full z-50 pt-1 transition ${
            open
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
        >
          <ul className="w-64 rounded-lg border border-ink/10 bg-paper p-2 shadow-lg">
            {children!.map((child, i) => (
              <li key={`${child.href}-${i}`}>
                <Link
                  href={child.href}
                  className="block rounded px-3 py-2 hover:bg-ink/5 hover:text-accent"
                  onClick={() => setOpen(false)}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}
