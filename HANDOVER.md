# CAD Brussels — Handover technique et design

> Document destiné au développeur mainteneur reprenant le projet.
> Version mai 2026 · Hilarious Agency × CAD Brussels

---

## En deux phrases

Le **CAD Brussels** est une école supérieure d'art et de design fondée en 1961 à Bruxelles, dirigée par **Eric Vanden Broeck** (Dean) et coordonnée par **Fabienne Willaert** (Admin). **Hilarious Agency** refond le site cad.be sur stack Next.js 15 + Payload v3 + Postgres, en parallèle d'un travail de Digital Guidelines pour aligner toutes les communications digitales sur la charte print officielle de **Thomas Durieux** (Finlande Graphic Design, juin 2024).

---

## Décisions design verrouillées

Ces décisions ont été validées avec Eric (Dean) et sont **verrouillées**. Toute modification doit passer par une revalidation formelle.

- **Logo** — Oldblend (charte Thomas Durieux). Fichiers officiels dans `public/logo/` (`cad-monogram.png`, `cad-logo-full.png`, `cad-logo-65.png`). Ne jamais reconstruire en SVG, toujours utiliser les fichiers officiels via le composant `<Logo>`.
- **Typographie digitale** — **Outfit** (Google Fonts). Typo unique pour tout le digital, chargée via `next/font/google` (self-hostée, aucune requête vers les serveurs Google en production). Ne pas ajouter d'autres polices.
- **Charte print** — inchangée, celle de Thomas Durieux (Oldblend + Geogrotesque). Le digital et le print ont volontairement une identité typographique distincte pour économiser les licences de Geogrotesque en digital.
- **Palette** — 14 couleurs CAD officielles (voir section dédiée).
- **Design tokens Tailwind** — `ink` (texte), `paper` (fond), `accent` (couleur de marque, variable par programme via classes `.theme-*`).
- **Œil graphique + grille 3×3** — signature visuelle de Thomas, à conserver sur les supports print clés uniquement. Pas d'application systématique en digital.
- **Grille 12 colonnes** — structure digitale standard (`<Grid>` / `<Col>`), 12 desktop / 8 tablet / 4 mobile, gouttière 24px.
- **Pas de référence Collège de Paris** — décision Eric mai 2026, le partenariat n'est plus communiqué. Le réseau CUMULUS (200+ écoles d'art) reste le seul argument international.

---

## Palette CAD — 14 couleurs officielles

Source : conversion RGB → HEX depuis la charte Thomas Durieux (juin 2024). Intégrée dans `tailwind.config.ts` (composantes RGB pour opacité Tailwind) et `src/app/(frontend)/globals.css` (variables CSS pour overrides locaux).

| # | Nom | HEX | Usage |
|---|---|---|---|
| 1 | Black | `#000000` | Texte print · Logo |
| 2 | White | `#FFFFFF` | Fond clair · Reverse logo |
| 3 | Cyan | `#00FFFF` | Accent digital |
| 4 | Navy | `#2F346D` | Architecture d'intérieur |
| 5 | Orange | `#FF8000` | Master Event Management |
| 6 | Violet | `#8000FF` | Communication & Digital |
| 7 | Pink | `#FF277F` | Fashion · 65 ans · accent par défaut |
| 8 | Magenta | `#FF00FF` | Lifelong Learning |
| 9 | Azure | `#0080FF` | Master Image 3D Motion AI · 65 ans |
| 10 | Red | `#FF1F20` | Journées Portes Ouvertes (alert) |
| 11 | Lime | `#80FF00` | Success |
| 12 | Yellow | `#FFFF00` | Spotlight |
| 13 | Blue | `#0000FF` | Variante azure |
| 14 | Mint | `#00FF80` | Master Home & Living |

### Notes d'accessibilité WCAG

