import { NextResponse } from 'next/server'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
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

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 422 })
  }
  const { name, email, subject, message } = parsed.data

  // Send via Resend if configured, otherwise just log (dev mode).
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL ?? 'secretariat@cad.be'
  const from = process.env.RESEND_FROM ?? 'CAD Brussels <noreply@cad.be>'

  if (!apiKey) {
    console.info('[contact] (dev) message received', {
      to,
      from,
      name,
      email,
      subject,
    })
    return NextResponse.json({ ok: true, dev: true })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `[CAD] ${subject}`,
      text: `De: ${name} <${email}>\n\n${message}`,
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('[contact] resend error', detail)
    return NextResponse.json({ error: 'send_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
