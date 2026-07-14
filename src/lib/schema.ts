/**
 * Schema.org JSON-LD helpers.
 *
 * Ce module produit des objets `schema.org` typés (Organization, Course,
 * Article, etc.) que les pages injectent via <JsonLd data={...} />.
 *
 * Motivation (audit SEO Digistage janvier 2026) :
 *  - 30.35 % des pages actuelles n'ont AUCUNE donnée structurée
 *  - Impact direct sur les rich snippets Google (breadcrumbs, sitelinks,
 *    ratings, events) → augmente le CTR en SERP
 *  - Impact direct sur les LLM (ChatGPT, Perplexity, Google AI Overview)
 *    qui utilisent le JSON-LD pour comprendre le contenu structuré
 *
 * Sources de référence :
 *  - https://schema.org/EducationalOrganization
 *  - https://schema.org/CollegeOrUniversity
 *  - https://schema.org/Course
 *  - https://schema.org/Person
 *  - https://schema.org/Article
 *  - https://schema.org/Event
 *  - https://schema.org/FAQPage
 *
 * Convention : toutes les fonctions retournent un objet plain (pas de
 * classes), à sérialiser tel quel dans <script type="application/ld+json">.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://cad.be'

const SCHOOL_BASE = {
  '@id': `${SITE_URL}/#organization`,
  '@type': ['EducationalOrganization', 'CollegeOrUniversity'] as const,
  name: 'CAD Brussels',
  alternateName: [
    'College of Art & Design Brussels',
    'College of Art and Design Brussels',
    'CAD',
  ],
  url: SITE_URL,
  logo: `${SITE_URL}/logo/cad-logo-full.png`,
  description:
    'École supérieure de design à Bruxelles depuis 1961. Bachelor, Master et formations continues en architecture d’intérieur, communication digitale, image 3D, motion, IA et mode.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '25 rue Roberts-Jones',
    postalCode: '1180',
    addressLocality: 'Bruxelles',
    addressRegion: 'Bruxelles-Capitale',
    addressCountry: 'BE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'admissions',
    telephone: '+32 2 640 40 32',
    email: 'secretariat@cad.be',
    availableLanguage: ['fr', 'en'],
  },
  foundingDate: '1961',
  sameAs: [
    'https://instagram.com/cadbrussels',
    'https://facebook.com/CADBrussels',
    'https://linkedin.com/school/cad-brussels',
  ],
}

/**
 * EducationalOrganization — à injecter sur la homepage et /about.
 * C'est LA fiche officielle du CAD pour Google et les LLMs.
 */
export function educationalOrganization() {
  return {
    '@context': 'https://schema.org',
    ...SCHOOL_BASE,
    numberOfStudents: 160,
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Bachelor',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Master',
      },
    ],
  }
}

/**
 * Course — à injecter sur chaque page programme.
 * Documenté sur https://schema.org/Course
 */
export function course({
  name,
  description,
  url,
  locale,
  level,
  duration,
}: {
  name: string
  description: string
  url: string
  locale: string
  level?: 'bachelor' | 'master' | 'specialisation'
  duration?: string
}) {
  const inLanguage = locale === 'fr' ? 'fr-BE' : 'en'
  const educationalLevel =
    level === 'master'
      ? 'Master'
      : level === 'specialisation'
        ? 'Specialisation'
        : 'Bachelor'

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    inLanguage,
    educationalLevel,
    ...(duration && { timeRequired: duration }),
    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: 'CAD Brussels',
      url: SITE_URL,
      sameAs: SCHOOL_BASE.sameAs,
    },
    // Sans hasCourseInstance, Google ne peut pas indexer le Course en
    // rich snippet. On ajoute une instance "any-time" pour l'année en cours.
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: SCHOOL_BASE.address,
      inLanguage,
    },
    offers: {
      '@type': 'Offer',
      category: educationalLevel,
      priceCurrency: 'EUR',
      // Prix indicatifs — Bachelor et Master à 9 500 €/an EU
      price: level === 'specialisation' ? '4500' : '9500',
      availability: 'https://schema.org/InStock',
    },
  }
}

/**
 * Article — à injecter sur chaque post news (/news/[slug]).
 * Rich snippet Google : titre, date, image, auteur.
 */
export function article({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
  locale,
}: {
  headline: string
  description?: string | null
  url: string
  datePublished: string
  dateModified?: string
  imageUrl?: string | null
  locale: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description && { description }),
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: locale === 'fr' ? 'fr-BE' : 'en',
    ...(imageUrl && { image: imageUrl }),
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'CAD Brussels',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'CAD Brussels',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo/cad-logo-full.png`,
      },
    },
  }
}

/**
 * Person avec worksFor + hasOccupation. Utilisé pour la page /professeurs
 * (liste de faculty avec leur employeur parallèle).
 */
export function person({
  name,
  role,
  parallelEmployer,
  imageUrl,
}: {
  name: string
  role?: string
  parallelEmployer?: string
  imageUrl?: string
}) {
  return {
    '@type': 'Person',
    name,
    ...(role && { jobTitle: role }),
    worksFor: {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: 'CAD Brussels',
    },
    ...(parallelEmployer && {
      hasOccupation: {
        '@type': 'Occupation',
        name: role ?? 'Professionnel en activité',
        occupationLocation: {
          '@type': 'Organization',
          name: parallelEmployer,
        },
      },
    }),
    ...(imageUrl && { image: imageUrl }),
  }
}

/**
 * FAQPage — pour les blocs FAQ. Rich snippet Google avec accordéon
 * cliquable directement dans les résultats (impact CTR massif).
 */
export function faqPage(
  questions: Array<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

/**
 * ItemList — pour les pages listing (hub Bachelors, Masters, listing news).
 * Aide Google à comprendre la structure de listing.
 */
export function itemList({
  name,
  items,
}: {
  name: string
  items: Array<{ name: string; url: string }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}