- **Black officiel** = `#000000` en print, mais token `ink` côté digital = `#0A0A0A` (plus doux à l'écran, moins de fatigue visuelle).
- **Couleurs CTA validées WCAG AA** sur fond blanc : Black, Navy, Pink, Violet.
- **Couleurs à éviter pour texte courant** sur fond blanc (contraste < 4.5:1) : Orange, Lime, Yellow, Cyan, Mint, Magenta. À réserver pour fonds colorés ou typo noire sur fond couleur.

---

## Système de thèmes `.theme-*`

Décision verrouillée mai 2026. Chaque page programme applique automatiquement la classe `.theme-*` sur son wrapper via le helper `themeForSlug()` dans `src/lib/program-themes.ts`. Le composant `<RenderBlocks>` et tous les `text-accent` / `bg-accent` basculent automatiquement.

### Mapping programme → thème → couleur

| Programme / Contexte | Classe | Couleur |
|---|---|---|
| Bachelor Architecture d'intérieur | `theme-interior` | Navy |
| Bachelor Communication & Digital | `theme-communication` | Violet |
| Bachelor Mode & Accessoires | `theme-fashion` | Pink |
| Master Interior Architecture 2 ans | `theme-interior` | Navy |
| Master Home & Living | `theme-home-living` | Mint |
| Master Digital Brand Content | `theme-communication` | Violet |
| Master Image 3D Motion AI | `theme-image-3d` | Azure |
| Master Event Management | `theme-event` | Orange |
| Spécialisation Fashion Management | `theme-fashion` | Pink |
| Lifelong Learning (hub + modules) | `theme-lifelong` | Magenta |
| Édition 65 ans (homepage 2026) | `theme-65` | Pink |
| Journées Portes Ouvertes | `theme-jpo` | Red |

### Usage dans le code

```tsx
import { themeForSlug } from '@/lib/program-themes'

<div className={themeForSlug(page.slug)}>
  {/* tout ce qui est dans ce wrapper aura --accent défini automatiquement */}
  <button className="bg-accent text-paper">CTA coloré</button>
  <p className="text-accent">Texte accent</p>
</div>
```

Toute future modification du mapping programme → couleur doit passer par une mise à jour de ce document ET de `src/lib/program-themes.ts`.

---

## Personas cibles

4 profils étudiants qui structurent toutes les décisions produit et éditoriales.

| Persona | Âge · Lieu | Programme visé | Message-clé |
|---|---|---|---|
| **Léa** | 17 · Bruxelles | Fashion & Textile Design | « Inspire-toi » |
| **Hugo** | 19 · Liège | Interior Architecture & Design | « Repars du bon pied » |
| **Sofia** | 22 · Milan / Bruxelles | Master double diplôme Nantes | « Pense international » |
| **Justine** | 18 · Uccle | Communication & Digital Design | « Rejoins l'ambiance » |

**Justine** est un profil crucial à ne pas oublier : parents-redirigée, levier décisionnel = vie d'école + soirées + crédibilité institutionnelle pour les parents. Toute décision UX sur la homepage doit garder ce persona en tête.

---

## Conventions éditoriales

**À respecter partout dans le code visible** (labels, titres, boutons, contenu inline, seeds Payload).

- **Pas d'em-dashes** (`—`) dans le contenu visible. Utiliser `·`, `,`, `.`, `à`, ou reformuler.
- **« Vous »** institutionnel mais adressé. Jamais « on » ni « nous » (sauf citations d'alumni).
- **Verbes d'action** : « vous apprendrez à », « vous deviendrez », « vous réaliserez ».
- **Inclusivité** : `étudiant·e`, `chef·fe`, `designer·euse`.
- **« Professionnels en activité »** et non « praticiens » (insistance client sur le contact avec le marché).
- **« Admissions »** dans le header (jamais « Candidater »). **« Postuler en ligne »** sur les CTAs.
- **Chiffres officiels** : 1961 (fondation), 160 étudiants, 50 professeurs, +90 % insertion. Ces chiffres sont utilisés dans le trust band de la homepage et diverses landing pages. À synchroniser si mis à jour côté client.

---

## Conventions de design (CSS / Tailwind)

| Aspect | Convention |
|---|---|
| Hero pages éditoriales niveau 1 | `py-20 md:py-28`, H1 `text-6xl`, eyebrow `text-accent` |
| Hero pages listings | `py-20 md:py-28`, H1 `text-5xl` |
| Hero sous-pages (avec breadcrumb) | `py-16`, H1 `text-5xl` |
| Hero homepage | `py-20 md:py-32`, H1 `text-6xl` (le plus grand) |
| Marge eyebrow → titre | `mt-4` |
| Marge titre → sous-titre | `mt-6` |
| CTA bouton primary | `bg-ink text-paper`, rounded-full (lisible sur tout fond accent) |
| CTA bouton secondary | `border border-ink/20`, transparent |
| Cartes | `rounded-2xl border border-ink/10 bg-paper` |
| Blocs CTA fin de page | `<PageCTA tone="accent">` ou `<AdmissionCTA>` (jamais custom) |

---

## Composants UI clés (à réutiliser, ne pas dupliquer)

Composants partagés dans `src/components/` :

- **`<AdmissionCTA variant="primary | soft | contextual" />`** — bandes admission, fond accent vivant
- **`<PageCTA tone="accent | soft" nested? />`** — bloc CTA de fin de page standardisé
- **`<Logo variant="65 | wordmark | monogram" size="sm | md | lg" />`** — logo officiel par contexte
- **`<Grid>` + `<Col span={1-12} offset={0-11} />`** — grille 12 colonnes structurelle
- **`<NewsletterForm variant="full | compact" />`** — formulaire newsletter (double opt-in)
- **`<NavItem>`** — dropdown menu avec hover bridge + a11y clavier
- **`<EventCard>`** — variantes `featured | listing | compact`
- **`<RenderBlocks>`** — rendu polymorphe des blocs CMS Payload
- **`<ContactForm>`, `<BreakfastForm>`, `<ApplicationForm>`, `<LeadForm>`** — formulaires dédiés avec validation Zod
- **`<LanguageSwitcher>`** — bascule FR/EN
- **`<ImagePlaceholder ratio="16:9 | 4:5 | 3:2 | 1:1" caption="..." />`** — placeholder image en attendant les vraies photos

**Règle importante** : préférer les composants partagés (`<PageCTA>`, `<AdmissionCTA>`, `<Grid>`) plutôt que des blocs custom. Ça évite la dérive visuelle sur ~40 pages.

### Helpers dans `src/lib/`

- **`themeForSlug(slug)`** — retourne la classe `.theme-*` pour un slug de programme (voir section thèmes ci-dessus)
- **`email.ts`** — wrapper `sendEmail` (Resend ou console-fallback si pas de clé API)
- **`newsletter-emails.ts`** — templates HTML des emails newsletter (respectent les couleurs CAD officielles)

---

## Architecture Payload

**Collections (9)** : `pages`, `posts`, `events`, `categories`, `media`, `users`, `subscribers`, `leads`, `applications`

**Globals (3)** : `header`, `footer`, `site-settings`

**Locale** : natif via Payload v3 multi-locale (fr / en, defaultLocale = fr).

**~40 pages livrées** avec contenu réel cad.be, bilingue FR + EN sur 100 % du contenu.

### Blocs de contenu réutilisables

Dans `src/blocks/` :

- `Hero` — grand bloc d'ouverture avec titre, sous-titre, éventuellement image
- `RichText` — texte libre édité via Lexical
- `CTA` — bloc bouton d'action
- `FAQ` — accordéon questions/réponses
- `FeatureList` — liste de features avec icônes
- `Quote` — citation avec attribution
- `Stats` — chiffres clés

Chaque bloc est configuré dans `config.ts` (schéma Payload) et rendu dans `<RenderBlocks>` (composant polymorphe).

### Routes principales

- **Dynamique CMS** : `/[locale]/[...slug]` — toutes les pages seedées, programmes Bachelor/Master
- **Hand-codées** : `/admissions`, `/admissions/frais`, `/apply`, `/breakfast`, `/professeurs`, `/alumni`, `/pourquoi-le-cad`, `/lifelong-learning/*`, `/etudier-a-bruxelles/*`, `/legal`, `/privacy`
- **Utilitaires** : `/contact`, `/newsletter`, `/info-pack`, `/events`, `/news/*`

---

## Décisions techniques verrouillées

- **Framework** : Next.js 15 (App Router, RSC)
- **Langage** : TypeScript 5.6, strict mode
- **UI** : React 19 + Tailwind CSS 3.4
- **CMS** : Payload v3 (headless, TypeScript natif)
- **DB** : PostgreSQL 16 (multi-locale natif via Payload)
- **i18n** : next-intl 3.26 (FR/EN, `localePrefix: 'always'`)
- **Forms** : react-hook-form + Zod
- **Rich text** : Lexical (via Payload)
- **Optimisation images** : `next/image` + Sharp (auto AVIF/WebP, lazy par défaut)
- **Stockage médias** : S3-compatible (R2 ou Scaleway, à confirmer au déploiement)

---

## Décisions ouvertes (à trancher avec Eric)

- **Hébergement** : Vercel (~50 €/mois géré) vs Scaleway (RGPD natif, ~20 €/mois) vs Self-hosted (VPS + Coolify, ~10 €/mois)
- **Monitoring** : Sentry + Plausible recommandés mais non confirmés
- **Compression upload Payload** : hook Sharp à mettre en place quand les vraies images arrivent (max 1600px, JPEG q80)

---

## État d'avancement (mai 2026)

### Fait

- Audit complet du site cad.be actuel (typographique + visuel + UX)
- Charte Thomas Durieux 2024 analysée et intégrée
- 3 logos officiels CAD intégrés via `<Logo>` (monogramme, full, 65 ans)
- Personas validés (Léa, Hugo, Sofia, Justine)
- Stack technique documentée et implémentée
- Sitemap des ~40 pages cartographié
- Palette 14 couleurs intégrée (Tailwind + CSS variables)
- Système `.theme-*` par programme déployé (9 thèmes)
- Grille 12 colonnes structurée (`<Grid>` / `<Col>`)
- Tous les blocs CTA harmonisés (`<PageCTA>` / `<AdmissionCTA>`)
- Pages stratégiques créées : Admissions hub + 4 portes, Pourquoi le CAD, Alumni, Professeurs, Breakfast, Apply, Frais, Legal, Privacy
- Ton « vous » adressé sur 100 % des pages programmes
- Référence Collège de Paris retirée (nettoyée sur tout le repo)
- Contenu bilingue FR/EN complet sur toutes les pages livrées

### En cours

- Intégration des vraies photos (alumni, professeurs, projets étudiants, hero images)
- Wireframes des pages clés (placeholders à remplir avec screenshots)
- Retouche photo pour cohérence (Phase 1 : 15 images récupérables du site actuel, Phase 2 : shoot pro de 100+ nouvelles photos)

### À faire (roadmap)

1. **Photos** — remplacer les `<ImagePlaceholder>` par les vraies images (via Payload media collection, upload via back-office admin)
2. **Compression images** — activer le hook Sharp de compression à l'upload dans Payload (max 1600px largeur, JPEG q80, génération auto WebP/AVIF via Next Image)
3. **Wireframes** — remplir les placeholders des livrables présentation avec les screenshots des vraies pages
4. **Validation client** — présenter à Eric et Fabienne pour signoff final
5. **Hébergement** — trancher Vercel / Scaleway / self-hosted
6. **Monitoring** — configurer Sentry (erreurs) + Plausible (analytics RGPD-friendly)
7. **Migration WordPress → Next.js** — définir le workflow de bascule (DNS, redirects 301 des anciennes URLs, période de staging)
8. **Staging** — mettre en place un environnement staging avant le go-live
9. **Backup DB** — configurer un backup automatique de Postgres en production
10. **Tests** — étoffer la suite Vitest (unitaires) et Playwright (e2e) sur les parcours critiques (admissions, contact, newsletter)

---

## Migration WordPress → Next.js — notes

Le site actuel `cad.be` est sur WordPress. La bascule doit préserver le SEO existant.

- **Redirects 301** — configurer dans `next.config.ts` sous `redirects()`. Déjà commencé : voir `/fr/living-in-brussels` → `/fr/etudier-a-bruxelles`, `/fr/galerie` → `/fr/programmes`, etc.
- **Sitemap.xml** — généré dynamiquement par `src/app/sitemap.ts`. Vérifier avant go-live que tous les slugs FR/EN y apparaissent.
- **Robots.txt** — dans `src/app/robots.ts`. Bloquer `/admin` en production.
- **Meta title/description** — champs SEO natifs dans Payload (voir `src/lib/fields/seo.ts`).
- **OG tags** — gérés par le `metadata` du layout et par page. Vérifier avec l'outil de debug Facebook et Twitter Card Validator.
- **Google Search Console** — inscrire le nouveau domaine dès la mise en staging pour préparer la bascule.

---

## Sécurité et RGPD

- **HTTPS + HSTS** — headers déjà configurés dans `next.config.ts`
- **CSP** — à ajouter en production (Content-Security-Policy stricte)
- **Consent cookies** — nécessaire si intégration Google Analytics. Plausible ne nécessite pas de consentement (analytics anonyme sans cookies).
- **Formulaires** — Turnstile (Cloudflare) pour anti-spam. Clés à configurer dans `.env`.
- **Emails** — Resend configuré via `RESEND_API_KEY`. Fallback console si non configurée (dev).
- **Payload admin** — accès uniquement via `/admin`, protégé par login. Créer les comptes Eric et Fabienne à la livraison.
- **Backup DB** — critique en prod. Configurer selon l'hébergeur choisi (snapshot quotidien minimum).

---

## Contacts projet

### CAD Brussels (client)

- **Eric Vanden Broeck** — Dean — eric.vandenbroeck@cad.be — +32 477 22 43 46
- **Fabienne Willaert** — Admin — secretariat@cad.be — +32 2 640 40 32

### Hilarious Agency

- **Audry Van Essche** — Creative Manager / pilote — joker@hilarious.be — +32 478 28 13 33
- **Yannick Chan** — Intégration / maintenance — yannick@hilarious.be — +32 478 31 00 35

### Charte print legacy (référence uniquement)

- **Thomas Durieux** — Finlande Graphic Design — thomas@designbyfinlande.be — +32 477 43 83 67

---

## Ressources externes

- Site actuel (à remplacer) : https://cad.be
- Charte print de référence : `DOSSIER-CG-LOGO-CAD.pdf` (dans le dossier Google Drive projet)
- Livrables de présentation : `CAD_Digital_Guidelines_v8.pptx` + `CAD_New_Website_Spec.pptx`
- Réseau CUMULUS (200+ écoles d'art) : https://cumulusassociation.org

---

## Note pour la prochaine reprise

- **Ne pas modifier la charte Thomas Durieux** pour le print (verrouillée)
- **Outfit reste la seule typo digitale** — ne plus proposer d'alternatives (Inter, Sora, etc.) sauf demande explicite du client
- **Le logo CAD officiel reste celui des fichiers `public/logo/`** — ne pas tenter de le reconstruire en SVG
- **Pas de référence Collège de Paris** dans les nouveaux contenus (décision Eric mai 2026)
- **Pas d'em-dashes** (`—`) dans le contenu visible du site
- **Justine (persona Uccle)** : à garder en tête à chaque décision UX (levier vie d'école + soirées + crédibilité pour parents)
- **Préférer composants partagés** aux blocs custom pour éviter la dérive visuelle
