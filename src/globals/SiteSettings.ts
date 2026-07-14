import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'CAD Brussels' },
    { name: 'tagline', type: 'text', localized: true },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'textarea',
          defaultValue: '25 rue Roberts-Jones\n1180 Bruxelles\nBelgique',
        },
        { name: 'email', type: 'text', defaultValue: 'secretariat@cad.be' },
        { name: 'phone', type: 'text', defaultValue: '+32 (0)2 640 40 32' },
      ],
    },
    {
      name: 'social',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'Behance', value: 'behance' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
