# CAD Brussels — Next.js + Payload CMS

Site officiel du **College of Art & Design Brussels** ([cad.be](https://cad.be)), reconstruit en 2026 sur une stack moderne.

> **Décisions design, palette, personas, conventions éditoriales** → [`HANDOVER.md`](./HANDOVER.md)
> **Audit SEO du site actuel et plan d'action refonte** → [`SEO-AUDIT-2026.md`](./SEO-AUDIT-2026.md)

---

## Stack

| Brique | Version | Rôle |
|---|---|---|
| Next.js | 15.5+ | App Router, React Server Components |
| React | 19 | UI |
| TypeScript | 5.6 | Type safety strict |
| Tailwind CSS | 3.4 | Styling utility-first |
| Payload CMS | v3 | Headless CMS intégré au même process Next |
| PostgreSQL | 16 | Base de données (multi-locale natif) |
| next-intl | 3.26 | Internationalisation FR/EN |
| Lexical | via Payload | Rich text editor |
| Sharp | via Next | Optimisation images auto AVIF/WebP |
| react-hook-form + Zod | | Formulaires validés côté client + serveur |
| Resend | | Envoi d'emails transactionnels |

Stockage médias : S3-compatible (Cloudflare R2 ou Scaleway, à trancher au déploiement).

---

## Prérequis

- **Node.js** ≥ 20.9 (testé jusqu'à v26)
- **pnpm** ≥ 9
- **PostgreSQL** 16 (via Homebrew, Docker, ou service cloud tier Neon/Supabase)

Sur macOS, la voie la plus rapide :

```bash
brew install node@20 pnpm postgresql@16
brew services start postgresql@16
```

---

## Installation

**1. Cloner le repo**

```bash
git clone https://github.com/Hilarious/cad-brussels.git
cd cad-brussels
```

**2. Créer l'utilisateur et la base Postgres**

```bash
createuser -s cad
createdb -O cad cad
```

(Sur Homebrew : préfixer par `/opt/homebrew/opt/postgresql@16/bin/`.)

**3. Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Puis éditer `.env` pour ajuster si besoin. Les valeurs par défaut fonctionnent en local. Génère un `PAYLOAD_SECRET` propre :

```bash
echo "PAYLOAD_SECRET=$(openssl rand -base64 48)" >> .env
```

**4. Installer les dépendances**

```bash
pnpm install
```

**5. Charger le contenu de démo (~40 pages + événements + header/footer)**

```bash
pnpm seed:all
```

**6. Lancer le serveur de dev**

```bash
pnpm dev
```

- **Front public FR** : http://localhost:3000/fr
- **Front public EN** : http://localhost:3000/en
- **Back-office CMS** : http://localhost:3000/admin (à la première visite, créer un compte admin)

### ⚠️ Votre site local n'est pas le site réel

Le code que vous venez de lancer est le même qu'en production. **Le contenu, non.**

`pnpm seed:all` remplit votre base locale avec un instantané figé du contenu, celui écrit
en dur dans `scripts/seed.ts`. Tout ce que le CAD a modifié depuis dans l'admin de
production est absent de chez vous, et le restera : rien ne synchronise les deux bases.

Exemple réel rencontré le 28/08/2026 : l'icône YouTube du pied de page était visible en
production mais pas en local. Le code était pourtant identique au commit près. La liste des
réseaux sociaux vit dans la base (`site-settings`), et YouTube y avait été ajouté depuis
l'admin de production le 26/08, après le dernier remplissage de la base locale.

**Ce qui est fiable en local** : la mise en page, le comportement des pages, les
composants, tout ce qui vient du code.
**Ce qui ne l'est pas** : les textes des pages pilotées par le CMS, les événements, les
réseaux sociaux, les images, bref tout ce qui vit en base.

Ne concluez jamais « ma version est en retard » depuis un écart de contenu. Vérifiez
d'abord avec `git log` si le code diffère vraiment.

---

## Scripts disponibles

| Commande | Effet |
|---|---|
| `pnpm dev` | Serveur de dev (Next + Payload admin sur `/admin`) |
| `pnpm build` | Build de production |
| `pnpm start` | Serveur de production (après `build`) |
| `pnpm typecheck` | Vérification TypeScript sans build |
| `pnpm lint` | ESLint |
| `pnpm seed` | Seed principal (pages, catégories, events, header, footer) |
| `pnpm seed:extras` | Seed complémentaire (Masters, posts, testimonials) |
| `pnpm seed:all` | Enchaîne `seed` + `seed:extras` |
| `pnpm fix:header` | Met à jour le header globals depuis le code source |
| `pnpm inspect` | Liste pages, events et header en base (debug) |
| `pnpm reset:content` | Reset slugs vides après migration de schéma |
| `pnpm generate:types` | Regénère `src/payload-types.ts` à partir des collections |
| `pnpm generate:importmap` | Regénère `src/app/(payload)/admin/importMap.js` |
| `pnpm test` | Tests unitaires (Vitest) |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |

> **Note** : `src/payload-types.ts` et `src/app/(payload)/admin/importMap.js` sont générés. À regénérer après toute modification d'une collection Payload ou d'un composant admin custom.

---

## Structure du repo

```
src/
├── app/
│   ├── (frontend)/[locale]/       # Site public bilingue FR/EN
│   │   ├── [...slug]/             # Route CMS dynamique (pages Payload)
│   │   ├── page.tsx               # Homepage (hand-coded)
│   │   ├── admissions/            # Hub admissions + sous-pages
│   │   ├── programmes/            # Hub Bachelors
│   │   ├── masters/               # Hub Masters
│   │   ├── alumni/                # Page Alumni
│   │   ├── professeurs/           # Page Professeurs
│   │   ├── etudier-a-bruxelles/   # Hub "Étudier à Bruxelles"
│   │   ├── lifelong-learning/     # Hub formations continues
│   │   ├── events/                # Listing + détail événements
│   │   ├── news/                  # Listing + détail articles
│   │   ├── legal/                 # Mentions légales
│   │   └── privacy/               # Politique de confidentialité
│   ├── (payload)/                 # Admin Payload (route /admin)
│   └── api/                       # Routes API (contact, newsletter, apply)
├── collections/                   # Schémas Payload (Pages, Events, Posts, Media, Users, ...)
├── globals/                       # Header, Footer, SiteSettings
├── blocks/                        # Blocs de contenu réutilisables (Hero, RichText, CTA, FAQ, ...)
├── components/                    # UI React partagée
├── lib/                           # Utilitaires : i18n, email, program-themes, ...
├── messages/                      # Traductions UI (next-intl, fr.json / en.json)
├── middleware.ts                  # Middleware next-intl (locale routing)
└── payload.config.ts              # Configuration Payload

scripts/
├── seed.ts                        # Seed principal
├── seed-extras.ts                 # Seed complémentaire
├── fix-header.ts                  # Reset/upsert header
├── inspect.ts                     # Debug : list DB content
├── reset-content.ts               # Reset slugs vides
└── setup.sh                       # Setup automatique (à jour selon .env.example)

public/
└── logo/                          # Logos officiels CAD (65, full, monogram)
```

---

## Contenu bilingue (FR/EN)

100 % du contenu du site est bilingue. La stratégie :

- **Pages hand-codées** : les traductions sont inline dans les fichiers `.tsx` via `locale === 'fr' ? '...' : '...'` ou des maps de type `{ fr: '...', en: '...' }`.
- **UI récurrente** (boutons, labels de nav, footer, éléments de formulaire) : dans `src/messages/fr.json` et `src/messages/en.json`, accédée via `useTranslations()` de next-intl.
- **Contenu CMS** (pages Payload, événements, posts) : natif multi-locale dans Payload v3 (chaque champ existe en FR + EN).

---

## Routes

**Dynamiques (Payload CMS)** :
- `/[locale]/[...slug]` — toutes les pages CMS (programmes, hubs, sous-pages seedées par `scripts/seed.ts`)

**Hand-codées** :
- `/[locale]/` — homepage
- `/[locale]/admissions` + `/frais`
- `/[locale]/apply`, `/breakfast`, `/contact`, `/info-pack`
- `/[locale]/alumni`, `/professeurs`, `/pourquoi-le-cad`
- `/[locale]/etudier-a-bruxelles` + `/se-loger`, `/vie-pratique`, `/visa`
- `/[locale]/lifelong-learning` + `/applied-ai-spatial-design`, `/generative-ai-creative`
- `/[locale]/events` (+ `/[slug]`)
- `/[locale]/news` (+ `/[slug]`)
- `/[locale]/newsletter` + `/confirmed`, `/unsubscribed`
- `/[locale]/legal`, `/[locale]/privacy`
- `/[locale]/design-system` (dev only, catalogue des composants)

Le middleware `src/middleware.ts` gère la redirection locale (`localePrefix: 'always'` — toutes les URLs sont préfixées par `/fr` ou `/en`).

---

## Conventions

**Éditorial** — voir `HANDOVER.md` pour le détail. En résumé :

- **Pas d'em-dashes** (`—`) dans le contenu visible
- **« Vous »** institutionnel mais adressé
- **Verbes d'action** : « vous apprendrez à », « vous deviendrez »
- **Inclusivité** : `étudiant·e`, `chef·fe`, `designer·euse`
- **« Professionnels en activité »** et non « praticiens »
- **« Postuler en ligne »** sur les CTAs (jamais « Candidater »)

**Design/CSS** — voir `HANDOVER.md`. Composants clés à utiliser (jamais réinventer) :
- `<AdmissionCTA>`, `<PageCTA>`, `<Grid>`, `<Col>`, `<Logo>`, `<NewsletterForm>`, `<RenderBlocks>`

**Système de thèmes** — chaque page programme applique automatiquement une classe `.theme-*` qui définit `--accent` :

```tsx
import { themeForSlug } from '@/lib/program-themes'
// <div className={themeForSlug(page.slug)}>
```

Mapping complet dans `HANDOVER.md` et `src/lib/program-themes.ts`.

---

## Déploiement

> Cette section disait jusqu'au 28/08/2026 que l'hébergement restait « à trancher ». Il est
> tranché et en service depuis le 25/08. Le reste de la liste, lui, est toujours d'actualité.

**L'infrastructure en service** :

| Brique | Fournisseur | État |
|---|---|---|
| Site, admin `/admin` et API `/api` | **Vercel**, projet `cad-brussels` | ✅ en service |
| Base de données | **Neon** (PostgreSQL), via l'intégration Vercel | ✅ en service |
| Adresse publique | `cad-brussels.vercel.app` | ✅ en service, `noindex` volontaire |

Payload n'est pas hébergé séparément : c'est une bibliothèque qui tourne dans le même
programme que le site. Déployer le site déploie Payload.

Le code accepte trois noms pour l'adresse de la base, dans l'ordre `DATABASE_URI` (local),
`POSTGRES_URL` puis `DATABASE_URL` (injectés par Vercel). C'est pourquoi la production
fonctionne sans qu'aucun `DATABASE_URI` n'y soit défini.

### ⚠️ Ce qui reste à configurer, et que le site attend vraiment

Vérifié dans le projet Vercel le 28/08/2026 : seules la base et `PAYLOAD_SECRET` y sont
définies. Toutes les variables ci-dessous sont **absentes en production**, avec des
conséquences visibles :

1. **Resend, pour les emails.** Sans `RESEND_API_KEY`, le code se rabat silencieusement sur
   l'écriture dans le journal. Conséquence : `admissions@cad.be` n'est prévenu d'aucune
   candidature, le candidat ne reçoit aucun accusé de réception, et **la newsletter est
   cassée de bout en bout** puisque son lien de confirmation ne part jamais.
   *Les données ne sont pas perdues pour autant : les formulaires écrivent en base avant de
   tenter l'envoi, tout est dans `Applications` et `Leads`.*
2. **Un bucket S3-compatible pour les médias** (R2 ou Scaleway). Le module de stockage est
   activé sans condition avec des identifiants vides : tout envoi d'image depuis l'admin
   échoue.
3. **Cloudflare Turnstile pour l'anti-spam.** Il figure dans `.env.example` mais **n'est
   écrit nulle part dans le code**. Les formulaires publics, dont celui de candidature,
   sont aujourd'hui sans protection anti-robot.
4. **`NEXT_PUBLIC_SITE_URL`**, utilisée par le plan du site et les balises de partage.
5. HTTPS et HSTS : déjà en place, les en-têtes sont dans `next.config.ts`.
6. Monitoring (Sentry, Plausible) : toujours à faire.

### Sauvegarde du contenu

Neon conserve un historique permettant de revenir en arrière, ce qui couvre la fausse
manipulation. Il n'a jamais été vérifié, sa profondeur dépend du plan souscrit, et il ne
protège pas de la perte du compte. **Il n'existe aucune copie du contenu hors de Neon.**

---

## CI / GitHub Actions

Un workflow `.github/workflows/ci.yml` est configuré. Il s'exécute automatiquement à chaque push sur `main` et à chaque pull request. Il :

1. Installe les dépendances (`pnpm install --frozen-lockfile`)
2. Vérifie le typage TypeScript (`pnpm typecheck`)
3. Lint le code (`pnpm lint`)
4. Build en mode production (`pnpm build`)

Voir le fichier CI pour les détails.

---

## Contacts projet

- **Audry Van Essche** — CEO et cofondateur, Hilarious Agency — joker@hilarious.be
- **Jerome Canon** — Technical Lead Hilarious Agency — freeze@hilarious.be
- **Yannick Chan** — Intégration & maintenance Hilarious — yannick@hilarious.be

Client :
- **Eric Vanden Broeck** — Dean, CAD Brussels
- **Fabienne Willaert** — Admin, CAD Brussels

---

## Licence

Propriétaire — © 2026 CAD Brussels & Hilarious Agency. Tous droits réservés.
