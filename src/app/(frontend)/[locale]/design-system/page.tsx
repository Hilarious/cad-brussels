import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Grid, Col } from '@/components/grid'
import { ImagePlaceholder } from '@/components/image-placeholder'

export const metadata: Metadata = {
  title: 'Design System · CAD Brussels',
  description:
    'Bibliothèque interne de patterns éditoriaux texte/image. Usage interne uniquement.',
  // Page volontairement non indexée (référence interne)
  robots: { index: false, follow: false },
}

/**
 * /design-system — Bibliothèque interne de patterns éditoriaux.
 *
 * Pas de lien depuis la nav. Accessible uniquement par URL directe.
 * Sert de référence partagée entre :
 *  - Audry / Hilarious (DA)
 *  - Yannick (intégration)
 *  - Photographe (brief shooting)
 *  - Eric / Fabienne (validation visuelle)
 *
 * Chaque pattern est nommé, expliqué, et utilise des `<ImagePlaceholder>`
 * pour signaler clairement les zones image avec leur ratio attendu.
 */
export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <article className="container py-16">
      {/* Hero */}
      <header className="max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          Design System · usage interne
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
          Patterns éditoriaux texte / image
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-ink/70">
          Deux familles de patterns : <strong>classiques</strong> qui
          rassurent et structurent la lecture, <strong>audacieux</strong>{' '}
          qui surprennent et signent la posture créative. Le bon site
          alterne les deux familles.
        </p>
        <p className="mt-4 max-w-3xl text-sm text-ink/60">
          Cette page n'est pas indexée et n'apparaît pas dans la navigation.
          Elle reste accessible aux mainteneurs via URL directe.
        </p>
      </header>

      {/* Family banner — Classiques */}
      <section className="mt-20 border-t border-ink/20 pt-10">
        <p className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Famille 1 · 5 patterns
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl">
          Les classiques qui rassurent.
        </h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Structure éditoriale lisible, hiérarchie claire, codes des grands
          magazines de design. À utiliser pour les 70% du contenu : pages
          programme, About, articles. C'est ce que les parents et les
          recruteurs attendent.
        </p>
      </section>

      {/* Pattern A — Full-bleed */}
      <PatternSection
        index="A"
        name="Image full-bleed pleine largeur"
        when="Pause respiratoire entre deux longues sections texte. Idéal pour un visuel emblématique (campus, défilé, atelier en pleine action). Crée un moment de souffle."
        ratio="21:9 ou 16:9 selon la dramatisation souhaitée"
      >
        <div className="-mx-4 md:-mx-8 xl:-mx-12">
          <ImagePlaceholder
            ratio="21:9"
            caption="Vue panoramique campus / défilé public / atelier"
          />
        </div>
      </PatternSection>

      {/* Pattern B — Asymétrique avec offset */}
      <PatternSection
        index="B"
        name="Image asymétrique, texte qui déborde"
        when="Quand l'image et le texte ont un poids éditorial égal mais qu'on veut éviter le 50/50 banal. L'image prend 7 colonnes, le texte 5, et le texte démarre plus haut que l'image (effet d'imbrication)."
        ratio="3:4 ou 4:5 pour l'image (portrait)"
      >
        <Grid>
          <Col span={7} spanMd={8}>
            <ImagePlaceholder
              ratio="4:5"
              caption="Projet étudiant en cours · atelier"
            />
          </Col>
          <Col span={5} spanMd={8} className="lg:pt-12">
            <p className="text-sm uppercase tracking-widest text-accent">
              Atelier
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              Le projet n'attend pas le diplôme.
            </h2>
            <p className="mt-4 text-ink/80">
              Dès la première année, vous travaillez sur des briefs réels.
              Des marques partenaires apportent leurs commandes, vous les
              traitez comme une agence le ferait : recherche, proposition,
              défense, livrable.
            </p>
            <p className="mt-4 text-ink/80">
              Le résultat ? À la sortie, vous n'avez pas un dossier d'école.
              Vous avez un portfolio de projets que vous pouvez défendre
              devant n'importe quel recruteur.
            </p>
          </Col>
        </Grid>
      </PatternSection>

      {/* Pattern C — Citation visuelle (texte sur fond image) */}
      <PatternSection
        index="C"
        name="Citation visuelle, texte sur fond image"
        when="Témoignage fort, manifeste, accroche émotionnelle. Image en arrière-plan avec overlay sombre, texte court par-dessus. Format hero secondaire."
        ratio="16:9 ou 21:9 (paysage immersif)"
      >
        <div className="relative overflow-hidden rounded-2xl">
          {/* Placeholder fond */}
          <ImagePlaceholder
            ratio="16:9"
            caption="Étudiant·e en plein travail · regard concentré"
            className="rounded-none border-0"
          />
          {/* Overlay sombre + texte */}
          <div className="absolute inset-0 flex items-end bg-ink/40 p-8 md:p-16">
            <div className="max-w-2xl text-paper">
              <p className="text-sm uppercase tracking-widest text-paper/70">
                Témoignage · Promo 2023
              </p>
              <blockquote className="mt-4 font-display text-2xl leading-snug md:text-4xl">
                « Au CAD, j'ai appris à défendre mes idées devant un jury
                de pros. Aujourd'hui, je dirige des campagnes pour des
                marques que j'admirais quand j'étais étudiante. »
              </blockquote>
              <p className="mt-6 text-sm text-paper/80">
                Inès Daems, Art Director chez Mortierbrigade
              </p>
            </div>
          </div>
        </div>
      </PatternSection>

      {/* Pattern D — Mosaïque (2×2 ou 3×1) */}
      <PatternSection
        index="D"
        name="Mosaïque de petits visuels"
        when="Effet « contact sheet » : montre la diversité des projets ou des moments. Idéal pour sections projets dans les pages programmes, vie d'école, ou portraits alumni. Mix de ratios autorisé."
        ratio="Carré 1:1 (uniforme) ou mix portrait/paysage (jeu)"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ImagePlaceholder ratio="1:1" caption="Détail · maquette" />
          <ImagePlaceholder ratio="1:1" caption="Atelier mode · couture" />
          <ImagePlaceholder ratio="1:1" caption="Plan technique · projet" />
          <ImagePlaceholder ratio="1:1" caption="Défilé public · backstage" />
        </div>
        <p className="mt-6 max-w-2xl text-sm italic text-ink/60">
          Variante : mêmes 4 images mais en mix de ratios (1:1, 2:3, 4:3, 1:1)
          pour casser la régularité — voir le bloc Galerie sur la page
          chaque page programme.
        </p>
      </PatternSection>

      {/* Pattern E — Portrait + texte serré */}
      <PatternSection
        index="E"
        name="Image portrait + texte serré"
        when="Article éditorial type Domus, Wallpaper. Image verticale à gauche sur 4-5 colonnes, texte long à droite sur 6-7 colonnes avec offset. Pour les portraits de profs, alumni, ou articles longs."
        ratio="2:3 (portrait éditorial classique)"
      >
        <Grid>
          <Col span={5} spanMd={8}>
            <ImagePlaceholder
              ratio="2:3"
              caption="Portrait · Charlotte Lemoine, prof"
            />
          </Col>
          <Col span={6} offset={6} spanMd={8}>
            <p className="text-sm uppercase tracking-widest text-accent">
              Portrait · Architecture d'intérieur
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              Charlotte Lemoine
            </h2>
            <p className="mt-2 text-ink/60">
              Architecte d'intérieur fondatrice · Studio CL Interiors,
              Bruxelles
            </p>
            <div className="mt-6 space-y-4 text-ink/80">
              <p>
                Charlotte enseigne l'atelier de projet en deuxième et
                troisième année. Le mardi soir, elle débriefe les
                productions de la semaine avec son expérience du lundi en
                agence.
              </p>
              <p>
                « Je leur apprends à voir avant de leur apprendre à dessiner.
                La technique vient ensuite, naturellement. Ce qui manque
                souvent aux jeunes designers, c'est le regard. »
              </p>
              <p>
                Diplômée de La Cambre en 2008, elle a co-fondé Studio CL
                Interiors en 2015. Spécialisée dans les projets résidentiels
                haut de gamme et les flagship stores.
              </p>
            </div>
          </Col>
        </Grid>
      </PatternSection>

      {/* ─────────── Famille 2 : les audaces ─────────── */}
      <section className="mt-32 border-t border-ink/20 pt-10">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Famille 2 · 4 patterns
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl">
          Les audaces qui surprennent.
        </h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Ruptures graphiques qui signent « école d'art ». À utiliser
          parcimonieusement : 1 à 2 audaces par page, en alternance avec
          les classiques. C'est ce qui distingue le CAD d'une école de
          commerce avec une jolie photo.
        </p>
      </section>

      {/* Pattern F — Typo géante hors grille */}
      <PatternSection
        index="F"
        name="Typo géante hors grille"
        when="Un mot ou une phrase courte en très gros. Aucune image. Pure typographie. À utiliser comme respiration audacieuse entre deux blocs texte denses, ou comme hero secondaire fort. Style ECAL graduation, Pentagram."
        ratio="Pas d'image · text-7xl à text-9xl"
      >
        <div className="-mx-4 overflow-hidden md:-mx-8 xl:-mx-12">
          <div className="bg-paper py-16 md:py-24">
            <p className="px-4 text-sm uppercase tracking-widest text-accent md:px-8">
              Posture
            </p>
            <p className="mt-6 px-4 font-display text-[18vw] font-bold leading-[0.85] tracking-tight text-ink md:px-8">
              On forme<br />
              le regard.
            </p>
          </div>
        </div>
      </PatternSection>

      {/* Pattern G — Image décalée hors cadre */}
      <PatternSection
        index="G"
        name="Image décalée hors cadre"
        when="Une image qui sort de la grille : démarre dans le container puis déborde vers l'extérieur sur un côté. Casse la régularité, crée du mouvement. Idéal pour une image emblématique en milieu de page programme."
        ratio="3:2 ou 4:3 (paysage)"
      >
        <Grid>
          <Col span={5} spanMd={8} className="lg:pt-12">
            <p className="text-sm uppercase tracking-widest text-accent">
              Pédagogie
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              L'atelier, avant tout.
            </h2>
            <p className="mt-4 text-ink/80">
              Au CAD, vous passez l'essentiel de votre temps en atelier. Pas
              dans un amphi, pas devant un écran. Vos mains apprennent en
              même temps que votre tête.
            </p>
            <p className="mt-4 text-ink/80">
              C'est la condition pour devenir designer, pas juste pour le
              dire sur un CV.
            </p>
          </Col>
          {/* Image qui déborde à droite */}
          <Col span={7} spanMd={8} className="lg:-mr-8 xl:-mr-12">
            <ImagePlaceholder
              ratio="3:2"
              caption="Atelier · vue large, étudiants en action"
            />
          </Col>
        </Grid>
      </PatternSection>

      {/* Pattern H — Citation typographique massive */}
      <PatternSection
        index="H"
        name="Citation typographique massive"
        when="Une citation en très gros, en couleur accent, mise en scène typographique. Pas de photo de l'auteur, juste le verbe. À utiliser pour un témoignage signature ou un manifeste fort. Pleine couleur ou fond paper."
        ratio="Pas d'image · text-5xl à text-7xl"
      >
        <div className="rounded-2xl bg-accent p-12 text-paper md:p-20">
          <p className="text-sm uppercase tracking-widest text-paper/80">
            Témoignage
          </p>
          <blockquote className="mt-8 font-display text-4xl font-bold leading-[0.95] md:text-6xl xl:text-7xl">
            <span className="text-paper/60">«</span> Au CAD,<br />
            j'ai appris<br />
            <span className="text-paper">à voir</span>. <span className="text-paper/60">»</span>
          </blockquote>
          <p className="mt-12 text-sm uppercase tracking-widest text-paper/80">
            Maya Tanaka · diplômée 2023 · junior designer chez Maison Margiela
          </p>
        </div>
      </PatternSection>

      {/* Pattern I — Mosaïque irrégulière */}
      <PatternSection
        index="I"
        name="Mosaïque irrégulière, grille libre"
        when="Pas une grille 2x2 sage. 5 images de tailles différentes dans une grille libre, avec une grosse qui ancre la composition et des petites qui jouent autour. Effet « moodboard » qui dit immédiatement « école créative »."
        ratio="Mix : 1 grande 4:5 + 4 carrées 1:1, ou 1 grande 16:9 + 3 portraits 2:3"
      >
        <div className="grid grid-cols-6 gap-3 md:gap-4">
          {/* Grande image à gauche, sur toute la hauteur */}
          <div className="col-span-6 md:col-span-3 md:row-span-2">
            <ImagePlaceholder
              ratio="4:5"
              caption="Projet star · collection mode 3ème année"
              className="h-full"
            />
          </div>
          {/* 4 petites images à droite */}
          <div className="col-span-3 md:col-span-3">
            <ImagePlaceholder ratio="1:1" caption="Détail · matière" />
          </div>
          <div className="col-span-3 md:col-span-3">
            <ImagePlaceholder ratio="1:1" caption="Atelier · maquette" />
          </div>
          <div className="col-span-3 md:col-span-2">
            <ImagePlaceholder ratio="1:1" caption="Croquis main" />
          </div>
          <div className="col-span-3 md:col-span-4">
            <ImagePlaceholder
              ratio="16:9"
              caption="Mise en situation · espace"
            />
          </div>
        </div>
      </PatternSection>

      {/* ─────────── Recettes d'équilibre ─────────── */}
      <section className="mt-32 border-t border-ink/20 pt-10">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Recettes d'équilibre
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl">
          Comment doser classique et audace.
        </h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          La règle : sur une page longue (5 à 7 sections après le hero),
          viser <strong>70% classique</strong> pour la lisibilité et la
          confiance, <strong>30% audace</strong> pour l'émotion et la
          mémoire. Ni trop sage (école de commerce), ni trop wild (portfolio
          d'étudiant).
        </p>
      </section>

      <section className="mt-12 max-w-5xl">
        <ul className="space-y-10">
          <RecipeRow
            page="Page Home"
            classics={['A · Full-bleed campus', 'D · Mosaïque 4 projets']}
            audaces={['F · Typo géante manifeste', 'H · Citation massive']}
            verdict="Mix riche pour la vitrine principale. 1 audace toutes les 2 sections."
          />
          <RecipeRow
            page="Page programme"
            classics={[
              'B · Asymétrique (intro)',
              'D · Mosaïque projets étudiants',
              'E · Portrait responsable',
            ]}
            audaces={['G · Image décalée (milieu)']}
            verdict="Plutôt classique. 1 seule audace qui marque le projet phare."
          />
          <RecipeRow
            page="Page About / Pourquoi le CAD"
            classics={['A · Full-bleed campus', 'E · Portrait directeur']}
            audaces={['F · Typo géante (manifeste)', 'H · Citation alumni']}
            verdict="Une page institutionnelle qui ose. Les audaces signent l'ADN art."
          />
          <RecipeRow
            page="Page Alumni / Professeurs"
            classics={['E · Portrait + bio (×8 à 12)']}
            audaces={['I · Mosaïque irrégulière en intro']}
            verdict="Galerie classique structurée, mais ouverture en mosaïque libre pour casser l'effet annuaire."
          />
          <RecipeRow
            page="Article news long"
            classics={['B · Asymétrique', 'A · Full-bleed milieu']}
            audaces={['H · Citation typographique en pivot']}
            verdict="Lecture confortable, audace pour faire pivoter le récit au tiers."
          />
        </ul>
      </section>

      {/* Combinaisons recommandées (existant) */}
      <section className="mt-32 max-w-4xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          Anciennes recommandations
        </p>
        <h2 className="mt-4 font-display text-3xl md:text-4xl">
          Comment combiner les patterns dans une page longue
        </h2>
        <p className="mt-6 text-ink/80">
          Une page éditoriale de qualité (Pourquoi le CAD, pages programmes,
          articles news) devrait alterner au moins <strong>3 patterns différents</strong>
          {' '}pour éviter la monotonie visuelle. Quelques compositions
          éprouvées :
        </p>

        <ul className="mt-8 space-y-4 text-ink/80">
          <li className="border-t border-ink/10 pt-4">
            <strong>Page programme</strong> : Hero texte → Pattern B
            (asymétrique : programme + projet emblématique) → Pattern D
            (mosaïque 4 projets étudiants) → Pattern E (portrait du
            responsable de programme) → CTA accent.
          </li>
          <li className="border-t border-ink/10 pt-4">
            <strong>Page About</strong> : Hero texte → Pattern A (full-bleed
            campus / atelier) → contenu texte → Pattern C (citation
            directeur) → bande de fiabilité.
          </li>
          <li className="border-t border-ink/10 pt-4">
            <strong>Page Alumni / Professeurs</strong> : Hero texte →
            Pattern D (mosaïque portraits) → 8-12 cards avec Pattern E
            réduit (portrait + bio courte côte à côte).
          </li>
          <li className="border-t border-ink/10 pt-4">
            <strong>Article news long</strong> : Hero texte → Pattern A
            (visuel d'ouverture) → 3-4 paragraphes → Pattern B (image
            illustrative) → 3-4 paragraphes → Pattern C (citation) →
            conclusion.
          </li>
        </ul>
      </section>

      {/* Brief photo */}
      <section className="mt-24 max-w-4xl rounded-2xl border border-ink/10 bg-paper p-8 md:p-12">
        <p className="text-sm uppercase tracking-widest text-accent">
          Brief photographe
        </p>
        <h2 className="mt-4 font-display text-2xl md:text-3xl">
          Ce qu'on a besoin de shooter
        </h2>
        <ul className="mt-6 space-y-3 text-ink/80">
          <li>
            <strong>Heros campus / atelier</strong> en 21:9 et 16:9 (3 à
            4 visuels emblématiques)
          </li>
          <li>
            <strong>Portraits professeurs</strong> en 2:3 (15 portraits,
            cadrage cohérent, fond neutre ou en situation)
          </li>
          <li>
            <strong>Portraits alumni</strong> en 2:3 ou 4:5 (8 à 12
            portraits, dans leur cadre professionnel)
          </li>
          <li>
            <strong>Projets étudiants</strong> en 1:1 et 4:3 (30 à 40
            visuels, défilé, maquettes, écrans, prototypes)
          </li>
          <li>
            <strong>Vie d'école</strong> en mix (Breakfast, conférences,
            voyages, jurys) — 20 visuels pour alimenter les news et
            l'about
          </li>
        </ul>
        <p className="mt-6 text-sm italic text-ink/60">
          Format livraison souhaité : JPEG ou WebP, max 2 MB par image,
          1600px côté long minimum. Métadonnées : nom du fichier =
          ratio_sujet_date (ex: 2-3_charlotte-lemoine_2026-05.jpg).
        </p>
      </section>
    </article>
  )
}

