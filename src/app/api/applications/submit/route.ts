import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail } from '@/lib/email'

const Schema = z.object({
  // Identity
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(40),
  birthDate: z.string().min(8).max(20), // ISO date string from <input type=date>
  nationality: z.string().min(1).max(80),

  // Address (all optional at this stage; admissions can complete later)
  street: z.string().max(200).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional().nullable(),

  // Program
  desiredProgram: z.string().min(1).max(60),
  startYear: z.enum(['2026', '2027']),
  startLevel: z.enum(['bac1', 'bac2', 'bac3', 'm1', 'm2']),

  // Academic
  currentSchool: z.string().max(200).optional().nullable(),
  lastDiploma: z.string().max(200).optional().nullable(),
  lastDiplomaYear: z.number().int().min(1990).max(2030).optional().nullable(),

  // Motivation
  motivation: z.string().min(20).max(3000),
  portfolioUrl: z.string().url().max(500).optional().nullable(),

  // Source
  source: z
    .enum([
      'search',
      'word-of-mouth',
      'social',
      'event',
      'press',
      'alumni',
      'other',
    ])
    .optional()
    .nullable(),

  // RGPD
  acceptedTerms: z.literal(true),
  locale: z.enum(['fr', 'en']).default('fr'),

  // honeypot
  website: z.string().max(0).optional(),
})

const PROGRAM_LABELS: Record<string, string> = {
  'bachelor-interior': 'Bachelor · Architecture d’intérieur',
  'bachelor-communication': 'Bachelor · Communication & Digital',
  'bachelor-fashion': 'Bachelor · Mode & Accessoires',
  'master-interior': 'Master · Architecture d’intérieur 2 ans',
  'master-home-living': 'Master · Home & Living',
  'master-digital-brand': 'Master · Digital Brand Content',
  'master-image': 'Master · Image / 3D / Motion / IA',
  'master-event': 'Master · Event Management',
}

