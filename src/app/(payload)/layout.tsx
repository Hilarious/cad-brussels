/* Payload admin segment.
 *
 * Payload v3 ships its own root layout via `@payloadcms/next/layouts`.
 * The route group `(payload)` is excluded from the i18n middleware
 * (see `src/middleware.ts`) so the admin can run at `/admin` without
 * a locale prefix.
 */

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import { importMap } from './admin/importMap'

import '@payloadcms/next/css'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
