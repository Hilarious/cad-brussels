/**
 * Tiny transactional-email helper.
 *
 * - In dev (no RESEND_API_KEY): logs the email to the console so you can
 *   copy/paste the confirm/unsubscribe link from the terminal.
 * - In prod (RESEND_API_KEY set): sends via Resend's HTTP API.
 *
 * Swap with Postmark, Sendgrid, etc. by changing the `sendEmail` body.
 */

export type EmailPayload = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'CAD Brussels <noreply@cad.be>'

  if (!apiKey) {
    console.info('\n────────── [email] DEV mode (no RESEND_API_KEY) ──────────')
    console.info(`From:    ${from}`)
    console.info(`To:      ${payload.to}`)
    console.info(`Subject: ${payload.subject}`)
    if (payload.replyTo) console.info(`Reply-To: ${payload.replyTo}`)
    console.info('--- HTML ---')
    console.info(payload.html)
    if (payload.text) {
      console.info('--- TEXT ---')
      console.info(payload.text)
    }
    console.info('───────────────────────────────────────────────────────────\n')
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${body}`)
  }
}
