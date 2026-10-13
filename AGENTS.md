# AGENTS.md · Site du CAD Brussels

Consignes pour toute personne et tout agent de code (Claude Code, Codex, Copilot…) qui
travaille dans ce dépôt. À lire avant de toucher au code. L'état du projet, les accès et
le backlog sont dans [HANDOVER.md](./HANDOVER.md).

Chaque règle porte sa raison. Elles viennent toutes d'un incident déjà payé.

---

## Le projet en bref

- POC construit par Audry Van Essche avec Claude, d'avril à octobre 2026, devenu le vrai
  site. Repris le 13/10/2026 par **Jérôme Canon** (IT Lead) et **Florian Donckers**
  (développeur).
- En ligne sur `cad-brussels.vercel.app`, en `noindex` volontaire tant que `cad.be` sert
  l'ancien WordPress.
- Next.js 15 (App Router) · Payload 3 **dans le même process** (admin `/admin`, API `/api`)
  · PostgreSQL chez Neon via l'intégration Vercel · next-intl FR/EN · Tailwind 3 ·
  react-hook-form + zod · Vitest · Playwright.
- **Un push sur `main` est un déploiement de production.** `vercel-build` lance
  `clear-dev-sentinel.ts`, puis `payload migrate`, puis `next build`.

## Commandes

```bash
pnpm install --frozen-lockfile      # respecter le lockfile, voir plus bas
pnpm dev                            # site + admin en local, sur la base locale
pnpm typecheck && pnpm lint && pnpm test
pnpm verify:ui                      # le contrôle navigateur de la CI, en local
pnpm generate:types                 # après toute modification d'une collection
pnpm generate:importmap             # après tout composant d'admin ajouté
pnpm payload migrate:create <nom>   # tout changement de schéma
```

---

## Les règles qui ne se discutent pas

1. **Ne jamais faire pointer un `.env` local sur la base de production.** En développement,
   Payload synchronise le schéma tout seul. Il modifierait la vraie base et y poserait sa
   marque « dev », celle qui a bloqué les déploiements le 26/08/2026.
2. **Ne jamais lancer `pnpm seed`, `seed:all`, `seed:extras`, `reset:content` ni
   `fix:header` contre la production.** Ces scripts contiennent le contenu figé d'août et
   écrasent ce que le CAD a saisi depuis.
3. **Tout changement de schéma passe par une migration** dans `src/migrations/`, testée avec
   `NODE_ENV=production` sur une base vierge ou une branche Neon avant le push. Un champ
   `select` est un `enum` Postgres : **ajouter une option est un changement de schéma.**
4. **Ne pas retirer `clear-dev-sentinel.ts` de `vercel-build`.** Sans lui, Payload bloque
   indéfiniment un déploiement sur une base qui a connu une création automatique.
5. **Ne pas monter de version en même temps qu'on livre autre chose.** `package.json`
   demande Payload `^3.7`, la version installée est 3.84.1. Seul `pnpm-lock.yaml` tient
   l'ensemble. Une montée de version est un envoi à part, vérifié seul.
6. **Toute date d'événement affichée passe par `timeZone: FUSEAU_ECOLE`** (`src/lib/fuseau.ts`).
   Sans cette option, le même événement s'affiche à deux heures différentes selon la page
   (le serveur Vercel tourne en UTC).
7. **Appellations protégées.** Jamais « Bachelor », « Master » comme diplôme, ni « école
   supérieure » : le CAD n'a pas le droit de les employer. On écrit Undergraduate,
   Postgraduate, école de design privée. Un garde-fou corrige l'affichage
   (`src/lib/appellations.ts`, testé), mais `/api` sert le contenu brut : **la base doit
   rester propre.** Ne pas renommer les adresses `masters`, `home-living-design`,
   `masterclass-motion-design`, des liens en dépendent.
8. **Marque.** Outfit est la seule police. Logos officiels de `public/logo/`, via `<Logo>`,
   jamais redessinés. Palette : les 14 couleurs de `HANDOVER.md`, et jamais d'orange, de
   lime, de jaune, de cyan, de mint ni de magenta pour du texte courant sur fond clair
   (sous le seuil WCAG AA). **Aucune référence au Collège de Paris.** Pas de tiret long « — »
   dans le texte visible.
