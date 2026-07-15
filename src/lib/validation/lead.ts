import { z } from 'zod'

/**
 * Schéma de validation d'un lead (demande de brochure / visite / candidature
 * légère). Extrait de la route api/leads/submit pour être testable isolément,
 * sans tirer les dépendances serveur (Payload, envoi d'email) de la route.
 *
 * `desiredSection` est aligné sur le champ select de la collection Leads : toute
 * valeur hors liste est rejetée avant écriture en base.
 */
export const leadSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  intents: z.array(z.enum(['brochure', 'visit', 'apply'])).min(1),
  desiredSection: z.enum([
    'bachelor-interior',
    'bachelor-communication',
    'bachelor-fashion',
    'master-interior',
    'master-home-living',
    'master-digital-brand',
    'master-image',
    'master-event',
    'lifelong-genai',
    'undecided',
  ]),
  profile: z
    .enum(['student', 'parent', 'professional', 'other'])
    .default('student'),
  message: z.string().max(2000).optional().nullable(),
  acceptedTerms: z.literal(true),
  locale: z.enum(['fr', 'en']).default('fr'),
  // honeypot anti-spam : un bot remplit ce champ caché, un humain le laisse vide.
  website: z.string().max(0).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
