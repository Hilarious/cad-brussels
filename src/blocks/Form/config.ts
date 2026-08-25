import type { Block } from 'payload'

/**
 * Formulaire — insère l'un des formulaires du site dans une page.
 *
 * C'est ce bloc qui rend éditables les pages Contact, Candidater,
 * Info-pack, Newsletter et Breakfast. Le formulaire lui-même reste du
 * code, c'est normal : sa logique, ses validations et son anti-spam
 * n'ont rien à faire dans un CMS. Mais tout ce qui l'entoure, titre,
 * introduction, mentions, devient éditable comme n'importe quelle page.
 *
 * Le client choisit lequel afficher. Il ne peut pas en inventer un :
 * la liste est fermée, et un formulaire inexistant n'affiche rien
 * plutôt que de casser la page.
 */
export const FormBlock: Block = {
  slug: 'form',
  labels: { singular: 'Formulaire', plural: 'Formulaires' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      admin: { description: 'Texte affiché au-dessus du formulaire.' },
    },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'contact',
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Candidature', value: 'application' },
        { label: 'Demande de brochure', value: 'lead' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Summer Breakfast', value: 'breakfast' },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      localized: true,
      admin: { description: 'Mentions affichées sous le formulaire. Facultatif.' },
    },
  ],
}
