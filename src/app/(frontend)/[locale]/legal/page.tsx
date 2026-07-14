import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

/**
 * /legal — Mentions légales obligatoires.
 *
 * Page hand-coded plutôt que CMS pour deux raisons :
 *  1. Le contenu change rarement (numéro d'entreprise, adresse, hosting).
 *  2. La structure est juridique et doit rester stable, pas un terrain
 *     d'éditeur visuel pour Eric / Fabienne.
 *
 * Source des données : registre BCE belge + statuts CAD Brussels.
 * Doit être mise à jour si : changement d'adresse, de raison sociale,
 * d'hébergeur, ou de DPO.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Mentions légales · CAD Brussels',
        description:
          "Informations légales du site cad.be : éditeur, hébergement, propriété intellectuelle, contact.",
        robots: { index: false },
      }
    : {
        title: 'Legal notice · CAD Brussels',
        description:
          'Legal information for cad.be: publisher, hosting, intellectual property, contact.',
        robots: { index: false },
      }
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        title: 'Mentions légales',
        intro:
          "Le site cad.be est édité par le CAD Brussels, école supérieure d'art et de design fondée en 1961.",
        sections: [
          {
            heading: 'Éditeur',
            body:
              "CAD Brussels (College of Art & Design Brussels) · 25 rue Roberts-Jones, 1180 Uccle, Belgique · Numéro d'entreprise BCE : à compléter · Directeur de la publication : Eric Vanden Broeck, Dean.",
          },
          {
            heading: 'Contact',
            body:
              "Téléphone : +32 2 640 40 32 · Email : secretariat@cad.be · Pour toute question légale : direction@cad.be",
          },
          {
            heading: 'Hébergement',
            body:
              "Site hébergé par : à confirmer (Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA, ou Scaleway SAS, 8 rue de la Ville l'Évêque, 75008 Paris).",
          },
          {
            heading: 'Propriété intellectuelle',
            body:
              "L'ensemble des contenus du site (textes, images, vidéos, logos, charte graphique) est la propriété exclusive du CAD Brussels ou de ses ayants droit. Toute reproduction, totale ou partielle, est soumise à autorisation préalable écrite.",
          },
          {
            heading: 'Crédits',
            body:
              "Charte graphique print : Thomas Durieux (Finlande Graphic Design), juin 2024. Refonte digitale 2026 : Hilarious Agency.",
          },
          {
            heading: 'Responsabilité',
            body:
              "Les informations diffusées sur le site sont fournies à titre indicatif. Le CAD Brussels ne peut être tenu responsable d'erreurs ou d'omissions, malgré tout le soin apporté à la rédaction des contenus.",
          },
        ],
      }
    : {
        title: 'Legal notice',
        intro:
          'The website cad.be is published by CAD Brussels, a school of art and design founded in 1961.',
        sections: [
          {
            heading: 'Publisher',
            body:
              'CAD Brussels (College of Art & Design Brussels) · 25 rue Roberts-Jones, 1180 Uccle, Belgium · Business registration number: to be completed · Director of publication: Eric Vanden Broeck, Dean.',
          },
          {
            heading: 'Contact',
            body:
              'Phone: +32 2 640 40 32 · Email: secretariat@cad.be · For any legal request: direction@cad.be',
          },
          {
            heading: 'Hosting',
            body:
              "Site hosted by: to be confirmed (Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA, or Scaleway SAS, 8 rue de la Ville l'Évêque, 75008 Paris).",
          },
          {
            heading: 'Intellectual property',
            body:
              'All content on this site (texts, images, videos, logos, design system) is the exclusive property of CAD Brussels or its rightful owners. Any reproduction, in whole or in part, requires prior written authorization.',
          },
          {
            heading: 'Credits',
            body:
              'Print design system: Thomas Durieux (Finlande Graphic Design), June 2024. Digital redesign 2026: Hilarious Agency.',
          },
          {
            heading: 'Liability',
            body:
              'Information provided on this site is for general guidance only. CAD Brussels cannot be held responsible for errors or omissions, despite all care taken in the editorial process.',
          },
        ],
      }

  return (
    <article className="container max-w-3xl py-20">
      <h1 className="font-display text-4xl md:text-5xl">{L.title}</h1>
      <p className="mt-6 text-lg text-ink/70">{L.intro}</p>
      <div className="mt-12 space-y-10">
        {L.sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-xl">{section.heading}</h2>
            <p className="mt-3 text-ink/80">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  )
}
