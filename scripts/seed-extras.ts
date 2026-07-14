/**
 * Extra seed: more pages (Masters, Workshops, Living in Brussels, etc.),
 * news posts, more events, plus testimonials and FAQ blocks across all pages.
 *
 * Runs after `pnpm seed`. Idempotent (upsert by slug).
 *
 * Usage:  pnpm seed:extras
 */

import { getPayload } from "payload"
import config from "../src/payload.config"
import type { Payload } from "payload"

// ---------------------------------------------------------------- helpers

const inDays = (n: number, hour = 18, minute = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

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

async function upsertBySlug<T extends Record<string, unknown>>(
  payload: Payload,
  collection: "pages" | "posts" | "events" | "categories",
  slug: string,
  data: T,
  locale: "fr" | "en" = "fr",
) {
  const existing = await payload.find({
    // @ts-expect-error generic
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    return payload.update({
      // @ts-expect-error generic
      collection,
      id: existing.docs[0]!.id,
      data,
      locale,
    })
  }
  return payload.create({
    // @ts-expect-error generic
    collection,
    data,
    locale,
  })
}

// ---------------------------------------------------------------- pages

type PageDef = {
  slug: string
  fr: PageContent
  en: PageContent
}

type PageContent = {
  title: string
  hero: { eyebrow: string; heading: string; subheading: string }
  body: string[]
  // optional extras
  feature?: {
    eyebrow: string
    heading: string
    columns: "2" | "3"
    items: { title: string; description: string }[]
  }
  stats?: { value: string; label: string }[]
  quote?: { eyebrow?: string; quote: string; authorName: string; authorRole: string }
  faq?: { eyebrow?: string; heading?: string; items: { question: string; answer: string }[] }
  cta: { heading: string; href: string; label: string }
}

const pageDefs: PageDef[] = [
  // ============================================================ MASTERS
  {
    slug: "masters",
    fr: {
      title: "Masters",
      hero: {
        eyebrow: "Master · 1 ou 2 ans",
        heading: "Sept Masters spécialisés.",
        subheading:
          "Architecture d'intérieur, Home & Living, Digital Brand Content, Image 3D-Motion-Vidéo-IA, Event Management, choisissez votre voie.",
      },
      body: [
        "Les Masters du CAD durent 1 ou 2 ans selon la filière (60 ou 120 ECTS). Ils sont ouverts aux titulaires d'un Bachelor en discipline créative ou aux candidats démontrant un niveau équivalent par portfolio.",
        "Quel que soit votre Master, vous aurez : ateliers de création, suivi individuel par un mentor en activité, projets clients réels, mémoire-projet final présenté publiquement.",
        "Tous les cours sont en anglais. Le CAD est membre du réseau international CUMULUS depuis 2013, qui réunit plus de 200 écoles d'art à travers le monde. Cela ouvre la porte à des échanges et workshops internationaux.",
      ],
      feature: {
        eyebrow: "Six Masters + une spécialisation",
        heading: "Choisissez votre spécialisation.",
        columns: "3",
        items: [
          { title: "Architecture d'intérieur · 2 ans", description: "Le Master long, pour devenir architecte d'intérieur senior. 120 ECTS." },
          { title: "Home & Living Design", description: "Mobilier, objet, scénographie domestique. Workshop Milan inclus." },
          { title: "Digital Brand Content", description: "Stratégie de marque digitale, content design, social media." },
          { title: "Image, 3D, Motion & Video, AI", description: "CGI, motion design, vidéo, IA générative pour la création." },
          { title: "Event Management", description: "Conception et production d'événements. 12 places max." },
          { title: "Fashion Management", description: "Spécialisation business mode. Temps partiel + stage 6 mois." },
        ],
      },
      cta: { heading: "Quelle filière vous correspond ?", href: "/fr/admissions", label: "Discuter avec le secrétariat" },
    },
    en: {
      title: "Masters",
      hero: {
        eyebrow: "Master · 1 or 2 years",
        heading: "Seven specialized Masters.",
        subheading:
          "Interior Architecture, Home & Living, Digital Brand Content, Image 3D-Motion-Video-AI, Event Management, pick your path.",
      },
      body: [
        "CAD Masters run for 1 or 2 years depending on the track (60 or 120 ECTS). They are open to Bachelor graduates in a creative field, or to candidates demonstrating an equivalent level via portfolio.",
        "Whatever your Master, you'll get: studio creation, one-on-one mentoring by working professionals, real client projects, a final thesis-project shown publicly.",
        "All classes are taught in English. CAD has been a member of the international CUMULUS network since 2013, gathering over 200 art schools worldwide. This opens the door to international exchanges and workshops.",
      ],
      feature: {
        eyebrow: "Six Masters + one specialization",
        heading: "Choose your specialization.",
        columns: "3",
        items: [
          { title: "Interior Architecture · 2 years", description: "The long Master, to become a senior interior architect. 120 ECTS." },
          { title: "Home & Living Design", description: "Furniture, object, domestic scenography. Milan workshop included." },
          { title: "Digital Brand Content", description: "Digital brand strategy, content design, social media." },
          { title: "Image, 3D, Motion & Video, AI", description: "CGI, motion design, video, generative AI for creation." },
          { title: "Event Management", description: "Concept and production of events. 12 places max." },
          { title: "Fashion Management", description: "Fashion business specialization. Part-time + 6-month internship." },
        ],
      },
      cta: { heading: "Which path fits you best?", href: "/en/admissions", label: "Talk to the secretariat" },
    },
  },
  // ============================================================ HOME & LIVING
  {
    slug: "home-living-design",
    fr: {
      title: "Home & Living Design",
      hero: {
        eyebrow: "Master · 1 an · 60 ECTS",
        heading: "Home & Living Design",
        subheading:
          "Mobilier, luminaire, objet, scénographie d'intérieur, un Master tourné vers l'art de vivre contemporain.",
      },
      body: [
        "Vous deviendrez designer spécialisé·e dans l'univers domestique : sièges, tables, rangements, luminaires, art de la table. La pédagogie alterne ateliers de prototypage, briefs industriels et veille esthétique.",
        "Pendant cette année intensive, vous concevrez votre propre collection : une ligne de mobilier (tables, chaises, fauteuils, etc.) ainsi qu'une ligne d'art de la table (verres, carafes, assiettes, couverts, accessoires).",
        "Workshop d'une semaine au Salone del Mobile de Milan chaque année, l'événement référence de la profession. Partenariat avec plusieurs éditeurs de mobilier belges qui apporteront des briefs réels.",
        "Pour valider votre Master, vous finaliserez et exposerez publiquement votre collection à Bruxelles, devant un jury de directeurs créatifs et d'éditeurs.",
        "Tous les cours sont en anglais. Diplôme privé équivalent à un Master (60 ECTS), non reconnu d'État.",
      ],
      stats: [
        { value: "1", label: "Semaine à Milan" },
        { value: "5", label: "Éditeurs partenaires" },
        { value: "60", label: "ECTS en 1 an" },
      ],
      cta: { heading: "Demander la brochure Home & Living", href: "/fr/contact", label: "Recevoir la brochure" },
    },
    en: {
      title: "Home & Living Design",
      hero: {
        eyebrow: "Master · 1 year · 60 ECTS",
        heading: "Home & Living Design",
        subheading:
          "Furniture, lighting, object, interior scenography, a Master focused on contemporary lifestyle.",
      },
      body: [
        "You will become a designer specialised in the domestic world: chairs, tables, storage, lighting, tableware. Teaching alternates prototyping studios, industrial briefs and aesthetic research.",
        "During this intensive year, you will design your own collection: a furniture line (tables, chairs, armchairs, etc.) plus a tableware line (glasses, carafes, plates, cutlery, accessories).",
        "One-week workshop at Salone del Mobile Milan every year, the profession's reference event. Partnerships with several Belgian furniture editors bringing real briefs.",
        "To validate your Master, you will finalise and publicly exhibit your collection in Brussels, in front of a jury of creative directors and editors.",
        "All classes taught in English. Private diploma equivalent to a Master (60 ECTS), not state-approved.",
      ],
      stats: [
        { value: "1", label: "Week in Milan" },
        { value: "5", label: "Partner editors" },
        { value: "60", label: "ECTS in 1 year" },
      ],
      cta: { heading: "Request the Home & Living brochure", href: "/en/contact", label: "Get the brochure" },
    },
  },
  // ============================================================ DIGITAL BRAND CONTENT
  {
    slug: "digital-brand-content",
    fr: {
      title: "Digital Brand Content",
      hero: {
        eyebrow: "Master · 1 an · 60 ECTS",
        heading: "Digital Brand Content",
        subheading:
          "Stratégie de contenu, direction artistique digitale et social media pour les marques contemporaines.",
      },
      body: [
        "Vous deviendrez stratège de contenu, content designer ou social media art director. Vous apprendrez à imaginer, structurer et exécuter une stratégie de contenu digitale cohérente, des concepts éditoriaux jusqu'à la production exécutive.",
        "Comptez environ 25 heures de cours par semaine, structurées en deux semestres. Premier semestre : vous maîtriserez les techniques et les outils pour comprendre et créer un écosystème digital, à travers exercices pratiques et projets, incluant UX-UI, Brand Strategy, Figma et IA générative.",
        "Deuxième semestre : vous réaliserez un projet global, la création d'un écosystème digital complet pour une marque, un service, une institution ou un produit. Présentation finale devant un jury de directeurs marketing.",
        "Vous travaillerez aussi sur un module IA générative, l'analyse data des performances de contenu, et la production de campagnes vidéo courtes pour les plateformes sociales.",
        "Tous les cours sont en anglais. Diplôme privé équivalent à un Master (60 ECTS), non reconnu d'État.",
      ],
      cta: { heading: "Voir les briefs de l'an passé", href: "/fr/contact", label: "Demander un échantillon" },
    },
    en: {
      title: "Digital Brand Content",
      hero: {
        eyebrow: "Master · 1 year · 60 ECTS",
        heading: "Digital Brand Content",
        subheading:
          "Content strategy, digital art direction and social media for contemporary brands.",
      },
      body: [
        "You will become a content strategist, content designer or social media art director. You will learn to imagine, structure and execute a coherent digital content strategy, from editorial concepts to executive production.",
        "Expect around 25 hours of class per week, structured in two semesters. First semester: you will master the techniques and tools to understand and create a digital ecosystem, through practical exercises and projects, including UX-UI, Brand Strategy, Figma and generative AI.",
        "Second semester: you will deliver a global project, the creation of a complete digital ecosystem for a brand, service, institution or product. Final presentation to a jury of marketing directors.",
        "You will also work on a generative AI module, data analysis of content performance, and short video campaign production for social platforms.",
        "All classes taught in English. Private diploma equivalent to a Master (60 ECTS), not state-approved.",
      ],
      cta: { heading: "See last year's briefs", href: "/en/contact", label: "Request a sample" },
    },
  },
  // ============================================================ IMAGE 3D MOTION VIDEO AI
  {
    slug: "image-3d-motion-video-ai",
    fr: {
      title: "Image, 3D, Motion & Video, AI",
      hero: {
        eyebrow: "Master · 1 an · 60 ECTS",
        heading: "Image, 3D, Motion, Vidéo, IA",
        subheading:
          "Le Master image à 360° : modélisation 3D, motion design, prise de vue, montage, et workflows IA générative.",
      },
      body: [
        "Vous couvrirez tout le spectre de la production d'image contemporaine : 3D temps réel et offline (Blender, Cinema 4D, Unreal Engine), motion design (After Effects), tournage, montage (Premiere, DaVinci), et IA générative (Midjourney, ComfyUI, Runway, Sora).",
        "Vous travaillerez sur des films courts, des publicités, des clips musicaux et des installations vidéo, encadré·e par des réalisateurs et motion designers en activité. En un an, vous maîtriserez les techniques de design 3D, animation et IA.",
        "Pour valider votre Master, vous produirez une série de trois pièces démontrant la maîtrise de plusieurs techniques, présentées lors d'une projection publique.",
        "Tous les cours sont en anglais. Diplôme privé équivalent à un Master (60 ECTS), non reconnu d'État.",
      ],
      feature: {
        eyebrow: "Outils maîtrisés",
        heading: "Une chaîne de production complète.",
        columns: "3",
        items: [
          { title: "Blender / C4D / Unreal", description: "3D temps réel et offline." },
          { title: "After Effects / DaVinci", description: "Motion design et étalonnage." },
          { title: "Premiere Pro", description: "Montage long et publicitaire." },
          { title: "Midjourney / Runway / Sora", description: "Génération d'image et de vidéo IA." },
          { title: "ComfyUI", description: "Workflows IA avancés." },
          { title: "Houdini (option)", description: "Effets spéciaux procéduraux." },
        ],
      },
      cta: { heading: "Voir les films de promo", href: "/fr/events", label: "Projection publique" },
    },
    en: {
      title: "Image, 3D, Motion & Video, AI",
      hero: {
        eyebrow: "Master · 1 year · 60 ECTS",
        heading: "Image, 3D, Motion, Video, AI",
        subheading:
          "A 360° image Master: 3D modelling, motion design, shooting, editing, and generative AI workflows.",
      },
      body: [
        "You will cover the full spectrum of contemporary image production: real-time and offline 3D (Blender, Cinema 4D, Unreal Engine), motion design (After Effects), shooting, editing (Premiere, DaVinci), and generative AI (Midjourney, ComfyUI, Runway, Sora).",
        "You will work on short films, commercials, music videos and video installations, mentored by working directors and motion designers. In one year, you will master design techniques across 3D, animation and AI.",
        "To validate your Master, you will produce a series of three pieces demonstrating mastery of several techniques, shown at a public screening.",
        "All classes taught in English. Private diploma equivalent to a Master (60 ECTS), not state-approved.",
      ],
      feature: {
        eyebrow: "Tools mastered",
        heading: "A complete production chain.",
        columns: "3",
        items: [
          { title: "Blender / C4D / Unreal", description: "Real-time and offline 3D." },
          { title: "After Effects / DaVinci", description: "Motion design and color grading." },
          { title: "Premiere Pro", description: "Long-form and ad editing." },
          { title: "Midjourney / Runway / Sora", description: "AI image and video generation." },
          { title: "ComfyUI", description: "Advanced AI workflows." },
          { title: "Houdini (option)", description: "Procedural visual effects." },
        ],
      },
      cta: { heading: "See class films", href: "/en/events", label: "Public screening" },
    },
  },
  // ============================================================ EVENT MANAGEMENT
  {
    slug: "event-management",
    fr: {
      title: "Event Management",
      hero: {
        eyebrow: "Master · 1 an · 60 ECTS",
        heading: "Event Management",
        subheading:
          "Concevoir, produire et diriger des événements culturels, corporate et de marque, du brief à la livraison.",
      },
      body: [
        "Vous deviendrez chef·fe de projet événementiel, capable de mener un événement de A à Z : concept, scénographie, production, logistique, communication, budget, sécurité. L'accent est mis sur la scénographie, le storytelling et la planification logistique, enseignés par des experts en activité dans le secteur.",
        "Promotion à effectif réduit : 12 places maximum chaque année, pour garantir un suivi individuel et une production de qualité. Cours intégralement en anglais.",
        "Premier semestre : vous maîtriserez les aspects techniques et opérationnels, et préparerez un cas où vous présenterez votre propre concept dans le cadre d'un projet final complet. Deuxième semestre : stage obligatoire de 6 mois en entreprise de production, agence événementielle, bureau de scénographie ou structure équivalente.",
        "Vous produirez en vrai au moins deux événements pendant l'année : exposition, défilé, conférence, lancement de marque, avec budget réel et public extérieur. Pas de simulation.",
        "À la sortie, vous pouvez travailler comme chef·fe de projet événementiel, scénographe, producteur·rice exécutif·ve ou directeur·rice de création événementiel. Diplôme privé équivalent à un Master (60 ECTS), non reconnu d'État.",
      ],
      cta: { heading: "Voir notre Graduation Show", href: "/fr/events", label: "Calendrier des événements" },
    },
    en: {
      title: "Event Management",
      hero: {
        eyebrow: "Master · 1 year · 60 ECTS",
        heading: "Event Management",
        subheading:
          "Design, produce and direct cultural, corporate and brand events from brief to delivery.",
      },
      body: [
        "You will become an event project manager, able to lead an event end-to-end: concept, scenography, production, logistics, communications, budget, safety. The focus is on scenography, storytelling and logistical planning, taught by industry experts.",
        "Small cohort: 12 places maximum every year, to guarantee individual mentoring and production quality. All classes taught in English.",
        "First semester: you will master the technical and operational aspects, and prepare a case where you present your own concept as part of a comprehensive final project. Second semester: mandatory 6-month internship in a production company, event agency, scenography office or equivalent.",
        "You will actually produce at least two events during the year: exhibition, runway, conference, brand launch, with real budget and external audience. No simulation.",
        "By graduation, you can work as event project manager, scenographer, executive producer or event creative director. Private diploma equivalent to a Master (60 ECTS), not state-approved.",
      ],
      cta: { heading: "See our Graduation Show", href: "/en/events", label: "Event calendar" },
    },
  },
  // ============================================================ INTERIOR ARCHITECTURE (Master 2 years)
  {
    slug: "interior-architecture-design-master",
    fr: {
      title: "Architecture d'intérieur · Master 2 ans",
      hero: {
        eyebrow: "Master · 2 ans · 120 ECTS",
        heading: "Architecture d'intérieur & Design",
        subheading:
          "Le Master long, pour devenir architecte d'intérieur senior. Deux années d'approfondissement, un mémoire-projet d'envergure, ouverture internationale via le réseau CUMULUS.",
      },
      body: [
        "Ce Master 2 ans est fait pour vous si vous avez un Bachelor en architecture, architecture d'intérieur ou design d'espace, et que vous voulez approfondir votre pratique avant d'entrer dans la profession à un niveau senior.",
        "La première année, vous développerez votre expertise technique et conceptuelle : grands formats résidentiels, retail haut de gamme, scénographie d'exposition, hôtellerie, projets de réhabilitation patrimoniale.",
        "La deuxième année est dédiée à votre mémoire-projet : un projet d'envergure mené sur deux semestres, depuis la recherche jusqu'à la livraison de plans d'exécution professionnels, avec soutenance publique devant un jury international.",
        "Tous les cours sont en anglais. Diplôme privé équivalent à un Master (120 ECTS), non reconnu d'État.",
      ],
      feature: {
        eyebrow: "Au programme",
        heading: "Une expertise complète, du concept à la livraison.",
        columns: "2",
        items: [
          { title: "Conception spatiale avancée", description: "Grands volumes, programmes complexes, contraintes techniques." },
          { title: "Patrimoine & réhabilitation", description: "Réécrire des espaces existants avec sensibilité historique." },
          { title: "Logiciels professionnels", description: "AutoCAD, Rhino, V-Ray, Twinmotion, Lumion." },
          { title: "Direction de projet", description: "Pilotage d'équipe, dialogue MOA/MOE, gestion de chantier." },
          { title: "Workshops internationaux", description: "Milan, Shanghai, São Paulo. ECTS validés." },
          { title: "Mémoire-projet sur 2 semestres", description: "Projet d'envergure, jury international, exposition publique." },
        ],
      },
      stats: [
        { value: "120", label: "ECTS sur 2 ans" },
        { value: "200+", label: "Écoles partenaires CUMULUS" },
        { value: "2", label: "Stages obligatoires" },
      ],
      cta: { heading: "Demander la brochure Master 2 ans", href: "/fr/contact", label: "Recevoir la brochure" },
    },
    en: {
      title: "Interior Architecture · Master 2 years",
      hero: {
        eyebrow: "Master · 2 years · 120 ECTS",
        heading: "Interior Architecture & Design",
        subheading:
          "The long Master, to become a senior interior architect. Two years of deepening, a substantial thesis-project, international reach through the CUMULUS network.",
      },
      body: [
        "This 2-year Master is for you if you hold a Bachelor in architecture, interior architecture or spatial design, and want to deepen your practice before entering the profession at a senior level.",
        "Year 1, you will build your technical and conceptual expertise: large residential formats, high-end retail, exhibition scenography, hospitality, heritage rehabilitation projects.",
        "Year 2 is dedicated to your thesis-project: a substantial project run over two semesters, from research to professional construction drawings, with public defense before an international jury.",
        "All classes are taught in English. Private diploma equivalent to a Master (120 ECTS), not state-approved.",
      ],
      feature: {
        eyebrow: "Curriculum",
        heading: "Full expertise, from concept to delivery.",
        columns: "2",
        items: [
          { title: "Advanced spatial design", description: "Large volumes, complex programs, technical constraints." },
          { title: "Heritage & rehabilitation", description: "Rewriting existing spaces with historical sensitivity." },
          { title: "Professional software", description: "AutoCAD, Rhino, V-Ray, Twinmotion, Lumion." },
          { title: "Project direction", description: "Team management, client and contractor dialogue, site supervision." },
          { title: "International workshops", description: "Milan, Shanghai, São Paulo. ECTS validated." },
          { title: "Two-semester thesis-project", description: "Substantial project, international jury, public exhibition." },
        ],
      },
      stats: [
        { value: "120", label: "ECTS over 2 years" },
        { value: "200+", label: "CUMULUS partner schools" },
        { value: "2", label: "Mandatory internships" },
      ],
      cta: { heading: "Request the 2-year Master brochure", href: "/en/contact", label: "Get the brochure" },
    },
  },
  // ============================================================ FASHION MANAGEMENT (Specialization)
  {
    slug: "fashion-management",
    fr: {
      title: "Fashion Management · Spécialisation",
      hero: {
        eyebrow: "Spécialisation · 60 ECTS · temps partiel",
        heading: "Fashion Business Specialization",
        subheading:
          "Une spécialisation à temps partiel pour former les futurs leaders de l'industrie de la mode : management, marketing, stratégie, retail. Avec stage obligatoire de 6 mois en fin de cursus.",
      },
      body: [
        "Cette spécialisation est faite pour vous si vous voulez évoluer dans l'écosystème mode contemporain : maisons de luxe, marques de prêt-à-porter, retail, e-commerce, presse spécialisée. Que vous soyez passionné·e de mode, designer voulant comprendre le business, ou pro du marketing voulant vous spécialiser sur ce secteur.",
        "Le format à temps partiel vous permet de combiner la formation avec une activité professionnelle. Les cours sont concentrés sur certains jours et soirées, assurés par des intervenants en activité (directeurs de maisons, chefs de produit, acheteurs, retailers, journalistes mode).",
        "Vous concluerez votre cursus par un stage obligatoire de 6 mois dans une maison de mode, un groupe de marques ou une entreprise de prêt-à-porter, suivi d'un rapport de stage à remettre au CAD.",
        "À l'issue du programme, vous obtenez un diplôme privé équivalent au niveau Master (60 ECTS), non reconnu d'État.",
      ],
      feature: {
        eyebrow: "Au programme",
        heading: "Le business de la mode, par ceux qui le pratiquent.",
        columns: "2",
        items: [
          { title: "Stratégie de marque mode", description: "Positionnement, identité, storytelling, différenciation." },
          { title: "Marketing & retail mode", description: "Canaux, parcours client, e-commerce, expérience flagship." },
          { title: "Production & supply chain", description: "Sourcing, calendrier collection, fournisseurs, qualité." },
          { title: "Économie de la mode", description: "Modèles d'affaires, rentabilité, levée de fonds, M&A." },
          { title: "Communication & presse", description: "RP, influence, défilés, lookbook, calendrier shows." },
          { title: "Stage 6 mois obligatoire", description: "Maison, groupe de marques, entreprise de PAP." },
        ],
      },
      stats: [
        { value: "60", label: "ECTS · 1 an" },
        { value: "6", label: "Mois de stage" },
        { value: "4 500€", label: "Frais étudiants UE" },
      ],
      cta: { heading: "Voir les frais et l'échéancier", href: "/fr/admissions/frais", label: "Frais de scolarité" },
    },
    en: {
      title: "Fashion Management · Specialization",
      hero: {
        eyebrow: "Specialization · 60 ECTS · part-time",
        heading: "Fashion Business Specialization",
        subheading:
          "A part-time specialization to train the next generation of fashion industry leaders: management, marketing, strategy, retail. With a mandatory 6-month internship at the end.",
      },
      body: [
        "This specialization is for you if you want to grow in the contemporary fashion ecosystem: luxury houses, ready-to-wear brands, retail, e-commerce, specialised press. Whether you're a fashion enthusiast, a designer wanting to understand the business, or a marketing pro wanting to specialise in this sector.",
        "The part-time format lets you combine training with a professional activity. Classes are concentrated on selected days and evenings, taught by working professionals (house directors, product heads, buyers, retailers, fashion journalists).",
        "You will conclude your program with a mandatory 6-month internship in a fashion house, brand group or ready-to-wear company, followed by an internship report submitted to CAD.",
        "Upon completion, you receive a private diploma equivalent to a Master level (60 ECTS), not state-approved.",
      ],
      feature: {
        eyebrow: "Curriculum",
        heading: "The business of fashion, by those who do it.",
        columns: "2",
        items: [
          { title: "Fashion brand strategy", description: "Positioning, identity, storytelling, differentiation." },
          { title: "Fashion marketing & retail", description: "Channels, customer journey, e-commerce, flagship experience." },
          { title: "Production & supply chain", description: "Sourcing, collection calendar, suppliers, quality." },
          { title: "Fashion economics", description: "Business models, profitability, fundraising, M&A." },
          { title: "Communication & press", description: "PR, influence, runways, lookbook, show calendar." },
          { title: "Mandatory 6-month internship", description: "House, brand group, RTW company." },
        ],
      },
      stats: [
        { value: "60", label: "ECTS · 1 year" },
        { value: "6", label: "Months of internship" },
        { value: "€4,500", label: "EU student fees" },
      ],
      cta: { heading: "See fees and schedule", href: "/en/admissions/frais", label: "Tuition fees" },
    },
  },
  // NOTE: page CMS "living-in-brussels" retirée mai 2026.
  // Le contenu vit désormais dans la page hand-coded
  // src/app/(frontend)/[locale]/etudier-a-bruxelles/page.tsx + 3 sous-pages.
  // Un redirect /living-in-brussels → /etudier-a-bruxelles est en place
  // dans next.config.ts pour les éventuels backlinks externes.
  // ============================================================ OPENNESS & CULTURE
  {
    slug: "openness-and-culture",
    fr: {
      title: "Ouverture & Culture",
      hero: {
        eyebrow: "Vie de l'école",
        heading: "Ouverture, dialogue, culture.",
        subheading:
          "Le CAD ne forme pas seulement des techniciens du design. Il forme des esprits curieux, ouverts au monde, capables de penser leur métier dans un contexte culturel large.",
      },
      body: [
        "Cycle de conférences mensuelles ouvertes au public, avec invités belges et internationaux : architectes, designers, photographes, philosophes, chercheurs.",
        "Visites d'expositions, biennales et salons : Venise, Milan, Paris, Bâle. Les étudiants partent en voyage culturel collectif au moins deux fois par an.",
        "L'école promeut l'égalité, l'inclusion et la diversité comme moteurs créatifs. Elle accueille des étudiants de plus de 30 nationalités, dans une ambiance d'atelier où chacun apporte sa singularité.",
      ],
      quote: {
        eyebrow: "Témoignage",
        quote: "Au CAD, on apprend autant en atelier qu'en discutant à la cafétéria avec des étudiants venus de Hong Kong, Lisbonne ou São Paulo. C'est cette mixité qui m'a fait choisir cette école.",
        authorName: "Inès D.",
        authorRole: "Diplômée Communication & Digital Design 2024",
      },
      cta: { heading: "Prochaine conférence publique", href: "/fr/events", label: "Voir le calendrier" },
    },
    en: {
      title: "Openness & Culture",
      hero: {
        eyebrow: "School life",
        heading: "Openness, dialogue, culture.",
        subheading:
          "CAD doesn't only train design technicians. It trains curious minds, open to the world, able to think their craft in a wide cultural context.",
      },
      body: [
        "A monthly public lecture series with Belgian and international guests: architects, designers, photographers, philosophers, researchers.",
        "Visits to exhibitions, biennials and fairs: Venice, Milan, Paris, Basel. Students travel together at least twice a year.",
        "The school promotes equality, inclusion and diversity as creative drivers. It welcomes students from over 30 nationalities, in a studio atmosphere where everyone contributes their singular voice.",
      ],
      quote: {
        eyebrow: "Testimonial",
        quote: "At CAD, you learn as much in the studio as in the cafeteria, chatting with students from Hong Kong, Lisbon or São Paulo. That mix is why I chose this school.",
        authorName: "Inès D.",
        authorRole: "Communication & Digital Design, Class of 2024",
      },
      cta: { heading: "Next public lecture", href: "/en/events", label: "See calendar" },
    },
  },
  // ============================================================ AROUND THE WORLD
  {
    slug: "around-the-world",
    fr: {
      title: "Autour du monde",
      hero: {
        eyebrow: "Workshops & échanges",
        heading: "Apprendre en se déplaçant.",
        subheading:
          "Shanghai, São Paulo, Milan, Lisbonne, Tokyo, New York, l'école envoie ses étudiants travailler là où le design se fait.",
      },
      body: [
        "Chaque année, le CAD organise plusieurs workshops intensifs à l'étranger : 1 à 3 semaines, sur invitation d'écoles partenaires ou dans le cadre d'événements professionnels majeurs.",
        "Les workshops sont intégrés au cursus (ECTS validés) et co-financés par l'école. Ils sont obligatoires pour certains programmes (Home & Living à Milan, par exemple) et optionnels pour d'autres.",
        "Au-delà des workshops, les étudiants peuvent partir en semestre d'échange via le réseau CUMULUS (200+ écoles) ou faire un stage à l'étranger validé pour leur cursus.",
      ],
      feature: {
        eyebrow: "Destinations 2026",
        heading: "Cinq villes au programme.",
        columns: "3",
        items: [
          { title: "Shanghai", description: "Tongji University · 2 semaines · été." },
          { title: "São Paulo", description: "IED São Paulo · 1 semaine · printemps." },
          { title: "Milan", description: "Salone del Mobile · 1 semaine · avril." },
          { title: "Lisbonne", description: "IADE Lisboa · 10 jours · automne." },
          { title: "Tokyo", description: "Musashino Art University · 2 semaines · automne." },
        ],
      },
      cta: { heading: "Postuler à un workshop international", href: "/fr/contact", label: "Discuter avec la coordinatrice" },
    },
    en: {
      title: "Around the World",
      hero: {
        eyebrow: "Workshops & exchanges",
        heading: "Learning on the move.",
        subheading:
          "Shanghai, São Paulo, Milan, Lisbon, Tokyo, New York, the school sends students to work where design happens.",
      },
      body: [
        "Every year, CAD organises several intensive workshops abroad: 1 to 3 weeks, hosted by partner schools or as part of major professional events.",
        "Workshops are integrated into the curriculum (ECTS-validated) and co-funded by the school. They are mandatory for some programs (Home & Living in Milan, for instance) and optional for others.",
        "Beyond workshops, students can spend an exchange semester abroad via the CUMULUS network (200+ schools) or do an internship abroad validated for their program.",
      ],
      feature: {
        eyebrow: "Destinations 2026",
        heading: "Five cities on the program.",
        columns: "3",
        items: [
          { title: "Shanghai", description: "Tongji University · 2 weeks · summer." },
          { title: "São Paulo", description: "IED São Paulo · 1 week · spring." },
          { title: "Milan", description: "Salone del Mobile · 1 week · April." },
          { title: "Lisbon", description: "IADE Lisboa · 10 days · autumn." },
          { title: "Tokyo", description: "Musashino Art University · 2 weeks · autumn." },
        ],
      },
      cta: { heading: "Apply to an international workshop", href: "/en/contact", label: "Talk to the coordinator" },
    },
  },
]

// ---------------------------------------------------------------- posts (news)

type PostDef = {
  slug: string
  publishedAtDays: number
  fr: { title: string; excerpt: string; content: string[] }
  en: { title: string; excerpt: string; content: string[] }
}

const postDefs: PostDef[] = [
  {
    slug: "lancement-lifelong-learning-ia",
    publishedAtDays: -90,
    fr: {
      title: "Lancement de notre premier module Lifelong Learning : IA générative",
      excerpt: "Dix soirées de 2 heures pour reprendre le contrôle créatif sur les outils d'IA. Un module pensé pour les agences et créatifs en activité.",
      content: [
        "Nous ouvrons le premier module de notre nouvelle filière Lifelong Learning : « IA générative pour professionnels créatifs ».",
        "Le module se déroule en dix séances en soirée de 2 heures, organisées sur 10 semaines. Chaque participant travaille sur un projet réel apporté de son agence ou de son studio.",
        "L'objectif est concret : repartir avec une méthodologie claire, des projets aboutis et une compréhension réaliste de ce que l'IA peut, et ne peut pas, faire en contexte professionnel. Petit groupe (12 places). Certificat CAD délivré à la fin.",
      ],
    },
    en: {
      title: "Launching our first Lifelong Learning module: Generative AI",
      excerpt: "Ten 2-hour evenings to regain creative control over AI tools. A module designed for working agencies and creatives.",
      content: [
        "We are opening the first module of our new Lifelong Learning track: \"Generative AI for creative professionals\".",
        "The module runs across ten 2-hour evening sessions over 10 weeks. Each participant works on a real project from their agency or studio.",
        "The goal is concrete: leave with a clear methodology, finished projects, and a realistic understanding of what AI can, and cannot, do in a professional context. Small group (12 seats). CAD certificate awarded at the end.",
      ],
    },
  },
  {
    slug: "graduation-show-2026-recap",
    publishedAtDays: -30,
    fr: {
      title: "Graduation Show 2025 : 60 projets, 1500 visiteurs",
      excerpt: "Retour en images sur l'exposition annuelle des projets de fin d'études des trois Bachelors.",
      content: [
        "Le Graduation Show 2025 a accueilli plus de 1 500 visiteurs sur la semaine du vernissage. Soixante étudiants ont présenté leurs projets de fin d'études dans la grande galerie de l'école.",
        "À noter cette année : trois projets primés par le jury professionnel (Maison Margiela pour la mode, Studio Job pour le design, BBDO pour la communication).",
        "Le Graduation Show 2026 est déjà programmé fin juin, une date à bloquer dans vos agendas.",
      ],
    },
    en: {
      title: "Graduation Show 2025: 60 projects, 1500 visitors",
      excerpt: "A look back at the annual graduation projects exhibition of the three Bachelor programs.",
      content: [
        "The 2025 Graduation Show welcomed over 1,500 visitors during the opening week. Sixty students presented their graduation projects in the school's main gallery.",
        "Notable this year: three projects awarded by the professional jury (Maison Margiela for fashion, Studio Job for design, BBDO for communication).",
        "The 2026 Graduation Show is already scheduled for late June, block your calendars.",
      ],
    },
  },
  {
    slug: "workshop-shanghai-2025-recap",
    publishedAtDays: -60,
    fr: {
      title: "Workshop Shanghai 2025 : retour des étudiants",
      excerpt: "Deux semaines à Tongji University autour du retail asiatique. Récit, photos, projets.",
      content: [
        "Quinze étudiants de 2e et 3e année ont passé deux semaines à Tongji University en juillet 2025, dans le cadre du workshop annuel CAD–Tongji autour du design d'expérience pour le retail asiatique.",
        "Au programme : visites de flagships à Shanghai et Hangzhou, briefs avec des marques chinoises locales (Shang Xia, Heytea), production en équipes mixtes franco-chinoises.",
        "Trois équipes ont été invitées à présenter leur projet à la Shanghai Design Week en novembre 2025.",
      ],
    },
    en: {
      title: "Shanghai 2025 Workshop: students report back",
      excerpt: "Two weeks at Tongji University on Asian retail. Story, photos, projects.",
      content: [
        "Fifteen 2nd and 3rd year students spent two weeks at Tongji University in July 2025, as part of the annual CAD–Tongji workshop on experience design for Asian retail.",
        "On the program: flagship visits in Shanghai and Hangzhou, briefs with local Chinese brands (Shang Xia, Heytea), production in mixed French-Chinese teams.",
        "Three teams were invited to present their project at Shanghai Design Week in November 2025.",
      ],
    },
  },
  {
    slug: "rentree-2026-portes-ouvertes",
    publishedAtDays: -7,
    fr: {
      title: "Rentrée 2026 : il reste des places en Bachelor",
      excerpt: "Inscriptions ouvertes pour la rentrée de septembre 2026 dans les trois Bachelor.",
      content: [
        "Le secrétariat pédagogique a ouvert la session d'admission tardive pour la rentrée de septembre 2026. Quelques places restent disponibles dans les trois Bachelor (Architecture d'intérieur, Communication & Digital, Mode & Accessoires).",
        "Procédure : envoi du dossier de candidature avant le 30 juin, suivi d'un entretien avec présentation de portfolio.",
        "Une dernière journée portes ouvertes est organisée pour les indécis : voir le calendrier des événements.",
      ],
    },
    en: {
      title: "2026 intake: spots still open in Bachelor programs",
      excerpt: "Applications open for the September 2026 intake in all three Bachelor programs.",
      content: [
        "The academic secretariat has opened a late admission round for the September 2026 intake. A few spots remain in all three Bachelor programs (Interior Architecture, Communication & Digital, Fashion & Accessory).",
        "Procedure: send your application file before June 30, followed by an interview with portfolio presentation.",
        "A final open day is organised for those still hesitating: see the events calendar.",
      ],
    },
  },
]

// ---------------------------------------------------------------- events extras

type EventDef = {
  slug: string
  categorySlug: string
  featured: boolean
  startDays: number
  endDays: number
  startHour: number
  endHour: number
  fr: { title: string; location: string; description: string[] }
  en: { title: string; location: string; description: string[] }
}

const eventDefs: EventDef[] = [
  {
    slug: "open-day-autumn-2026",
    categorySlug: "open-day",
    featured: true,
    startDays: 120,
    endDays: 120,
    startHour: 14,
    endHour: 18,
    fr: {
      title: "Journée portes ouvertes, Automne 2026",
      location: "CAD, 25 rue Roberts-Jones, 1180 Uccle",
      description: [
        "La deuxième journée portes ouvertes de l'année. Visites guidées des ateliers, rencontres avec les enseignants, démonstrations en direct.",
        "Présentations programmées à 14h, 15h30 et 17h. Inscription non obligatoire.",
      ],
    },
    en: {
      title: "Open Day, Autumn 2026",
      location: "CAD, 25 rue Roberts-Jones, 1180 Uccle",
      description: [
        "The second open day of the year. Guided studio visits, faculty meet-ups, live demos.",
        "Presentations scheduled at 2pm, 3:30pm and 5pm. Registration optional.",
      ],
    },
  },
  {
    slug: "workshop-tokyo-2026",
    categorySlug: "workshop",
    featured: false,
    startDays: 200,
    endDays: 214,
    startHour: 9,
    endHour: 18,
    fr: {
      title: "Workshop Tokyo, Musashino Art University",
      location: "Musashino Art University, Tokyo",
      description: [
        "Deux semaines au Japon dans l'une des plus prestigieuses écoles d'art asiatiques. Brief partagé avec les étudiants japonais autour du design d'objet contemporain.",
        "Réservé aux étudiants de Master Home & Living Design et Image. 15 places.",
      ],
    },
    en: {
      title: "Tokyo Workshop, Musashino Art University",
      location: "Musashino Art University, Tokyo",
      description: [
        "Two weeks in Japan at one of Asia's most prestigious art schools. Brief shared with Japanese students around contemporary object design.",
        "Reserved for Home & Living Design and Image Master students. 15 seats.",
      ],
    },
  },
  {
    slug: "lecture-architecture-radicale",
    categorySlug: "conference",
    featured: false,
    startDays: 12,
    endDays: 12,
    startHour: 19,
    endHour: 21,
    fr: {
      title: "Conférence, Architecture radicale, hier et aujourd'hui",
      location: "CAD, Auditorium",
      description: [
        "Conférence publique d'un historien de l'architecture sur les courants radicaux des années 1960-70 et leurs résonances contemporaines.",
        "Entrée libre, sans inscription. Drink offert à l'issue.",
      ],
    },
    en: {
      title: "Lecture, Radical Architecture, then and now",
      location: "CAD, Auditorium",
      description: [
        "Public lecture by an architecture historian on the radical movements of the 1960s-70s and their contemporary echoes.",
        "Free entry, no registration. Drink offered afterwards.",
      ],
    },
  },
  {
    slug: "lifelong-learning-genai-autumn-2026",
    categorySlug: "lifelong-learning",
    featured: false,
    startDays: 150,
    endDays: 220,
    startHour: 19,
    endHour: 21,
    fr: {
      title: "IA générative pour pros créatifs, Module Septembre 2026",
      location: "CAD Brussels",
      description: [
        "Deuxième session du module phare de notre filière Lifelong Learning. 10 séances du soir.",
        "12 places, ouvert aux professionnels de la communication, des agences créatives et des studios digitaux.",
      ],
    },
    en: {
      title: "Generative AI for creative pros, September 2026 module",
      location: "CAD Brussels",
      description: [
        "Second session of our flagship Lifelong Learning module. 10 evening sessions.",
        "12 seats, open to communications, creative agency and digital studio professionals.",
      ],
    },
  },
  {
    slug: "fashion-show-2026",
    categorySlug: "exhibition",
    featured: true,
    startDays: 75,
    endDays: 75,
    startHour: 20,
    endHour: 23,
    fr: {
      title: "Défilé Mode 2026, Bachelor 3e année",
      location: "Halles Saint-Géry, Bruxelles",
      description: [
        "Le défilé annuel des étudiants Bachelor de 3e année en Mode & Accessoires. Trente collections complètes présentées sur scène.",
        "Sur invitation et liste d'attente publique. Le secrétariat publie le formulaire deux semaines avant.",
      ],
    },
    en: {
      title: "Fashion Show 2026, Bachelor year 3",
      location: "Halles Saint-Géry, Brussels",
      description: [
        "The annual runway show by 3rd year Bachelor Fashion & Accessory students. Thirty full collections shown on stage.",
        "By invitation and public waitlist. The secretariat publishes the form two weeks before.",
      ],
    },
  },
  {
    slug: "masterclass-motion-design",
    categorySlug: "workshop",
    featured: false,
    startDays: 25,
    endDays: 27,
    startHour: 10,
    endHour: 18,
    fr: {
      title: "Masterclass Motion Design, 3 jours intensifs",
      location: "CAD, Studio digital",
      description: [
        "Trois jours d'atelier intensif pour maîtriser After Effects et le design d'animation publicitaire courte (10 à 30 secondes).",
        "Encadré par un motion designer en activité chez BBDO. Ouvert aux étudiants Master Image et aux pros via Lifelong Learning.",
      ],
    },
    en: {
      title: "Motion Design Masterclass, 3 intensive days",
      location: "CAD, Digital studio",
      description: [
        "Three days of intensive workshop to master After Effects and short ad animation design (10 to 30 seconds).",
        "Mentored by a working motion designer at BBDO. Open to Image Master students and professionals via Lifelong Learning.",
      ],
    },
  },
]

// ---------------------------------------------------------------- runner

async function run() {
  const payload = await getPayload({ config })
  console.log("▶ Seeding extras (Masters, news, more events, testimonials)…")

  // -------- find news category for posts
  const newsCat = await payload.find({
    collection: "categories",
    where: { slug: { equals: "news" } },
    limit: 1,
  })
  const newsCatId = newsCat.docs[0]?.id

  // -------- find existing event categories for new events
  const allCats = await payload.find({ collection: "categories", limit: 50 })
  const catBySlug: Record<string, string | number> = {}
  for (const c of allCats.docs) catBySlug[c.slug ?? ""] = c.id

  // -------- pages
  for (const def of pageDefs) {
    const layout = (loc: "fr" | "en") => {
      const d = def[loc]
      const blocks: Array<Record<string, unknown>> = [
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
      ]
      if (d.feature) {
        blocks.push({
          blockType: "featureList",
          eyebrow: d.feature.eyebrow,
          heading: d.feature.heading,
          columns: d.feature.columns,
          items: d.feature.items,
        })
      }
      if (d.stats) {
        blocks.push({ blockType: "stats", items: d.stats })
      }
      if (d.quote) {
        blocks.push({
          blockType: "quote",
          eyebrow: d.quote.eyebrow,
          quote: d.quote.quote,
          authorName: d.quote.authorName,
          authorRole: d.quote.authorRole,
        })
      }
      if (d.faq) {
        blocks.push({
          blockType: "faq",
          eyebrow: d.faq.eyebrow,
          heading: d.faq.heading,
          items: d.faq.items,
        })
      }
      blocks.push({
        blockType: "cta",
        heading: d.cta.heading,
        buttons: [{ label: d.cta.label, href: d.cta.href, style: "primary" }],
      })
      return blocks
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
      data: { title: def.en.title, layout: layout("en") },
      locale: "en",
    })
    console.log(`   ✓ page: ${def.slug}`)
  }

  // -------- posts
  for (const p of postDefs) {
    const created = await upsertBySlug(
      payload,
      "posts",
      p.slug,
      {
        slug: p.slug,
        title: p.fr.title,
        publishedAt: inDays(p.publishedAtDays, 12),
        category: newsCatId,
        excerpt: p.fr.excerpt,
        content: richText(p.fr.content),
        status: "published",
      },
      "fr",
    )
    await payload.update({
      collection: "posts",
      id: created.id,
      data: {
        title: p.en.title,
        excerpt: p.en.excerpt,
        content: richText(p.en.content),
      },
      locale: "en",
    })
    console.log(`   ✓ post: ${p.slug}`)
  }

  // -------- events
  for (const ev of eventDefs) {
    const created = await upsertBySlug(
      payload,
      "events",
      ev.slug,
      {
        slug: ev.slug,
        title: ev.fr.title,
        startDate: inDays(ev.startDays, ev.startHour),
        endDate: inDays(ev.endDays, ev.endHour),
        location: ev.fr.location,
        category: catBySlug[ev.categorySlug],
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

  // -------- enrich existing pages with quote / faq blocks
  // Append a testimonial to /about and a FAQ to /admissions
  await appendBlocks(payload, "about", {
    fr: [
      {
        blockType: "quote",
        eyebrow: "Témoignage",
        quote:
          "Le CAD m'a appris à penser en designer, pas seulement à dessiner. La pratique d'abord, mais avec une vraie culture du projet.",
        authorName: "Tom V.",
        authorRole: "Diplômé Architecture d'intérieur 2022, aujourd'hui chez Studio Job",
      },
    ],
    en: [
      {
        blockType: "quote",
        eyebrow: "Testimonial",
        quote:
          "CAD taught me to think as a designer, not just to draw. Practice first, but with a real culture of project thinking.",
        authorName: "Tom V.",
        authorRole: "Interior Architecture graduate 2022, now at Studio Job",
      },
    ],
  })

  await appendBlocks(payload, "admissions", {
    fr: [
      {
        blockType: "faq",
        eyebrow: "Foire aux questions",
        heading: "Vos questions sur l'admission.",
        items: [
          { question: "Y a-t-il un concours d'entrée ?", answer: "Non. L'admission se fait sur dossier et entretien avec présentation d'un portfolio. Pas d'épreuve dessinée éliminatoire." },
          { question: "Quel niveau de portfolio attendez-vous ?", answer: "5 à 10 projets démontrant votre démarche créative. Croquis, projets scolaires, photos personnelles, objets, tout est recevable du moment que ça raconte votre processus." },
          { question: "Quels sont les frais de scolarité ?", answer: "Les frais varient selon le programme et l'année. Le secrétariat envoie une grille tarifaire détaillée sur demande à secretariat@cad.be." },
          { question: "Acceptez-vous les candidatures hors UE ?", answer: "Oui, et le secrétariat accompagne la procédure de visa étudiant (D) une fois l'admission confirmée. Comptez 2 à 3 mois de délai pour le visa." },
          { question: "Y a-t-il des passerelles depuis d'autres écoles ?", answer: "Oui, des admissions directes en 2e ou 3e année Bachelor sont possibles avec un dossier équivalent. Les ECTS acquis ailleurs sont étudiés au cas par cas." },
        ],
      },
    ],
    en: [
      {
        blockType: "faq",
        eyebrow: "Frequently Asked Questions",
        heading: "Your questions about admission.",
        items: [
          { question: "Is there an entrance exam?", answer: "No. Admission is by file and interview with a portfolio presentation. No eliminatory drawing test." },
          { question: "What portfolio level do you expect?", answer: "5 to 10 projects showing your creative approach. Sketches, school projects, personal photos, objects, anything goes as long as it tells your process." },
          { question: "What are the tuition fees?", answer: "Fees vary by program and year. The secretariat sends a detailed pricing grid on request at secretariat@cad.be." },
          { question: "Do you accept non-EU candidates?", answer: "Yes, and the secretariat assists with the student visa (D) procedure once admission is confirmed. Allow 2 to 3 months for the visa." },
          { question: "Are transfers from other schools possible?", answer: "Yes, direct admissions to year 2 or 3 of Bachelor are possible with an equivalent file. ECTS earned elsewhere are reviewed case by case." },
        ],
      },
    ],
  })

  // Header is already fully populated by `pnpm seed` (initial seed).
  // Re-running it after seed:extras would just rewrite the same data —
  // we leave it as is.

  console.log("\n✅ Extras seed complete.")
  process.exit(0)
}

async function appendBlocks(
  payload: Payload,
  slug: string,
  newBlocks: { fr: Array<Record<string, unknown>>; en: Array<Record<string, unknown>> },
) {
  for (const locale of ["fr", "en"] as const) {
    try {
      // Fetch the page WITHOUT fallback so we get only the data actually
      // stored for this locale. If the page has no data in this locale,
      // skip it (better than re-saving fallback content as if it were
      // localized).
      const existing = await payload.find({
        collection: "pages",
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
        fallbackLocale: false as unknown as "fr",
      })
      const page = existing.docs[0]
      if (!page || !page.layout || page.layout.length === 0) continue

      const layout = page.layout
      // remove the trailing CTA, append new blocks, then re-append CTA
      const ctaIdx = layout.findIndex((b) => b.blockType === "cta")
      const cta = ctaIdx >= 0 ? layout[ctaIdx] : null
      const head = ctaIdx >= 0 ? layout.slice(0, ctaIdx) : layout
      // de-dup: drop blocks of the same type as the new ones if already present
      const newTypes = new Set(newBlocks[locale].map((b) => b.blockType))
      const dedup = head.filter((b) => !newTypes.has(b.blockType))
      const next = [...dedup, ...newBlocks[locale], ...(cta ? [cta] : [])]
      await payload.update({
        collection: "pages",
        id: page.id,
        data: { layout: next },
        locale,
      })
    } catch (err) {
      console.warn(
        `   ⚠ skipped appendBlocks(${slug}, ${locale}): ${(err as Error).message.split("\n")[0]}`,
      )
    }
  }
  console.log(`   ✓ appended blocks to: ${slug}`)
}

run().catch((e) => {
  console.error("✗ Extras seed failed:", e)
  process.exit(1)
})
