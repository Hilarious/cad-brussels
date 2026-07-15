import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail } from '@/lib/email'
import { leadSchema as Schema } from '@/lib/validation/lead'

const SECTION_LABELS: Record<string, string> = {
  'bachelor-interior': "Bachelor, Architecture d’intérieur",
  'bachelor-communication': 'Bachelor, Communication & Digital',
  'bachelor-fashion': 'Bachelor, Mode & Accessoires',
  'master-interior': "Master, Architecture d’intérieur 2 ans",
  'master-home-living': 'Master, Home & Living',
  'master-digital-brand': 'Master, Digital Brand Content',
  'master-image': 'Master, Image / 3D / Motion / IA',
  'master-event': 'Master, Event Management',
  'lifelong-genai': 'Lifelong Learning, IA générative',
  undecided: 'Pas encore décidé·e',
}

const INTENT_LABELS: Record<string, string> = {
  brochure: 'Recevoir la brochure',
  visit: 'Visiter le CAD',
  apply: 'Candidater',
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  // Honeypot triggered → fake success
  if ((parsed.data as { website?: string }).website) {
    return NextResponse.json({ ok: true })
  }

  const data = parsed.data
  const payload = await getPayload({ config })

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null
  const userAgent = req.headers.get('user-agent') ?? null
  const referrer = req.headers.get('referer') ?? null

  // 1) Persist the lead
  await payload.create({
    collection: 'leads',
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone ?? undefined,
      intents: data.intents,
      desiredSection: data.desiredSection,
      profile: data.profile,
      message: data.message ?? undefined,
      status: 'new',
      locale: data.locale,
      consent: {
        acceptedTerms: true,
        ip,
        userAgent,
        referrer,
      },
    },
  })

  // 2) Notify the secretariat
  try {
    const isFR = data.locale === 'fr'
    const intents = data.intents
      .map((i) => `• ${INTENT_LABELS[i] ?? i}`)
      .join('\n')
    const section = SECTION_LABELS[data.desiredSection] ?? data.desiredSection
    const html = `
      <h2 style="font-family:sans-serif">Nouveau lead, formulaire « I would like to… »</h2>
      <p style="font-family:sans-serif">
        <strong>${data.firstName} ${data.lastName}</strong><br>
        <a href="mailto:${data.email}">${data.email}</a>
        ${data.phone ? `<br>${data.phone}` : ''}
      </p>
      <p style="font-family:sans-serif">
        <strong>Section visée :</strong> ${section}<br>
        <strong>Profil :</strong> ${data.profile}<br>
        <strong>Langue :</strong> ${data.locale.toUpperCase()}
      </p>
      <p style="font-family:sans-serif">
        <strong>Intentions :</strong><br>
        ${intents.replace(/\n/g, '<br>')}
      </p>
      ${data.message ? `<p style="font-family:sans-serif"><strong>Message :</strong><br>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p style="font-family:sans-serif;font-size:12px;color:#737373">
        Reçu via cad.be · IP ${ip ?? '-'} · ${new Date().toISOString()}
      </p>
    `
    await sendEmail({
      to: process.env.CONTACT_EMAIL ?? 'secretariat@cad.be',
      subject: `[CAD] Lead ${data.firstName} ${data.lastName}, ${section}`,
      html,
      text: `${data.firstName} ${data.lastName} <${data.email}>\nSection: ${section}\nIntentions:\n${intents}\n${data.message ?? ''}`,
      replyTo: data.email,
    })

    // 3) Acknowledgement to the prospect
    const ackSubject = isFR
      ? 'Nous avons bien reçu votre demande'
      : 'We have received your request'
    const ackHtml = isFR
      ? `<div style="font-family:'Outfit',sans-serif;color:#0A0A0A;background:#F4F4F0;padding:24px">
          <h1 style="font-size:22px">Merci ${data.firstName}.</h1>
          <p>Nous avons bien reçu votre demande pour <strong>${section}</strong>. Le secrétariat vous recontactera dans les 48 heures ouvrées.</p>
          <p>Vos intentions :</p>
          <ul>${data.intents.map((i) => `<li>${INTENT_LABELS[i] ?? i}</li>`).join('')}</ul>
          <hr style="border:0;border-top:1px solid #e5e5e5;margin:32px 0">
          <p style="font-size:12px;color:#a3a3a3">CAD, College of Art & Design · 25 rue Roberts-Jones, 1180 Bruxelles</p>
        </div>`
      : `<div style="font-family:'Outfit',sans-serif;color:#0A0A0A;background:#F4F4F0;padding:24px">
          <h1 style="font-size:22px">Thanks ${data.firstName}.</h1>
          <p>We have received your request for <strong>${section}</strong>. The secretariat will get back to you within 2 working days.</p>
          <p>Your intents:</p>
          <ul>${data.intents.map((i) => `<li>${INTENT_LABELS[i] ?? i}</li>`).join('')}</ul>
          <hr style="border:0;border-top:1px solid #e5e5e5;margin:32px 0">
          <p style="font-size:12px;color:#a3a3a3">CAD, College of Art & Design · 25 rue Roberts-Jones, 1180 Brussels</p>
        </div>`
    await sendEmail({
      to: data.email,
      subject: ackSubject,
      html: ackHtml,
    })
  } catch (err) {
    console.error('[leads] notification email failed', err)
    // Lead is saved, that's the main thing — don't 500
  }

  return NextResponse.json({ ok: true })
}
