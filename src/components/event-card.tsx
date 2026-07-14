import Link from 'next/link'
import Image from 'next/image'
import type { Event, Media } from '@/payload-types'

export function EventCard({
  event,
  locale,
}: {
  event: Event
  locale: string
}) {
  const cover =
    typeof event.coverImage === 'object' ? (event.coverImage as Media) : null
  const date = new Date(event.startDate)

  return (
    <Link
      href={`/${locale}/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-paper transition hover:border-accent/40"
    >
      <div className="relative aspect-[4/3] bg-ink/5">
        {cover?.url && (
          <Image
            src={cover.url}
            alt={cover.alt ?? ''}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <time
          dateTime={event.startDate}
          className="text-xs uppercase tracking-widest text-accent"
        >
          {date.toLocaleDateString(locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </time>
        <h3 className="font-display text-xl leading-tight">{event.title}</h3>
        {event.location && (
          <p className="text-sm text-ink/60">{event.location}</p>
        )}
      </div>
    </Link>
  )
}
