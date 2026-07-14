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
        title: 'Vivre à Bruxelles, budget et vie quotidienne pour étudiants',
        description:
          'Transports STIB, courses, restaurants, sorties, santé. Combien prévoir par mois pour vivre confortablement à Bruxelles en tant qu’étudiant au CAD.',
      }
    : {
        title: 'Living in Brussels, daily life and budget for students',
        description:
          'STIB transport, groceries, restaurants, going out, healthcare. How much to budget per month to live comfortably as a CAD student in Brussels.',
      }
}

export default async function PracticalPage({
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
          {isFR ? 'Guide vie pratique' : 'Daily life guide'}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
          {isFR
            ? 'Vivre à Bruxelles au quotidien'
            : 'Daily life in Brussels'}
        </h1>
        <p className="mt-6 text-lg text-ink/70">
          {isFR
            ? 'Bruxelles est une grande ville à taille humaine. Tout se fait en tram, à vélo ou à pied. Voici les ordres de grandeur pour bien vivre, sans se priver.'
            : 'Brussels is a big city on a human scale. Everything happens by tram, bicycle or on foot. Here are the orders of magnitude to live well, without holding back.'}
        </p>
      </div>

      <div className="mt-12 max-w-3xl space-y-12 text-ink/85">
        {/* Budget breakdown */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? 'Budget mensuel type' : 'Typical monthly budget'}
          </h2>
          <p className="mt-4">
            {isFR
              ? "Pour un étudiant vivant en kot ou colocation, voici un budget réaliste. Le total grimpe vite à 1 200 € en studio individuel."
              : "For a student living in a kot or shared flat, here is a realistic budget. The total quickly rises to €1,200 in a private studio."}
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-ink/10">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-ink/10">
                {[
                  { label: isFR ? 'Logement (kot ou colocation)' : 'Housing (kot or shared flat)', amount: '450-600 €' },
                  { label: isFR ? 'Courses alimentaires' : 'Groceries', amount: '200-300 €' },
                  { label: isFR ? 'Transports (abonnement STIB jeune)' : 'Transport (STIB youth pass)', amount: '12 €' },
                  { label: isFR ? 'Téléphone et internet' : 'Phone and internet', amount: '20-40 €' },
                  { label: isFR ? 'Sorties, restaurants, loisirs' : 'Going out, restaurants, leisure', amount: '100-200 €' },
                  { label: isFR ? 'Santé et mutuelle' : 'Healthcare and mutuelle', amount: '5-15 €' },
                  { label: isFR ? 'Imprévus, fournitures, livres' : 'Unforeseen, supplies, books', amount: '50-100 €' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 text-right font-medium">{row.amount}</td>
                  </tr>
                ))}
                <tr className="bg-ink/5">
                  <td className="px-4 py-3 font-display text-base">
                    {isFR ? 'Total estimé' : 'Estimated total'}
                  </td>
                  <td className="px-4 py-3 text-right font-display text-base">
                    850-1 250 €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Transport */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? 'Se déplacer' : 'Getting around'}
          </h2>
          <p className="mt-4">
            {isFR
              ? "Bruxelles est l'une des villes les plus connectées d'Europe. Vous n'aurez pas besoin de voiture."
              : "Brussels is one of the most connected cities in Europe. You will not need a car."}
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            <li>
              <strong>STIB</strong> ({isFR ? 'tram, bus, métro' : 'tram, bus, metro'}) ·{' '}
              {isFR
                ? "Abonnement annuel jeune (moins de 25 ans) : environ 12 € par mois. Le campus du CAD est desservi par les trams 4 et 92."
                : 'Annual youth pass (under 25): around €12 per month. The CAD campus is served by trams 4 and 92.'}
            </li>
            <li>
              <strong>Villo!</strong> ({isFR ? 'vélos en libre-service' : 'public bike-share'}) ·{' '}
              {isFR
                ? "Abonnement annuel à 33,60 €. Premier 30 minutes gratuit à chaque trajet."
                : 'Annual subscription €33.60. First 30 minutes free on each ride.'}
            </li>
            <li>
              <strong>SNCB</strong> ({isFR ? 'trains nationaux' : 'national trains'}) ·{' '}
              {isFR
                ? "Pour les week-ends en Belgique. Bruxelles, Anvers, Gand, Bruges, Liège : tout est à moins d'une heure."
                : 'For weekends across Belgium. Brussels, Antwerp, Ghent, Bruges, Liège: everything is less than an hour away.'}
            </li>
            <li>
              <strong>Eurostar, Thalys, ICE</strong> ·{' '}
              {isFR
                ? "Bruxelles est un hub international : Paris en 1h25, Londres en 1h50, Amsterdam en 1h50, Cologne en 1h50."
                : 'Brussels is an international hub: Paris in 1h25, London in 1h50, Amsterdam in 1h50, Cologne in 1h50.'}
            </li>
          </ul>
        </section>

        {/* Food and groceries */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? 'Manger et faire ses courses' : 'Eating and grocery shopping'}
          </h2>
          <p className="mt-4 text-sm">
            {isFR
              ? "Pour les courses, les enseignes les plus accessibles côté budget : Lidl et Aldi (discount), Colruyt (qualité-prix), puis Delhaize et Carrefour. Pour les marchés bio et producteurs, le marché du Châtelain (Ixelles) le mercredi et le marché du Midi le dimanche matin."
              : "For groceries, the most affordable chains: Lidl and Aldi (discount), Colruyt (good price-quality), then Delhaize and Carrefour. For organic and producer markets, the Châtelain market (Ixelles) on Wednesdays and the Midi market on Sunday mornings."}
          </p>
          <p className="mt-4 text-sm">
            {isFR
              ? "Côté restaurants, comptez 12 à 18 € pour un repas étudiant complet, 20 à 30 € pour un restaurant correct, 8 à 14 € pour un kebab, frites ou bagel. Bruxelles est aussi la capitale mondiale des bières spéciales : la dégustation est culturelle, pas seulement festive."
              : "For restaurants, count €12 to €18 for a full student meal, €20 to €30 for a decent restaurant, €8 to €14 for a kebab, fries or bagel. Brussels is also the world capital of specialty beers: tasting is cultural, not just festive."}
          </p>
        </section>

        {/* Going out and culture */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? 'Sortir et nourrir sa créativité' : 'Going out and feeding your creativity'}
          </h2>
          <p className="mt-4 text-sm">
            {isFR
              ? "Bruxelles est l'une des villes les plus stimulantes d'Europe pour un futur designer. Sa scène artistique est dense et accessible."
              : "Brussels is one of the most stimulating cities in Europe for a future designer. Its art scene is dense and accessible."}
          </p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm">
            <li>
              {isFR
                ? "Musées : Bozar, WIELS, KANAL Centre Pompidou, Design Museum, Musée Magritte, Atomium. Tarif étudiant systématique, gratuité le premier dimanche du mois dans tous les musées fédéraux."
                : 'Museums: Bozar, WIELS, KANAL Centre Pompidou, Design Museum, Magritte Museum, Atomium. Student rates everywhere, free entry on the first Sunday of every month in all federal museums.'}
            </li>
            <li>
              {isFR
                ? "Cinémas : Cinematek, Aventure, Vendôme, Galeries. Tarif étudiant à 8 €."
                : 'Cinemas: Cinematek, Aventure, Vendôme, Galeries. Student rate €8.'}
            </li>
            <li>
              {isFR
                ? "Festivals : Brussels Design September (le mois du design), KIKK, AB Concerts, Couleur Café, Brosella."
                : 'Festivals: Brussels Design September (design month), KIKK, AB Concerts, Couleur Café, Brosella.'}
            </li>
            <li>
              {isFR
                ? "Quartiers à explorer : Sablon (antiquités, design), Saint-Gilles (cafés, librairies), Dansaert (mode), Ixelles (étudiant), Marolles (vintage)."
                : 'Neighbourhoods to explore: Sablon (antiques, design), Saint-Gilles (cafés, bookshops), Dansaert (fashion), Ixelles (student), Marolles (vintage).'}
            </li>
          </ul>
        </section>

        {/* Health */}
        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {isFR ? 'Santé et bien-être' : 'Health and well-being'}
          </h2>
          <p className="mt-4 text-sm">
            {isFR
              ? "L'affiliation à une mutuelle (Solidaris, Mutualité chrétienne, Partenamut) est obligatoire et permet le remboursement d'environ 75 % des consultations médicales. Une consultation chez un médecin généraliste coûte 30 €, dont 25 € sont remboursés. Les services psychologiques étudiants (centre PMS, Wel'Com) sont gratuits ou très peu chers."
              : "Registering with a mutuelle (Solidaris, Mutualité chrétienne, Partenamut) is mandatory and reimburses around 75% of medical consultations. A consultation with a general practitioner costs €30, of which €25 is reimbursed. Student mental health services (PMS centre, Wel'Com) are free or very low-cost."}
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
              href={`/${locale}/etudier-a-bruxelles/visa`}
              className="text-ink/80 hover:text-accent"
            >
              → {isFR ? 'Visa et démarches' : 'Visa and paperwork'}
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
              ? 'Vivre à Bruxelles au quotidien'
              : 'Daily life in Brussels',
            inLanguage: locale,
            author: {
              '@type': 'EducationalOrganization',
              name: 'CAD Brussels',
            },
            about: ['Brussels', 'Cost of living', 'Student life', 'Belgium'],
          }),
        }}
      />
    </article>
  )
}
