# CAD Brussels — Next.js + Payload CMS

Site officiel du **College of Art & Design Brussels** ([cad.be](https://cad.be)), reconstruit en 2026 sur une stack moderne.

> **Pour les décisions design, la palette, les personas, les conventions éditoriales : voir [`HANDOVER.md`](./HANDOVER.md).**

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

**À trancher avec le client** (Eric, mai 2026 : décision non prise) :

- **Vercel** — le plus simple, ~50 €/mois, Postgres via Vercel Postgres ou Neon
- **Scaleway** — RGPD natif, ~20 €/mois, container/serverless
- **Self-hosted** — VPS Hetzner + Coolify, ~10 €/mois, plus de contrôle

Prérequis pour la mise en prod :
1. Configurer un bucket S3-compatible pour les médias (R2 ou Scaleway)
2. Configurer Resend (ou SMTP alternatif) pour les emails
3. Configurer Cloudflare Turnstile pour l'anti-spam des formulaires
4. Activer HTTPS + HSTS (headers déjà configurés dans `next.config.ts`)
5. Configurer un monitoring (Sentry + Plausible recommandés)

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

- **Audry Van Essche** — Creative Manager Hilarious Agency — joker@hilarious.be
- **Yannick Chan** — Intégration & maintenance Hilarious — yannick@hilarious.be

Client :
- **Eric Vanden Broeck** — Dean, CAD Brussels
- **Fabienne Willaert** — Admin, CAD Brussels

---

## Licence

Propriétaire — © 2026 CAD Brussels & Hilarious Agency. Tous droits réservés.
