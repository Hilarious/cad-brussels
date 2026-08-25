'use client'

import { usePathname } from 'next/navigation'
import { Maze404 } from './maze-404'
import { locales } from '@/lib/i18n'

/**
 * Enveloppe de la page 404.
 *
 * `not-found.tsx` ne reçoit pas les paramètres de route : Next le rend en
 * dehors du segment qui a échoué, donc sans `params.locale`. On relit donc
 * la langue dans l'URL courante, et on retombe sur le français si l'URL n'en
 * porte pas (le cas d'une adresse totalement fantaisiste).
 */
export function Maze404Page() {
  const pathname = usePathname() ?? ''
  const first = pathname.split('/')[1]
  const locale = (locales as readonly string[]).includes(first)
    ? (first as 'fr' | 'en')
    : 'fr'

  return <Maze404 locale={locale} />
}
