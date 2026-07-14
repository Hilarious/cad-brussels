import type { CollectionConfig } from 'payload'

/**
 * Leads — qualified prospects who completed the "I would like to…" form.
 *
 * Captured intents (multi-select):
 *   - newsletter
 *   - brochure
 *   - visit (open day / individual visit)
 *   - apply (express interest in applying)
 *
 * The form also captures the desired section (Bachelor / Master / Lifelong)
 * which is what makes the lead actionable for the admissions team.
 *
 * Visible to admins/editors only. RGPD: data retained 2 years max.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'email',
      'firstName',
      'lastName',
      'desiredSection',
      'status',
      'createdAt',
    ],
    description:
      'Prospects qualifiés depuis le formulaire « I would like to… ». Conservation 2 ans max (RGPD).',
    group: 'CRM',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true, // public submissions via API route
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  timestamps: true,
  fields: [
    // ─── Contact ────────────────────────────────────────────────
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
      admin: { description: 'Optionnel.' },
    },

    // ─── Intent (multi-select via checkbox group) ──────────────
    // Note: 'newsletter' is intentionally NOT here.
    // Casual newsletter signups go to the Subscribers collection via
    // the dedicated /newsletter page (1-field form). The info-pack form
    // is for qualified prospects only.
    {
      name: 'intents',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Recevoir la brochure', value: 'brochure' },
        { label: 'Visiter le CAD', value: 'visit' },
        { label: 'Candidater', value: 'apply' },
      ],
    },

    // ─── Programme d'intérêt ───────────────────────────────────
    {
      name: 'desiredSection',
      type: 'select',
      required: true,
      options: [
        // Bachelor
        { label: "Bachelor, Architecture d’intérieur", value: 'bachelor-interior' },
        { label: 'Bachelor, Communication & Digital', value: 'bachelor-communication' },
        { label: 'Bachelor, Mode & Accessoires', value: 'bachelor-fashion' },
        // Master
        { label: "Master, Architecture d’intérieur 2 ans", value: 'master-interior' },
        { label: 'Master, Home & Living', value: 'master-home-living' },
        { label: 'Master, Digital Brand Content', value: 'master-digital-brand' },
        { label: 'Master, Image / 3D / Motion / IA', value: 'master-image' },
        { label: 'Master, Event Management', value: 'master-event' },
        // Lifelong
        { label: 'Lifelong Learning, IA générative', value: 'lifelong-genai' },
        // Other
        { label: 'Pas encore décidé·e', value: 'undecided' },
      ],
    },

    // ─── Profil ────────────────────────────────────────────────
    {
      name: 'profile',
      type: 'select',
      required: true,
      defaultValue: 'student',
      options: [
        { label: 'Étudiant·e / Candidat·e', value: 'student' },
        { label: 'Parent', value: 'parent' },
        { label: 'Professionnel·le', value: 'professional' },
        { label: 'Autre', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },

    {
      name: 'message',
      type: 'textarea',
      admin: { description: 'Message libre du prospect (optionnel).' },
    },

    // ─── CRM workflow status ───────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Contacté', value: 'contacted' },
        { label: 'Inscrit·e', value: 'enrolled' },
        { label: 'Archivé', value: 'archived' },
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

    // ─── RGPD trace ────────────────────────────────────────────
    {
      name: 'consent',
      type: 'group',
      admin: { description: 'Consentement éclairé (RGPD).' },
      fields: [
        {
          name: 'acceptedTerms',
          type: 'checkbox',
          required: true,
          defaultValue: false,
          admin: { readOnly: true },
        },
        { name: 'ip', type: 'text', admin: { readOnly: true } },
        { name: 'userAgent', type: 'text', admin: { readOnly: true } },
        { name: 'referrer', type: 'text', admin: { readOnly: true } },
      ],
    },

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Notes internes admissions (non visible par le prospect).',
        position: 'sidebar',
      },
    },
  ],
}
