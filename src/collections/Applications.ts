import type { CollectionConfig } from 'payload'

/**
 * Applications — formal pre-registration submissions to CAD programs.
 *
 * This collection replaces the legacy WordPress form at
 * https://cad.be/pre-registration-form-2024/. It captures the candidate's
 * full identity, academic background, motivation and program of choice
 * so the admissions team can review and follow up.
 *
 * Distinct from `leads` (lighter, multi-intent, info-pack capture):
 * an Application means the candidate is actively seeking enrollment.
 *
 * Visible to admins/admissions team only. RGPD: data retained until
 * the candidate's program cohort completes (or 5 years for rejected/
 * withdrawn files, then archived/anonymized).
 */
export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'lastName',
      'firstName',
      'email',
      'desiredProgram',
      'startYear',
      'status',
      'createdAt',
    ],
    description:
      'Candidatures de pré-inscription formelles. Suivi par l’équipe Admissions.',
    group: 'CRM',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true, // public submission via API route
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
  },
  timestamps: true,
  fields: [
    // ─── Identity ───────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, index: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'birthDate',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'nationality',
          type: 'text',
          required: true,
        },
      ],
    },

    // ─── Address (postal) ──────────────────────────────────────
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'postalCode', type: 'text' },
            { name: 'city', type: 'text' },
          ],
        },
        { name: 'country', type: 'text' },
      ],
    },

    // ─── Program of choice ─────────────────────────────────────
    {
      name: 'desiredProgram',
      type: 'select',
      required: true,
      options: [
        // Bachelor
        { label: 'Bachelor · Architecture d’intérieur', value: 'bachelor-interior' },
        { label: 'Bachelor · Communication & Digital', value: 'bachelor-communication' },
        { label: 'Bachelor · Mode & Accessoires', value: 'bachelor-fashion' },
        // Master
        { label: 'Master · Architecture d’intérieur 2 ans', value: 'master-interior' },
        { label: 'Master · Home & Living', value: 'master-home-living' },
        { label: 'Master · Digital Brand Content', value: 'master-digital-brand' },
        { label: 'Master · Image / 3D / Motion / IA', value: 'master-image' },
        { label: 'Master · Event Management', value: 'master-event' },
      ],
    },
    {
      name: 'startYear',
      type: 'select',
      required: true,
      options: [
        { label: '2026-2027', value: '2026' },
        { label: '2027-2028', value: '2027' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'startLevel',
      type: 'select',
      required: true,
      options: [
        { label: '1ère année (Bac1)', value: 'bac1' },
        { label: '2ème année (Bac2)', value: 'bac2' },
        { label: '3ème année (Bac3)', value: 'bac3' },
        { label: 'Master 1', value: 'm1' },
        { label: 'Master 2', value: 'm2' },
      ],
    },

    // ─── Academic background ───────────────────────────────────
    {
      name: 'academic',
      type: 'group',
      label: 'Parcours scolaire',
      fields: [
        {
          name: 'currentSchool',
          type: 'text',
          label: 'École / établissement actuel',
        },
        {
          name: 'lastDiploma',
          type: 'text',
          label: 'Dernier diplôme obtenu (ou en cours)',
        },
        {
          name: 'lastDiplomaYear',
          type: 'number',
          label: 'Année d’obtention',
          min: 1990,
          max: 2030,
        },
      ],
    },

    // ─── Motivation ────────────────────────────────────────────
    {
      name: 'motivation',
      type: 'textarea',
      required: true,
      label: 'Motivation',
      admin: {
        description:
          'Pourquoi le CAD ? Pourquoi ce programme ? Que voulez-vous y trouver ? (5–10 lignes suffisent.)',
      },
    },
    {
      name: 'portfolioUrl',
      type: 'text',
      label: 'Lien portfolio',
      admin: {
        description:
          'URL de votre portfolio en ligne (Behance, Instagram, site perso, Google Drive). Optionnel à ce stade.',
      },
    },

    // ─── How did you hear about us ─────────────────────────────
    {
      name: 'source',
      type: 'select',
      label: 'Comment avez-vous connu le CAD ?',
      options: [
        { label: 'Recherche Google / IA', value: 'search' },
        { label: 'Recommandation (ami, famille)', value: 'word-of-mouth' },
        { label: 'Réseaux sociaux', value: 'social' },
        { label: 'Open Day / Salon', value: 'event' },
        { label: 'Presse / article', value: 'press' },
        { label: 'Ancien étudiant', value: 'alumni' },
        { label: 'Autre', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },

    // ─── CRM workflow ──────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Nouvelle', value: 'new' },
        { label: 'Dossier en cours', value: 'reviewing' },
        { label: 'Entretien planifié', value: 'interview-scheduled' },
        { label: 'Entretien passé', value: 'interview-done' },
        { label: 'Acceptée', value: 'accepted' },
        { label: 'Inscrite', value: 'enrolled' },
        { label: 'Refusée', value: 'rejected' },
        { label: 'Désistement', value: 'withdrawn' },
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
        description: 'Notes internes Admissions (non visible par le candidat).',
        position: 'sidebar',
      },
    },
  ],
}
