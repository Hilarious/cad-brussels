import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Events } from './collections/Events'
import { Categories } from './collections/Categories'
import { Subscribers } from './collections/Subscribers'
import { Leads } from './collections/Leads'
import { Applications } from './collections/Applications'

import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· CAD Brussels',
    },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Pages,
    Posts,
    Events,
    Categories,
    Subscribers,
    Leads,
    Applications,
  ],
  globals: [Header, Footer, SiteSettings],
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // En production, Payload désactive la synchro de schéma (« push ») et
    // attend des migrations. Ce projet n'en a pas : sur une base vierge (le CI),
    // les tables ne seraient jamais créées et le build échouerait sur
    // « relation "header" does not exist ». PAYLOAD_DB_PUSH=true réactive la
    // création du schéma, utilisé par l'étape de seed du CI avant le build.
    push: process.env.PAYLOAD_DB_PUSH === 'true' ? true : undefined,
    pool: {
      // Accepte DATABASE_URI (config locale) ou les noms injectés
      // automatiquement par une base Neon/Vercel connectée au projet
      // (POSTGRES_URL en priorité, poolée pour le serverless, sinon DATABASE_URL).
      connectionString:
        process.env.DATABASE_URI ||
        process.env.POSTGRES_URL ||
        process.env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: { prefix: 'media' },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
