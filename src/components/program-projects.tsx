import { ImagePlaceholder } from './image-placeholder'

/**
 * <ProgramProjects> — Section projets d'étudiants par programme.
 *
 * Injecté après le rendu CMS sur les pages programme, pour montrer
 * 3 projets emblématiques en format mini-récit :
 *
 *   Croquis initial → Étape intermédiaire → Résultat final
 *   + citation courte de l'étudiant·e
 *   + étape pédagogique précise (année, atelier)
 *
 * Ce format est calibré pour la PROJECTION du candidat : il voit
 * d'où part le projet (un crayon, comme lui), comment il évolue, où
 * il arrive. Plus puissant qu'une galerie de résultats finis.
 *
 * Chaque programme a son mapping de projets. Ajouter un programme =
 * ajouter une entrée dans PROJECTS_BY_SLUG.
 */
type Project = {
  title: string
  studentName: string
  year: string
  pedagogyStep: string // « Bachelor 2 · Atelier de projet »
  quote: string
  // 3 images : croquis, process, résultat
  sketchCaption: string
  processCaption: string
  resultCaption: string
}

const PROJECTS_BY_SLUG: Record<
  string,
  { fr: Project[]; en: Project[] }
> = {
  'fashion-accessory-design': {
    fr: [
      {
        title: 'Une silhouette qui revisite le tablier de cuisine',
        studentName: 'Maya T.',
        year: 'Bac 3 · 2023',
        pedagogyStep: 'Bachelor 3 · Collection de fin d’études',
        quote:
          "Mon point de départ, c'était un objet du quotidien que personne ne regarde. J'ai voulu en faire le sujet d'une silhouette de défilé.",
        sketchCaption:
          'Croquis initial · Maya T. · recherche silhouette tablier',
        processCaption: 'Atelier · Maya T. · prototype en toile, ajustements',
        resultCaption: 'Résultat · Maya T. · silhouette finale au défilé public',
      },
      {
        title: 'Une mini-collection en cuir végétal',
        studentName: 'Laure M.',
        year: 'Bac 2 · 2024',
        pedagogyStep: 'Bachelor 2 · Atelier matières alternatives',
        quote:
          "Je cherchais une matière qu'on n'utilise pas en mode. Pas du cuir animal, pas du synthétique. Le cuir de pomme m'a permis 4 sacs cousus à la main.",
        sketchCaption: 'Croquis · Laure M. · 4 silhouettes de sacs',
        processCaption: 'Atelier · Laure M. · découpe cuir végétal',
        resultCaption: 'Résultat · Laure M. · 4 sacs cousus à l’atelier',
      },
      {
        title: 'Une direction artistique pour un magazine émergent',
        studentName: 'Sofia R.',
        year: 'Bac 3 · 2024',
        pedagogyStep: 'Bachelor 3 · DA mode · projet client réel',
        quote:
          'Le brief était simple : reconstruire l\'image d\'un magazine indé en perte de vitesse. J\'ai pris ça comme une preuve qu\'on m\'écoute à ce niveau.',
        sketchCaption:
          'Moodboard · Sofia R. · références visuelles et typographiques',
        processCaption:
          'Maquette · Sofia R. · 8 pages en cours de mise en page',
        resultCaption: 'Lookbook · Sofia R. · couverture imprimée finale',
      },
    ],
    en: [
      {
        title: 'A silhouette revisiting the kitchen apron',
        studentName: 'Maya T.',
        year: 'Year 3 · 2023',
        pedagogyStep: 'Bachelor 3 · Final-year collection',
        quote:
          "My starting point was an everyday object nobody really looks at. I wanted to make it the subject of a runway silhouette.",
        sketchCaption: 'Initial sketch · Maya T. · apron silhouette research',
        processCaption: 'Studio · Maya T. · toile prototype, fittings',
        resultCaption: 'Result · Maya T. · final silhouette at public runway',
      },
      {
        title: 'A mini-collection in plant-based leather',
        studentName: 'Laure M.',
        year: 'Year 2 · 2024',
        pedagogyStep: 'Bachelor 2 · Alternative materials studio',
        quote:
          "I was looking for a material that fashion doesn't use. Not animal leather, not synthetic. Apple leather let me hand-stitch 4 bags.",
        sketchCaption: 'Sketches · Laure M. · 4 bag silhouettes',
        processCaption: 'Studio · Laure M. · cutting plant-based leather',
        resultCaption: 'Result · Laure M. · 4 hand-stitched bags',
      },
      {
        title: 'Art direction for an emerging magazine',
        studentName: 'Sofia R.',
        year: 'Year 3 · 2024',
        pedagogyStep: 'Bachelor 3 · Fashion art direction · real client',
        quote:
          'The brief was simple: rebuild the visual identity of a fading indie magazine. I took it as proof I was being heard at that level.',
        sketchCaption: 'Moodboard · Sofia R. · visual and type references',
        processCaption: 'Mockup · Sofia R. · 8 pages in layout',
        resultCaption: 'Lookbook · Sofia R. · printed cover',
      },
    ],
  },

  // ============================================================
  // BACHELOR · Interior Architecture & Design
  // ============================================================
  'interior-architecture-design': {
    fr: [
      {
        title: 'Réhabilitation d’une maison de maître à Saint-Gilles',
        studentName: 'Lukas V.',
        year: 'Bac 3 · 2024',
        pedagogyStep: 'Bachelor 3 · Projet de fin d’études',
        quote:
          "L'enjeu, c'était de garder l'âme du bel-étage 1900 sans en faire un musée. Chaque moulure, chaque cage d'escalier, on a décidé quoi garder.",
        sketchCaption: 'Croquis main · Lukas V. · plans et coupes',
        processCaption: 'Maquette · Lukas V. · échelle 1/50 carton bois',
        resultCaption: 'Render V-Ray · Lukas V. · salon central après réhabilitation',
      },
      {
        title: 'Un flagship store pour une marque scandinave',
        studentName: 'Mira K.',
        year: 'Bac 2 · 2024',
        pedagogyStep: 'Bachelor 2 · Atelier retail design',
        quote:
          "80m² pour raconter une marque entière. La contrainte du sourcing local et de la modularité m'a forcée à imaginer chaque détail.",
        sketchCaption: 'Plan masse · Mira K. · parcours client',
        processCaption: 'Maquette · Mira K. · vitrine et linéaires',
        resultCaption: 'Render · Mira K. · vue centrale du flagship',
      },
      {
        title: 'Scénographie pour BOZAR · projet client',
        studentName: 'Jules R.',
        year: 'Bac 3 · 2023',
        pedagogyStep: 'Bachelor 3 · Workshop BOZAR · projet client réel',
        quote:
          "Présenter sa scénographie devant l'équipe BOZAR en vrai, c'est ce moment où tu comprends que ton projet sert à quelqu'un.",
        sketchCaption: 'Schéma · Jules R. · parcours et signalétique',
        processCaption: 'Maquette · Jules R. · modules d’exposition à l’échelle',
        resultCaption: 'Render · Jules R. · vue d’ensemble salle d’exposition',
      },
    ],
    en: [
      {
        title: 'Rehabilitation of a 1900 townhouse in Saint-Gilles',
        studentName: 'Lukas V.',
        year: 'Year 3 · 2024',
        pedagogyStep: 'Bachelor 3 · Final project',
        quote:
          "The challenge was keeping the 1900 bel-étage's soul without turning it into a museum. Each moulding, each staircase, we decided what to keep.",
        sketchCaption: 'Hand sketch · Lukas V. · plans and sections',
        processCaption: 'Model · Lukas V. · 1/50 cardboard and wood',
        resultCaption: 'V-Ray render · Lukas V. · central living room after rehab',
      },
      {
        title: 'A flagship store for a Scandinavian brand',
        studentName: 'Mira K.',
        year: 'Year 2 · 2024',
        pedagogyStep: 'Bachelor 2 · Retail design studio',
        quote:
          '80m² to tell a whole brand. The constraints of local sourcing and modularity forced me to design every single detail.',
        sketchCaption: 'Floor plan · Mira K. · customer journey',
        processCaption: 'Model · Mira K. · window and shelving',
        resultCaption: 'Render · Mira K. · central view of the flagship',
      },
      {
        title: 'Scenography for BOZAR · real client project',
        studentName: 'Jules R.',
        year: 'Year 3 · 2023',
        pedagogyStep: 'Bachelor 3 · BOZAR workshop · real client',
        quote:
          'Presenting your scenography in person to the BOZAR team is the moment you realise your project serves someone.',
        sketchCaption: 'Diagram · Jules R. · path and signage',
        processCaption: 'Model · Jules R. · scaled exhibition modules',
        resultCaption: 'Render · Jules R. · overall view of exhibition hall',
      },
    ],
  },

  // ============================================================
  // BACHELOR · Communication & Digital Design
  // ============================================================
  'communication-digital-design': {
    fr: [
      {
        title: 'Identité visuelle complète pour un festival de musique',
        studentName: 'Sofia R.',
        year: 'Bac 3 · 2024',
        pedagogyStep: 'Bachelor 3 · Brief client réel · festival bruxellois',
        quote:
          "Logo, affiches, motion, signalétique sur site. J'ai défendu chaque déclinaison devant le commanditaire. C'est là qu'on apprend.",
        sketchCaption: 'Recherche logo · Sofia R. · 20 esquisses sur papier',
        processCaption: 'Système · Sofia R. · grille typographique et déclinaisons',
        resultCaption: 'Livrable · Sofia R. · affiches imprimées et bumper motion',
      },
      {
        title: 'Refonte UX/UI d’une app de service public',
        studentName: 'Inès D.',
        year: 'Bac 3 · 2023',
        pedagogyStep: 'Bachelor 3 · Atelier UX/UI · projet design system',
        quote:
          "On part d'une app que personne n'aime utiliser. On finit avec une présentation devant un jury de DA en agence. Le saut est énorme.",
        sketchCaption: 'Wireframe · Inès D. · papier et Post-it',
        processCaption: 'Maquettes Figma · Inès D. · flux d’inscription',
        resultCaption: 'Prototype · Inès D. · 12 écrans cliquables',
      },
      {
        title: 'Campagne sociale pour une ONG belge',
        studentName: 'Karim B.',
        year: 'Bac 2 · 2024',
        pedagogyStep: 'Bachelor 2 · Workshop campagne sociale',
        quote:
          "Le sujet était lourd, mais la commande était claire : faire bouger. J'ai travaillé avec deux étudiants de Mode pour le shooting.",
        sketchCaption: 'Moodboard · Karim B. · références photo et typo',
        processCaption: 'Maquette · Karim B. · 3 visuels print et social',
        resultCaption: 'Campagne · Karim B. · visuels finaux print + Instagram',
      },
    ],
    en: [
      {
        title: 'Complete visual identity for a music festival',
        studentName: 'Sofia R.',
        year: 'Year 3 · 2024',
        pedagogyStep: 'Bachelor 3 · Real client brief · Brussels festival',
        quote:
          'Logo, posters, motion, on-site signage. I defended every variation in front of the client. That\'s where you learn.',
        sketchCaption: 'Logo research · Sofia R. · 20 sketches on paper',
        processCaption: 'System · Sofia R. · type grid and variations',
        resultCaption: 'Deliverable · Sofia R. · printed posters and motion bumper',
      },
      {
        title: 'UX/UI redesign of a public service app',
        studentName: 'Inès D.',
        year: 'Year 3 · 2023',
        pedagogyStep: 'Bachelor 3 · UX/UI studio · design system project',
        quote:
          'You start from an app nobody likes using. You end up presenting to a jury of agency ADs. The leap is huge.',
        sketchCaption: 'Wireframe · Inès D. · paper and Post-its',
        processCaption: 'Figma mockups · Inès D. · onboarding flow',
        resultCaption: 'Prototype · Inès D. · 12 clickable screens',
      },
      {
        title: 'Social campaign for a Belgian NGO',
        studentName: 'Karim B.',
        year: 'Year 2 · 2024',
        pedagogyStep: 'Bachelor 2 · Social campaign workshop',
        quote:
          "The topic was heavy, but the brief was clear: move people. I worked with two Fashion students on the shoot.",
        sketchCaption: 'Moodboard · Karim B. · photo and type references',
        processCaption: 'Mockup · Karim B. · 3 visuals for print and social',
        resultCaption: 'Campaign · Karim B. · final visuals print + Instagram',
      },
    ],
  },

  // ============================================================
  // MASTER · Interior Architecture (2 years)
  // ============================================================
  'interior-architecture-design-master': {
    fr: [
      {
        title: 'Conversion d’un atelier industriel en hôtel boutique',
        studentName: 'Charlotte D.',
        year: 'Master 2 · 2024',
        pedagogyStep: 'Master 2 ans · Mémoire-projet final',
        quote:
          "Un projet sur deux semestres complets. De l'idée d'origine aux plans d'exécution professionnels. C'était la vraie échelle.",
        sketchCaption: 'Esquisse · Charlotte D. · concept et parti pris',
        processCaption: 'Maquette · Charlotte D. · échelle 1/100, structure',
        resultCaption: 'Plan exé · Charlotte D. · niveaux détaillés et coupes',
      },
      {
        title: 'Scénographie d’exposition · workshop Milan',
        studentName: 'Pieter J.',
        year: 'Master 1 · 2024',
        pedagogyStep: 'Master 1 · Workshop Salone del Mobile · Milan',
        quote:
          "Une semaine à Milan pour scénographier un stand pour un éditeur belge. Pression, deadline, présentation au commanditaire. Concret.",
        sketchCaption: 'Croquis sur place · Pieter J. · prises de notes du Salone',
        processCaption: 'Maquette rapide · Pieter J. · modules à assembler',
        resultCaption: 'Stand · Pieter J. · vue du stand monté à Milan',
      },
      {
        title: 'Bureaux pour une agence créative bruxelloise',
        studentName: 'Sophie L.',
        year: 'Master 1 · 2023',
        pedagogyStep: 'Master 1 · Atelier projet · client réel',
        quote:
          "300m² à repenser pour une agence qui doublait d'effectif. Tout le travail tient sur deux contraintes : la lumière et le silence.",
        sketchCaption: 'Plan actuel · Sophie L. · état des lieux annoté',
        processCaption: 'Variantes · Sophie L. · 3 partis d’aménagement',
        resultCaption: 'Render · Sophie L. · open space après transformation',
      },
    ],
    en: [
      {
        title: 'Converting an industrial workshop into a boutique hotel',
        studentName: 'Charlotte D.',
        year: 'Master 2 · 2024',
        pedagogyStep: '2-year Master · Final thesis-project',
        quote:
          'A project over two full semesters. From original idea to professional construction drawings. That was the real scale.',
        sketchCaption: 'Sketch · Charlotte D. · concept and parti',
        processCaption: 'Model · Charlotte D. · 1/100 scale, structure',
        resultCaption: 'Construction plan · Charlotte D. · detailed levels and sections',
      },
      {
        title: 'Exhibition scenography · Milan workshop',
        studentName: 'Pieter J.',
        year: 'Master 1 · 2024',
        pedagogyStep: 'Master 1 · Salone del Mobile workshop · Milan',
        quote:
          'A week in Milan to design an exhibition stand for a Belgian editor. Pressure, deadline, client presentation. Concrete.',
        sketchCaption: 'On-site sketch · Pieter J. · notes from the Salone',
        processCaption: 'Quick model · Pieter J. · modules to assemble',
        resultCaption: 'Stand · Pieter J. · view of the built stand in Milan',
      },
      {
        title: 'Offices for a Brussels creative agency',
        studentName: 'Sophie L.',
        year: 'Master 1 · 2023',
        pedagogyStep: 'Master 1 · Project studio · real client',
        quote:
          '300m² to rethink for an agency doubling in size. The whole project rests on two constraints: light and silence.',
        sketchCaption: 'Current plan · Sophie L. · annotated existing state',
        processCaption: 'Variants · Sophie L. · 3 layout options',
        resultCaption: 'Render · Sophie L. · open space after transformation',
      },
    ],
  },

  // ============================================================
  // MASTER · Home & Living Design
  // ============================================================
  'home-living-design': {
    fr: [
      {
        title: 'Mini-collection de mobilier modulaire en bois local',
        studentName: 'Léa M.',
        year: 'Master · 2023',
        pedagogyStep: 'Master Home & Living · Mémoire-projet final',
        quote:
          "J'ai utilisé du chêne belge récupéré d'une grange démolie. Trois pièces qui se combinent, fabricables en série.",
        sketchCaption: 'Croquis · Léa M. · recherche silhouettes mobilier',
        processCaption: 'Prototypage · Léa M. · assemblage atelier bois',
        resultCaption: 'Collection · Léa M. · 3 pièces exposées à Brussels Design Sept.',
      },
      {
        title: 'Une ligne d’art de la table en verre soufflé',
        studentName: 'Anna S.',
        year: 'Master · 2024',
        pedagogyStep: 'Master Home & Living · Atelier matières',
        quote:
          "J'ai passé 3 jours dans une verrerie à Mons pour comprendre le geste avant de dessiner. Pas l'inverse.",
        sketchCaption: 'Croquis · Anna S. · 8 formes de verres et carafes',
        processCaption: 'Atelier verrier · Anna S. · soufflage en collaboration',
        resultCaption: 'Collection · Anna S. · 6 pièces de verre soufflé',
      },
      {
        title: 'Workshop Milan · briefs d’éditeurs italiens',
        studentName: 'Giulia F.',
        year: 'Master · 2024',
        pedagogyStep: 'Master Home & Living · Workshop Salone del Mobile',
        quote:
          "Présenter ma chaise devant un éditeur Cassina, c'est ce que personne ne vous prépare à vivre. Sauf au CAD.",
        sketchCaption: 'Croquis · Giulia F. · chaise pour briefe Cassina',
        processCaption: 'Maquette 1/5 · Giulia F. · ajustements assise',
        resultCaption: 'Prototype final · Giulia F. · chaise grandeur réelle',
      },
    ],
    en: [
      {
        title: 'Modular furniture mini-collection in local wood',
        studentName: 'Léa M.',
        year: 'Master · 2023',
        pedagogyStep: 'Home & Living Master · Final thesis-project',
        quote:
          'I used Belgian oak recovered from a demolished barn. Three pieces that combine, manufacturable in series.',
        sketchCaption: 'Sketch · Léa M. · furniture silhouette research',
        processCaption: 'Prototyping · Léa M. · woodshop assembly',
        resultCaption: 'Collection · Léa M. · 3 pieces shown at Brussels Design Sept.',
      },
      {
        title: 'A blown-glass tableware line',
        studentName: 'Anna S.',
        year: 'Master · 2024',
        pedagogyStep: 'Home & Living Master · Materials studio',
        quote:
          'I spent 3 days at a glassworks in Mons to understand the gesture before drawing. Not the other way around.',
        sketchCaption: 'Sketch · Anna S. · 8 glass and carafe forms',
        processCaption: 'Glassworks · Anna S. · blowing in collaboration',
        resultCaption: 'Collection · Anna S. · 6 blown-glass pieces',
      },
      {
        title: 'Milan workshop · briefs from Italian editors',
        studentName: 'Giulia F.',
        year: 'Master · 2024',
        pedagogyStep: 'Home & Living Master · Salone del Mobile workshop',
        quote:
          "Presenting my chair to a Cassina editor is what nobody prepares you for. Except at CAD.",
        sketchCaption: 'Sketch · Giulia F. · chair for Cassina brief',
        processCaption: '1/5 model · Giulia F. · seat adjustments',
        resultCaption: 'Final prototype · Giulia F. · full-scale chair',
      },
    ],
  },

  // ============================================================
  // MASTER · Digital Brand Content
  // ============================================================
  'digital-brand-content': {
    fr: [
      {
        title: 'Écosystème digital pour une maison de luxe émergente',
        studentName: 'Romain L.',
        year: 'Master · 2024',
        pedagogyStep: 'Master Digital Brand · Projet global S2',
        quote:
          "Site, newsletter, social, app. Tout devait porter la même promesse. C'est ce travail de cohérence qui m'a vraiment formé.",
        sketchCaption: 'Brand strategy · Romain L. · cartographie écosystème',
        processCaption: 'Wireframes · Romain L. · prototypes Figma site et app',
        resultCaption: 'Livrables · Romain L. · 5 surfaces digitales cohérentes',
      },
      {
        title: 'Refonte UX/UI d’un service e-commerce',
        studentName: 'Julie M.',
        year: 'Master · 2023',
        pedagogyStep: 'Master Digital Brand · S1 · atelier UX-UI',
        quote:
          "Le brief venait d'une vraie marque. Conversion à améliorer, pas un exercice théorique. La pression était utile.",
        sketchCaption: 'Wireframe · Julie M. · parcours d’achat révisé',
        processCaption: 'A/B testing · Julie M. · variantes design system',
        resultCaption: 'Prototype · Julie M. · 15 écrans cliquables',
      },
      {
        title: 'Campagne IA générative pour une marque cosmétique',
        studentName: 'Yann B.',
        year: 'Master · 2024',
        pedagogyStep: 'Master Digital Brand · Module IA générative',
        quote:
          "ComfyUI et Runway, j'ai appris à les diriger comme on dirige un designer junior. Pas comme un gadget.",
        sketchCaption: 'Moodboard · Yann B. · références esthétiques cosmétique',
        processCaption: 'Workflow IA · Yann B. · pipeline ComfyUI documenté',
        resultCaption: 'Campagne · Yann B. · 6 visuels finaux + vidéo Runway',
      },
    ],
    en: [
      {
        title: 'Digital ecosystem for an emerging luxury house',
        studentName: 'Romain L.',
        year: 'Master · 2024',
        pedagogyStep: 'Digital Brand Master · S2 global project',
        quote:
          "Website, newsletter, social, app. All had to carry the same promise. That coherence work is what really trained me.",
        sketchCaption: 'Brand strategy · Romain L. · ecosystem mapping',
        processCaption: 'Wireframes · Romain L. · Figma site and app prototypes',
        resultCaption: 'Deliverables · Romain L. · 5 coherent digital surfaces',
      },
      {
        title: 'UX/UI redesign of an e-commerce service',
        studentName: 'Julie M.',
        year: 'Master · 2023',
        pedagogyStep: 'Digital Brand Master · S1 · UX-UI studio',
        quote:
          "The brief came from a real brand. Conversion to improve, not a theoretical exercise. The pressure was useful.",
        sketchCaption: 'Wireframe · Julie M. · revised purchase path',
        processCaption: 'A/B testing · Julie M. · design system variants',
        resultCaption: 'Prototype · Julie M. · 15 clickable screens',
      },
      {
        title: 'Generative AI campaign for a cosmetics brand',
        studentName: 'Yann B.',
        year: 'Master · 2024',
        pedagogyStep: 'Digital Brand Master · Generative AI module',
        quote:
          "ComfyUI and Runway, I learned to direct them like you direct a junior designer. Not as a gadget.",
        sketchCaption: 'Moodboard · Yann B. · cosmetics aesthetic references',
        processCaption: 'AI workflow · Yann B. · documented ComfyUI pipeline',
        resultCaption: 'Campaign · Yann B. · 6 final visuals + Runway video',
      },
    ],
  },

  // ============================================================
  // MASTER · Image, 3D, Motion, Video, AI
  // ============================================================
  'image-3d-motion-video-ai': {
    fr: [
      {
        title: 'Court-métrage 3D temps réel en Unreal Engine',
        studentName: 'Tom V.',
        year: 'Master · 2023',
        pedagogyStep: 'Master Image 3D · Projet final · 3 pièces',
        quote:
          "3 minutes entièrement produites en Unreal 5. Scénario, modélisation, animation, montage, son. Une équipe d'une personne.",
        sketchCaption: 'Storyboard · Tom V. · 8 plans dessinés à la main',
        processCaption: 'Modélisation · Tom V. · capture écran Unreal Engine',
        resultCaption: 'Final · Tom V. · still du film projeté en salle',
      },
      {
        title: 'Campagne IA générative pour une marque de mode',
        studentName: 'Lucie A.',
        year: 'Master · 2024',
        pedagogyStep: 'Master Image 3D · Module IA · workflow documenté',
        quote:
          "Workflow ComfyUI + Runway + montage After Effects. Le brief venait d'une vraie marque. La présentation, c'était au DA.",
        sketchCaption: 'Storyboard · Lucie A. · structure narrative campagne',
        processCaption: 'ComfyUI · Lucie A. · graph node-based capturé',
        resultCaption: 'Campagne · Lucie A. · série de 5 visuels finaux',
      },
      {
        title: 'Motion broadcast · habillage TV',
        studentName: 'Hugo M.',
        year: 'Master · 2024',
        pedagogyStep: 'Master Image 3D · Atelier motion After Effects',
        quote:
          "Un habillage complet pour une chaîne fictive. Bumper, transitions, lower thirds. Penser système, pas juste un visuel.",
        sketchCaption: 'Style frames · Hugo M. · 4 frames clés du système',
        processCaption: 'Timeline AE · Hugo M. · transitions en construction',
        resultCaption: 'Habillage final · Hugo M. · sequence broadcast 90sec',
      },
    ],
    en: [
      {
        title: 'Real-time 3D short film in Unreal Engine',
        studentName: 'Tom V.',
        year: 'Master · 2023',
        pedagogyStep: 'Image 3D Master · Final project · 3 pieces',
        quote:
          '3 minutes entirely produced in Unreal 5. Scenario, modelling, animation, editing, sound. A team of one.',
        sketchCaption: 'Storyboard · Tom V. · 8 hand-drawn shots',
        processCaption: 'Modelling · Tom V. · Unreal Engine screen capture',
        resultCaption: 'Final · Tom V. · still from the film screened publicly',
      },
      {
        title: 'Generative AI campaign for a fashion brand',
        studentName: 'Lucie A.',
        year: 'Master · 2024',
        pedagogyStep: 'Image 3D Master · AI module · documented workflow',
        quote:
          "ComfyUI + Runway workflow + After Effects editing. The brief was from a real brand. The presentation was to the AD.",
        sketchCaption: 'Storyboard · Lucie A. · campaign narrative structure',
        processCaption: 'ComfyUI · Lucie A. · captured node-based graph',
        resultCaption: 'Campaign · Lucie A. · series of 5 final visuals',
      },
      {
        title: 'Motion broadcast · TV channel identity',
        studentName: 'Hugo M.',
        year: 'Master · 2024',
        pedagogyStep: 'Image 3D Master · After Effects motion studio',
        quote:
          "A complete identity package for a fictional channel. Bumper, transitions, lower thirds. Think system, not just a visual.",
        sketchCaption: 'Style frames · Hugo M. · 4 key frames of the system',
        processCaption: 'AE timeline · Hugo M. · transitions under construction',
        resultCaption: 'Final package · Hugo M. · 90-sec broadcast sequence',
      },
    ],
  },

  // ============================================================
  // MASTER · Event Management
  // ============================================================
  'event-management': {
    fr: [
      {
        title: 'Production d’une exposition collective à la Bibliothèque Solvay',
        studentName: 'Antoine L.',
        year: 'Master · 2022',
        pedagogyStep: 'Master Event · Production réelle · S1',
        quote:
          "12 étudiants, un seul événement. Budget réel, public extérieur, vernissage avec 200 invités. Pas un exercice.",
        sketchCaption: 'Plan de salle · Antoine L. · scéno annotée',
        processCaption: 'Production · Antoine L. · montage la veille du vernissage',
        resultCaption: 'Vernissage · Antoine L. · vue de la soirée d’ouverture',
      },
      {
        title: 'Lancement d’une marque émergente',
        studentName: 'Élise V.',
        year: 'Master · 2023',
        pedagogyStep: 'Master Event · Brief client réel',
        quote:
          "La marque sortait sa première collection. Un soir, un lieu, 150 invités, 0 droit à l'erreur. C'est ça la prod événementielle.",
        sketchCaption: 'Story · Élise V. · narration soirée minute par minute',
        processCaption: 'Production · Élise V. · répétitions techniques',
        resultCaption: 'Soirée · Élise V. · public devant l’installation centrale',
      },
      {
        title: 'Conférence design avec invité international',
        studentName: 'Marc R.',
        year: 'Master · 2024',
        pedagogyStep: 'Master Event · Production conférence S2',
        quote:
          "On a fait venir un designer suisse. Voyage, hôtel, scéno, modération, captation vidéo. Toute la chaîne, en 6 semaines.",
        sketchCaption: 'Brief · Marc R. · scéno et parcours invité',
        processCaption: 'Briefing équipe · Marc R. · J-1 sur la scène',
        resultCaption: 'Conférence · Marc R. · vue du public en salle',
      },
    ],
    en: [
      {
        title: 'Producing a group exhibition at Bibliothèque Solvay',
        studentName: 'Antoine L.',
        year: 'Master · 2022',
        pedagogyStep: 'Event Master · Real production · S1',
        quote:
          "12 students, one single event. Real budget, external audience, opening night with 200 guests. Not an exercise.",
        sketchCaption: 'Floor plan · Antoine L. · annotated scenography',
        processCaption: 'Production · Antoine L. · install the day before opening',
        resultCaption: 'Opening · Antoine L. · view of the launch evening',
      },
      {
        title: 'Launch of an emerging brand',
        studentName: 'Élise V.',
        year: 'Master · 2023',
        pedagogyStep: 'Event Master · Real client brief',
        quote:
          "The brand was launching its first collection. One night, one venue, 150 guests, zero margin for error. That's event production.",
        sketchCaption: 'Story · Élise V. · minute-by-minute narration',
        processCaption: 'Production · Élise V. · technical rehearsals',
        resultCaption: 'Evening · Élise V. · audience in front of central installation',
      },
      {
        title: 'Design lecture with international guest',
        studentName: 'Marc R.',
        year: 'Master · 2024',
        pedagogyStep: 'Event Master · S2 lecture production',
        quote:
          "We brought in a Swiss designer. Travel, hotel, scenography, moderation, video capture. The whole chain, in 6 weeks.",
        sketchCaption: 'Brief · Marc R. · scenography and guest journey',
        processCaption: 'Team briefing · Marc R. · D-1 on stage',
        resultCaption: 'Lecture · Marc R. · view of the audience in the hall',
      },
    ],
  },

  // ============================================================
  // SPECIALIZATION · Fashion Management
  // ============================================================
  'fashion-management': {
    fr: [
      {
        title: 'Stratégie pour une marque de PAP émergente',
        studentName: 'Camille R.',
        year: 'Spécialisation · 2024',
        pedagogyStep: 'Fashion Management · S1 · stratégie de marque',
        quote:
          "On part d'une marque qui vend bien mais ne sait pas raconter sa différence. Mon travail : reconstruire le positionnement.",
        sketchCaption: 'Strategy board · Camille R. · analyse concurrentielle',
        processCaption: 'Atelier · Camille R. · workshops avec l’équipe marque',
        resultCaption: 'Livrable · Camille R. · plan stratégique 80 pages',
      },
      {
        title: 'Étude retail pour un flagship luxe',
        studentName: 'Sarah B.',
        year: 'Spécialisation · 2023',
        pedagogyStep: 'Fashion Management · Module retail',
        quote:
          "Comprendre un flagship Hermès quand on y va en cliente, c'est une chose. Quand on étudie sa logique commerciale, c'en est une autre.",
        sketchCaption: 'Observation · Sarah B. · plan annoté du flagship visité',
        processCaption: 'Analyse · Sarah B. · parcours client cartographié',
        resultCaption: 'Rapport · Sarah B. · recommandations pour la marque cliente',
      },
      {
        title: 'Business plan pour une jeune marque éthique',
        studentName: 'Karim E.',
        year: 'Spécialisation · 2024',
        pedagogyStep: 'Fashion Management · Économie · stage 6 mois',
        quote:
          "Stage chez un cabinet M&A mode à Paris. Mon mémoire portait sur la valorisation d'une marque jeune. Direct dans le métier.",
        sketchCaption: 'Modèle · Karim E. · spreadsheet de valorisation',
        processCaption: 'Cabinet · Karim E. · revue avec son maître de stage',
        resultCaption: 'Présentation · Karim E. · soutenance finale CAD + cabinet',
      },
    ],
    en: [
      {
        title: 'Strategy for an emerging RTW brand',
        studentName: 'Camille R.',
        year: 'Specialization · 2024',
        pedagogyStep: 'Fashion Management · S1 · brand strategy',
        quote:
          "We start with a brand that sells well but can't tell its difference. My job: rebuild the positioning.",
        sketchCaption: 'Strategy board · Camille R. · competitive analysis',
        processCaption: 'Studio · Camille R. · workshops with the brand team',
        resultCaption: 'Deliverable · Camille R. · 80-page strategic plan',
      },
      {
        title: 'Retail study for a luxury flagship',
        studentName: 'Sarah B.',
        year: 'Specialization · 2023',
        pedagogyStep: 'Fashion Management · Retail module',
        quote:
          "Understanding a Hermès flagship as a customer is one thing. Studying its commercial logic is another.",
        sketchCaption: 'Observation · Sarah B. · annotated plan of visited flagship',
        processCaption: 'Analysis · Sarah B. · mapped customer journey',
        resultCaption: 'Report · Sarah B. · recommendations for the client brand',
      },
      {
        title: 'Business plan for a young ethical brand',
        studentName: 'Karim E.',
        year: 'Specialization · 2024',
        pedagogyStep: 'Fashion Management · Economics · 6-month internship',
        quote:
          "Internship at a Paris fashion M&A firm. My thesis was on valuing a young brand. Straight into the profession.",
        sketchCaption: 'Model · Karim E. · valuation spreadsheet',
        processCaption: 'Firm · Karim E. · review with internship supervisor',
        resultCaption: 'Presentation · Karim E. · final defense CAD + firm',
      },
    ],
  },
}

