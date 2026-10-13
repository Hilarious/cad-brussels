# CAD Brussels · Dossier de passation

> Pour **Jérôme Canon** (IT Lead) et **Florian Donckers** (développeur), qui reprennent le
> site le **13 octobre 2026**. À jour à cette date, faits vérifiés le jour même.
> Les consignes pour les outils de code, et les pièges à ne pas refaire, sont dans
> [`AGENTS.md`](./AGENTS.md). L'audit SEO de l'ancien site est dans
> [`SEO-AUDIT-2026.md`](./SEO-AUDIT-2026.md).

---

## En deux phrases

Le **CAD Brussels** est une école privée de design fondée en 1961 à Bruxelles, environ 160
étudiants, dirigée par **Eric Vanden Broeck**. Ce site est le POC construit par Audry avec
Claude, devenu le vrai site : il est en ligne, le CAD l'a relu deux fois, et il remplace
`cad.be` dès que le domaine bascule. Ce qu'il reste à faire est surtout technique, d'où la
passation.

---

## L'état réel au 13 octobre 2026

| | |
|---|---|
| Adresse | `cad-brussels.vercel.app`, `noindex` volontaire par un en-tête `X-Robots-Tag` lié à l'hôte Vercel. Il tombe tout seul quand `cad.be` pointe ici |
| `cad.be` | Sert toujours l'ancien WordPress. Bascule menée par **Eric** avec Infinite-IT, pas par nous |
| Code | GitHub `Hilarious/cad-brussels`, branche `main`. **Public**, pour avoir pu montrer le POC au client |
| Base | PostgreSQL chez **Neon**, branchée par l'intégration Vercel |
| Variables de production | **Seulement la base et `PAYLOAD_SECRET`** (liste Vercel relue le 13/10) |
| CI | 3 jobs verts sur 4. « Vérification interface » rouge, **53 problèmes** de référence |
| Contenu | Relecture du CAD (cahier V4 de Fabienne) intégrée le 13/10 **en français**. L'anglais reste à reprendre |

### Ce qui ne marche pas en production

| Manque | Conséquence | Ce qu'il faut |
|---|---|---|
| Aucun email (`RESEND_API_KEY` absente) | Une candidature arrive en base et **ne prévient personne**. Le candidat ne reçoit pas d'accusé. La newsletter en double confirmation est cassée | Une clé Resend, un domaine d'envoi authentifié, `ADMISSIONS_EMAIL=secretariat@cad.be` |
| Aucun stockage d'images (`S3_*` absentes) | Tout envoi d'image depuis l'admin échoue. Les photos ne peuvent pas entrer | Un bucket S3-compatible (R2 prévu) |
| Aucun anti-robot | Turnstile figure dans `.env.example` mais **n'existe pas dans le code**. Les formulaires publics sont ouverts | Le développer, puis les clés |
| `NEXT_PUBLIC_SITE_URL` absente | Plan du site et balises de partage incomplets | L'adresse définitive |

Les formulaires écrivent en base **avant** de tenter l'envoi : rien n'est perdu, tout est dans
l'admin sous `Applications` et `Leads`.

---

## Les accès, et ce qui est à régler en premier

| Brique | Où | Aujourd'hui | À faire |
|---|---|---|---|
| GitHub | `Hilarious/cad-brussels` | Compte utilisateur **partagé** « Hilarious », pas une organisation. Les 99 commits sont signés « Hilarious » | Décider public ou privé maintenant que le POC est montré. Comptes nominatifs, idéalement une organisation |
| Vercel | Projet `cad-brussels`, équipe Hilarious | ⚠️ Membres à vérifier | Jérôme et Florian dans l'équipe |
| Neon | Via l'intégration Vercel | ⚠️ Compte d'**une seule personne**, à identifier | Le rattacher à l'agence. Exporter une copie de la base hors de Neon |
| Admin Payload | `/admin` | Audry et Jérôme administrateurs | Un compte par personne. Cindy en éditrice |
| Clé d'API de production | Dans le `.env.local` d'Audry, sur un compte **admin** | Sert aux écritures par script | La révoquer, en créer une sur un compte `editor` si besoin |
| Domaine `cad.be` | Registrar OVH, zone DNS chez **Cloudflare** | Chez Infinite-IT, l'IT du CAD | Seuls A et CNAME bougent, **jamais les MX** (messagerie Microsoft 365 de l'école) |

---

## Le backlog, par priorité

