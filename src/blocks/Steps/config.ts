import type { Block } from 'payload'

/**
 * Étapes numérotées — un parcours en plusieurs temps.
 *
 * Créé pour « Ce qui se passe une fois que vous avez postulé », qui
 * déroule la candidature en quatre temps. La numérotation est calculée
 * à l'affichage : réordonner les étapes dans l'admin suffit, il n'y a
 * aucun numéro à saisir ni à corriger à la main.
 */
export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: 'Étapes', plural: 'Étapes' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      labels: { singular: 'Étape', plural: 'Étapes' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'body', type: 'textarea', required: true, localized: true },
        {
          name: 'meta',
          type: 'text',
          localized: true,
          admin: { description: 'Délai ou durée. Ex : sous 48h' },
        },
      ],
    },
  ],
}