/* ---------------- Internal sub-component ---------------- */

function PatternSection({
  index,
  name,
  when,
  ratio,
  children,
}: {
  index: string
  name: string
  when: string
  ratio: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-24 border-t border-ink/10 pt-12">
      <Grid>
        {/* Métadonnées du pattern à gauche sur desktop */}
        <Col span={3} spanMd={8}>
          <p className="font-display text-4xl text-accent">{index}</p>
          <h2 className="mt-3 font-display text-xl">{name}</h2>
        </Col>
        <Col span={8} offset={4} spanMd={8}>
          <p className="text-ink/80">{when}</p>
          <p className="mt-2 text-sm text-ink/50">
            <span className="font-medium uppercase tracking-widest">
              Ratio
            </span>{' '}
            · {ratio}
          </p>
        </Col>
      </Grid>

      {/* Démonstration du pattern */}
      <div className="mt-12">{children}</div>
    </section>
  )
}

/**
 * RecipeRow — Ligne de la table « Recettes d'équilibre classique/audace ».
 * Affiche pour un type de page : la liste des classiques recommandés,
 * la liste des audaces, et un verdict éditorial court.
 */
function RecipeRow({
  page,
  classics,
  audaces,
  verdict,
}: {
  page: string
  classics: string[]
  audaces: string[]
  verdict: string
}) {
  return (
    <li className="grid gap-6 border-t border-ink/10 pt-8 md:grid-cols-[1fr_2fr]">
      <div>
        <p className="font-display text-xl">{page}</p>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-ink/50">
            Classiques (70%)
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {classics.map((c, i) => (
              <li
                key={i}
                className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-sm text-ink/80"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            Audaces (30%)
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {audaces.map((a, i) => (
              <li
                key={i}
                className="rounded-full bg-accent px-3 py-1 text-sm text-paper"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm italic text-ink/70">{verdict}</p>
      </div>
    </li>
  )
}
