/**
 * <JsonLd> — injecte un bloc `<script type="application/ld+json">`.
 *
 * Composant server-side (aucun code client). Idéal pour Schema.org
 * (voir `src/lib/schema.ts` pour les helpers de génération).
 *
 * Usage :
 *   import { educationalOrganization } from '@/lib/schema'
 *   import { JsonLd } from '@/components/json-ld'
 *
 *   export default function Page() {
 *     return (
 *       <>
 *         <JsonLd data={educationalOrganization()} />
 *         <article>...</article>
 *       </>
 *     )
 *   }
 *
 * Plusieurs blocs JSON-LD peuvent coexister sur la même page (chacun dans
 * son propre <script>) — c'est même recommandé (Organization + Course +
 * BreadcrumbList sur une page programme, par exemple).
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
