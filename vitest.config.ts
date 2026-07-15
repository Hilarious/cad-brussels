import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    // Tests unitaires de logique pure (pas de DOM) : environnement Node.
    environment: 'node',
    // On ne teste que les *.test.ts co-localisés dans src/. Les tests de bout en
    // bout (Playwright, scripts/verify-ui) vivent ailleurs et ne sont pas gérés
    // par Vitest.
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      // Miroir du paths `@/*` du tsconfig, pour que les imports `@/lib/...`
      // fonctionnent aussi sous Vitest.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
