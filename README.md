# CAD Brussels — Next.js + Payload CMS

Site officiel du **College of Art & Design Brussels** (cad.be), reconstruit en 2026 sur Next.js 15 + Payload v3.

> Voir `📄 Documentation/ARCHITECTURE.md` pour le détail des choix techniques et la roadmap.

## Stack
- **Next.js 15** (App Router, React 19)
- **Payload CMS v3** intégré dans le même process
- **PostgreSQL** + **S3** (media)
- **Tailwind CSS** + **next-intl** (FR/EN)
- **TypeScript strict**

## Démarrage rapide

### Prérequis
- Node.js ≥ 20.9
- pnpm ≥ 9
- Docker (pour Postgres en local)

### Installation (script automatique)

Depuis ce dossier (`💻 Source Code/cad-brussels`) :

```bash
./scripts/setup.sh
```

Le script :
1. active `pnpm` via Corepack
2. installe les dépendances
3. démarre Postgres + MinIO via Docker
4. crée `.env` avec un `PAYLOAD_SECRET` aléatoire
5. attend que Postgres soit prêt
6. génère les types Payload et l'import map

Puis lance le serveur :

```bash
pnpm dev
```

### Installation manuelle (équivalent)

```bash
corepack enable
pnpm install
docker compose -f "../../🐳 Docker & Deployment/docker-compose.yml" up -d
cp .env.example .env
echo "PAYLOAD_SECRET=$(openssl rand -base64 48)" >> .env
pnpm generate:types
pnpm generate:importmap
pnpm dev
```

> Note : `src/payload-types.ts` et `src/app/(payload)/admin/importMap.js` sont **générés** par Payload. À regénérer après toute modification d'une collection ou d'un composant admin custom.

- Front public : http://localhost:3000
- Admin Payload : http://localhost:3000/admin (créer le premier user à la première visite)

### Scripts

| Commande | Effet |
|---|---|
| `pnpm dev` | Dev server (Next + Payload admin) |
| `pnpm build` | Build production |
| `pnpm start` | Serveur prod |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm lint` | ESLint |
| `pnpm generate:types` | Génère `src/payload-types.ts` à partir des collections |
| `pnpm test` | Tests unitaires (Vitest) |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |

## Structure

```
src/
├── app/
│   ├── (frontend)/[locale]/   # Site public bilingue
│   ├── (payload)/             # Admin Payload (route /admin)
│   └── api/                   # API routes (formulaire contact, etc.)
├── collections/               # Schémas Payload (Pages, Events, Posts, Media, Users)
├── globals/                   # Header, Footer, SiteSettings
├── blocks/                    # Blocs de contenu (Hero, RichText, CTA, ...)
├── components/                # UI partagée
├── lib/                       # Utilitaires, i18n
├── messages/                  # Traductions UI (next-intl)
└── payload.config.ts          # Configuration Payload
```

## Déploiement

Voir `🐳 Docker & Deployment/DEPLOY.md`.

Cible recommandée : VPS Hetzner CX22 + **Coolify** (Docker auto-déployé depuis GitHub).
