import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'

/**
 * /privacy — Politique de confidentialité RGPD.
 *
 * Page hand-coded conforme RGPD (UE 2016/679). Couvre la collecte de
 * données via les 4 formulaires du site : Contact, Newsletter (double
 * opt-in), Lead (info-pack / I would like to), Application (pré-inscription).
 *
 * Doit être mise à jour si : nouveau formulaire ajouté, nouveau sous-traitant
 * (ex: changement de provider email Resend → Postmark), ou changement
 * légal de DPO.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Politique de confidentialité · CAD Brussels',
        description:
          "Comment le CAD Brussels collecte, traite et protège vos données personnelles. Vos droits RGPD et comment les exercer.",
        robots: { index: false },
      }
    : {
        title: 'Privacy policy · CAD Brussels',
        description:
          'How CAD Brussels collects, processes and protects your personal data. Your GDPR rights and how to exercise them.',
        robots: { index: false },
      }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        title: 'Politique de confidentialité',
        intro:
          "Le CAD Brussels collecte vos données personnelles uniquement dans le cadre de votre demande (information, candidature, newsletter, contact). Cette politique détaille ce qui est collecté, pourquoi, combien de temps, et comment exercer vos droits.",
        lastUpdate: 'Dernière mise à jour : mai 2026',
        sections: [
          {
            heading: 'Responsable du traitement',
            body:
              "CAD Brussels, 25 rue Roberts-Jones, 1180 Uccle, Belgique. Pour toute question relative à vos données : secretariat@cad.be",
          },
          {
            heading: 'Données collectées',
            body:
              "Selon le formulaire : nom et prénom, adresse email, téléphone (optionnel), pays, programme d'intérêt, message libre. Aucune donnée sensible n'est collectée (santé, religion, opinions politiques). Aucun profilage automatisé.",
          },
          {
            heading: 'Finalités du traitement',
            body:
              "Répondre à votre demande, vous envoyer la documentation demandée, traiter votre candidature, vous tenir informé·e des événements et programmes si vous y consentez (newsletter). Base légale : votre consentement (article 6.1.a RGPD) ou l'exécution d'une mesure pré-contractuelle (article 6.1.b RGPD) pour les candidatures.",
          },
          {
            heading: 'Durée de conservation',
            body:
              "Demandes d'information : 12 mois. Inscrits newsletter : tant que vous restez abonné·e (désinscription possible à chaque envoi). Candidatures : 24 mois après dernière interaction. Dossiers étudiants : conservation conforme au décret de la Fédération Wallonie-Bruxelles.",
          },
          {
            heading: 'Destinataires',
            body:
              "Vos données sont accessibles uniquement à l'équipe administrative du CAD Brussels. Nous utilisons les sous-traitants suivants : Resend (envoi d'emails transactionnels, données hébergées en UE) et notre hébergeur (Vercel ou Scaleway selon configuration finale). Aucun transfert hors UE sans clauses contractuelles types.",
          },
          {
            heading: 'Vos droits',
            body:
              "Vous disposez à tout moment des droits d'accès, de rectification, d'effacement, d'opposition, de limitation, et de portabilité de vos données. Pour exercer ces droits : envoyez un email à secretariat@cad.be avec une copie de votre pièce d'identité. Réponse sous 30 jours.",
          },
          {
            heading: 'Réclamations',
            body:
              "Vous pouvez introduire une réclamation auprès de l'Autorité de protection des données belge (APD) : rue de la Presse 35, 1000 Bruxelles · contact@apd-gba.be · www.autoriteprotectiondonnees.be",
          },
          {
            heading: 'Cookies',
            body:
              "Le site utilise uniquement des cookies techniques nécessaires au fonctionnement (préférence de langue, session). Aucun cookie publicitaire ou de tracking tiers. Mesure d'audience anonymisée via Plausible Analytics (sans cookie).",
          },
        ],
        contactCta:
          "Une question sur vos données ?",
        contactBody:
          "Le secrétariat répond rapidement à toute demande RGPD.",
        contactButton: 'Contacter le secrétariat',
      }
    : {
        title: 'Privacy policy',
        intro:
          "CAD Brussels collects your personal data only within the scope of your request (information, application, newsletter, contact). This policy details what is collected, why, for how long, and how to exercise your rights.",
        lastUpdate: 'Last updated: May 2026',
        sections: [
          {
            heading: 'Data controller',
            body:
              'CAD Brussels, 25 rue Roberts-Jones, 1180 Uccle, Belgium. For any question regarding your data: secretariat@cad.be',
          },
          {
            heading: 'Data collected',
            body:
              'Depending on the form: first and last name, email address, phone (optional), country, program of interest, free-form message. No sensitive data is collected (health, religion, political opinions). No automated profiling.',
          },
          {
            heading: 'Purposes',
            body:
              'To respond to your request, send you the requested documentation, process your application, keep you informed of events and programs if you consent to it (newsletter). Legal basis: your consent (article 6.1.a GDPR) or the execution of a pre-contractual measure (article 6.1.b GDPR) for applications.',
          },
          {
            heading: 'Retention period',
            body:
              'Information requests: 12 months. Newsletter subscribers: as long as you remain subscribed (unsubscribe link in every email). Applications: 24 months after last interaction. Student files: retention in accordance with the decree of the Wallonia-Brussels Federation.',
          },
          {
            heading: 'Recipients',
            body:
              'Your data is accessible only to the CAD Brussels administrative team. We use the following sub-processors: Resend (transactional email, data hosted in EU) and our hosting provider (Vercel or Scaleway depending on final configuration). No transfer outside the EU without standard contractual clauses.',
          },
          {
            heading: 'Your rights',
            body:
              'You have at any time the rights of access, rectification, erasure, objection, restriction, and data portability. To exercise these rights: send an email to secretariat@cad.be with a copy of your ID. Response within 30 days.',
          },
          {
            heading: 'Complaints',
            body:
              'You may file a complaint with the Belgian Data Protection Authority (APD/GBA): rue de la Presse 35, 1000 Brussels · contact@apd-gba.be · www.autoriteprotectiondonnees.be',
          },
          {
            heading: 'Cookies',
            body:
              "The site uses only technical cookies necessary for operation (language preference, session). No advertising or third-party tracking cookies. Anonymised audience measurement via Plausible Analytics (cookieless).",
          },
        ],
        contactCta: 'A question about your data?',
        contactBody:
          'The secretariat responds quickly to any GDPR request.',
        contactButton: 'Contact the secretariat',
      }

  return (
    <article className="container max-w-3xl py-20">
      <h1 className="font-display text-4xl md:text-5xl">{L.title}</h1>
      <p className="mt-3 text-sm uppercase tracking-widest text-ink/50">
        {L.lastUpdate}
      </p>
      <p className="mt-6 text-lg text-ink/70">{L.intro}</p>
      <div className="mt-12 space-y-10">
        {L.sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-xl">{section.heading}</h2>
            <p className="mt-3 text-ink/80">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-ink/10 bg-paper p-8">
        <h2 className="font-display text-xl">{L.contactCta}</h2>
        <p className="mt-2 text-ink/70">{L.contactBody}</p>
        <Link
          href={`/${locale}/contact`}
          className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-paper hover:bg-ink/90"
        >
          {L.contactButton}
        </Link>
      </div>
    </article>
  )
}
