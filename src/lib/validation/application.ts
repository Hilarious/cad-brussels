import { z } from 'zod'

/**
 * Schéma de validation d'une candidature complète. Extrait de la route
 * api/applications/submit pour être testable isolément.
 *
 * `desiredProgram` est aligné sur le champ select de la collection Applications.
 */
export const applicationSchema = z.object({
  // Identité
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(40),
  birthDate: z.string().min(8).max(20), // chaîne ISO issue de <input type=date>
  nationality: z.string().min(1).max(80),

  // Adresse (facultative à ce stade, complétée plus tard par les admissions)
  street: z.string().max(200).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional().nullable(),

  // Programme
  desiredProgram: z.enum([
    'bachelor-interior',
    'bachelor-communication',
    'bachelor-fashion',
    'master-interior',
    'master-home-living',
    'master-digital-brand',
    'master-image',
    'master-event',
  ]),
  startYear: z.enum(['2026', '2027']),
  startLevel: z.enum(['bac1', 'bac2', 'bac3', 'm1', 'm2']),

  // Parcours
  currentSchool: z.string().max(200).optional().nullable(),
  lastDiploma: z.string().max(200).optional().nullable(),
  lastDiplomaYear: z.number().int().min(1990).max(2030).optional().nullable(),

  // Motivation
  motivation: z.string().min(20).max(3000),
  portfolioUrl: z.string().url().max(500).optional().nullable(),

  // Source
  source: z
    .enum([
      'search',
      'word-of-mouth',
      'social',
      'event',
      'press',
      'alumni',
      'other',
    ])
    .optional()
    .nullable(),

  // RGPD
  acceptedTerms: z.literal(true),
  locale: z.enum(['fr', 'en']).default('fr'),

  // honeypot anti-spam
  website: z.string().max(0).optional(),
})

export type ApplicationInput = z.infer<typeof applicationSchema>
