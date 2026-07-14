import { NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail } from '@/lib/email'
import { confirmEmail } from '@/lib/newsletter-emails'

const SubscribeSchema = z.object({
  email: z.string().email().max(200),
  profile: z
    .enum(['student', 'professional', 'parent', 'other'])
    .default('other'),
  locale: z.enum(['fr', 'en']).default('fr'),
  // honeypot — must be empty
  website: z.string().max(0).optional(),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = SubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 422 })
  }
  const { email, profile, locale } = parsed.data

  // Honeypot triggered → pretend success without doing anything
  if ((parsed.data as { website?: string }).website) {
    return NextResponse.json({ ok: true })
  }

  const payload = await getPayload({ config })
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null
  const userAgent = req.headers.get('user-agent') ?? null
  const referrer = req.headers.get('referer') ?? null
  const confirmToken = randomBytes(24).toString('base64url')
  const unsubscribeToken = randomBytes(24).toString('base64url')

  // Check whether this email already exists
  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email.toLowerCase() } },
    limit: 1,
    depth: 0,
  })

  const existingDoc = existing.docs[0]

  // Reactivation flow: previously unsubscribed → start a fresh double opt-in
  if (existingDoc) {
    if (existingDoc.status === 'active') {
      return NextResponse.json({ ok: true, alreadyActive: true })
    }
    // pending or unsubscribed → re-issue confirm token
    await payload.update({
      collection: 'subscribers',
      id: existingDoc.id,
      data: {
        profile,
        locale,
        status: 'pending',
        confirmToken,
        unsubscribeToken,
        unsubscribedAt: null,
        metadata: { ip, userAgent, referrer },
      },
    })
  } else {
    await payload.create({
      collection: 'subscribers',
      data: {
        email: email.toLowerCase(),
        profile,
        locale,
        status: 'pending',
        confirmToken,
        unsubscribeToken,
        metadata: { ip, userAgent, referrer },
      },
    })
  }

  // Send the double-opt-in email
  try {
    const tpl = confirmEmail({ email, token: confirmToken, locale })
    await sendEmail({ to: email, ...tpl })
  } catch (err) {
    console.error('[newsletter] confirm email send failed', err)
    // We still reply OK to the user — they can re-submit. Don't leak details.
  }

  return NextResponse.json({ ok: true })
}
