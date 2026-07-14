import Link from 'next/link'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Breadcrumb } from '@/components/breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Se loger à Bruxelles, guide étudiant CAD',
        description:
          'Kot, studio, colocation près du CAD à Uccle. Prix, plateformes, quartiers, conseils pour trouver un logement étudiant à Bruxelles.',
      }
    : {
        title: 'Housing in Brussels, CAD student guide',
        description:
          'Student room, studio, shared flat near the CAD campus in Uccle. Prices, platforms, neighbourhoods, tips to find student housing in Brussels.',
      }
}

export default async function HousingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'

  return (
    <article className="container py-16">
      <Breadcrumb
        locale={locale}
        items={[
          {
            label: isFR ? 'Étudier à Bruxelles' : 'Studying in Brussels',
            href: `/${locale}/etudier-a-bruxelles`,
          },
          { label: isFR ? 'Se loger' : 'Housing' },
        ]}
      />

      <div className="mt-8 max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {isFR ? 'Guide logement' : 'Housing guide'}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
          {isFR
            ? 'Se loger à Bruxelles quand on étudie au CAD'
            : 'Housing in Brussels as a CAD student'}
        </h1>
        <p className="mt-6 text-lg text-ink/70">
          {isFR
            ? "Le CAD est situé à Uccle, dans le sud verdoyant de Bruxelles. Voici comment trouver un logement adapté, à un prix juste, dans un quartier qui vous correspond."
            : "CAD is located in Uccle, the leafy south of Brussels. Here is how to find suitable housing, at a fair price, in a neighbourhood that fits you."}
        </p>
      </div>

      <div className="mt-12 max-w-3xl space-y-12 text-ink/85">
        {/* Section 1 - Types of housing */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? '1. Quel type de logement ?' : '1. What type of housing?'}
          </h2>
          <p className="mt-4">
            {isFR
              ? "Trois grandes options s'offrent à un étudiant à Bruxelles. Chacune a son budget, son public, sa logique."
              : "Three main options are available to a student in Brussels. Each has its budget, its audience, its logic."}
          </p>

          <ul className="mt-6 space-y-6">
            <li className="rounded-xl border border-ink/10 p-5">
              <p className="font-display text-lg">
                {isFR ? 'Le kot étudiant (chambre meublée)' : 'Student room (kot)'}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {isFR
                  ? "Une chambre meublée de 12 à 20 m² dans une maison ou résidence partagée, avec cuisine et salle de bains communes. Solution la plus abordable, idéale en première année."
                  : "A furnished 12 to 20 m² room in a shared house or residence, with shared kitchen and bathroom. The most affordable option, ideal in first year."}
              </p>
              <p className="mt-3 text-sm">
                <strong>{isFR ? 'Budget' : 'Budget'} :</strong>{' '}
                {isFR ? '380 à 600 € / mois charges incluses' : '€380 to €600 / month, charges included'}
              </p>
            </li>

            <li className="rounded-xl border border-ink/10 p-5">
              <p className="font-display text-lg">
                {isFR ? 'Le studio meublé' : 'Furnished studio'}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {isFR
                  ? "Un appartement indépendant avec coin cuisine et salle de bain privative. Plus d'autonomie, plus d'intimité, mais aussi plus cher."
                  : "A self-contained apartment with kitchenette and private bathroom. More autonomy, more privacy, but also more expensive."}
              </p>
              <p className="mt-3 text-sm">
                <strong>{isFR ? 'Budget' : 'Budget'} :</strong>{' '}
                {isFR ? '700 à 950 € / mois selon le quartier' : '€700 to €950 / month depending on the area'}
              </p>
            </li>

            <li className="rounded-xl border border-ink/10 p-5">
              <p className="font-display text-lg">
                {isFR ? 'La colocation' : 'Shared flat'}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {isFR
                  ? "Une chambre privée dans un appartement partagé avec 2 à 5 colocataires. Le meilleur compromis budget-sociabilité, et une bonne porte d'entrée pour rencontrer d'autres étudiants."
                  : "A private bedroom in a flat shared with 2 to 5 roommates. The best budget-sociability compromise, and a great way to meet other students."}
              </p>
              <p className="mt-3 text-sm">
                <strong>{isFR ? 'Budget' : 'Budget'} :</strong>{' '}
                {isFR ? '450 à 700 € / mois charges incluses' : '€450 to €700 / month, charges included'}
              </p>
            </li>
          </ul>
        </section>

        {/* Section 2 - Where to look */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? '2. Où chercher ?' : '2. Where to look?'}
          </h2>
          <p className="mt-4">
            {isFR
              ? "Quelques plateformes fiables, recommandées par le secrétariat du CAD :"
              : "A few trusted platforms, recommended by the CAD secretariat:"}
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <strong>BRIK</strong> ({isFR ? 'résidences étudiantes officielles de la Région bruxelloise' : 'official student residences in the Brussels Region'}) ·{' '}
              <a
                href="https://brik.be"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                brik.be
              </a>
            </li>
            <li>
              <strong>Quartier Latin</strong>,{' '}
              <strong>Brussels Housing</strong> ({isFR ? 'résidences privées avec services' : 'private serviced residences'})
            </li>
            <li>
              <strong>Immoweb</strong>, <strong>Logic-Immo</strong> ({isFR ? 'studios et appartements en location classique' : 'studios and flats in classic rental'}) ·{' '}
              <a
                href="https://www.immoweb.be"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                immoweb.be
              </a>
            </li>
            <li>
              <strong>Appartager</strong>, <strong>Spotahome</strong>, <strong>HousingAnywhere</strong> ({isFR ? 'colocations meublées' : 'furnished shared flats'})
            </li>
            <li>
              {isFR
                ? 'Les groupes Facebook étudiants à Bruxelles sont également très actifs.'
                : 'Brussels student Facebook groups are also very active.'}
            </li>
          </ul>
        </section>

        {/* Section 3 - Neighbourhoods */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? '3. Quels quartiers privilégier' : '3. Which neighbourhoods to favour'}
          </h2>
          <p className="mt-4">
            {isFR
              ? "Le campus du CAD est à Uccle, au sud de Bruxelles. Plusieurs quartiers sont bien reliés et adaptés au mode de vie étudiant."
              : "The CAD campus is in Uccle, in the south of Brussels. Several neighbourhoods are well connected and suit the student lifestyle."}
          </p>

          <ul className="mt-6 space-y-5">
            <li>
              <p className="font-display text-lg">Uccle</p>
              <p className="mt-1 text-sm text-ink/70">
                {isFR
                  ? "À pied ou à 5 min en tram du campus. Quartier résidentiel, calme, vert, plutôt familial. Plus rare en colocation, plus cher en studio."
                  : "Walking distance or 5 min by tram from campus. Residential, quiet, green, family-oriented. Rare in shared flats, pricier in studios."}
              </p>
            </li>
            <li>
              <p className="font-display text-lg">Saint-Gilles, Ixelles</p>
              <p className="mt-1 text-sm text-ink/70">
                {isFR
                  ? "15 à 20 min de tram. Quartiers très étudiants, bars, restaurants, vie nocturne, place Flagey. Le meilleur compromis si vous voulez du mouvement."
                  : "15 to 20 min by tram. Very student-friendly, bars, restaurants, nightlife, place Flagey. Best balance if you want a lively setting."}
              </p>
            </li>
            <li>
              <p className="font-display text-lg">
                {isFR ? 'Forest, Brussels Sud' : 'Forest, South Brussels'}
              </p>
              <p className="mt-1 text-sm text-ink/70">
                {isFR
                  ? "Émergent, plus accessible financièrement. Bon pour les budgets serrés, à condition d'être à l'aise avec le tram du soir."
                  : "Up-and-coming, more affordable. Good for tight budgets, provided you are comfortable with the evening tram."}
              </p>
            </li>
          </ul>
        </section>

        {/* Section 4 - Tips */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? '4. Conseils du secrétariat' : '4. Secretariat tips'}
          </h2>
          <ul className="mt-6 list-disc space-y-3 pl-5 text-sm text-ink/80">
            <li>
              {isFR
                ? "Commencez à chercher dès l'admission confirmée, idéalement 2 à 3 mois avant la rentrée. Le marché est tendu en août et septembre."
                : "Start searching as soon as your admission is confirmed, ideally 2 to 3 months before the start of the year. The market is tight in August and September."}
            </li>
            <li>
              {isFR
                ? "Méfiez-vous des arnaques en ligne : ne versez jamais de caution avant d'avoir visité le logement (en personne ou en visio avec quelqu'un de confiance)."
                : "Beware of online scams: never pay a deposit before visiting the property (in person or by video call with someone you trust)."}
            </li>
            <li>
              {isFR
                ? "Demandez toujours un état des lieux écrit à l'entrée, et conservez une copie."
                : "Always ask for a written inventory of fixtures upon entry, and keep a copy."}
            </li>
            <li>
              {isFR
                ? "À Bruxelles, le bail étudiant standard dure 12 mois et peut être réduit à 9 ou 10 mois sur demande, alignée sur l'année académique."
                : "In Brussels, the standard student lease lasts 12 months and can be reduced to 9 or 10 months upon request, aligned with the academic year."}
            </li>
            <li>
              {isFR
                ? "Le secrétariat du CAD tient à jour une liste de logements vérifiés. Demandez-la après votre admission."
                : "The CAD secretariat maintains an updated list of verified housing. Ask for it after your admission."}
            </li>
          </ul>
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
              href={`/${locale}/etudier-a-bruxelles/visa`}
              className="text-ink/80 hover:text-accent"
            >
              → {isFR ? 'Visa et démarches administratives' : 'Visa and administrative steps'}
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
              ? 'Se loger à Bruxelles quand on étudie au CAD'
              : 'Housing in Brussels as a CAD student',
            inLanguage: locale,
            author: {
              '@type': 'EducationalOrganization',
              name: 'CAD Brussels',
            },
            about: ['Student housing', 'Brussels', 'Uccle'],
          }),
        }}
      />
    </article>
  )
}
