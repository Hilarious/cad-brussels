# SEO & Technical Audit — Analyse du site cad.be actuel et plan d'action pour le nouveau stack

> **Source** : Digistage / Digisense, [rapport du 22 janvier 2026](https://reports.digistage.be/cad/)
> **Objet** : synthèse de l'audit du site WordPress actuel et cartographie des améliorations à intégrer dans la refonte Next.js 15 + Payload v3.

---

## Scores actuels — la photo au 22 janvier 2026

| Pilier | Score / 100 | Évolution | Commentaire |
|---|---|---|---|
| **Piliers Techniques** | **38** | +9 | Le plus faible. Indexabilité à 0/100. |
| **Réputation (backlinks)** | 31 | +0 | Profil sain mais Domain Trust bas (23) |
| **Performance Mots-Clés** | **80** | +0 | Le meilleur. À protéger absolument lors de la bascule. |
| **Optimisation IA** | 48 | +0 | Position 1 face à Cambre et Saint-Luc, à consolider |

**Enjeu principal de la refonte** : monter le score technique de 38 → 85+ tout en préservant les 80/100 sur les mots-clés (donc migration 301 impeccable).

---

## 1. Vue d'ensemble du site actuel

- **1 319 URLs crawlées** — dont 480 pages HTML, 400 indexables (donc 80 pages HTML non-indexables actuellement)
- **736 ressources IMG/JS**
- **771 clics SEO** sur 3 mois (via Search Console)
- **23 173 impressions** sur 3 mois
- Pages qui reçoivent le plus d'impressions : `/`, `/fr/`, `/fr/un.tecture-design/`, `/fr/un.fashion-design/`, `/open-day-august-2025/`

### Profil des pages gagnantes (top 10 % trafic) vs moyenne du site

| Facteur | Moyenne site | Moyenne gagnants | Delta |
|---|---|---|---|
| Mots par page | 2 391 | 3 699 | **+55 %** |
| Liens internes (inlinks) | 33.6 | 154.5 | **+360 %** |
| Profondeur (depth) | 1.1 | 0.9 | -14 % |
| Temps chargement | 0.7 s | 0.6 s | -21 % |

### Facteurs d'influence (data science Digisense)

- **Liens internes** : corrélation positive (score 0.27) — **+ de maillage = + de trafic**
- **Temps de chargement** : corrélation négative (score -0.2) — **plus rapide = mieux**
- Mots par page : impact non-significatif (0.07)
- Profondeur de page : impact non-significatif (-0.03)

**➜ Traduction pour le nouveau site** : investir dans un **maillage interne dense** et une **performance ultra-rapide** — deux domaines où Next.js excelle par défaut.

---

## 2. Backlinks & Réputation (31/100)

### Profil actuel

- **843 backlinks** depuis **295 domaines**
- **653 follow / 190 nofollow**
- **819 texte / 24 image**
- **Domain Trust : 23** (médiane 20) — profil massivement en bas de gamme
- **0.9 % de jus SEO gaspillé** (bon, peu de liens vers 404 ou redirects)

### Top domaines qui pointent vers cad.be (à préserver dans la migration 301)

| Domaine | DT | Volume | Type |
|---|---|---|---|
| fastbase.com | 64 | 1 | Business directory |
| google.be | 64 | 1 | Google local |
| sosoir.lesoir.be | 58 | 1 | Le Soir (media) |
| flair.be | 51 | 1 | Media |
| studyrama.com | 47 | **17** | Orientation étudiante (le + gros volume) |
| encyclo.wallonica.org | 48 | 9 | Encyclopédie Wallonie |
| letudiant.fr | 46 | 3 | Orientation étudiante |
| perspective.brussels | 45 | 6 | Institution Bruxelles |
| gael.be | 45 | 1 | Media mode |

**Action refonte** : lister toutes ces URLs (voir le CSV disponible sur le rapport) et prévoir des **redirects 301** vers les nouvelles URLs équivalentes dans `next.config.ts`. Perdre ces liens = perte massive de trafic organique.

### Recommandation Digistage

> « Votre profil de liens ne présente pas de problème majeur. Les actions ci-dessous sont des optimisations complémentaires. »

**Traduction** : le boulot backlinks n'est pas urgent, le plus critique est de **ne pas casser les liens existants** lors de la bascule.

---

## 3. Mots-clés & Performance SEO (80/100)

Le seul pilier au vert. À protéger comme la prunelle de nos yeux lors de la migration.

### Chiffres-clés

- **1 074 mots-clés positionnés**
- **8 616 impressions**, **211 clics** sur 3 mois (via cette section)
- **Position moyenne : 17.7** (encore trop haut, cible < 10)
- **42 % du potentiel de recherche hors marque** captée

### Distribution des positions

| Position | Nb mots-clés | % |
|---|---|---|
| 1-3 | 362 | 23.7 % |
| 4-6 | 234 | 15.3 % |
| 7-10 | 337 | 22.0 % |
| 11-20 | 197 | 12.9 % |
| 21-50 | 150 | 9.8 % |
| 51-100 | 180 | 11.8 % |

### 🚨 GRAND CONSTAT : CTR catastrophique sur les positions 1-3

| Position | CTR réel | CTR attendu | Écart |
|---|---|---|---|
| **1-3** | **5.71 %** | **16.0 %** | **-10.29 %** 🔴 |
| 4-6 | 2.66 % | 5.0 % | -2.34 % |
| 7-10 | 1.38 % | 2.5 % | -1.12 % |
| 11-20 | 2.36 % | 1.0 % | +1.36 % |
| 21-50 | 1.61 % | 0.5 % | +1.11 % |

**Interprétation** : quand cad.be est en top 3 de Google, il n'obtient que **1/3 des clics attendus**. C'est ÉNORME comme perte. Les `<title>` et `<meta description>` sont soit vides, soit médiocres, soit non pertinents pour la requête. **Chaque page devrait avoir un title percutant et une meta description qui donne envie de cliquer.**

### Opportunités CTR — les mots-clés qui saignent

| Mot-clé | URL | Position | Impressions | Clics | CTR |
|---|---|---|---|---|---|
| ecole de design belgique | /fr/ | 1-3 | 14 | 0 | **0.00 %** |
| fashion school belgium | /undergraduate-fashion-design/ | 1-3 | 14 | 0 | **0.00 %** |
| thomas durieux | /fr/professeurs/ | 1-3 | 12 | 0 | **0.00 %** |

**Ces trois mots-clés sont en top 3 mais génèrent zéro clic.** Le titre et la meta description sont dysfonctionnels. C'est notre premier gain rapide au moment de la refonte.

### Quick Wins — positions 4-15 à pousser en top 3

Ces mots-clés sont à portée de main. Optimiser le contenu, le maillage et le title/meta permettra de gagner plusieurs positions.

| Mot-clé | Position | Impressions | URL cible |
|---|---|---|---|
| interior design | 8 | 135 | interior-architecture-design |
| architecte d'intérieur études belgique | 9 | 38 | interior-architecture-design |
| cadcollege.net | 6 | 26 | / |
| formation architecte d'intérieur | 9 | 26 | interior-architecture-design |
| fashion design | 6 | 20 | fashion-design |
| ecole art uccle | 6 | 20 | qui-sommes-nous |
| product design belgium | 11 | 19 | / |
| école stylisme belgique | 8 | 18 | fashion-design |
| ecole mode belgique | 8 | 15 | fashion-design |
| event management | 6 | 14 | event-management |
| architecture d'intérieur | 12 | 12 | interior-architecture-design |

### Top mots-clés déjà bien placés (à préserver)

| Mot-clé | Position | Impressions | Clics |
|---|---|---|---|
| cad | 11 | 716 | 29 |
| cad bruxelles | 1 | 64 | 16 |
| cad brussels | 1 | 32 | 12 |
| cad uccle | 1 | 22 | 3 |
| cadcollege | 5 | 66 | 0 |
| interior design | 8 | 135 | 0 |
| decoratrice d'intérieur étude belgique | 1 | 8 | 0 |
| ecole de mode bruxelles | 4 | 28 | 1 |
| college of art and design brussels | 3 | 21 | 6 |
| cad brussel | 1 | 10 | 6 |

---

## 4. Optimisation IA (48/100)

### Position vs concurrence

| Rank | Marque | Visibilité | Sentiment | Position moy. |
|---|---|---|---|---|
| **1** | **CAD** | **53 %** | 66 | 2.9 |
| 2 | Cambre | 43 % | **71** | **2.5** |
| 3 | Saint-Luc | 36 % | 66 | 2.9 |

CAD est **numéro 1 en visibilité** face à ses concurrents directs bruxellois, MAIS Cambre a un sentiment moyen supérieur (71 vs 66) et une position moyenne meilleure. **Enjeu refonte** : améliorer la qualité éditoriale pour rehausser le sentiment.

### Répartition par moteur

| Moteur | Mentions | Visibilité | Sentiment |
|---|---|---|---|
| ChatGPT | 75 | **83.3 %** | 64 |
| Perplexity | 52 | 57.8 % | 67 |
| Google AI Overview | 42 | 46.7 % | **68** |

### Pages les plus citées par les LLMs (à conserver + enrichir)

| URL | Type | Mentions |
|---|---|---|
| /fr/ | Homepage | 31 |
| /undergraduate-digital-design-art-direction/ | Programme | 26 |
| /fr/qui-sommes-nous/ | À propos | 24 |
| /fr/undergraduate-fashion-design/ | Programme | 24 |
| /undergraduate-fashion-design/ | Programme | 15 |
| /fr/digital-brand-content/ | Programme | 11 |
| /fr/procedure-admission/ | Admissions | 11 |
| /about-us/ | À propos | 10 |
| /fr/undergraduate-interior-architecture/ | Programme | 9 |

**Traduction pour la refonte** : ces URLs DOIVENT être migrées avec redirects 301 vers leurs équivalents dans la nouvelle arborescence. Les nouvelles URLs cibles :

- `/fr/undergraduate-digital-design-art-direction/` → `/fr/programmes/communication-digital-design/`
- `/fr/undergraduate-fashion-design/` → `/fr/programmes/fashion-accessory-design/`
- `/fr/undergraduate-interior-architecture/` → `/fr/programmes/interior-architecture-design/`
- `/fr/qui-sommes-nous/` → `/fr/about/` (ou garder tel quel via un slug custom en base)
- `/fr/procedure-admission/` → `/fr/admissions/`
- `/fr/digital-brand-content/` → `/fr/masters/digital-brand-content/`

### Prompts où CAD sort le mieux

| Prompt | Visibilité |
|---|---|
| meilleure école créative à Bruxelles pour apprendre les métiers du design | 0.95 |
| école de design à Bruxelles avec bachelors en design intérieur ou digital | 0.94 |
| comment choisir une école de design ou mode en Belgique | 0.70 |
| programme bachelor en digital design, motion design ou web design | 0.63 (**seul CAD**) |
| où étudier le graphisme, l'UX/UI ou la publicité en Belgique | 0.63 |

### Prompts à conquérir (visibilité faible actuellement)

| Prompt | Visibilité |
|---|---|
| études supérieures pour devenir designer, DA ou créatif digital | **0.07** |
| formation en communication visuelle et direction artistique après le secondaire | **0.07** |
| école privée pour apprendre le product design et le design industriel | 0.35 |
| formation créative internationale à Bruxelles pour jeunes designers | 0.50 |

**Action refonte** : créer du contenu éditorial ciblé sur ces intentions de recherche (blog posts, pages dédiées, FAQ enrichie via bloc `<FAQ>` Payload).

---

## 5. Piliers Techniques (38/100) — la refonte règle 90 % du problème

### Sous-scores actuels

| Sous-pilier | Score | Enjeu |
|---|---|---|
| **Indexabilité & Structure** | **0.0/100** 🔴 | Catastrophique — la refonte Next règle tout |
| Sécurité & Conformité | 30.2/100 | Manquent tous les headers de sécurité |
| Méta-données & Contenu | 75.0/100 | À finaliser mais bon |
| Performance & Mobile | 87.4/100 | Bon, mais images à optimiser |
| Audit Manuel/Qualitatif | 20/100 | À revoir humainement |

### 🔴 Top problèmes d'indexabilité (par points perdus)

| Problème | Impact | Points perdus |
|---|---|---|
| **Ressources internes bloquées par Robots.txt** | 31.41 % | -42 pts |
| **Codes de réponse : bloqué en interne par Robots.txt** | 31.41 % | -42 pts |
| Absentes du Sitemap | 23.75 % | -36.6 pts |
| GSC : Pages Orphelines | 19.65 % | -33.2 pts |
| GA : Pages Orphelines | 19.04 % | -32.7 pts |
| Pages Orphelines (Sitemap) | 18.06 % | -31.9 pts |
| GSC : URL Non Indexée | 15.63 % | -29.7 pts |
| Codes de réponse : aucune réponse en interne | 0.91 % | -21.5 pts |
| Liens Internes Cassés (404) | 0.46 % | -15.3 pts |
| Hreflang : URLs en Erreur | 0.23 % | -10.8 pts |

### 🟢 Ce que le nouveau stack Next.js règle AUTOMATIQUEMENT

| Problème actuel | Solution intégrée dans notre stack |
|---|---|
| Ressources bloquées par robots.txt | `src/app/robots.ts` — robots.txt géré en code, cohérent |
| Pages absentes du sitemap | `src/app/sitemap.ts` — sitemap dynamique généré depuis Payload |
| Pages orphelines | Structure Next.js + Payload garantit qu'aucune page publiée n'est déconnectée |
| Liens internes cassés (404) | TypeScript + revue de code + composant `<Link>` empêchent les URLs cassées |
| Hreflang en erreur | Middleware next-intl gère hreflang automatiquement (FR/EN cohérents) |
| Redirections en chaîne | Un seul niveau de redirect géré dans `next.config.ts` |
| Redirections internes | Toutes les URLs sont typées et vérifiées, pas de chaîne interne |
| Codes réponse aucune | Route handlers Next retournent explicitement des status corrects |
| Ressources JS/CSS inutilisées | Tree-shaking automatique par le bundler Turbo/Webpack |
| CSS inutilisé | Tailwind purge automatiquement les classes non utilisées |
| Images en mauvais format | `next/image` génère WebP + AVIF automatiquement |
| Images trop lourdes (101 MB total !) | Hook Sharp au moment de l'upload Payload (compression à faire) |
| Dimensions manquantes | `next/image` **oblige** width/height (protection anti-CLS) |
| CLS élevé | Idem, `next/image` fixe les dimensions par défaut |
| Images background | À traiter cas par cas avec `next/image` avec `fill` |
| Cache inefficace | Cache Next par défaut + headers Cache-Control appropriés |
| Ressources bloquantes | Streaming SSR + preload automatique |
| Font display | `next/font/google` gère `display: swap` par défaut |
| DOM trop complexe | Recomposition maîtrisée avec composants réutilisables |
| Empreinte carbone élevée | Bundle plus léger, moins de requêtes, meilleur cache |
| URLs avec majuscules / underscores / espaces | Slugs normalisés dans Payload (lowercase, kebab-case) |
| Character non-ASCII dans URLs | Idem, slugify côté Payload |

**Verdict** : au moins **20 problèmes techniques disparaissent automatiquement** avec le nouveau stack. Le score technique passera mécaniquement de 38 à ~75-80 sans effort supplémentaire.

### 🟡 Ce qu'on doit implémenter EN PLUS pour aller à 90+

Ces éléments ne sont pas automatiques et doivent être configurés :

#### Sécurité (score actuel 30.2/100 → cible 95+)

- ✅ **HSTS** — déjà configuré dans `next.config.ts` headers
- ✅ **X-Content-Type-Options** — déjà configuré
- ✅ **X-Frame-Options** — déjà configuré (`SAMEORIGIN`)
- ✅ **Referrer-Policy** — déjà configuré (`strict-origin-when-cross-origin`)
- ⏳ **CSP (Content-Security-Policy)** — À AJOUTER avant prod. Pas trivial à cause de Payload admin qui a des inline scripts.
- ⏳ **Liens `target="_blank"` non sécurisés** — vérifier que tous les liens externes ont `rel="noopener noreferrer"`. Créer un composant `<ExternalLink>` centralisé.

#### Performance (score actuel 87.4/100 → cible 95+)

- ⏳ **Hook Sharp de compression à l'upload Payload** — max 1600px, JPEG q80, génération WebP/AVIF automatique par `next/image`. Absolument critique vu que le site actuel a **101.71 MB d'images** dont plusieurs > 6 MB par image. Cible : ≤ 5 MB total sur toute la page.
- ⏳ **Lazy loading systématique** — déjà par défaut avec `next/image`, mais s'assurer qu'aucune image LCP ne le désactive à tort (utiliser `priority` uniquement sur les images above-the-fold critiques).
- ⏳ **TBT** — le site actuel est à 222 ms (cible < 200). Le nouveau site sera meilleur mais surveiller Sentry Performance + Web Vitals.

#### Contenu structuré

- ⏳ **Schema.org JSON-LD** — actuellement 30.35 % des pages n'ont pas de données structurées. Ajouter :
  - `EducationalOrganization` sur homepage + about
  - `Course` sur chaque page programme
  - `Event` sur chaque événement (déjà partiellement présent dans `/breakfast/`)
  - `Person` sur chaque professeur (Faculty page)
  - `Article` sur chaque post news
  - `Person` avec `alumniOf` sur les témoignages alumni
  - `FAQPage` sur les pages avec bloc `<FAQ>`
  - `BreadcrumbList` sur toutes les pages sous-niveau

Ce sont les données qui alimentent les **rich snippets Google** et sont ULTRA-utilisées par les LLMs pour comprendre le contenu du site (impact direct sur le score IA).

#### Meta données

Les problèmes actuels (75/100) :
- Titres trop courts (11.91 % des pages) → composant SEO utilitaire dans `src/lib/fields/seo.ts` déjà présent, à enforcer 45-60 caractères
- H2 manquants (30.35 %) → toujours un H2 après le H1 dans les templates
- Structure Hn illogique (23.60 %) → composant `<Heading level>` qui gère la hiérarchie
- Contenu quasi-dupliqué (20.71 %) → attention à la duplication FR/EN mal configurée (les URLs FR et EN doivent être distinctes ET liées par hreflang)
- Ancres de lien vagues (4.17 %) → bannir « cliquez ici », « en savoir plus », préférer des ancres descriptives

#### Maillage interne (grand levier de la data science Digisense)

Rappel : les pages gagnantes ont **154 liens internes vs 33 en moyenne** (+360 %).

- ⏳ **Component `<RelatedContent>`** — à ajouter en fin de chaque page programme (autres programmes du même thème, alumni de ce programme, events futurs de ce programme)
- ⏳ **Breadcrumbs** — à ajouter partout, y compris avec structured data BreadcrumbList
- ⏳ **Blog cluster / topic linking** — quand les news auront du contenu, les faire linker vers les pages programmes appropriées
- ⏳ **Footer riche** — le footer doit lister les 10-15 pages les plus importantes (déjà partiellement fait dans `<SiteFooter>` mais à enrichir)
- ⏳ **Bloc « À découvrir aussi »** — un `<RelatedPrograms>` à intégrer sur chaque page programme et hub

---

## 6. Plan d'action priorisé pour la refonte

### Phase 1 — CRITIQUE avant go-live (bloquant)

1. **Redirects 301 exhaustifs** dans `next.config.ts`
   - Toutes les URLs actuelles avec du trafic → nouvelles URLs
   - Priorité : les 22 pages les plus citées par les LLMs (voir section 4)
   - Priorité : les URLs sources des 843 backlinks (télécharger le CSV Digistage)
2. **Sitemap XML dynamique** via `src/app/sitemap.ts` (déjà présent, à finaliser avec toutes les URLs)
3. **Robots.txt propre** via `src/app/robots.ts` (bloquer uniquement `/admin`, `/api/`)
4. **Hreflang FR/EN correct** (déjà géré par next-intl, à valider)
5. **Compression images Payload** — hook Sharp à activer sur `MediaCollection`
6. **CSP en mode `Content-Security-Policy-Report-Only`** avant go-live puis en enforce

### Phase 2 — Optimisation CTR (impact business immédiat)

1. **Rédiger les meta title et description** de CHAQUE page manuellement dans Payload — cible : combler l'écart de -10.29 % de CTR sur les positions 1-3
   - Utiliser le champ SEO déjà configuré dans `src/lib/fields/seo.ts`
   - Format : `<Titre accrocheur> · CAD Brussels` — titres 50-60 caractères
   - Meta description 140-155 caractères, avec verbe d'action + bénéfice
2. **Prioriser les 3 « pages saignantes »** :
   - `/fr/` (mot-clé « ecole de design belgique » en pos 1-3, 0 clic)
   - `/undergraduate-fashion-design/` (« fashion school belgium »)
   - `/fr/professeurs/` (« thomas durieux »)

### Phase 3 — Quick Wins mots-clés

Optimiser le contenu et le maillage des pages listées en section 3 « Quick Wins » (interior design, fashion design, formation architecte d'intérieur, event management, etc.) pour passer de position 4-15 à 1-3.

### Phase 4 — Enrichissement contenu

1. **Schema.org JSON-LD** sur toutes les pages (voir section 5)
2. **Blocs FAQ** sur pages programmes et admissions (pour le SEO ET les rich snippets ET les LLMs)
3. **People Also Ask** : créer des pages de réponse aux questions AlsoAsked identifiées
4. **Prompts LLM à conquérir** — créer du contenu pour :
   - « études supérieures pour devenir designer, DA ou créatif digital » (visibilité 0.07)
   - « formation en communication visuelle et direction artistique après le secondaire » (0.07)
   - « école privée pour apprendre le product design et le design industriel » (0.35)

### Phase 5 — Backlinks

1. Contacter les gros référents (studyrama.com, letudiant.fr, perspective.brussels) pour :
   - S'assurer que les nouvelles URLs sont utilisées
   - Négocier des mises à jour de contenu (chiffres 1961, 160 étudiants, +90 % insertion, réseau CUMULUS)
2. Créer un press kit à envoyer aux médias (Le Soir Sosoir, Flair, Gael) — angle 65 ans CAD 2026
3. Content marketing pour attirer de nouveaux backlinks (études CUMULUS, positions alumni, workshops internationaux)

---

## 7. KPIs à monitorer post-migration

À suivre chaque mois dans Search Console + Plausible + Digistage :

| KPI | Actuel (jan 2026) | Cible 3 mois post-launch | Cible 12 mois |
|---|---|---|---|
| Score technique Digistage | 38 | 75 | 90+ |
| Score IA | 48 | 60 | 75 |
| Domain Trust | 23 | 25 | 30 |
| Clics SEO / 3 mois | 771 | 1 000+ | 2 000+ |
| Impressions / 3 mois | 23 173 | 30 000+ | 50 000+ |
| Position moyenne | 17.7 | 15 | < 10 |
| CTR position 1-3 | 5.71 % | 10 % | 14 % (proche du benchmark 16 %) |
| Pages orphelines | 18-19 % | < 2 % | 0 % |
| Poids images total | 101 MB | < 10 MB | < 5 MB |
| Format images modernes | 11.8 % | 90 % | 100 % |
| Sécurité (headers) | 30 % pages OK | 100 % | 100 % |
| Sentiment IA vs Cambre | -5 pts | 0 pt | +5 pts |

---

## 8. Notes complémentaires

- **Concurrents à surveiller** : La Cambre, Saint-Luc, HELHa, Howest, LISAA — tous cités par les LLMs comme alternatives
- **Le partenariat Collège de Paris** apparaît encore comme source dans les backlinks (DT 38) — décision Eric mai 2026 de ne plus le communiquer, mais **conserver le backlink existant** tant que le lien est actif, il transmet toujours du jus SEO
- **`fastbase.com` et `google.be`** (DT 64 chacun) sont probablement des directories/citations automatiques — vérifier qu'elles pointent vers la bonne URL après migration
- **Google AI Overview** sous-représente encore CAD (visibilité 46.7 % vs 83.3 % sur ChatGPT). Enjeu de qualité éditoriale + schema markup + fraîcheur du contenu

---

*Document généré depuis le rapport Digistage du 22/01/2026. À mettre à jour au prochain rapport (mensuel).*
