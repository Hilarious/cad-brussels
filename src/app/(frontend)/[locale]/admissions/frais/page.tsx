import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'
import { Breadcrumb } from '@/components/breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Frais de scolarité au CAD Brussels, Undergraduate, postgraduate, spécialisation',
        description:
          "Tarifs 2026-2027 : Undergraduate et postgraduate 9 500 €/an pour les étudiants EU, 11 000 €/an hors EU. Spécialisation Fashion Business 4 500 €. Échéancier de paiement détaillé.",
      }
    : {
        title: 'Tuition fees at CAD Brussels, Undergraduate, postgraduate, specialisation',
        description:
          '2026-2027 fees: Undergraduate and postgraduate €9,500/year for EU students, €11,000/year non-EU. Fashion Business Specialization €4,500. Detailed payment schedule.',
      }
}

export default async function TuitionFeesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  const L = isFR
    ? {
        backLabel: 'Admissions',
        eyebrow: 'Frais de scolarité',
        title: 'Tout sur les frais de scolarité au CAD',
        intro:
          "Les tarifs et l'échéancier sont publics. Tarif identique pour les undergraduates et les postgraduates, garanti pour toute la durée du cursus, sauf indexation si l'inflation dépasse 5 % par an.",

        // ============================================================
        // EU students — Undergraduate & Master
        // ============================================================
        euTitle: 'Undergraduate et postgraduate · Étudiants UE',
        euAmount: '9 500 €',
        euAmountUnit: 'par an',
        euBreakdown: '9 200 € + 300 € de frais d’inscription',
        euScheduleTitle: 'Échéancier de paiement',
        euSchedule: [
          {
            when: 'À l’inscription',
            amount: '3 400 €',
            detail: '1er tiers · 300 € frais d’inscription + 3 100 €',
          },
          {
            when: 'Avant le 30 juin',
            amount: '3 050 €',
            detail: '2ème tiers',
          },
          {
            when: 'Avant le 15 septembre',
            amount: '3 050 €',
            detail: 'Dernier tiers',
          },
        ],
        euInstalmentNote:
          'Un plan de paiement échelonné est possible pour certains résidents belges, sur acceptation du dossier et avec un supplément de 300 € : 300 € et un premier tiers à l’admission, un deuxième tiers pour le 15 décembre 2026, un troisième tiers pour le 15 mars 2027.',

        // ============================================================
        // Non-EU students
        // ============================================================
        nonEuTitle: 'Undergraduate et postgraduate · Étudiants hors UE',
        nonEuAmount: '11 000 €',
        nonEuAmountUnit: 'par an',
        nonEuBreakdown: '10 700 € + 300 € de frais d’inscription',
        nonEuNote:
          "Le montant total doit être réglé au moment de l'inscription définitive afin de lancer la procédure de demande de visa si nécessaire. Pour les virements internationaux, les frais bancaires sont à la charge de l'expéditeur.",

        // ============================================================
        // Specialization (Fashion Business)
        // ============================================================
        specTitle: 'Spécialisation · Fashion Business',
        specSubtitle: 'Format à temps partiel',
        specEuTitle: 'Étudiants UE',
        specEuAmount: '4 500 €',
        specEuSchedule: [
          {
            when: 'À l’inscription',
            amount: '1 700 €',
            detail: '1er tiers · 300 € frais d’inscription + 1 400 €',
          },
          { when: 'Avant le 30 juin', amount: '1 400 €', detail: '2ème tiers' },
          {
            when: 'Avant le 15 septembre',
            amount: '1 400 €',
            detail: 'Dernier tiers',
          },
        ],
        specNonEuTitle: 'Étudiants hors UE',
        specNonEuNote:
          "Les autorités belges n'accordent pas de visas étudiants pour les programmes de spécialisation à temps partiel. Cette formation n'est donc pas accessible aux candidats hors UE nécessitant un visa.",
        specLink: 'Voir le programme Fashion Business →',

        // ============================================================
        // Bank details
        // ============================================================
        bankTitle: 'Coordonnées bancaires',
        bankName: 'CDP-CAD ASBL',
        bankBank: 'BNP Paribas Fortis',
        bankIban: 'BE70 0019 6550 3825',
        bankBic: 'GEBABEBB',
        bankNote:
          "Le CAD n'accepte pas les chèques bancaires. Les frais de scolarité doivent être versés sur ce compte. Pour les virements internationaux, les frais bancaires sont à la charge de l'émetteur.",

        // ============================================================
        // Disclosure section — what to know before signing
        // ============================================================
        disclosureTitle: 'À savoir avant de signer',
        disclosurePoints: [
          {
            title: 'Frais non inclus',
            body: "Les frais de scolarité ne couvrent pas les visites culturelles ni les voyages d'étude organisés pendant l'année.",
          },
          {
            title: 'Tarif garanti',
            body: "Les frais annoncés à votre inscription restent ceux que vous payez pour toute la durée du cursus, sauf en cas de redoublement de la première année si le tarif a augmenté entre-temps. En cas d'inflation supérieure à 5 % par an, les frais sont indexés.",
          },
          {
            title: 'Frais d’inscription · 300 €',
            body: "Ce montant couvre les frais administratifs généraux ainsi qu'une assurance individuelle « frais médicaux » souscrite par le CAD en cas d'accident. Il n'est pas remboursable, même en cas de désistement.",
          },
          {
            title: 'Abandon en cours d’année',
            body: "Le nombre de places étant limité chaque année, la totalité des frais de scolarité reste due en cas d'abandon des cours, pour quelque raison que ce soit, en cours d'année académique. Le solde éventuel est payable dans les 8 jours suivant le dernier jour de présence.",
          },
          {
            title: 'Signataires et garant',
            body: "Les personnes qui signent la fiche d'inscription sont personnellement et solidairement responsables du paiement de l'entièreté des frais de scolarité. Ces conditions valent pour tout le cycle entamé, même si une seule fiche est signée en début de cycle, et restent d'application en cas de changement d'orientation.",
          },
          {
            title: 'Retard de paiement',
            body: "Tout montant non payé dans les 8 jours de son échéance porte d'office un intérêt de 12 % l'an, majoré de dommages et intérêts fixés à 15 % du montant de la facture, avec un minimum de 125 €. Les cours peuvent être suspendus jusqu'au paiement complet.",
          },
          {
            title: 'Refus de visa',
            body: "Les étudiants hors UE paient la totalité des frais annuels pour obtenir le certificat scolaire nécessaire à la demande de visa. En cas de refus définitif du visa étudiant, après la procédure d'appel, le CAD rembourse le montant payé d'avance moins 1 300 € de frais administratifs, sur présentation de la lettre originale des autorités diplomatiques belges précisant la raison du refus, et à condition que le candidat ait suivi correctement et dans les délais toutes les instructions des autorités et du CAD.",
          },
          {
            title: 'Certificats',
            body: "Les certificats d'inscription et de fréquentation, ainsi que les documents pour allocations familiales ou abonnements de transport, ne sont délivrés qu'après paiement du droit d'inscription, et du minerval complet pour les ressortissants hors UE.",
          },
          {
            title: 'Reconnaissance des titres',
            body: "Le CAD est agréé par la Communauté française, mais ses formations et son diplôme ne sont pas reconnus par la Communauté française de Belgique (Article 14/4, §2). C'est pourquoi nous parlons d'Undergraduate (1er cycle, 3 ans, 180 ECTS) et de Postgraduate (2e cycle, 2 ans, 120 ECTS), et non des appellations réservées aux établissements reconnus.",
          },
        ],

        // ============================================================
        // Questions section
        // ============================================================
        questionsTitle: 'Une question sur les frais ou le financement ?',
        questionsBody:
          "Modalités de paiement, plan échelonné, aides possibles, virement international : ces sujets se discutent en direct avec le secrétariat. Plus efficace que de chercher la réponse seul·e.",
        questionsCta: 'Contacter le secrétariat',

        // ============================================================
        // Cross-links
        // ============================================================
        crossTitle: 'Et après ?',
        crossLinks: [
          {
            title: 'Postuler au CAD',
            body: 'Le formulaire de pré-inscription prend ~5 minutes. Pas de frais à payer à ce stade.',
            href: `/${locale}/apply`,
          },
          {
            title: 'Les 4 portes d’admission',
            body: 'Postuler, demander un entretien, venir à un Open Day, ou au Summer Breakfast.',
            href: `/${locale}/admissions`,
          },
          {
            title: 'Vivre à Bruxelles',
            body: "Logement, visa, transports, coût de la vie. Le guide complet pour préparer votre arrivée.",
            href: `/${locale}/etudier-a-bruxelles`,
          },
        ],
      }
    : {
        backLabel: 'Admissions',
        eyebrow: 'Tuition fees',
        title: 'Everything about tuition fees at CAD',
        intro:
          'Fees and payment schedule are public. Same fee for undergraduate and postgraduate, locked for the entire program duration, unless inflation exceeds 5% per year, in which case fees are indexed.',

        euTitle: 'Undergraduate and postgraduate · EU students',
        euAmount: '€9,500',
        euAmountUnit: 'per year',
        euBreakdown: '€9,200 + €300 registration fee',
        euScheduleTitle: 'Payment schedule',
        euSchedule: [
          {
            when: 'At registration',
            amount: '€3,400',
            detail: '1st third · €300 registration fee + €3,100',
          },
          {
            when: 'Before June 30',
            amount: '€3,050',
            detail: '2nd third',
          },
          {
            when: 'Before September 15',
            amount: '€3,050',
            detail: 'Final third',
          },
        ],
        euInstalmentNote:
          'A staggered payment plan is possible for some Belgian residents, subject to file acceptance and a €300 supplement: €300 plus a first third at admission, a second third by 15 December 2026, a third third by 15 March 2027.',

        nonEuTitle: 'Undergraduate and postgraduate · Non-EU students',
        nonEuAmount: '€11,000',
        nonEuAmountUnit: 'per year',
        nonEuBreakdown: '€10,700 + €300 registration fee',
        nonEuNote:
          'The full amount must be paid at final registration in order to launch the visa application procedure if needed. For international wire transfers, bank fees are borne by the sender.',

        specTitle: 'Specialization · Fashion Business',
        specSubtitle: 'Part-time format',
        specEuTitle: 'EU students',
        specEuAmount: '€4,500',
        specEuSchedule: [
          {
            when: 'At registration',
            amount: '€1,700',
            detail: '1st third · €300 registration fee + €1,400',
          },
          { when: 'Before June 30', amount: '€1,400', detail: '2nd third' },
          {
            when: 'Before September 15',
            amount: '€1,400',
            detail: 'Final third',
          },
        ],
        specNonEuTitle: 'Non-EU students',
        specNonEuNote:
          'Belgian authorities do not grant student visas for part-time specialization programs. This program is therefore not available to non-EU applicants requiring a visa.',
        specLink: 'See the Fashion Business program →',

        bankTitle: 'Bank details',
        bankName: 'CDP-CAD ASBL',
        bankBank: 'BNP Paribas Fortis',
        bankIban: 'BE70 0019 6550 3825',
        bankBic: 'GEBABEBB',
        bankNote:
          "CAD does not accept bank cheques. Tuition fees must be paid to this account. For international transfers, bank fees are borne by the sender.",

        disclosureTitle: 'What to know before signing',
        disclosurePoints: [
          {
            title: 'Not included',
            body: 'Tuition does not cover cultural visits or study trips organized during the year.',
          },
          {
            title: 'Locked fees',
            body: 'Fees announced at registration remain what you pay for the entire program duration, except if you repeat the first year and the price has increased meanwhile. If inflation exceeds 5% per year, fees are indexed.',
          },
          {
            title: 'Registration fee · €300',
            body: 'This amount covers general administrative costs and an individual medical-expenses insurance taken out by CAD in case of accident. It is non-refundable, even in case of withdrawal.',
          },
          {
            title: 'Dropping out during the year',
            body: 'Since spots are limited each year, the full annual tuition remains due in case of withdrawal from classes, for any reason, during the academic year. Any outstanding balance is payable within 8 days of the last day of attendance.',
          },
          {
            title: 'Signatories and guarantor',
            body: 'The persons signing the registration form are personally and jointly liable for payment of the full tuition fees. These conditions apply to the whole cycle started, even if only one form is signed at the beginning of the cycle, and remain applicable in case of a change of program.',
          },
          {
            title: 'Late payment',
            body: 'Any amount unpaid within 8 days of its due date automatically bears interest at 12% per year, plus liquidated damages of 15% of the invoice amount, with a minimum of €125. Classes may be suspended until full payment.',
          },
          {
            title: 'Visa refusal',
            body: 'Non-EU students pay the full annual fees to obtain the school certificate required for the visa application. In case of a final refusal of the student visa, after the appeal procedure, CAD refunds the amount paid in advance minus €1,300 of administrative costs, upon presentation of the original letter from the Belgian diplomatic authorities stating the reason for refusal, and provided the applicant has correctly and timely followed all instructions from the authorities and from CAD.',
          },
          {
            title: 'Certificates',
            body: 'Registration and attendance certificates, as well as documents for family allowances or transport passes, are only issued after payment of the registration fee, and of the full tuition for non-EU nationals.',
          },
          {
            title: 'Recognition of titles',
            body: 'CAD is accredited by the French Community of Belgium, but its programs and diploma are not recognised by the French Community of Belgium (Article 14/4, §2). This is why we speak of Undergraduate (1st cycle, 3 years, 180 ECTS) and Postgraduate (2nd cycle, 2 years, 120 ECTS), and not of the titles reserved for recognised institutions.',
          },
        ],

        questionsTitle: 'A question about fees or financing?',
        questionsBody:
          'Payment terms, staggered plan, possible financial support, international wire transfer: these topics are best discussed directly with the secretariat. More efficient than searching alone.',
        questionsCta: 'Contact the secretariat',

        crossTitle: 'What next?',
        crossLinks: [
          {
            title: 'Apply to CAD',
            body: 'The pre-registration form takes ~5 minutes. No fees to pay at this stage.',
            href: `/${locale}/apply`,
          },
          {
            title: '4 admission paths',
            body: 'Apply, request a meeting, come to an Open Day, or to the Summer Breakfast.',
            href: `/${locale}/admissions`,
          },
          {
            title: 'Live in Brussels',
            body: 'Housing, visa, transport, cost of living. The complete guide to prepare your arrival.',
            href: `/${locale}/etudier-a-bruxelles`,
          },
        ],
      }

  return (
    <article className="container py-16">
      <Breadcrumb
        locale={locale}
        items={[
          { label: L.backLabel, href: `/${locale}/admissions` },
          { label: L.eyebrow },
        ]}
      />

      {/* Hero */}
      <header className="mt-8 max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-ink/70">{L.intro}</p>
      </header>

      {/* EU students — Undergraduate & Master */}
      <section className="mt-20 rounded-3xl border border-ink/10 bg-paper p-8 md:p-12">
        <p className="text-sm uppercase tracking-widest text-ink/50">
          {L.euTitle}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <p className="font-display text-5xl text-accent md:text-6xl">
            {L.euAmount}
          </p>
          <p className="text-lg text-ink/60">{L.euAmountUnit}</p>
        </div>
        <p className="mt-2 text-sm text-ink/60">{L.euBreakdown}</p>

        <h3 className="mt-10 font-display text-xl">{L.euScheduleTitle}</h3>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {L.euSchedule.map((step, i) => (
            <li
              key={i}
              className="rounded-xl border border-ink/10 bg-white p-5"
            >
              <p className="text-xs uppercase tracking-widest text-ink/50">
                {step.when}
              </p>
              <p className="mt-2 font-display text-2xl">{step.amount}</p>
              <p className="mt-2 text-sm text-ink/60">{step.detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm italic text-ink/60">{L.euInstalmentNote}</p>
      </section>

      {/* Non-EU students */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-paper p-8 md:p-12">
        <p className="text-sm uppercase tracking-widest text-ink/50">
          {L.nonEuTitle}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <p className="font-display text-5xl text-accent md:text-6xl">
            {L.nonEuAmount}
          </p>
          <p className="text-lg text-ink/60">{L.nonEuAmountUnit}</p>
        </div>
        <p className="mt-2 text-sm text-ink/60">{L.nonEuBreakdown}</p>
        <p className="mt-6 max-w-3xl text-ink/80">{L.nonEuNote}</p>
      </section>

      {/* Specialization — Fashion Business */}
      <section className="mt-20">
        <h2 className="font-display text-3xl md:text-4xl">{L.specTitle}</h2>
        <p className="mt-2 text-ink/60">{L.specSubtitle}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* EU */}
          <div className="rounded-2xl border border-ink/10 bg-paper p-8">
            <p className="text-sm uppercase tracking-widest text-ink/50">
              {L.specEuTitle}
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <p className="font-display text-4xl text-accent">
                {L.specEuAmount}
              </p>
            </div>
            <ol className="mt-8 space-y-3">
              {L.specEuSchedule.map((step, i) => (
                <li
                  key={i}
                  className="flex justify-between gap-4 border-b border-ink/10 pb-3 text-sm last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-ink">{step.when}</p>
                    <p className="text-ink/60">{step.detail}</p>
                  </div>
                  <p className="font-display text-lg shrink-0">
                    {step.amount}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Non-EU */}
          <div className="rounded-2xl border border-ink/10 bg-paper p-8">
            <p className="text-sm uppercase tracking-widest text-ink/50">
              {L.specNonEuTitle}
            </p>
            <p className="mt-6 text-ink/80">{L.specNonEuNote}</p>
          </div>
        </div>

        <Link
          href={`/${locale}/fashion-management`}
          className="mt-6 tap text-sm text-accent hover:underline"
        >
          {L.specLink}
        </Link>
      </section>

      {/* Bank details */}
      <section className="mt-20 rounded-3xl border border-ink/10 bg-ink/5 p-8 md:p-12">
        <h2 className="font-display text-2xl md:text-3xl">{L.bankTitle}</h2>
        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink/50">
              {isFR ? 'Bénéficiaire' : 'Beneficiary'}
            </dt>
            <dd className="mt-1 font-display text-xl">{L.bankName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink/50">
              {isFR ? 'Banque' : 'Bank'}
            </dt>
            <dd className="mt-1 font-display text-xl">{L.bankBank}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink/50">
              IBAN
            </dt>
            <dd className="mt-1 font-mono text-lg tracking-wide">
              {L.bankIban}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink/50">
              BIC
            </dt>
            <dd className="mt-1 font-mono text-lg">{L.bankBic}</dd>
          </div>
        </dl>
        <p className="mt-8 max-w-3xl text-sm text-ink/60">{L.bankNote}</p>
      </section>

      {/* Disclosure — what to know before signing */}
      <section className="mt-20">
        <h2 className="max-w-3xl font-display text-3xl md:text-4xl">
          {L.disclosureTitle}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {L.disclosurePoints.map((p, i) => (
            <li
              key={i}
              className="rounded-2xl border border-ink/10 bg-paper p-6"
            >
              <h3 className="font-display text-xl">{p.title}</h3>
              <p className="mt-3 text-ink/70">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Questions CTA */}
      <PageCTA
        title={L.questionsTitle}
        body={L.questionsBody}
        ctaLabel={L.questionsCta}
        ctaHref={`/${locale}/contact`}
        nested
      />

      {/* Cross-links */}
      <section className="mt-20">
        <h2 className="font-display text-2xl md:text-3xl">{L.crossTitle}</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {L.crossLinks.map((link, i) => (
            <li key={i}>
              <Link
                href={link.href}
                className="group block h-full rounded-2xl border border-ink/10 p-6 transition hover:border-accent/40"
              >
                <h3 className="font-display text-lg">{link.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{link.body}</p>
                <p className="mt-4 text-sm text-accent group-hover:underline">
                  {isFR ? 'Lire la suite' : 'Read more'} →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Schema.org for AI engines / Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOccupationalProgram',
            name: 'CAD Brussels · Tuition fees',
            description: L.intro,
            provider: {
              '@type': 'EducationalOrganization',
              name: 'CAD College of Art & Design Brussels',
              url: 'https://cad.be',
            },
            offers: [
              {
                '@type': 'Offer',
                category: 'Undergraduate and postgraduate · EU',
                price: '9500',
                priceCurrency: 'EUR',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '9500',
                  priceCurrency: 'EUR',
                  billingDuration: 'P1Y',
                },
                eligibleCustomerType: 'EU resident',
              },
              {
                '@type': 'Offer',
                category: 'Undergraduate and postgraduate · Non-EU',
                price: '11000',
                priceCurrency: 'EUR',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '11000',
                  priceCurrency: 'EUR',
                  billingDuration: 'P1Y',
                },
                eligibleCustomerType: 'Non-EU resident',
              },
              {
                '@type': 'Offer',
                category: 'Specialization · Fashion Business',
                price: '4500',
                priceCurrency: 'EUR',
                eligibleCustomerType: 'EU resident',
              },
            ],
          }),
        }}
      />
    </article>
  )
}
