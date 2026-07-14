import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Visa étudiant Belgique, démarches pour étudier au CAD',
        description:
          "Visa D, inscription à la commune, ouverture de compte, sécurité sociale. Toutes les démarches pour étudiants UE et hors UE qui rejoignent le CAD à Bruxelles.",
      }
    : {
        title: 'Belgium student visa, steps to study at CAD',
        description:
          'Visa D, town hall registration, bank account, healthcare. All the steps for EU and non-EU students joining CAD in Brussels.',
      }
}

export default async function VisaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  return (
    <article className="container py-16">
      <Link
        href={`/${locale}/etudier-a-bruxelles`}
        className="text-sm text-ink/60 hover:text-accent"
      >
        ← {isFR ? 'Étudier à Bruxelles' : 'Studying in Brussels'}
      </Link>

      <div className="mt-8 max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {isFR ? 'Guide visa et démarches' : 'Visa and paperwork guide'}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
          {isFR
            ? 'Visa étudiant et démarches administratives'
            : 'Student visa and administrative steps'}
        </h1>
        <p className="mt-6 text-lg text-ink/70">
          {isFR
            ? "Les démarches dépendent de votre nationalité. Bonne nouvelle : le secrétariat du CAD vous accompagne à chaque étape une fois votre admission confirmée."
            : "Procedures depend on your nationality. The good news: the CAD secretariat assists you at every step once your admission is confirmed."}
        </p>
      </div>

      <div className="mt-12 max-w-3xl space-y-12 text-ink/85">
        {/* Section EU */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR
              ? 'Étudiants UE, EEE et Suisse'
              : 'EU, EEA and Swiss students'}
          </h2>
          <p className="mt-4">
            {isFR
              ? "Si vous êtes ressortissant d'un pays de l'Union européenne, de l'Espace économique européen ou de Suisse, vous n'avez pas besoin de visa pour étudier en Belgique. Les démarches sont simples."
              : "If you are a citizen of an EU country, the European Economic Area or Switzerland, you do not need a visa to study in Belgium. The procedures are simple."}
          </p>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm">
            <li>
              {isFR
                ? "Arrivez en Belgique avec votre carte d'identité ou passeport en cours de validité."
                : "Arrive in Belgium with your valid ID or passport."}
            </li>
            <li>
              {isFR
                ? "Dans les 8 jours suivant votre arrivée, présentez-vous à l'administration communale de votre lieu de résidence (Uccle pour le CAD si vous habitez à proximité)."
                : "Within 8 days of arrival, present yourself at the town hall of your place of residence (Uccle for CAD if you live nearby)."}
            </li>
            <li>
              {isFR
                ? "Apportez votre attestation d'inscription au CAD, votre passeport, une preuve de logement, une attestation de moyens financiers et 3 photos d'identité."
                : "Bring your CAD enrolment certificate, passport, proof of housing, proof of financial means and 3 ID photos."}
            </li>
            <li>
              {isFR
                ? "Vous recevrez une attestation d'enregistrement, puis une carte E (séjour temporaire) après quelques semaines."
                : "You will receive a registration certificate, then an E card (temporary residence) after a few weeks."}
            </li>
          </ol>
        </section>

        {/* Section non-EU */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? 'Étudiants hors UE' : 'Non-EU students'}
          </h2>
          <p className="mt-4">
            {isFR
              ? "Si vous n'êtes pas ressortissant UE, vous devez demander un visa étudiant de type D (long séjour) dans votre pays de résidence avant le départ. Comptez 2 à 3 mois pour la procédure complète."
              : "If you are not an EU citizen, you must apply for a type D student visa (long stay) in your country of residence before departure. Allow 2 to 3 months for the full procedure."}
          </p>

          <h3 className="mt-8 font-display text-xl">
            {isFR
              ? 'Documents à préparer'
              : 'Documents to prepare'}
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
            <li>
              {isFR
                ? "Attestation officielle d'inscription au CAD"
                : 'Official enrolment certificate from CAD'}
            </li>
            <li>
              {isFR
                ? 'Passeport valide au moins 12 mois après la date prévue de retour'
                : 'Passport valid at least 12 months after planned return date'}
            </li>
            <li>
              {isFR
                ? "Preuve de moyens financiers : 10 020 € pour l'année académique 2025-2026 (montant fixé par l'État belge)"
                : 'Proof of financial means: €10,020 for the 2025-2026 academic year (set by the Belgian State)'}
            </li>
            <li>
              {isFR
                ? 'Certificat médical et attestation de bonne vie et mœurs'
                : 'Medical certificate and certificate of good conduct'}
            </li>
            <li>
              {isFR
                ? "Justificatif de logement à Bruxelles (peut être fourni à l'arrivée si difficile à obtenir avant)"
                : 'Proof of housing in Brussels (can be provided on arrival if hard to obtain beforehand)'}
            </li>
            <li>
              {isFR
                ? "Frais de dossier visa : environ 200 €"
                : 'Visa file fees: approximately €200'}
            </li>
          </ul>

          <h3 className="mt-8 font-display text-xl">
            {isFR ? 'Une fois en Belgique' : 'Once in Belgium'}
          </h3>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm">
            <li>
              {isFR
                ? "Inscription obligatoire à l'administration communale dans les 8 jours suivant l'arrivée."
                : 'Mandatory registration at the town hall within 8 days of arrival.'}
            </li>
            <li>
              {isFR
                ? "Demande de carte de séjour (carte A pour les étudiants hors UE)."
                : 'Application for a residence card (A card for non-EU students).'}
            </li>
            <li>
              {isFR
                ? "Souscription à une mutuelle belge (sécurité sociale étudiante)."
                : 'Registration with a Belgian mutuelle (student healthcare).'}
            </li>
            <li>
              {isFR
                ? "Ouverture d'un compte bancaire belge (BNP Paribas Fortis, KBC, ING acceptent les étudiants étrangers avec carte de séjour ou récépissé)."
                : 'Opening a Belgian bank account (BNP Paribas Fortis, KBC, ING accept foreign students with a residence card or receipt).'}
            </li>
          </ol>
        </section>

        {/* Section Healthcare */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? 'Sécurité sociale et santé' : 'Healthcare and social security'}
          </h2>
          <p className="mt-4 text-sm">
            {isFR
              ? "En Belgique, l'affiliation à une mutuelle est obligatoire pour accéder aux remboursements de soins. Les principales mutuelles ouvertes aux étudiants sont Solidaris, Mutualité chrétienne et Partenamut. Affiliation gratuite ou autour de 60 € par an."
              : 'In Belgium, registering with a mutuelle (health insurance fund) is mandatory to access healthcare reimbursements. The main mutuelles open to students are Solidaris, Mutualité chrétienne and Partenamut. Free or around €60 per year.'}
          </p>
          <p className="mt-4 text-sm">
            {isFR
              ? "Pour les étudiants UE, la Carte européenne d'assurance maladie (CEAM) reste valide en Belgique pour la première année."
              : "For EU students, the European Health Insurance Card (EHIC) remains valid in Belgium for the first year."}
          </p>
        </section>

        {/* Section CAD support */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR
              ? "L'accompagnement du CAD"
              : "CAD's support"}
          </h2>
          <p className="mt-4 text-sm">
            {isFR
              ? "Une fois votre admission confirmée, le secrétariat vous envoie une checklist personnalisée selon votre nationalité, vous fournit les attestations officielles dans les délais, et reste joignable par email pour toute question administrative pendant toute la procédure."
              : "Once your admission is confirmed, the secretariat sends you a personalised checklist based on your nationality, provides the official certificates on time, and stays reachable by email for any administrative question throughout the process."}
          </p>
        </section>
      </div>

      {/* Cross-links */}
      <div className="mx-auto mt-16 max-w-3xl border-t border-ink/10 pt-10">
        <p className="text-sm uppercase tracking-widest text-accent">
          {isFR ? 'À lire aussi' : 'Also read'}
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <Link
              href={`/${locale}/etudier-a-bruxelles/se-loger`}
              className="text-ink/80 hover:text-accent"
            >
              → {isFR ? 'Se loger à Bruxelles' : 'Housing in Brussels'}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/etudier-a-bruxelles/vie-pratique`}
              className="text-ink/80 hover:text-accent"
            >
              → {isFR ? 'Vie pratique et budget' : 'Daily life and budget'}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/contact`}
              className="text-ink/80 hover:text-accent"
            >
              → {isFR ? 'Contacter le secrétariat' : 'Contact the secretariat'}
            </Link>
          </li>
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: isFR
              ? 'Visa étudiant et démarches administratives'
              : 'Student visa and administrative steps',
            inLanguage: locale,
            author: {
              '@type': 'EducationalOrganization',
              name: 'CAD Brussels',
            },
            about: ['Student visa', 'Belgium', 'Type D visa', 'Non-EU students'],
          }),
        }}
      />
    </article>
  )
}