const LEVEL_LABELS: Record<string, string> = {
  bac1: '1ère année (Bac1)',
  bac2: '2ème année (Bac2)',
  bac3: '3ème année (Bac3)',
  m1: 'Master 1',
  m2: 'Master 2',
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

  // 1) Persist the application
  await payload.create({
    collection: 'applications',
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      birthDate: new Date(data.birthDate).toISOString(),
      nationality: data.nationality,
      address: {
        street: data.street ?? undefined,
        postalCode: data.postalCode ?? undefined,
        city: data.city ?? undefined,
        country: data.country ?? undefined,
      },
      desiredProgram: data.desiredProgram,
      startYear: data.startYear,
      startLevel: data.startLevel,
      academic: {
        currentSchool: data.currentSchool ?? undefined,
        lastDiploma: data.lastDiploma ?? undefined,
        lastDiplomaYear: data.lastDiplomaYear ?? undefined,
      },
      motivation: data.motivation,
      portfolioUrl: data.portfolioUrl ?? undefined,
      source: data.source ?? undefined,
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

  // 2) Notify the admissions team
  try {
    const isFR = data.locale === 'fr'
    const program = PROGRAM_LABELS[data.desiredProgram] ?? data.desiredProgram
    const level = LEVEL_LABELS[data.startLevel] ?? data.startLevel

    const html = `
      <h2 style="font-family:sans-serif">Nouvelle candidature</h2>
      <p style="font-family:sans-serif">
        <strong>${data.firstName} ${data.lastName}</strong><br>
        <a href="mailto:${data.email}">${data.email}</a><br>
        ${data.phone}<br>
        <span style="color:#737373">Né·e le ${new Date(data.birthDate).toLocaleDateString('fr-FR')} · ${data.nationality}</span>
      </p>
      <p style="font-family:sans-serif">
        <strong>Programme :</strong> ${program}<br>
        <strong>Niveau :</strong> ${level}<br>
        <strong>Rentrée :</strong> ${data.startYear}<br>
        <strong>Langue :</strong> ${data.locale.toUpperCase()}
      </p>
      ${
        data.currentSchool || data.lastDiploma
          ? `<p style="font-family:sans-serif">
              <strong>Parcours :</strong><br>
              ${data.currentSchool ? `École : ${data.currentSchool}<br>` : ''}
              ${data.lastDiploma ? `Diplôme : ${data.lastDiploma}${data.lastDiplomaYear ? ` (${data.lastDiplomaYear})` : ''}` : ''}
            </p>`
          : ''
      }
      <p style="font-family:sans-serif">
        <strong>Motivation :</strong><br>
        ${data.motivation.replace(/\n/g, '<br>')}
      </p>
      ${data.portfolioUrl ? `<p style="font-family:sans-serif"><strong>Portfolio :</strong> <a href="${data.portfolioUrl}">${data.portfolioUrl}</a></p>` : ''}
      <hr>
      <p style="font-family:sans-serif;font-size:12px;color:#737373">
        Source : ${data.source ?? '-'} · IP ${ip ?? '-'} · ${new Date().toISOString()}
      </p>
    `

    await sendEmail({
      to: process.env.ADMISSIONS_EMAIL ?? 'admissions@cad.be',
      subject: `[CAD] Candidature ${data.firstName} ${data.lastName}, ${program}`,
      html,
      text: `${data.firstName} ${data.lastName} <${data.email}>\nProgramme: ${program}\nNiveau: ${level}\nRentrée: ${data.startYear}\n\n${data.motivation}`,
      replyTo: data.email,
    })

    // 3) Acknowledgement to the candidate
    const ackSubject = isFR
      ? 'Votre candidature au CAD est bien reçue'
      : 'Your CAD application has been received'
    const ackHtml = isFR
      ? `<div style="font-family:'Outfit',sans-serif;color:#0A0A0A;background:#F4F4F0;padding:24px">
          <h1 style="font-size:22px">Merci ${data.firstName}.</h1>
          <p>Votre candidature au programme <strong>${program}</strong> pour la rentrée ${data.startYear} est bien reçue.</p>
          <p><strong>La suite :</strong></p>
          <ol>
            <li>Sous 48h, on vous confirme la réception et on commence à regarder votre dossier.</li>
            <li>Sous 5 jours ouvrés, on vous propose un créneau d'entretien (visio ou présentiel, ~45 minutes).</li>
            <li>Sous 7 jours après l'entretien, vous recevez notre réponse.</li>
          </ol>
          <p>Si vous avez une question d'ici là, écrivez à <a href="mailto:admissions@cad.be">admissions@cad.be</a>.</p>
          <hr style="border:0;border-top:1px solid #e5e5e5;margin:32px 0">
          <p style="font-size:12px;color:#a3a3a3">CAD, College of Art & Design · 25 rue Roberts-Jones, 1180 Bruxelles</p>
        </div>`
      : `<div style="font-family:'Outfit',sans-serif;color:#0A0A0A;background:#F4F4F0;padding:24px">
          <h1 style="font-size:22px">Thank you ${data.firstName}.</h1>
          <p>Your application to the <strong>${program}</strong> program for the ${data.startYear} intake has been received.</p>
          <p><strong>What happens next:</strong></p>
          <ol>
            <li>Within 48h, we confirm receipt and start reviewing your file.</li>
            <li>Within 5 working days, we propose an interview slot (video call or on site, ~45 minutes).</li>
            <li>Within 7 days after the interview, you receive our answer.</li>
          </ol>
          <p>Any question in the meantime, write to <a href="mailto:admissions@cad.be">admissions@cad.be</a>.</p>
          <hr style="border:0;border-top:1px solid #e5e5e5;margin:32px 0">
          <p style="font-size:12px;color:#a3a3a3">CAD, College of Art & Design · 25 rue Roberts-Jones, 1180 Brussels</p>
        </div>`
    await sendEmail({
      to: data.email,
      subject: ackSubject,
      html: ackHtml,
    })
  } catch (err) {
    console.error('[applications] notification email failed', err)
    // Application is saved, that is the main thing — don't 500
  }

  return NextResponse.json({ ok: true })
}
