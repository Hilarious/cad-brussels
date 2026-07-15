import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PageCTA } from '@/components/page-cta'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { RelatedContent } from '@/components/related-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return locale === 'fr'
    ? {
        title: 'Professeurs au CAD Brussels, des professionnels en activité',
        description:
          'Une cinquantaine de professeurs, tous en activité dans leur métier : designers, architectes, directeurs artistiques, motion designers, créateurs de mode. Voici qui enseigne au CAD.',
      }
    : {
        title: 'Faculty at CAD Brussels, working professionals',
        description:
          'About fifty teachers, all active in their craft: designers, architects, art directors, motion designers, fashion creators. Meet the people who teach at CAD.',
      }
}

// ---------------------------------------------------------------- faculty data
// Note: profiles are placeholder representations of the kind of profiles
// that teach at CAD (working professionals from agencies, studios, firms,
// houses, freelancers). Replace with real teachers
// once the school has consent and proper biographies. Structure is
// intentionally consistent so a future Payload `Faculty` collection
// can plug in here.
type FacultyMember = {
  name: string
  initials: string
  subject: string
  programs: string[]
  parallelRole: string
  parallelEmployer: string
  city: string
}

const facultyFR: FacultyMember[] = [
  // Bachelor Architecture d'intérieur
  {
    name: 'Charlotte Lemoine',
    initials: 'CL',
    subject: "Atelier de projet · Conception spatiale",
    programs: ['Architecture d’intérieur'],
    parallelRole: 'Architecte d’intérieur fondatrice',
    parallelEmployer: 'Studio CL Interiors',
    city: 'Bruxelles',
  },
  {
    name: 'Pieter Janssens',
    initials: 'PJ',
    subject: 'Logiciels professionnels · Rhino · V-Ray',
    programs: ['Architecture d’intérieur', 'Master 2 ans'],
    parallelRole: 'Senior 3D artist',
    parallelEmployer: 'B+B Studio',
    city: 'Anvers',
  },
  {
    name: 'Marc Devroe',
    initials: 'MD',
    subject: 'Histoire du design & culture visuelle',
    programs: ['Architecture d’intérieur', 'Communication & Digital'],
    parallelRole: 'Critique design',
    parallelEmployer: 'Knack Weekend, Wallpaper',
    city: 'Bruxelles',
  },

  // Bachelor Communication & Digital
  {
    name: 'Sophie Vermeer',
    initials: 'SV',
    subject: 'Direction artistique · Identité de marque',
    programs: ['Communication & Digital'],
    parallelRole: 'Directrice de création',
    parallelEmployer: 'Base Design',
    city: 'Bruxelles',
  },
  {
    name: 'Thomas Renaud',
    initials: 'TR',
    subject: 'Motion design · After Effects',
    programs: ['Communication & Digital', 'Master Image 3D'],
    parallelRole: 'Motion designer freelance',
    parallelEmployer: 'Clients agences belges et NL',
    city: 'Amsterdam',
  },
  {
    name: 'Julie Marin',
    initials: 'JM',
    subject: 'UX/UI · Figma · Recherche utilisateur',
    programs: ['Communication & Digital', 'Master Digital Brand'],
    parallelRole: 'Lead designer',
    parallelEmployer: 'Decathlon Digital',
    city: 'Lille',
  },
  {
    name: 'Yann Beaufils',
    initials: 'YB',
    subject: 'IA générative · Workflows créatifs',
    programs: ['Communication & Digital', 'Master Image 3D'],
    parallelRole: 'Creative AI Lead',
    parallelEmployer: 'Studio indépendant',
    city: 'Bruxelles',
  },

  // Bachelor Mode & Accessoires
  {
    name: 'Alessandra Conti',
    initials: 'AC',
    subject: 'Dessin de mode · Illustration',
    programs: ['Mode & Accessoires'],
    parallelRole: 'Illustratrice mode',
    parallelEmployer: 'Vogue Italia (collaboratrice)',
    city: 'Milan',
  },
  {
    name: 'Anne Dewit',
    initials: 'AD',
    subject: 'Coupe à plat · Moulage · Couture',
    programs: ['Mode & Accessoires'],
    parallelRole: 'Modéliste senior',
    parallelEmployer: 'Maison Margiela (consultante)',
    city: 'Anvers',
  },
  {
    name: 'Olivier Deschamps',
    initials: 'OD',
    subject: 'Direction artistique mode · Lookbook',
    programs: ['Mode & Accessoires'],
    parallelRole: 'Photographe & DA',
    parallelEmployer: 'Magazines indépendants',
    city: 'Bruxelles',
  },

  // Master Home & Living
  {
    name: 'Giulia Ferrari',
    initials: 'GF',
    subject: 'Design produit · Mobilier',
    programs: ['Master Home & Living'],
    parallelRole: 'Designer produit',
    parallelEmployer: 'Cassina (collabore régulièrement)',
    city: 'Milan',
  },

  // Master Digital Brand Content
  {
    name: 'Romain Lefèvre',
    initials: 'RL',
    subject: 'Stratégie de contenu · Brand strategy',
    programs: ['Master Digital Brand', 'Communication & Digital'],
    parallelRole: 'Stratégiste senior',
    parallelEmployer: 'Mortierbrigade',
    city: 'Bruxelles',
  },

  // Master Event Management
  {
    name: 'Elise Vanderbeeck',
    initials: 'EV',
    subject: 'Scénographie événementielle · Production',
    programs: ['Master Event Management'],
    parallelRole: 'Productrice exécutive',
    parallelEmployer: 'Indépendante (Brussels Design September)',
    city: 'Bruxelles',
  },

  // Spécialisation Fashion Management
  {
    name: 'Camille Roussel',
    initials: 'CR',
    subject: 'Stratégie & retail mode',
    programs: ['Fashion Management'],
    parallelRole: 'Directrice retail',
    parallelEmployer: 'Maison de luxe (Paris)',
    city: 'Paris',
  },
  {
    name: 'Karim El Mansouri',
    initials: 'KE',
    subject: 'Économie & business de la mode',
    programs: ['Fashion Management'],
    parallelRole: 'Consultant M&A mode',
    parallelEmployer: 'Cabinet international',
    city: 'Paris',
  },
]

