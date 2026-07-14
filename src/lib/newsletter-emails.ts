/**
 * HTML/text templates for newsletter emails.
 * Localized FR/EN. Plain HTML, no CSS framework — works in every email client.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// CAD official palette (Thomas Durieux June 2024).
// Kept in sync with tailwind.config.ts and globals.css.
// Inlined here because email clients don't understand CSS variables.
const COLORS = {
  ink: '#0A0A0A',
  paper: '#F4F4F0',
  accent: '#FF277F', // CAD Pink (default brand accent)
  bodyText: '#404040',
  mutedText: '#737373',
  faintText: '#A3A3A3',
  hairline: '#E5E5E5',
} as const

const baseStyle = `
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: ${COLORS.ink};
  background: ${COLORS.paper};
  padding: 24px;
`

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;background:${COLORS.ink};color:${COLORS.paper};padding:14px 28px;border-radius:9999px;text-decoration:none;font-size:14px;">
    ${label}
  </a>
`

export function confirmEmail({
  email,
  token,
  locale,
}: {
  email: string
  token: string
  locale: 'fr' | 'en'
}) {
  const link = `${SITE_URL}/${locale}/newsletter/confirm?token=${encodeURIComponent(token)}`

  if (locale === 'fr') {
    return {
      subject: 'Confirmez votre inscription à la newsletter du CAD',
      html: `
        <div style="${baseStyle}">
          <h1 style="font-size:22px;margin:0 0 16px;">Bienvenue au CAD Brussels</h1>
          <p style="line-height:1.5;color:#404040;">
            Vous avez demandé à recevoir la newsletter du CAD avec l'adresse <strong>${email}</strong>.
            Pour confirmer votre inscription, cliquez sur le bouton ci-dessous.
          </p>
          <p style="margin:28px 0;">${button(link, 'Confirmer mon inscription')}</p>
          <p style="font-size:13px;color:#737373;line-height:1.5;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
            <a href="${link}" style="color:${COLORS.accent};">${link}</a>
          </p>
          <p style="font-size:12px;color:#a3a3a3;margin-top:32px;">
            Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.
            Aucune inscription ne sera enregistrée.
          </p>
        </div>
      `,
      text: `Confirmez votre inscription à la newsletter du CAD : ${link}`,
    }
  }

  return {
    subject: 'Confirm your subscription to the CAD newsletter',
    html: `
      <div style="${baseStyle}">
        <h1 style="font-size:22px;margin:0 0 16px;">Welcome to CAD Brussels</h1>
        <p style="line-height:1.5;color:#404040;">
          You requested to receive the CAD newsletter with the address <strong>${email}</strong>.
          To confirm your subscription, click the button below.
        </p>
        <p style="margin:28px 0;">${button(link, 'Confirm my subscription')}</p>
        <p style="font-size:13px;color:#737373;line-height:1.5;">
          If the button doesn't work, copy this link into your browser:<br>
          <a href="${link}" style="color:${COLORS.accent};">${link}</a>
        </p>
        <p style="font-size:12px;color:#a3a3a3;margin-top:32px;">
          If you didn't request this, simply ignore this message. No subscription will be saved.
        </p>
      </div>
    `,
    text: `Confirm your subscription to the CAD newsletter: ${link}`,
  }
}

export function welcomeEmail({
  email,
  unsubscribeToken,
  locale,
}: {
  email: string
  unsubscribeToken: string
  locale: 'fr' | 'en'
}) {
  const unsubLink = `${SITE_URL}/${locale}/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`

  if (locale === 'fr') {
    return {
      subject: 'Bienvenue dans la communauté CAD',
      html: `
        <div style="${baseStyle}">
          <h1 style="font-size:22px;margin:0 0 16px;">Inscription confirmée</h1>
          <p style="line-height:1.5;color:#404040;">
            Merci ${email}. Vous recevrez désormais nos actualités, événements
            et appels à candidature directement dans votre boîte mail.
          </p>
          <p style="line-height:1.5;color:#404040;margin-top:24px;">
            Une question ? Écrivez-nous à
            <a href="mailto:secretariat@cad.be" style="color:${COLORS.accent};">secretariat@cad.be</a>.
          </p>
          <hr style="border:0;border-top:1px solid #e5e5e5;margin:32px 0;">
          <p style="font-size:12px;color:#a3a3a3;line-height:1.5;">
            CAD, College of Art & Design · 25 rue Roberts-Jones, 1180 Bruxelles<br>
            Pour vous désinscrire en un clic :
            <a href="${unsubLink}" style="color:#a3a3a3;">se désinscrire</a>.
          </p>
        </div>
      `,
      text: `Inscription confirmée. Pour vous désinscrire : ${unsubLink}`,
    }
  }

  return {
    subject: 'Welcome to the CAD community',
    html: `
      <div style="${baseStyle}">
        <h1 style="font-size:22px;margin:0 0 16px;">Subscription confirmed</h1>
        <p style="line-height:1.5;color:#404040;">
          Thank you ${email}. You will now receive our news, events and
          admission calls straight to your inbox.
        </p>
        <p style="line-height:1.5;color:#404040;margin-top:24px;">
          Any question? Write to
          <a href="mailto:secretariat@cad.be" style="color:${COLORS.accent};">secretariat@cad.be</a>.
        </p>
        <hr style="border:0;border-top:1px solid #e5e5e5;margin:32px 0;">
        <p style="font-size:12px;color:#a3a3a3;line-height:1.5;">
          CAD, College of Art & Design · 25 rue Roberts-Jones, 1180 Brussels<br>
          One-click unsubscribe:
          <a href="${unsubLink}" style="color:#a3a3a3;">unsubscribe</a>.
        </p>
      </div>
    `,
    text: `Subscription confirmed. To unsubscribe: ${unsubLink}`,
  }
}