const LABELS = {
  fr: {
    eyebrow: 'Projets étudiants',
    title: 'Ce qu’on fait ici, concrètement.',
    intro:
      'Trois projets récents de ce programme, racontés de leur point de départ jusqu’à leur résultat. Pour vous projeter, pas pour vous intimider.',
    fromSketch: 'Du croquis',
    process: 'au process',
    toResult: 'au résultat',
  },
  en: {
    eyebrow: 'Student projects',
    title: 'What we do here, concretely.',
    intro:
      'Three recent projects from this program, told from starting point to final result. To help you picture yourself here, not to intimidate.',
    fromSketch: 'From sketch',
    process: 'to process',
    toResult: 'to result',
  },
}

export function ProgramProjects({
  slug,
  locale,
}: {
  slug: string
  locale: string
}) {
  const programProjects = PROJECTS_BY_SLUG[slug]
  if (!programProjects) return null

  const isFR = locale === 'fr'
  const projects = isFR ? programProjects.fr : programProjects.en
  const L = isFR ? LABELS.fr : LABELS.en

  return (
    <section className="container py-20 md:py-24">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-accent">
          {L.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-3xl md:text-5xl">
          {L.title}
        </h2>
        <p className="mt-6 text-lg text-ink/70">{L.intro}</p>
      </div>

      <div className="mt-16 space-y-24">
        {projects.map((p, i) => (
          <article
            key={i}
            className="border-t border-ink/10 pt-12"
          >
            {/* Header projet : numéro + étape pédagogique + titre */}
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-3">
                <p className="font-display text-5xl text-accent md:text-6xl">
                  0{i + 1}
                </p>
                <p className="mt-4 text-xs uppercase tracking-widest text-ink/60">
                  {p.pedagogyStep}
                </p>
              </div>
              <div className="lg:col-span-9">
                <h3 className="font-display text-2xl md:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm uppercase tracking-widest text-ink/60">
                  {p.studentName} · {p.year}
                </p>
              </div>
            </div>

            {/* Mini-récit : 3 images en grille avec labels d'étapes
                (du croquis au résultat). Sur mobile, stack vertical. */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <figure>
                <ImagePlaceholder
                  ratio="3:4"
                  caption={p.sketchCaption}
                />
                <figcaption className="mt-3 text-xs uppercase tracking-widest text-ink/50">
                  {L.fromSketch}
                </figcaption>
              </figure>
              <figure>
                <ImagePlaceholder
                  ratio="3:4"
                  caption={p.processCaption}
                />
                <figcaption className="mt-3 text-xs uppercase tracking-widest text-ink/50">
                  {L.process}
                </figcaption>
              </figure>
              <figure>
                <ImagePlaceholder
                  ratio="3:4"
                  caption={p.resultCaption}
                />
                <figcaption className="mt-3 text-xs uppercase tracking-widest text-ink/50">
                  {L.toResult}
                </figcaption>
              </figure>
            </div>

            {/* Citation étudiant·e — légère, italique, max-w pour
                forcer un rythme de lecture confortable. */}
            <blockquote className="mt-10 max-w-3xl border-l-2 border-accent pl-6 font-display text-xl italic leading-snug text-ink/90 md:text-2xl">
              « {p.quote} »
            </blockquote>
          </article>
        ))}
      </div>
    </section>
  )
}
