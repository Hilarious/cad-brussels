import type { Block } from 'payload'

/**
 * Grille tarifaire — un tarif par public, avec son échéancier.
 *
 * Créé pour la page des frais de scolarité. Les montants sont du texte
 * et non des nombres : ils s'écrivent « 9 500 € » avec leur devise et
 * leur espace insécable, et certaines lignes portent une mention plutôt
 * qu'un montant (« nous consulter »).
 */
export const PriceGridBlock: Block = {
  slug: 'priceGrid',
  labels: { singular: 'Grille tarifaire', plural: 'Grilles tarifaires' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      labels: { singular: 'Tarif', plural: 'Tarifs' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'amount', type: 'text', required: true, localized: true },
        { name: 'period', type: 'text', localized: true },
        { name: 'detail', type: 'textarea', localized: true },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Met ce tarif en avant visuellement.' },
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      localized: true,
      admin: { description: 'Mentions et conditions, sous la grille.' },
    },
  ],
}