9. **Ne pas inventer de contenu factuel** : chiffres, partenaires, villes de workshop, dates,
   noms. La relecture du CAD du 13/10 a dû retirer des marques présentées comme partenaires
   et des workshops qui n'existaient pas. Tout texte nouveau est relu par Cindy, la cheffe
   de projet.

---

## Où vit un texte : le premier réflexe

```bash
grep -rn "la phrase exacte" src/
```

| Trouvé dans `src/` | Le texte est | On le modifie |
|---|---|---|
| Oui | En dur dans le code (accueil, à propos, admissions, contact, cours du soir, Bruxelles, légal…) | Commit, push, déploiement |
| Non | En base (13 pages programmes et hubs, événements, actualités, en-tête, pied de page, réglages) | Dans l'admin, par Cindy ou le CAD |

- `scripts/seed*.ts` sont une troisième source, **qui écrase la base**. Elle ne sert qu'à
  monter une base vierge.
- **Le statut Payload `_status: draft` ne dit pas si une page est en ligne.** Le site public
  filtre sur son propre champ `status`. Les pages en ligne portent toutes `_status: draft`.
- Les blocs `layout` des pages sont localisés au niveau du tableau : écrire le français
  ne touche pas l'anglais.
- Le bouton d'admin « Copier le français vers l'anglais » ne remplit que les champs vides,
  volontairement : une traduction automatique réintroduirait « Bachelor ».
- Lire la collection dans `src/collections/` avant d'écrire une requête. Un champ absent
  revient vide et se confond avec un champ vide (`startDate` existe, `startsAt` n'existe
  pas).

---

## Les pièges connus

- **Deux serveurs de développement sur le même dossier se détruisent** : erreurs 500 sur
  toutes les pages sans que le code soit en cause. Remède : arrêter l'un des deux, vider
  `.next`.
- **La CI a été rouge d'août au 13/10/2026 sur un seul job, « Vérification interface »,**
  avec 53 problèmes stables. Leurs trois causes sont corrigées dans la PR #1 : le contenu de
  démonstration avait un menu à sept entrées alors que la barre est calculée pour six (36
  débordements de 55 px à 1280 px), il créait la page du master Nantes sous `-postgraduate`
  alors que `next.config.ts` redirige vers `-master` (1 faux 404), et deux étiquettes étaient
  à 11 px (16 textes trop petits). ⚠️ À confirmer par la CI de cette PR. **Une fois verte,
  la garder verte** : un échec signale alors une vraie régression.
- **Le contenu de démonstration (`scripts/seed*.ts`) doit ressembler à la production.** La
  CI le charge pour tout vérifier : s'il diverge, elle signale des défauts qui n'existent pas
  en ligne, ou rate ceux qui existent.
- Le code accepte `DATABASE_URI` (local), puis `POSTGRES_URL`, puis `DATABASE_URL` (injectés
  par Vercel).
- Le stockage S3 est activé sans condition : sans identifiants, tout envoi d'image depuis
  l'admin échoue.
- `src/lib/email.ts` se rabat sur la console quand `RESEND_API_KEY` manque. C'est le cas en
  production : aucun email ne part, et rien ne le signale.

---

## Avant de dire « c'est fait »

- `pnpm typecheck`, `pnpm lint` et `pnpm test` verts.
- CI à 53 problèmes ou moins.
- Vérifié **sur le site en ligne** après déploiement, aux **deux endroits** où la donnée
  s'affiche quand c'est le cas (une fiche et une liste peuvent diverger).
- Les deux langues regardées.

## Ce qui demande un accord avant d'agir

- Toute écriture en base de production par script ou par l'API, et toute suppression de
  contenu. **Lire et conserver la valeur d'origine avant d'écrire** : il n'existe aucune
  copie du contenu hors de Neon.
- Tout changement sur le domaine `cad.be` : seuls les enregistrements A et CNAME bougent,
  **jamais les MX**, qui portent la messagerie Microsoft 365 de l'école.
- Tout ce qui change ce que voit le CAD sans passer par Cindy.
