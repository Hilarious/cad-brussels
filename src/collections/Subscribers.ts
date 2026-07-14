import type { CollectionConfig } from 'payload'

/**
 * Newsletter subscribers — RGPD-compliant double opt-in.
 *
 * Lifecycle:
 *   1. POST /api/newsletter/subscribe creates a row with status=pending
 *      and a confirmToken. A confirmation email is sent.
 *   2. The recipient clicks the link → /api/newsletter/confirm?token=...
 *      → status becomes 'active', confirmToken cleared, confirmedAt set.
 *   3. /api/newsletter/unsubscribe?token=... uses the unsubscribeToken
 *      → status becomes 'unsubscribed'.
 *
 * Only authenticated admins can list / read / export subscribers.
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'profile', 'status', 'createdAt'],
    description:
      'Abonnés à la newsletter (double opt-in). Exporter via les boutons Payload pour envoyer une campagne.',
  },
  access: {
    // Admin/editor can read; nobody can read publicly.
    read: ({ req }) => Boolean(req.user),
    create: () => true, // creation happens via the public API route
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  timestamps: true,
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'profile',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: [
        { label: 'Étudiant·e / Candidat·e', value: 'student' },
        { label: 'Professionnel·le créatif·ve', value: 'professional' },
        { label: 'Parent', value: 'parent' },
        { label: 'Autre', value: 'other' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'En attente de confirmation', value: 'pending' },
        { label: 'Actif', value: 'active' },
        { label: 'Désinscrit', value: 'unsubscribed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'fr',
      options: [
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'confirmToken',
      type: 'text',
      admin: { hidden: true },
      index: true,
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      admin: { hidden: true },
      index: true,
    },
    {
      name: 'confirmedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'metadata',
      type: 'group',
      admin: { description: 'Traçabilité RGPD (consentement éclairé).' },
      fields: [
        { name: 'ip', type: 'text', admin: { readOnly: true } },
        { name: 'userAgent', type: 'text', admin: { readOnly: true } },
        { name: 'referrer', type: 'text', admin: { readOnly: true } },
      ],
    },
  ],
}
