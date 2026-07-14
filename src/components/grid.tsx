/**
 * <Grid> + <Col> — CAD Brussels 12-column grid system.
 *
 * The visual structural backbone of the site. Use it whenever you need
 * precise editorial layouts (image + text in 7/5 split, quote spanning
 * 8 cols offset 2, etc.). For simple cases (2-3 equal cards), the
 * shorthand `grid grid-cols-2` / `grid-cols-3` Tailwind classes remain
 * perfectly fine — don't over-engineer.
 *
 * Convention :
 *  - Mobile         : 4 columns (auto-collapse: each <Col> takes full width)
 *  - Tablet (md)    : 8 columns
 *  - Desktop (lg+)  : 12 columns
 *  - Gutter         : gap-x-6 (24px) desktop, gap-x-4 (16px) mobile
 *  - Row gap        : gap-y-8 (32px) by default
 *
 * Usage :
 *
 *   <Grid>
 *     <Col span={7}>...image...</Col>
 *     <Col span={5}>...text...</Col>
 *   </Grid>
 *
 *   <Grid>
 *     <Col span={8} offset={2}>...quote...</Col>
 *   </Grid>
 *
 * Tailwind class strings are static (full names below), which lets the
 * Tailwind JIT purge pick them up correctly. DO NOT build classes
 * dynamically like `col-span-${n}` — they would be purged.
 */
import type { ReactNode } from 'react'

// ─── <Grid> ─────────────────────────────────────────────────────
type GridProps = {
  children: ReactNode
  /** Override the default row gap. Tailwind class like `gap-y-12`. */
  rowGap?: string
  /** Extra classes on the grid container. */
  className?: string
}

export function Grid({ children, rowGap = 'gap-y-8', className = '' }: GridProps) {
  return (
    <div
      className={`grid grid-cols-4 gap-x-4 md:grid-cols-8 md:gap-x-6 lg:grid-cols-12 ${rowGap} ${className}`}
    >
      {children}
    </div>
  )
}

// ─── <Col> ──────────────────────────────────────────────────────
type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type ColOffset = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

type ColProps = {
  children: ReactNode
  /** Desktop span (lg+): how many of the 12 columns this column occupies. */
  span: ColSpan
  /** Desktop offset: how many columns to skip before this column starts. */
  offset?: ColOffset
  /** Tablet span (md): defaults to min(span, 8). */
  spanMd?: ColSpan
  /** Mobile span: defaults to 4 (full width on 4-col mobile grid). */
  spanSm?: ColSpan
  className?: string
}

// Static class maps. Each value must be a literal string so Tailwind
// can detect it during JIT compilation. No template literals.
const SPAN_LG: Record<ColSpan, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
}

const OFFSET_LG: Record<ColOffset, string> = {
  0: '',
  1: 'lg:col-start-2',
  2: 'lg:col-start-3',
  3: 'lg:col-start-4',
  4: 'lg:col-start-5',
  5: 'lg:col-start-6',
  6: 'lg:col-start-7',
  7: 'lg:col-start-8',
  8: 'lg:col-start-9',
  9: 'lg:col-start-10',
  10: 'lg:col-start-11',
  11: 'lg:col-start-12',
}

const SPAN_MD: Record<ColSpan, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  // Past 8 on tablet, span the full 8-col grid.
  9: 'md:col-span-8',
  10: 'md:col-span-8',
  11: 'md:col-span-8',
  12: 'md:col-span-8',
}

const SPAN_SM: Record<ColSpan, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  // Past 4 on mobile, span the full 4-col grid.
  5: 'col-span-4',
  6: 'col-span-4',
  7: 'col-span-4',
  8: 'col-span-4',
  9: 'col-span-4',
  10: 'col-span-4',
  11: 'col-span-4',
  12: 'col-span-4',
}

export function Col({
  children,
  span,
  offset = 0,
  spanMd,
  spanSm,
  className = '',
}: ColProps) {
  // Sensible defaults: on tablet, mirror desktop span; on mobile, full width.
  const mdSpan = spanMd ?? (span as ColSpan)
  const smSpan = spanSm ?? 4

  return (
    <div
      className={[
        SPAN_SM[smSpan],
        SPAN_MD[mdSpan],
        SPAN_LG[span],
        OFFSET_LG[offset],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
