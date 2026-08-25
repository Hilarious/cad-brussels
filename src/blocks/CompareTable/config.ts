import type { Block } from 'payload'

/**
 * Tableau comparatif — deux colonnes mises face à face, ligne par ligne.
 *
 * Créé pour la page « Pourquoi le CAD », qui compare l'école aux écoles
 * publiques. Le parti pris éditorial de cette page est d'assumer la
 * comparaison plutôt que de l'éviter : le bloc porte donc un libellé
 * pour chaque camp, et une note de bas de tableau pour nuancer.
 */
export const CompareTableBlock: Block = {
  slug: 'compareTable',
  labels: { singular: 'Tableau comparatif', plural: 'Tableaux comparatifs' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'columnA',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Nom de la première colonne. Ex : CAD' },
    },
    {
      name: 'columnB',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Nom de la seconde colonne. Ex : École publique' },
    },
    {
      name: 'rows',
      type: 'array',
      minRows: 2,
      maxRows: 12,
      labels: { singular: 'Critère', plural: 'Critères' },
      fields: [
        { name: 'criterion', type: 'text', required: true, localized: true },
        { name: 'valueA', type: 'text', required: true, localized: true },
        { name: 'valueB', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      localized: true,
      admin: { description: 'Nuance affichée sous le tableau. Facultatif.' },
    },
  ],
}
