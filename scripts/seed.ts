/**
 * Seed the local database with realistic CAD Brussels content.
 *
 * Usage:
 *   pnpm seed
 *
 * The script is idempotent: it upserts by slug so running it twice
 * won't create duplicates.
 *
 * Content is loosely based on the public information available at cad.be.
 * Dates are computed relative to "now" so events stay in the future.
 */

import { getPayload } from "payload"
import config from "../src/payload.config"
import type { Payload } from "payload"

// --- helpers --------------------------------------------------------------

const inDays = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(18, 0, 0, 0)
  return d.toISOString()
}

const inDaysAt = (n: number, hour: number, minute = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

/** Build a minimal Lexical rich-text node with a few paragraphs.
 *  Strictly matches the shape Payload's Lexical editor produces.
 */
const richText = (paragraphs: string[]) => ({
  root: {
    type: "root",
    format: "" as const,
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    children: paragraphs.map((text) => ({
      type: "paragraph",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      textFormat: 0,
      textStyle: "",
      children: [
        {
          type: "text",
          detail: 0,
          format: 0,
          mode: "normal" as const,
          style: "",
          text,
          version: 1,
        },
      ],
    })),
  },
})

/** Upsert a doc by `slug`. Creates it on first run, updates on subsequent runs. */
async function upsertBySlug<T extends Record<string, unknown>>(
  payload: Payload,
  collection:
    | "pages"
    | "posts"
    | "events"
    | "categories",
  slug: string,
  data: T,
  locale: "fr" | "en" = "fr",
) {
  const existing = await payload.find({
    // @ts-expect-error — generic narrowing
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
    depth: 0,
  })

  if (existing.docs.length > 0) {
    return payload.update({
      // @ts-expect-error — generic narrowing
      collection,
      id: existing.docs[0]!.id,
      data,
      locale,
    })
  }
  return payload.create({
    // @ts-expect-error — generic narrowing
    collection,
    data,
    locale,
  })
}

// --- main -----------------------------------------------------------------

async function seed() {
  const payload = await getPayload({ config })
  console.log("▶ Seeding CAD Brussels content…")

  // ---------------------------------------------------------------------
  // 1) Categories
  // ---------------------------------------------------------------------
  const categoryDefs = [
    { slug: "workshop", fr: "Workshop", en: "Workshop", type: "event" as const },
    { slug: "open-day", fr: "Portes ouvertes", en: "Open Day", type: "event" as const },
    { slug: "exhibition", fr: "Exposition", en: "Exhibition", type: "event" as const },
    {
      slug: "lifelong-learning",
      fr: "Lifelong Learning",
      en: "Lifelong Learning",
      type: "event" as const,
    },
    {
      slug: "conference",
      fr: "Conférence",
      en: "Talk",
      type: "event" as const,
    },
    { slug: "news", fr: "Actualité", en: "News", type: "post" as const },
  ]

  const categoryIds: Record<string, string | number> = {}
  for (const c of categoryDefs) {
    const fr = await upsertBySlug(
      payload,
      "categories",
      c.slug,
      { slug: c.slug, name: c.fr, type: c.type },
      "fr",
    )
    await payload.update({
      collection: "categories",
      id: fr.id,
      data: { name: c.en },
      locale: "en",
    })
    categoryIds[c.slug] = fr.id
    console.log(`   ✓ category: ${c.slug}`)
  }

  // ---------------------------------------------------------------------
  // 2) Pages — bilingual content
  // ---------------------------------------------------------------------
  const pageDefs = [
    // NOTE: about is now a hand-coded page at
    // src/app/(frontend)/[locale]/about/page.tsx — the static route
    // takes precedence over [...slug], so no CMS doc is needed here.
    // The page features editorial image placements (Patterns A, C, D,
    // E, G) tailored for the parent audience.
    {
      slug: "programmes",
      fr: {
        title: "Programmes",
        hero: {
          eyebrow: "Bachelor • Master • Lifelong Learning",
          heading: "Trois disciplines, une exigence : la maîtrise du métier.",
          subheading:
            "Architecture d'intérieur, communication & design digital, mode et accessoires, du Bachelor au Master, en passant par la formation continue pour professionnels.",
        },
        body: [
          "Vous avez le choix entre trois Bachelor de 3 ans (180 ECTS) qui couvrent tous les fondamentaux du métier : dessin technique, design, outils numériques (AutoCAD, SketchUp, Rhino), histoire du design, ateliers de pratique. Au programme : Architecture d'intérieur, Communication & Digital, Mode & Accessoires.",
          "En Master, vous trouverez 1 ou 2 ans selon la filière : Architecture d'intérieur (2 ans), Home & Living Design, Digital Brand Content, Image / 3D / Motion / IA, Event Management. Plus une Spécialisation Fashion Management à temps partiel.",
          "Quel que soit votre cursus, vous aurez : des cours en anglais, des stages chaque année, des workshops internationaux (Shanghai, São Paulo, Milan), et un projet de fin d'études exposé publiquement.",
        ],
        cta: { heading: "Procédure d'admission", href: "/fr/admissions" },
      },
      en: {
        title: "Programs",
        hero: {
          eyebrow: "Bachelor • Master • Lifelong Learning",
          heading: "Three disciplines, one demand: master your craft.",
          subheading:
            "Interior architecture, communication & digital design, fashion and accessories, from Bachelor to Master, plus continuing education for professionals.",
        },
        body: [
          "You can choose between three 3-year Bachelor programs (180 ECTS) that cover every fundamental of the trade: technical drawing, design, digital tools (AutoCAD, SketchUp, Rhino), design history, hands-on studio practice. On offer: Interior Architecture, Communication & Digital, Fashion & Accessory.",
          "At Master level, you'll find 1 or 2 years depending on the track: Interior Architecture (2 years), Home & Living Design, Digital Brand Content, Image / 3D / Motion / AI, Event Management. Plus a part-time Fashion Management Specialization.",
          "Whatever your program, you will have: classes in English, yearly internships, international workshops (Shanghai, São Paulo, Milan), and a graduation project shown publicly.",
        ],
        cta: { heading: "Admission procedure", href: "/en/admissions" },
      },
    },
    {
      slug: "interior-architecture-design",
      fr: {
        title: "Architecture d'intérieur & Design",
        hero: {
          eyebrow: "Bachelor · 3 ans · 180 ECTS",
          heading: "Architecture d'intérieur & Design",
          subheading:
            "Concevez des espaces habités, durables et émotionnellement justes, de la maison particulière au flagship store.",
        },
        body: [
          "Vous apprendrez à penser l'espace dans toutes ses dimensions : volume, lumière, matériaux, ergonomie, narration. Les ateliers couvrent le résidentiel, le retail, l'hôtellerie, la scénographie d'exposition et le design d'événement.",
          "Vous maîtriserez les logiciels professionnels du métier (AutoCAD, SketchUp, Rhino, V-Ray) et ferez un stage en agence chaque année. 1ère année : gros œuvre et menuiserie pendant les vacances de Pâques et d'été. 2ème année : 3 semaines en entreprise du bâtiment puis 4 semaines en agence d'architecture. 3ème année : stage long avant le projet de diplôme.",
          "Workshops internationaux intégrés à votre cursus : Milan Design Week en 2ème année, Shanghai ou São Paulo en 3ème année. ECTS validés, co-financement par l'école.",
          "En 3ème année, vous présentez votre projet de diplôme accompagné d'un book et d'une soutenance publique devant un jury de professionnels.",
          "Tous les cours sont en anglais. Diplôme privé équivalent à un Bachelor (180 ECTS), non reconnu d'État.",
        ],
        cta: { heading: "Demander la brochure", href: "/fr/contact" },
      },
      en: {
        title: "Interior Architecture & Design",
        hero: {
          eyebrow: "Bachelor · 3 years · 180 ECTS",
          heading: "Interior Architecture & Design",
          subheading:
            "Design lived-in, sustainable and emotionally right spaces, from a private house to a flagship store.",
        },
        body: [
          "You will learn to think space across every dimension: volume, light, materials, ergonomics, narrative. Studios cover residential, retail, hospitality, exhibition design and event scenography.",
          "You will master the professional software of the trade (AutoCAD, SketchUp, Rhino, V-Ray) and do an internship every year. Year 1: structural works and cabinetmaking during Easter and summer breaks. Year 2: 3 weeks in a building firm then 4 weeks in an architecture office. Year 3: a longer internship before the graduation project.",
          "International workshops integrated in your curriculum: Milan Design Week in year 2, Shanghai or São Paulo in year 3. ECTS validated, co-funded by the school.",
          "In year 3, you present your graduation project alongside a book and a public defense in front of a jury of professionals.",
          "All classes taught in English. Private diploma equivalent to a Bachelor (180 ECTS), not state-approved.",
        ],
        cta: { heading: "Request the brochure", href: "/en/contact" },
      },
    },
    {
      slug: "communication-digital-design",
      fr: {
        title: "Communication & Design Digital",
        hero: {
          eyebrow: "Bachelor · 3 ans · 180 ECTS",
          heading: "Communication & Design Digital",
          subheading:
            "Direction artistique, identité de marque, motion design, UI/UX et création digitale assistée par IA.",
        },
        body: [
          "Vous apprendrez à penser une marque de bout en bout : identité visuelle, déclinaison print, web, motion, social media, et désormais workflows IA. À la sortie, vous êtes opérationnel·le pour devenir directeur·rice artistique, designer de marque, motion designer, designer UX/UI ou créatif·ve IA.",
          "La pédagogie repose sur de vrais briefs apportés par des agences et des marques partenaires, en logique d'atelier-studio plutôt que de cours magistraux. L'année académique démarre début octobre avec un workshop multidisciplinaire international au 2ème trimestre.",
          "Stage de 3 semaines en agence intégrée publicité / graphique / digitale ou en service communication d'une marque pendant les vacances de Pâques. Vous gérerez un projet réel : brief, livrables, présentation au commanditaire.",
          "Tous les cours sont en anglais. Diplôme privé équivalent à un Bachelor (180 ECTS), non reconnu d'État.",
        ],
        cta: { heading: "Découvrir les workshops", href: "/fr/events" },
      },
      en: {
        title: "Communication & Digital Design",
        hero: {
          eyebrow: "Bachelor · 3 years · 180 ECTS",
          heading: "Communication & Digital Design",
          subheading:
            "Art direction, brand identity, motion design, UI/UX and AI-assisted digital creation.",
        },
        body: [
          "You will learn to think a brand end-to-end: visual identity, print, web, motion, social media, and now AI workflows. By graduation, you are operational to work as art director, brand designer, motion designer, UX/UI designer or AI creative.",
          "Teaching is based on real briefs from partner agencies and brands, in a studio-style atelier rather than lectures. The academic year starts in early October with an international multidisciplinary workshop in Q2.",
          "A 3-week internship in an integrated advertising / graphic / digital agency or in a brand's communication department during the Easter break. You will handle a real project: brief, deliverables, final presentation.",
          "All classes taught in English. Private diploma equivalent to a Bachelor (180 ECTS), not state-approved.",
        ],
        cta: { heading: "See upcoming workshops", href: "/en/events" },
      },
    },
    {
      slug: "fashion-accessory-design",
      fr: {
        title: "Mode & Design d'accessoires",
        hero: {
          eyebrow: "Bachelor · 3 ans · 180 ECTS",
          heading: "Mode & Design d'accessoires",
          subheading:
            "De l'intuition créative au défilé : concevoir, prototyper et présenter une collection complète.",
        },
        body: [
          "Dès le premier jour, vous développez votre culture artistique, votre regard sur le détail, et votre compréhension des matériaux, des volumes et des couleurs. Vous apprendrez à construire une collection cohérente, à façonner une identité visuelle, à planifier un défilé, à créer des visuels percutants, et à présenter votre travail avec aisance.",
          "Vous couvrirez tous les fondamentaux du métier : dessin de mode, coupe à plat, moulage, couture, sérigraphie textile, et conception d'accessoires (sacs, chaussures, chapellerie). Encadrement par des professionnels en activité dans le secteur.",
          "En 3ème année, vous produirez une collection complète présentée lors d'un défilé public à Bruxelles, devant la presse spécialisée et les recruteurs des grandes maisons. Le défilé annuel est le moment phare du cursus.",
          "Le programme entretient des liens étroits avec l'industrie : Maison Margiela, AF Vandevorst, MM6, ainsi que de nombreuses jeunes marques bruxelloises. Tous les cours sont en anglais.",
          "Diplôme privé équivalent à un Bachelor (180 ECTS), non reconnu d'État.",
        ],
        cta: { heading: "Voir les expositions", href: "/fr/events" },
      },
      en: {
        title: "Fashion & Accessory Design",
        hero: {
          eyebrow: "Bachelor · 3 years · 180 ECTS",
          heading: "Fashion & Accessory Design",
          subheading:
            "From creative intuition to runway. Design, prototype and present a full collection.",
        },
        body: [
          "From day one, you build your artistic culture, your eye for detail, and your understanding of materials, volumes and colours. You will learn to craft a coherent collection, shape a visual identity, plan a runway show, create compelling visuals, and present your work with confidence.",
          "You will cover every fundamental of the trade: fashion drawing, flat pattern cutting, draping, sewing, textile printing, and accessory design (bags, shoes, millinery). Mentored by working industry professionals.",
          "In year 3, you produce a full collection presented at a public runway show in Brussels, attended by specialised press and recruiters from major fashion houses. The annual show is the highlight of the program.",
          "The program maintains close ties with the industry: Maison Margiela, AF Vandevorst, MM6, and many emerging Brussels labels. All classes taught in English.",
          "Private diploma equivalent to a Bachelor (180 ECTS), not state-approved.",
        ],
        cta: { heading: "See exhibitions", href: "/en/events" },
      },
    },
    // NOTE: lifelong-learning is now a hand-coded page tree at
    // src/app/(frontend)/[locale]/lifelong-learning/* — the static route
    // takes precedence over [...slug], so no CMS doc is needed here.
    // NOTE: admissions is now a hand-coded page at
    // src/app/(frontend)/[locale]/admissions/page.tsx — the static route
    // takes precedence over [...slug], so no CMS doc is needed here.
    // NOTE: page CMS "international" retirée mai 2026 — doublon sémantique
    // avec /around-the-world qui est exposé dans la nav. Cf. audit cleanup.
  ]

  // Per-page extra blocks (stats, feature lists) keyed by slug
  const extraBlocks: Record<
    string,
    (loc: "fr" | "en") => Array<Record<string, unknown>>
  > = {
    // NOTE: about extras retired — About is now hand-coded.
    programmes: (loc) => [
      {
        blockType: "featureList",
        eyebrow: loc === "fr" ? "Bachelor" : "Bachelor",
        heading:
          loc === "fr"
            ? "Trois cursus de 3 ans, 180 ECTS chacun."
            : "Three 3-year programs, 180 ECTS each.",
        columns: "3",
        items:
          loc === "fr"
            ? [
                {
                  title: "Architecture d'intérieur & Design",
                  description:
                    "Conception d'espaces résidentiels, retail, hôteliers et scénographiques.",
                },
                {
                  title: "Communication & Design Digital",
                  description:
                    "Direction artistique, identité de marque, motion, UI/UX, IA générative.",
                },
                {
                  title: "Mode & Design d'accessoires",
                  description:
                    "De la planche d'inspiration au défilé : collection complète en 3 ans.",
                },
              ]
            : [
                {
                  title: "Interior Architecture & Design",
                  description:
                    "Designing residential, retail, hospitality and scenographic spaces.",
                },
                {
                  title: "Communication & Digital Design",
                  description:
                    "Art direction, brand identity, motion, UI/UX, generative AI.",
                },
                {
                  title: "Fashion & Accessory Design",
                  description:
                    "From mood board to runway: a full collection in 3 years.",
                },
              ],
      },
    ],
    "interior-architecture-design": (loc) => [
      {
        blockType: "featureList",
        eyebrow: loc === "fr" ? "Au programme" : "Curriculum",
        heading:
          loc === "fr" ? "Un cursus complet et pratique." : "A complete, hands-on curriculum.",
        columns: "2",
        items:
          loc === "fr"
            ? [
                { title: "Dessin technique & perspective", description: "Croquis, vues, plans, axonométries." },
                { title: "Conception spatiale", description: "Volume, lumière, matières, ergonomie." },
                { title: "Logiciels professionnels", description: "AutoCAD, SketchUp, Rhino, V-Ray." },
                { title: "Histoire du design", description: "Modernisme, post-modernisme, références contemporaines." },
                { title: "Stages en agence", description: "Un stage chaque année, en Belgique ou à l'étranger." },
                { title: "Workshops internationaux", description: "Shanghai, São Paulo, Milan." },
              ]
            : [
                { title: "Technical drawing & perspective", description: "Sketches, views, plans, axonometric drawings." },
                { title: "Spatial design", description: "Volume, light, materials, ergonomics." },
                { title: "Professional software", description: "AutoCAD, SketchUp, Rhino, V-Ray." },
                { title: "Design history", description: "Modernism, post-modernism, contemporary references." },
                { title: "Agency internships", description: "One internship every year, in Belgium or abroad." },
                { title: "International workshops", description: "Shanghai, São Paulo, Milan." },
              ],
      },
    ],
    "communication-digital-design": (loc) => [
      {
        blockType: "featureList",
        eyebrow: loc === "fr" ? "Métiers visés" : "Career outcomes",
        heading:
          loc === "fr"
            ? "Six débouchés, un même fondement créatif."
            : "Six career paths, one creative foundation.",
        columns: "3",
        items:
          loc === "fr"
            ? [
                { title: "Direction artistique", description: "Agences, marques, médias." },
                { title: "Designer de marque", description: "Identités visuelles complètes." },
                { title: "Motion designer", description: "Animation, broadcast, social." },
                { title: "Designer UX/UI", description: "Produits digitaux, applications." },
                { title: "Créatif IA", description: "Workflows assistés, prompt engineering." },
                { title: "Indépendant·e", description: "Studio personnel, freelance international." },
              ]
            : [
                { title: "Art direction", description: "Agencies, brands, media." },
                { title: "Brand designer", description: "Full visual identities." },
                { title: "Motion designer", description: "Animation, broadcast, social." },
                { title: "UX/UI designer", description: "Digital products, applications." },
                { title: "AI creative", description: "AI-assisted workflows, prompt engineering." },
                { title: "Freelance / studio", description: "Personal studio, international freelance." },
              ],
      },
    ],
    "fashion-accessory-design": (loc) => [
      {
        blockType: "featureList",
        eyebrow: loc === "fr" ? "Savoir-faire" : "Craftsmanship",
        heading:
          loc === "fr"
            ? "Du dessin de mode au défilé public."
            : "From fashion drawing to public runway.",
        columns: "2",
        items:
          loc === "fr"
            ? [
                { title: "Dessin de mode & illustration", description: "Silhouettes, mouvements, expressivité." },
                { title: "Coupe à plat & moulage", description: "Patronage, prototypage, ajustement." },
                { title: "Couture & finitions", description: "Machines industrielles, finitions haute couture." },
                { title: "Sérigraphie textile", description: "Impression, broderie, tissage." },
                { title: "Design d'accessoires", description: "Sacs, chaussures, chapellerie." },
                { title: "Direction artistique mode", description: "Lookbook, campagne, scénographie défilé." },
              ]
            : [
                { title: "Fashion drawing & illustration", description: "Silhouettes, movement, expressiveness." },
                { title: "Flat pattern & draping", description: "Pattern-making, prototyping, fitting." },
                { title: "Sewing & finishing", description: "Industrial machines, couture-grade finishes." },
                { title: "Textile printing", description: "Screen printing, embroidery, weaving." },
                { title: "Accessory design", description: "Bags, shoes, millinery." },
                { title: "Fashion art direction", description: "Lookbook, campaign, runway scenography." },
              ],
      },
    ],
    // NOTE: bloc "international" retiré mai 2026 en même temps que la page.
  }

  for (const def of pageDefs) {
    const layout = (loc: "fr" | "en") => {
      const d = def[loc]
      const extra = extraBlocks[def.slug]?.(loc) ?? []
      return [
        {
          blockType: "hero",
          eyebrow: d.hero.eyebrow,
          heading: d.hero.heading,
          subheading: d.hero.subheading,
          variant: "text",
        },
        {
          blockType: "richText",
          content: richText(d.body),
          width: "prose",
        },
        ...extra,
        {
          blockType: "cta",
          heading: d.cta.heading,
          buttons: [
            {
              label: loc === "fr" ? "Nous contacter" : "Get in touch",
              href: d.cta.href,
              style: "primary",
            },
          ],
        },
      ]
    }

    const created = await upsertBySlug(
      payload,
      "pages",
      def.slug,
      {
        slug: def.slug,
        title: def.fr.title,
        layout: layout("fr"),
        status: "published",
      },
      "fr",
    )

    await payload.update({
      collection: "pages",
      id: created.id,
      data: {
        title: def.en.title,
        layout: layout("en"),
      },
      locale: "en",
    })
    console.log(`   ✓ page: ${def.slug}`)
  }

  // ---------------------------------------------------------------------
  // 3) Events
  // ---------------------------------------------------------------------
  const eventDefs = [
    {
      slug: "open-day-spring-2026",
      categorySlug: "open-day",
      featured: true,
      startDays: 14,
      endDays: 14,
      startHour: 14,
      endHour: 18,
      fr: {
        title: "Journée portes ouvertes, Printemps 2026",
        location: "CAD, 25 rue Roberts-Jones, 1180 Uccle",
        description: [
          "Visitez les ateliers, échangez avec les enseignants et les étudiants, et découvrez les projets de 3e année.",
          "Présentations de programmes à 14h, 15h30 et 17h. Pas d'inscription nécessaire, vous êtes les bienvenu·e·s.",
        ],
      },
      en: {
        title: "Open Day, Spring 2026",
        location: "CAD, 25 rue Roberts-Jones, 1180 Uccle",
        description: [
          "Visit the studios, talk with faculty and students, and discover the year-3 graduation projects.",
          "Program presentations at 2pm, 3:30pm and 5pm. No registration needed, you are welcome to drop by.",
        ],
      },
    },
    {
      slug: "workshop-shanghai-2026",
      categorySlug: "workshop",
      featured: true,
      startDays: 45,
      endDays: 59,
      startHour: 9,
      endHour: 18,
      fr: {
        title: "Workshop international, Shanghai 2026",
        location: "Tongji University, Shanghai",
        description: [
          "Deux semaines de workshop intensif à Tongji University autour du design d'expérience pour le retail asiatique.",
          "Encadré par les enseignants du CAD et des designers shanghaïens. Ouvert aux étudiants de 2e et 3e année.",
        ],
      },
      en: {
        title: "International workshop, Shanghai 2026",
        location: "Tongji University, Shanghai",
        description: [
          "Two weeks of intensive workshop at Tongji University on experience design for Asian retail.",
          "Mentored by CAD faculty and Shanghai-based designers. Open to year 2 and 3 students.",
        ],
      },
    },
    {
      slug: "lifelong-learning-genai-may-2026",
      categorySlug: "lifelong-learning",
      featured: false,
      startDays: 21,
      endDays: 80,
      startHour: 19,
      endHour: 21,
      fr: {
        title: "IA générative pour professionnels créatifs, Module Mai 2026",
        location: "CAD Brussels",
        description: [
          "Dix séances en soirée pour reprendre le contrôle créatif sur les outils d'IA générative, au-delà de l'effet « wow ».",
          "Pour communicants, agences créatives et studios digitaux. Travail sur projets réels, méthodologie applicable dès le lendemain.",
          "Petit groupe (12 places). Certificat CAD délivré à la fin du module.",
        ],
      },
      en: {
        title: "Generative AI for creative professionals, May 2026 module",
        location: "CAD Brussels",
        description: [
          "Ten evening sessions to regain creative control over generative AI tools, beyond the \"wow\" effect.",
          "For communicators, creative agencies and digital studios. Real-project work, methodology you can apply the next day.",
          "Small group (12 seats). CAD certificate awarded at the end of the module.",
        ],
      },
    },
    {
      slug: "graduation-show-2026",
      categorySlug: "exhibition",
      featured: true,
      startDays: 60,
      endDays: 67,
      startHour: 18,
      endHour: 22,
      fr: {
        title: "Graduation Show 2026, Diplômes des trois filières",
        location: "CAD Brussels, Galerie d'exposition",
        description: [
          "Découvrez les projets de fin d'études des promotions Bachelor : architecture d'intérieur, communication digitale, mode et accessoires.",
          "Vernissage le premier soir de 18h à 22h. Exposition ouverte au public toute la semaine, 11h–19h.",
        ],
      },
      en: {
        title: "Graduation Show 2026, Bachelor showcase",
        location: "CAD Brussels, Gallery",
        description: [
          "Discover the graduation projects of the Bachelor classes: interior architecture, digital communication, fashion and accessories.",
          "Opening night on day 1 from 6pm to 10pm. Exhibition open to the public all week, 11am–7pm.",
        ],
      },
    },
    {
      slug: "talk-design-careers-2026",
      categorySlug: "conference",
      featured: false,
      startDays: 35,
      endDays: 35,
      startHour: 19,
      endHour: 21,
      fr: {
        title: "Talk, Construire une carrière en design aujourd'hui",
        location: "CAD Brussels, Auditorium",
        description: [
          "Trois designers reviennent sur leur parcours : agence, studio indépendant, freelance international.",
          "Discussion ouverte avec le public, suivie d'un drink.",
        ],
      },
      en: {
        title: "Talk, Building a design career today",
        location: "CAD Brussels, Auditorium",
        description: [
          "Three designers share their journey: agency, independent studio, international freelance.",
          "Open Q&A with the audience, followed by a drink.",
        ],
      },
    },
    {
      slug: "workshop-milan-design-week-2026",
      categorySlug: "workshop",
      featured: false,
      startDays: 90,
      endDays: 96,
      startHour: 9,
      endHour: 19,
      fr: {
        title: "Workshop Milan Design Week 2026",
        location: "Salone del Mobile, Milan",
        description: [
          "Une semaine immersive au cœur du Salone del Mobile : visites guidées, rencontres avec des designers, brief de projet en équipe.",
          "Réservé aux étudiants Master Home & Living Design.",
        ],
      },
      en: {
        title: "Milan Design Week Workshop 2026",
        location: "Salone del Mobile, Milan",
        description: [
          "An immersive week at the heart of Salone del Mobile: guided tours, designer meet-ups, team project brief.",
          "Reserved for Master Home & Living Design students.",
        ],
      },
    },
  ]

  for (const ev of eventDefs) {
    const created = await upsertBySlug(
      payload,
      "events",
      ev.slug,
      {
        slug: ev.slug,
        title: ev.fr.title,
        startDate: inDaysAt(ev.startDays, ev.startHour),
        endDate: inDaysAt(ev.endDays, ev.endHour),
        location: ev.fr.location,
        category: categoryIds[ev.categorySlug],
        description: richText(ev.fr.description),
        featured: ev.featured,
        status: "published",
      },
      "fr",
    )

    await payload.update({
      collection: "events",
      id: created.id,
      data: {
        title: ev.en.title,
        location: ev.en.location,
        description: richText(ev.en.description),
      },
      locale: "en",
    })
    console.log(`   ✓ event: ${ev.slug}`)
  }

  // ---------------------------------------------------------------------
  // 4) Globals — Header, Footer, Site Settings
  // ---------------------------------------------------------------------
  // Header: paths are locale-agnostic; the front prepends `/fr` or `/en`.
  // We write the FULL structure in FR first (with paths and labels), then
  // overwrite ONLY the localized labels in EN.
  const headerFR = {
    navItems: [
      {
        label: "Bachelor",
        path: "/programmes",
        children: [
          { label: "Architecture d'intérieur", path: "/interior-architecture-design" },
          { label: "Communication & Digital", path: "/communication-digital-design" },
          { label: "Mode & Accessoires", path: "/fashion-accessory-design" },
        ],
      },
      {
        label: "Master",
        path: "/masters",
        children: [
          { label: "Tous les Masters", path: "/masters" },
          { label: "Architecture d'intérieur", path: "/interior-architecture-design-master" },
          { label: "Home & Living", path: "/home-living-design" },
          { label: "Digital Brand Content", path: "/digital-brand-content" },
          { label: "Image, 3D, Motion, IA", path: "/image-3d-motion-video-ai" },
          { label: "Event Management", path: "/event-management" },
          { label: "Fashion Management", path: "/fashion-management" },
        ],
      },
      { label: "Lifelong Learning", path: "/lifelong-learning" },
      { label: "Événements", path: "/events" },
      { label: "Actualités", path: "/news" },
      {
        label: "À propos",
        path: "/about",
        children: [
          { label: "L'école", path: "/about" },
          { label: "International", path: "/around-the-world" },
          { label: "Étudier à Bruxelles", path: "/etudier-a-bruxelles" },
          { label: "Ouverture & Culture", path: "/openness-and-culture" },
        ],
      },
      { label: "Contact", path: "/contact" },
    ],
    cta: { label: "Candidater", path: "/admissions" },
  }

  await payload.updateGlobal({ slug: "header", data: headerFR, locale: "fr" })

  // Now translate just the labels in EN. Same structure, only labels change.
  const headerEN = {
    navItems: [
      {
        label: "Bachelor",
        path: "/programmes",
        children: [
          { label: "Interior Architecture", path: "/interior-architecture-design" },
          { label: "Communication & Digital", path: "/communication-digital-design" },
          { label: "Fashion & Accessory", path: "/fashion-accessory-design" },
        ],
      },
      {
        label: "Master",
        path: "/masters",
        children: [
          { label: "All Masters", path: "/masters" },
          { label: "Interior Architecture", path: "/interior-architecture-design-master" },
          { label: "Home & Living", path: "/home-living-design" },
          { label: "Digital Brand Content", path: "/digital-brand-content" },
          { label: "Image, 3D, Motion, AI", path: "/image-3d-motion-video-ai" },
          { label: "Event Management", path: "/event-management" },
          { label: "Fashion Management", path: "/fashion-management" },
        ],
      },
      { label: "Lifelong Learning", path: "/lifelong-learning" },
      { label: "Events", path: "/events" },
      { label: "News", path: "/news" },
      {
        label: "About",
        path: "/about",
        children: [
          { label: "The school", path: "/about" },
          { label: "International", path: "/around-the-world" },
          { label: "Studying in Brussels", path: "/etudier-a-bruxelles" },
          { label: "Openness & Culture", path: "/openness-and-culture" },
        ],
      },
      { label: "Contact", path: "/contact" },
    ],
    cta: { label: "Apply", path: "/admissions" },
  }
  await payload.updateGlobal({ slug: "header", data: headerEN, locale: "en" })
  console.log("   ✓ global: header (FR + EN)")

  // Footer: paths are locale-agnostic, labels are localized.
  const footerFR = {
    columns: [
      {
        title: "École",
        links: [
          { label: "À propos", path: "/about" },
          { label: "Programmes", path: "/programmes" },
          { label: "Admissions", path: "/admissions" },
          { label: "International", path: "/around-the-world" },
        ],
      },
      {
        title: "Communauté",
        links: [
          { label: "Événements", path: "/events" },
          { label: "Actualités", path: "/news" },
          { label: "Lifelong Learning", path: "/lifelong-learning" },
          { label: "Contact", path: "/contact" },
        ],
      },
      {
        title: "Suivez-nous",
        links: [
          { label: "Instagram", path: "https://instagram.com/cadbrussels" },
          { label: "Facebook", path: "https://facebook.com/CADBrussels" },
          { label: "LinkedIn", path: "https://linkedin.com/school/cad-brussels" },
        ],
      },
    ],
    legal: [
      { label: "Mentions légales", path: "/legal" },
      { label: "Confidentialité", path: "/privacy" },
    ],
    copyright: "© CAD Brussels, College of Art & Design",
  }
  await payload.updateGlobal({ slug: "footer", data: footerFR, locale: "fr" })

  const footerEN = {
    columns: [
      {
        title: "School",
        links: [
          { label: "About", path: "/about" },
          { label: "Programs", path: "/programmes" },
          { label: "Admissions", path: "/admissions" },
          { label: "International", path: "/around-the-world" },
        ],
      },
      {
        title: "Community",
        links: [
          { label: "Events", path: "/events" },
          { label: "News", path: "/news" },
          { label: "Lifelong Learning", path: "/lifelong-learning" },
          { label: "Contact", path: "/contact" },
        ],
      },
      {
        title: "Follow us",
        links: [
          { label: "Instagram", path: "https://instagram.com/cadbrussels" },
          { label: "Facebook", path: "https://facebook.com/CADBrussels" },
          { label: "LinkedIn", path: "https://linkedin.com/school/cad-brussels" },
        ],
      },
    ],
    legal: [
      { label: "Legal", path: "/legal" },
      { label: "Privacy", path: "/privacy" },
    ],
    copyright: "© CAD Brussels, College of Art & Design",
  }
  await payload.updateGlobal({ slug: "footer", data: footerEN, locale: "en" })
  console.log("   ✓ global: footer (FR + EN)")

  await payload.updateGlobal({
    slug: "site-settings",
    locale: "fr",
    data: {
      siteName: "CAD Brussels",
      tagline: "College of Art & Design, Bruxelles, depuis 1961",
      contact: {
        address: "25 rue Roberts-Jones\n1180 Bruxelles\nBelgique",
        email: "secretariat@cad.be",
        phone: "+32 (0)2 640 40 32",
      },
      social: [
        { platform: "instagram", url: "https://instagram.com/cadbrussels" },
        { platform: "facebook", url: "https://facebook.com/CADBrussels" },
        { platform: "linkedin", url: "https://linkedin.com/school/cad-brussels" },
      ],
    },
  })
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "en",
    data: {
      tagline: "College of Art & Design, Brussels, since 1961",
    },
  })
  console.log("   ✓ global: site-settings")

  console.log("\n✅ Seed complete.")
  process.exit(0)
}

seed().catch((err) => {
  console.error("✗ Seed failed", err)
  process.exit(1)
})
