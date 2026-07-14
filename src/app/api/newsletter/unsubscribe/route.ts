import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /api/newsletter/unsubscribe?token=...
 *
 * One-click unsubscribe (RFC 8058 / List-Unsubscribe).
 * Marks the subscriber as 'unsubscribed' and redirects to a friendly page.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') ?? ''

  if (!token) {
    return NextResponse.redirect(new URL('/fr/newsletter?error=missing', url))
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'subscribers',
    where: { unsubscribeToken: { equals: token } },
    limit: 1,
    depth: 0,
  })
  const sub = result.docs[0]
  if (!sub) {
    return NextResponse.redirect(new URL('/fr/newsletter?error=invalid', url))
  }

  if (sub.status !== 'unsubscribed') {
    await payload.update({
      collection: 'subscribers',
      id: sub.id,
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString(),
      },
    })
  }

  const locale = (sub.locale as 'fr' | 'en') ?? 'fr'
  return NextResponse.redirect(
    new URL(`/${locale}/newsletter/unsubscribed`, url),
  )
}

// Some email clients (Gmail/Apple Mail) trigger unsubscribe via POST with
// `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. Mirror the GET handler.
export const POST = GET