| P | Sujet | Pourquoi | Dépend de |
|---|---|---|---|
| 1 | Brancher Resend | Aucune candidature n'alerte personne | Une clé et un domaine d'envoi. ⚠️ Authentifier `cad.be` touche au DNS de l'école |
| 1 | Stockage des images | Les photos du CAD ne peuvent pas entrer | Un bucket |
| 1 | Bascule de `cad.be` et redirections 301 de l'ancien site | Elle commande le calendrier | Eric, Infinite-IT |
| 2 | Turnstile sur les formulaires | Formulaire de candidature ouvert aux robots | Clés Cloudflare |
| 2 | Ajouter **Fashion Business** et **Interior Architecture 1 an** aux formulaires de candidature et d'information | Demandé par le CAD le 13/10. Un `select` est un `enum` : migration | Rien |
| 2 | Débordement de 55 px sur portable | Visible par tous les candidats, 36 des 53 problèmes de la CI | Rien |
| 3 | Reporter en anglais les corrections factuelles du 13/10 | L'anglais cite encore des marques partenaires et des workshops à Lisbonne et Tokyo | Validation du français par le CAD |
| 3 | Adresse `/fashion-management` vers le nom Fashion Business, avec redirection | Le programme a changé de nom | Nom acté par Eric |
| 3 | Copie de la base hors de Neon, restauration testée une fois | Aucune sauvegarde hors du fournisseur | Accès Neon |
| 3 | Six langues (IT, ES, DE, PT sur le parcours de recrutement) | Décidé en juillet, reporté | Relecteurs natifs |
| ⏸ | Fusion de trois masters en un seul (Image 3D Motion AI, Digital Brand Content, Event Management) | Pages, menu, formulaires, thèmes de couleur | **Décision et nom d'Eric** |

---

## Le calendrier

| Date | Jalon |
|---|---|
| 16/10/2026 | Textes et photos complets côté CAD (planning de Cindy) |
| 06/11/2026 | Accès techniques |
| 17/11/2026 | Tests par le CAD |
| 19/11/2026 | Mise en ligne prévue |
| 26 au 28/11/2026 | **SIEP de Bruxelles**, salon de l'orientation : l'échéance réelle d'Eric |

---

## Qui fait quoi désormais

| Domaine | Qui |
|---|---|
| Code, base, déploiements, variables, côté technique du domaine | **Jérôme** et **Florian** |
| Contenu : relecture, saisie dans l'admin, lien quotidien avec le CAD | **Cindy**, cheffe de projet |
| Décisions client | **Eric Vanden Broeck**, seul décideur. Fabienne Willaert relaie |
| Mémoire du POC, pourquoi des choix | **Audry** |

**Règle de cohabitation** : à partir du 13/10, rien n'arrive sur `main` en dehors de l'équipe
technique, et le contenu passe par l'admin. Le journal complet du POC (décisions, incidents,
leur raison) vit dans le dossier de travail d'Audry, hors du dépôt. Ce qui sert au code est
repris dans `AGENTS.md`.

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
- **Pas de référence Collège de Paris** : décision Eric mai 2026, le partenariat n'est plus communiqué. ⚠️ Le réseau CUMULUS, seul argument international jusqu'ici, est contesté par Fabienne le 13/10 (« on ne fait rien avec CUMULUS ») : à faire trancher par Eric avant de le retirer.

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

**Collections (11)** : `pages`, `posts`, `events`, `categories`, `media`, `users`, `subscribers`, `leads`, `applications`, `faculty`, `alumni`

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
- **Formulaires** : Turnstile (Cloudflare) prévu pour l'anti-spam, **pas encore écrit dans le code**.
- **Emails** : Resend via `RESEND_API_KEY`, repli silencieux sur la console sans clé. **La clé manque en production** au 13/10.
- **Payload admin** — accès uniquement via `/admin`, protégé par login. Créer les comptes Eric et Fabienne à la livraison.
- **Backup DB** : critique en prod. Neon garde un historique jamais vérifié, et **aucune copie n'existe hors de Neon**.

---

## Contacts projet

### CAD Brussels (client)

- **Eric Vanden Broeck** · directeur, seul décideur · eric.vandenbroeck@cad.be · +32 477 22 43 46
- **Fabienne Willaert** · secrétariat, relaie et relit · secretariat@cad.be · +32 2 640 40 32

### Hilarious

- **Jérôme Canon** · IT Lead, reprend le site · freeze@hilarious.be
- **Florian Donckers** · développeur, reprend le site
- **Cindy** · cheffe de projet du compte, contenu et relation client · cindy@hilarious.be
- **Audry Van Essche** · CEO, auteur du POC · joker@hilarious.be · +32 478 28 13 33

### Infrastructure et domaine

- **Bruno De Naeyer** · IT du CAD, Infinite-IT SRL · bruno@infinite-it.be · +32 2 897 62 50
- ⚠️ **Le domaine et l'hébergement quittent Infinite-IT.** C'est **Eric** qui mène cet échange : c'est une fin de prestation, pas une demande technique. Nous fournissons les enregistrements et les redirections quand il les demande.
- Le domaine est chez le registrar **OVH**, sa zone DNS est gérée dans **Cloudflare** : la bascule se joue là. **Ne modifier que les A et CNAME, les MX portent la messagerie Microsoft 365 de l'école.** Les six questions à poser à Bruno et l'ordre des opérations sont chez Audry, `CAD/ressources/acces-domaine-cad-be.md`.

### Charte print (référence uniquement)

- **Thomas Durieux** · Finlande Graphic Design · thomas@designbyfinlande.be · +32 477 43 83 67

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
