import type { Block } from 'payload'

/**
 * Accordéon — des entrées dépliables.
 *
 * Pour les pages pratiques (visa, logement, vie à Bruxelles) où le
 * contenu est long et consulté par recherche plutôt que lu en entier.
 *
 * À distinguer du bloc FAQ, qui existe déjà : celui-ci n'émet pas de
 * données structurées Schema.org. Réserver la FAQ aux vraies questions
 * de candidats, que Google peut afficher dans ses résultats, et cet
 * accordéon au repliage de contenu documentaire.
 */
export const AccordionBlock: Block = {
  slug: 'accordion',
  labels: { singular: 'Accordéon', plural: 'Accordéons' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 20,
      labels: { singular: 'Entrée', plural: 'Entrées' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'body', type: 'textarea', required: true, localized: true },
        {
          name: 'openByDefault',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Affiche cette entrée déjà dépliée.' },
        },
      ],
    },
  ],
}