const facultyEN: FacultyMember[] = facultyFR.map((m) => {
  // Translate program labels for EN. Keep names as-is (they are people).
  const labels: Record<string, string> = {
    "Architecture d’intérieur": 'Interior Architecture',
    'Master 2 ans': 'Master 2 years',
    'Communication & Digital': 'Communication & Digital',
    'Master Image 3D': 'Master Image 3D',
    'Master Digital Brand': 'Master Digital Brand',
    'Mode & Accessoires': 'Fashion & Accessory',
    'Master Home & Living': 'Master Home & Living',
    'Master Event Management': 'Master Event Management',
    'Fashion Management': 'Fashion Management',
  }
  // Translate subjects to English
  const subjectMap: Record<string, string> = {
    "Atelier de projet · Conception spatiale": 'Project studio · Spatial design',
    'Logiciels professionnels · Rhino · V-Ray': 'Professional software · Rhino · V-Ray',
    'Histoire du design & culture visuelle': 'Design history & visual culture',
    'Direction artistique · Identité de marque': 'Art direction · Brand identity',
    'Motion design · After Effects': 'Motion design · After Effects',
    'UX/UI · Figma · Recherche utilisateur': 'UX/UI · Figma · User research',
    'IA générative · Workflows créatifs': 'Generative AI · Creative workflows',
    'Dessin de mode · Illustration': 'Fashion drawing · Illustration',
    'Coupe à plat · Moulage · Couture': 'Flat pattern · Draping · Sewing',
    'Direction artistique mode · Lookbook': 'Fashion art direction · Lookbook',
    'Design produit · Mobilier': 'Product design · Furniture',
    'Stratégie de contenu · Brand strategy': 'Content strategy · Brand strategy',
    'Scénographie événementielle · Production': 'Event scenography · Production',
    'Stratégie & retail mode': 'Fashion strategy & retail',
    'Économie & business de la mode': 'Fashion economics & business',
  }
  const roleMap: Record<string, string> = {
    "Architecte d’intérieur fondatrice": 'Founding interior architect',
    'Senior 3D artist': 'Senior 3D artist',
    'Critique design': 'Design critic',
    'Directrice de création': 'Creative director',
    'Motion designer freelance': 'Freelance motion designer',
    'Lead designer': 'Lead designer',
    'Creative AI Lead': 'Creative AI Lead',
    'Illustratrice mode': 'Fashion illustrator',
    'Modéliste senior': 'Senior pattern-maker',
    'Photographe & DA': 'Photographer & art director',
    'Designer produit': 'Product designer',
    'Stratégiste senior': 'Senior strategist',
    'Productrice exécutive': 'Executive producer',
    'Directrice retail': 'Retail director',
    'Consultant M&A mode': 'Fashion M&A consultant',
  }
  // Only employers carrying French qualifiers need translation. Pure brand
  // names (Base Design, Cassina, Mortierbrigade…) stay as-is across locales.
  const employerMap: Record<string, string> = {
    'Vogue Italia (collaboratrice)': 'Vogue Italia (contributor)',
    'Maison Margiela (consultante)': 'Maison Margiela (consultant)',
    'Magazines indépendants': 'Independent magazines',
    'Cassina (collabore régulièrement)': 'Cassina (regular collaborator)',
    'Indépendante (Brussels Design September)': 'Independent (Brussels Design September)',
    'Maison de luxe (Paris)': 'Luxury house (Paris)',
    'Cabinet international': 'International consultancy',
    'Studio indépendant': 'Independent studio',
    'Clients agences belges et NL': 'Agency clients in Belgium and NL',
  }
  return {
    ...m,
    programs: m.programs.map((p) => labels[p] ?? p),
    subject: subjectMap[m.subject] ?? m.subject,
    parallelRole: roleMap[m.parallelRole] ?? m.parallelRole,
    parallelEmployer: employerMap[m.parallelEmployer] ?? m.parallelEmployer,
  }
})

