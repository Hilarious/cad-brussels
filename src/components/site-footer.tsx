import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NewsletterForm } from './newsletter-form'
import { SocialIcons } from './social-icons'
import { Logo } from './logo'
import { localized } from '@/lib/localize'
import { assainirLibelle } from '@/lib/appellations'

export async function SiteFooter({ locale }: { locale: string }) {
  const payload = await getPayload({ config })
  const [footer, settings] = await Promise.all([
    payload.findGlobal({
      slug: 'footer',
      locale: locale as 'fr' | 'en',
      depth: 0,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      locale: locale as 'fr' | 'en',
      depth: 0,
    }),
  ])

  const columns = footer.columns ?? []
  const legal = footer.legal ?? []
  const social = settings.social ?? []
  const year = new Date().getFullYear()
  const isFR = locale === 'fr'

  return (
    <footer className="mt-12 bg-paper">
      {/* Découvrez l'intérieur du CAD — titre commun aux deux volets :
          newsletter (audience deja engagee) et reseaux sociaux
          (decouverte, jeune public). Deux canaux complementaires, pas
          l'un a la place de l'autre. Choix assume : pas d'apercu visuel
          du contenu social ici, seulement l'invitation a s'abonner. */}
      <div>
        <div className="container py-12">
          <h2 className="font-display text-2xl text-ink md:text-3xl">
            {isFR ? 'Découvrez l’intérieur du CAD.' : 'See what happens inside the CAD.'}
          </h2>

          {/* Deux colonnes de meme rang : meme intitule en capitales (la
              trame du footer), meme phrase de description, puis l'action.
              La difference de rythme editorial, mensuel contre quotidien,
              est ce qui distingue les deux canaux, pas leur mise en forme. */}
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-ink/50">
                {isFR ? 'La newsletter' : 'The newsletter'}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {isFR
                  ? 'Une fois par mois : événements, admissions, modules. '
                  : 'Once a month: events, admissions, modules. '}
                <Link href={`/${locale}/newsletter`} className="text-accent hover:underline">
                  {isFR ? 'En savoir plus →' : 'Learn more →'}
                </Link>
              </p>
              <div className="mt-4 max-w-xs">
                <NewsletterForm locale={locale} variant="compact" />
              </div>
            </div>

            {social.length > 0 && (
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-ink/50">
                  {isFR ? 'Les réseaux' : 'Social'}
                </p>
                <p className="mt-2 text-sm text-ink/70">
                  {isFR
                    ? 'Au quotidien : les créations, les briefs, les coulisses.'
                    : 'Every day: the projects, the briefs, behind the scenes.'}
                </p>
                <div className="mt-4">
                  <SocialIcons links={social} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frise décorative — charte graphique Thomas Durieux.
          Motif carré (662×75) répété en bg-repeat-x : s'adapte à toute
          largeur d'écran sans jamais couper le motif, contrairement à
          une longue bande pré-assemblée. */}
      <div
        aria-hidden="true"
        className="mt-10 h-6 w-full bg-repeat-x sm:mt-14 sm:h-9 lg:h-12"
        style={{ backgroundImage: "url('/decor/frise-cad-tile.png')", backgroundSize: 'auto 100%' }}
      />

      {/* Site map — layout dense pour maximiser le maillage interne.
          L'audit SEO Digistage 2026 a montré que les pages qui
          performent ont 154 liens internes en moyenne. Le footer est
          notre principal levier de densification (présent sur toutes
          les pages), d'où le passage à 5 colonnes de liens. */}
      <div className="container grid gap-12 py-16 md:grid-cols-3 lg:grid-cols-6">
        <div className="md:col-span-3 lg:col-span-2">
          {/* Footer : wordmark complet, signature institutionnelle stable
              indépendamment des campagnes anniversaire. */}
          <Logo locale={locale} variant="wordmark" size="lg" noLink />
          <p className="mt-2 max-w-sm text-sm text-ink/60">{settings.tagline}</p>
          <div className="mt-6 text-sm text-ink/70">
            {settings.contact?.address && (
              <p className="whitespace-pre-line">{settings.contact.address}</p>
            )}
            {settings.contact?.email && (
              <p>
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="tap hover:text-accent"
                >
                  {settings.contact.email}
                </a>
              </p>
            )}
            {settings.contact?.phone && (
              <p>
                <a
                  href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                  className="tap hover:text-accent"
                >
                  {settings.contact.phone}
                </a>
              </p>
            )}
          </div>
        </div>

        {columns.map((col, i) => (
          <div key={`col-${i}`}>
            <p className="text-sm font-medium uppercase tracking-widest text-ink/50">
              {assainirLibelle(col.title)}
            </p>
            {/* `space-y-2` retiré : la hauteur de 44px de `.tap` fournit
                désormais l'espacement entre les liens. Le cumul des deux
                aurait donné des lignes de 52px, inutilement aérées. */}
            <ul className="mt-1 text-sm">
              {(col.links ?? []).map((link, j) => (
                <li key={`link-${j}`}>
                  <Link
                    href={localized(link.path, locale)}
                    className="tap text-ink/80 hover:text-accent"
                  >
                    {assainirLibelle(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 py-6 text-xs text-ink/60">
        <p>
          {footer.copyright ?? `© ${year} CAD Brussels`} · {year}
        </p>
        <ul className="flex flex-wrap gap-x-4">
          {legal.map((item, i) => (
            <li key={`legal-${i}`}>
              <Link
                href={localized(item.path, locale)}
                className="tap hover:text-accent"
              >
                {assainirLibelle(item.label)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
