import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail } from '@/lib/email'
import { welcomeEmail } from '@/lib/newsletter-emails'

/**
 * GET /api/newsletter/confirm?token=...
 *
 * Used by the email button. We respond by redirecting to the confirmation
 * page so the user lands on a friendly UI with proper i18n.
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
    where: { confirmToken: { equals: token } },
    limit: 1,
    depth: 0,
  })

  const sub = result.docs[0]
  if (!sub) {
    return NextResponse.redirect(new URL('/fr/newsletter?error=invalid', url))
  }

  if (sub.status !== 'active') {
    await payload.update({
      collection: 'subscribers',
      id: sub.id,
      data: {
        status: 'active',
        confirmedAt: new Date().toISOString(),
        confirmToken: null,
      },
    })

    // Welcome email with one-click unsubscribe link
    try {
      const tpl = welcomeEmail({
        email: sub.email,
        unsubscribeToken: sub.unsubscribeToken ?? '',
        locale: (sub.locale as 'fr' | 'en') ?? 'fr',
      })
      await sendEmail({ to: sub.email, ...tpl })
    } catch (err) {
      console.error('[newsletter] welcome email send failed', err)
    }
  }

  const locale = (sub.locale as 'fr' | 'en') ?? 'fr'
  return NextResponse.redirect(
    new URL(`/${locale}/newsletter/confirmed`, url),
  )
}