export default async function FacultyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFR = locale === 'fr'
  const faculty = isFR ? facultyFR : facultyEN

  const L = isFR
    ? {
        eyebrow: 'Professeurs',
        title: 'Des professionnels, pas des académiciens.',
        intro:
          "Une cinquantaine de professeurs enseignent au CAD. Tous travaillent en parallèle dans leur métier : agence, studio, cabinet, maison, freelance. Ils sont au contact direct des clients, du marché, des contraintes réelles. Et c'est cette expérience-là qu'ils transmettent en cours, le soir même.",
        why:
          "Pourquoi cette règle ? Parce que le design évolue trop vite pour être enseigné par des théoriciens. Les outils d'aujourd'hui (IA, Figma, Unreal) n'existaient pas il y a 5 ans. Et un brief client, une deadline, une présentation à un comité de marque, ça ne s'apprend pas dans un manuel. Ça se transmet par ceux qui le vivent.",
        teaches: 'Enseigne',
        worksAt: 'En parallèle',
        based: 'Basé·e à',
        for: 'Pour',
        ctaTitle: 'Vous voulez en savoir plus sur un·e prof ?',
        ctaBody:
          "Le secrétariat peut organiser un échange court avec un·e enseignant·e du programme qui vous intéresse, par mail ou en visio. C'est souvent le moyen le plus efficace de comprendre la pédagogie réelle.",
        ctaButton: 'Demander un échange',
      }
    : {
        eyebrow: 'Faculty',
        title: 'Working professionals, not academics.',
        intro:
          'About fifty teachers teach at CAD. All work in parallel in their craft: agency, studio, firm, house, freelance. They are in direct contact with clients, the market, the real constraints. And that’s the experience they bring to class, the same evening.',
        why:
          'Why this rule? Because design evolves too fast to be taught by theorists. Today’s tools (AI, Figma, Unreal) didn’t exist 5 years ago. And a client brief, a deadline, a presentation to a brand committee, you don’t learn that in a textbook. It is passed on by those who live it.',
        teaches: 'Teaches',
        worksAt: 'Also',
        based: 'Based in',
        for: 'For',
        ctaTitle: 'Want to know more about a specific teacher?',
        ctaBody:
          'The secretariat can arrange a short exchange with a teacher from the program that interests you, by email or video call. Often the most efficient way to understand the actual pedagogy.',
        ctaButton: 'Request an exchange',
      }

  return (
    <article className="container py-16">
      {/* Hero */}
      <header className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          {L.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-ink/70">{L.intro}</p>
      </header>

      {/* Pattern A — Image full-bleed après le hero pour donner immédiatement
          le ton "atelier vivant". Vue d'un cours en train de se passer,
          prof + étudiants en interaction. */}
      <section className="-mx-4 mt-16 md:-mx-8 xl:-mx-12">
        <ImagePlaceholder
          ratio="21:9"
          caption={
            isFR
              ? 'Scène · prof corrigeant un projet étudiant en atelier'
              : 'Scene · faculty member reviewing a student project in the studio'
          }
          className="rounded-none border-0"
        />
      </section>

      {/* Why this rule — pulled out as a key argument */}
      <section className="mt-16 max-w-3xl rounded-2xl border border-ink/10 bg-paper p-8">
        <p className="text-ink/80">{L.why}</p>
      </section>

      {/* Faculty grid.
          Chaque carte intègre maintenant un portrait 2:3 en tête,
          remplaçant l'avatar initiales. Ratio portrait éditorial
          classique, en cohérence avec le brief photographe. */}
      <section className="mt-20">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {faculty.map((m, i) => (
            <li
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper"
            >
              {/* Portrait éditorial 2:3 en tête de carte */}
              <ImagePlaceholder
                ratio="2:3"
                caption={`Portrait · ${m.name} · ${m.parallelRole}`}
                className="rounded-none border-0 border-b border-ink/10"
              />
              <div className="flex flex-1 flex-col p-6">
                <div>
                  <p className="font-display text-lg leading-tight">
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-widest text-ink/50">
                    {m.city}
                  </p>
                </div>

              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-ink/50">
                    {L.teaches}
                  </dt>
                  <dd className="mt-1 text-ink">{m.subject}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-ink/50">
                    {L.for}
                  </dt>
                  <dd className="mt-1 text-ink/70">{m.programs.join(' · ')}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-ink/50">
                    {L.worksAt}
                  </dt>
                  <dd className="mt-1 text-ink/70">
                    {m.parallelRole}
                    <span className="text-ink/50">, {m.parallelEmployer}</span>
                  </dd>
                </div>
              </dl>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Maillage éditorial — bloc "à découvrir aussi" pour renforcer
          le maillage interne contextuel. */}
      <RelatedContent locale={locale} />

      {/* CTA */}
      <PageCTA
        title={L.ctaTitle}
        body={L.ctaBody}
        ctaLabel={L.ctaButton}
        ctaHref={`/${locale}/contact`}
        nested
      />
    </article>
  )
}
