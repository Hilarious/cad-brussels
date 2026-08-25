'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Générateur d'affiche « Plus tard ».
 *
 * Le jeune complète la phrase, la page fabrique son image, et il l'envoie
 * à ses parents. Le partage passe par l'API Web Share avec fichier, qui
 * ouvre la feuille de partage native : WhatsApp y figure en premier sur
 * la plupart des téléphones. Sur desktop, où cette API n'existe pas, on
 * retombe sur le téléchargement.
 *
 * L'image est produite en 1080x1350, format portrait lisible dans une
 * conversation WhatsApp comme dans un fil Instagram.
 */

const W = 1080
const H = 1350

type Palette = { nom: string; fond: string; encre: string; signature: string }

// Impression une seule couleur sur fond textile, comme les t-shirts.
// Les encres sont celles de la palette officielle du CAD. Les couleurs
// trop claires de la palette (jaune, lime, cyan, mint) sont ecartees :
// illisibles en encre sur un fond creme.
const CREME = '#F1EDE3'

// Deux encres par affiche, comme une impression deux plaques.
//   encre     : la voix du jeune. La phrase, le metier, la signature.
//   signature : la voix de l'ecole. CAD Brussels, la pastille de rentree
//               et le post-scriptum sur l'IA.
// Les deux couleurs sont choisies pour se distinguer au premier coup d'oeil,
// c'est ce qui cree la hierarchie de lecture.
const PALETTES: Palette[] = [
  { nom: 'Navy et rose', fond: CREME, encre: '#2f346d', signature: '#ff277f' },
  { nom: 'Rose et navy', fond: CREME, encre: '#ff277f', signature: '#2f346d' },
  { nom: 'Violet et orange', fond: CREME, encre: '#8000ff', signature: '#ff8000' },
  { nom: 'Azur et rouge', fond: CREME, encre: '#0080ff', signature: '#ff1f20' },
  { nom: 'Rouge et navy', fond: CREME, encre: '#ff1f20', signature: '#2f346d' },
  { nom: 'Orange et violet', fond: CREME, encre: '#ff8000', signature: '#8000ff' },
  { nom: 'Magenta et navy', fond: CREME, encre: '#ff00ff', signature: '#2f346d' },
  { nom: 'Noir et rose', fond: CREME, encre: '#000000', signature: '#ff277f' },
  // Les deux inversions, pour ceux qui veulent du sombre
  { nom: 'Navy inversé', fond: '#2f346d', encre: CREME, signature: '#ff277f' },
  { nom: 'Noir inversé', fond: '#14140F', encre: CREME, signature: '#80ff00' },
]

// L'edition textile est une serie fermee : trois t-shirts, chacun avec son
// metier et son duo d'encres. Ce n'est pas le metier choisi a l'ecran qui
// s'imprime, c'est l'un de ces trois modeles, decide a la production.
const MODELES_TEE: { metier: string; palette: number; precommandes: number }[] =
  [
    { metier: 'Creative Director', palette: 3, precommandes: 63 }, // azur et rouge
    { metier: 'Fashion Designer', palette: 5, precommandes: 78 }, // orange et violet
    { metier: 'Interior Architect', palette: 1, precommandes: 51 }, // rose et navy
  ]

/**
 * ATTENTION : les compteurs ci-dessus sont SIMULES pour la demonstration.
 *
 * Aucune de ces precommandes n'existe. Tant que ce drapeau est a true, la
 * page affiche des chiffres inventes, ce qui est une pratique commerciale
 * trompeuse si elle est mise en ligne pour de vrais visiteurs. A brancher
 * sur le compteur reel de Shopify, et a repasser a false, avant toute
 * ouverture au public.
 */
const COMPTEURS_SIMULES = true

// Le nombre de precommandes qui declenche l'impression d'un modele.
const SEUIL_PRODUCTION = 50

// L'objectif affiche par la jauge, au-dela du seuil : une barre pleine des
// le seuil ne dirait plus rien une fois celui-ci franchi.
const OBJECTIF_TEE = 100

// L'interface emprunte l'encre du dessin en cours : choisir une couleur
// se voit alors partout, pas seulement dans l'apercu. Sur les palettes
// inversees c'est la seconde encre qui sert, la premiere etant claire.
const teinte = (p: Palette) => (p.fond === CREME ? p.encre : p.signature)

// De quoi ecrire par-dessus sans jamais tomber sur du clair sur clair.
const lisible = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const l =
    (0.299 * ((n >> 16) & 255) +
      0.587 * ((n >> 8) & 255) +
      0.114 * (n & 255)) /
    255
  return l > 0.62 ? '#14140F' : '#F5F2EC'
}

// Le premier mot de l'affiche appartient a la langue du jeune : le laisser
// en francais sur la page anglaise ferait de l'affiche une traduction a
// moitie faite. Le pluriel se lit toujours a la premiere entree.
const DESTINATAIRES = {
  fr: ['Papa, maman', 'Maman', 'Papa', 'Mamie'],
  en: ['Mum, dad', 'Mum', 'Dad', 'Grandma'],
} as const

const TAILLES = ['S', 'M', 'L', 'XL'] as const

/**
 * La boutique de precommande du t-shirt.
 *
 * A REMPLIR : l'adresse de la fiche produit Shopify. Tant qu'elle est vide,
 * le bouton reste inactif et le dit, plutot que de mener nulle part.
 * La taille choisie est passee en parametre, Shopify sait s'en servir pour
 * preselectionner la variante.
 */
const SHOPIFY_PRODUIT = ''

// Liste fermee : le jeune choisit, il ne tape pas. Cela simplifie le geste
// et garantit que l'affiche ne porte que des intitules valides.
//
// Les intitules restent en anglais dans les deux langues : c'est l'usage du
// secteur creatif belge, cela colle aux noms des programmes du CAD, et cela
// evite les tournures bancales du type « je serai design d'objets ».
const METIERS = [
  // Les metiers du design
  'Fashion Designer',
  'Product Designer',
  'Interior Architect',
  // Le digital et l'image
  'Digital Designer',
  '3D Designer',
  'Motion Designer',
  // La communication
  'Art Director',
  'Creative Director',
  'Advertising Creative',
  'Creative',
]

const COPY = {
  fr: {
    eyebrow: 'Plus tard',
    title: 'Annonce-le à tes parents.',
    intro:
      "Complète la phrase, on en fait une image. Tu n'auras plus qu'à la leur envoyer.",
    labelDest: 'Tu l\'annonces à qui ?',
    labelMetier: 'Plus tard, tu seras...',
    placeholderMetier: 'Fashion Designer',
    manque: 'Choisis un métier et écris ton prénom.',
    labelPrenom: 'Ton prénom',
    placeholderPrenom: 'Lina',
    labelCouleur: 'La couleur',
    send: 'L\'envoyer sur WhatsApp',
    byMail: 'L\'envoyer par mail',
    download: 'Télécharger le JPG',
    sending: 'Un instant...',
    shareText: 'Plus tard, je serai',
    hintDesktop:
      'Sur ordinateur, l\'image se télécharge et tu la joins toi-même. Depuis un téléphone, elle part directement dans WhatsApp.',
    hintMail:
      'Ton image se télécharge, puis ta messagerie s\'ouvre. Il ne te reste qu\'à y glisser l\'image.',
    mailSujet: (prenom: string) => `L'avenir de ${prenom}`,
    pastille: 'Rentrée le 14/09',
    merci: 'We wish you a happy creative future.',
    merciFait: 'Ton image est prête.',
    recommencer: 'En créer une autre',
    teeTitre: 'Le t-shirt',
    teeIntro:
      "L'affiche existe aussi en t-shirt. Trois modèles, trois métiers, trois duos de couleurs. Édition limitée, deux encres sur couleur crème.",
    teeModele: 'Ton modèle',
    teeSansPrenom:
      "Chaque t-shirt porte son propre métier, il ne reprend pas celui que tu viens de choisir. Sans prénom et sans pastille de rentrée non plus : ce qui est personnel reste dans l'image que tu envoies à tes parents.",
    teeApercu: 'Modèle de t-shirt',
    teeCompteur: (n: number) => `${n} précommandes`,
    teeSeuil: `Un modèle part en production à partir de ${SEUIL_PRODUCTION} précommandes.`,
    teeTaille: 'Ta taille',
    teeCta: 'Précommander',
    teeBientot: 'Boutique en cours d\'ouverture.',
    teeRaison:
      'La production est lancée en fonction des précommandes, après le 30 septembre. Livraison prévue le 30 octobre si le nombre de commandes est suffisant. On imprime ce qui est commandé, rien de plus.',
    souvenirLabel: 'Idée à valider',
    souvenir: 'Cet email pourrait t\'être renvoyé dans 10 ans, en souvenir.',
    baseline: 'Créer son avenir, ça s\'apprend.',
    thanks: 'Merci de croire en mon',
    punch: 'Moi !',
    prefix: 'plus tard je serai',
    // La chute, accordee au destinataire : « ton » au singulier, « votre »
    // quand la phrase s'adresse aux deux parents.
    ps: (pluriel: boolean) =>
      pluriel
        ? ["P.S. L'IA est un outil.", 'Comme vos logiciels, à votre époque.']
        : ["P.S. L'IA est un outil.", 'Comme tes logiciels, à ton époque.'],
  },
  en: {
    eyebrow: 'Later',
    title: 'Tell your parents.',
    intro: 'Fill in the blank, we turn it into an image. All you do is send it.',
    labelDest: 'Who are you telling?',
    labelMetier: 'Later, you will be...',
    placeholderMetier: 'Fashion Designer',
    manque: 'Pick a job and write your first name.',
    labelPrenom: 'Your first name',
    placeholderPrenom: 'Lina',
    labelCouleur: 'Colour',
    send: 'Send it on WhatsApp',
    byMail: 'Send it by email',
    download: 'Download the JPG',
    sending: 'One moment...',
    shareText: 'Later, I will be',
    hintDesktop:
      'On desktop the image downloads and you attach it yourself. From a phone it goes straight into WhatsApp.',
    hintMail:
      'Your image downloads, then your mail app opens. All you do is drop the image in.',
    mailSujet: (prenom: string) => `${prenom}'s future`,
    // « 14/09 » se lit 9 avril pour un anglophone : on ecrit le mois.
    pastille: 'Term starts 14 Sept',
    merci: 'We wish you a happy creative future.',
    merciFait: 'Your image is ready.',
    recommencer: 'Make another one',
    teeTitre: 'The t-shirt',
    teeIntro:
      'The poster also comes as a t-shirt. Three designs, three job titles, three colour pairs. Limited edition, two inks on cream.',
    teeModele: 'Your design',
    teeSansPrenom:
      'Each t-shirt carries its own job title, not the one you just picked. No first name and no term-start sticker either: what is personal stays in the image you send your parents.',
    teeApercu: 'T-shirt design',
    teeCompteur: (n: number) => `${n} pre-orders`,
    teeSeuil: `A design goes to print from ${SEUIL_PRODUCTION} pre-orders.`,
    teeTaille: 'Your size',
    teeCta: 'Pre-order',
    teeBientot: 'Shop opening soon.',
    teeRaison:
      'Production runs on pre-orders only, after 30 September. Delivery expected 30 October if enough orders come in. We print what is ordered, nothing more.',
    souvenirLabel: 'Idea to validate',
    souvenir: 'This email could be sent back to you in 10 years, as a keepsake.',
    baseline: 'Building a future is something you learn.',
    thanks: 'Thank you for believing in',
    punch: 'Me !',
    prefix: 'later I will be',
    ps: (pluriel: boolean) =>
      pluriel
        ? ['P.S. AI is a tool.', 'So was your favourite software.']
        : ['P.S. AI is a tool.', 'So was your favourite software.'],
  },
}

/** Découpe un texte en lignes qui tiennent dans une largeur donnée. */
function lignes(
  ctx: CanvasRenderingContext2D,
  texte: string,
  largeurMax: number,
): string[] {
  const mots = texte.split(/\s+/).filter(Boolean)
  if (mots.length === 0) return ['']
  const out: string[] = []
  let courante = mots[0]
  for (const mot of mots.slice(1)) {
    const essai = `${courante} ${mot}`
    if (ctx.measureText(essai).width <= largeurMax) {
      courante = essai
    } else {
      out.push(courante)
      courante = mot
    }
  }
  out.push(courante)
  return out
}

export function MyFutureGenerator({ locale }: { locale: string }) {
  const langue = locale === 'fr' ? 'fr' : 'en'
  const L = COPY[langue]
  const qui = DESTINATAIRES[langue]

  const [destinataire, setDestinataire] =
    useState<string>(DESTINATAIRES[locale === 'fr' ? 'fr' : 'en'][0])
  const [metier, setMetier] = useState('')
  const [prenom, setPrenom] = useState('')
  const [palette, setPalette] = useState(0)
  const [busy, setBusy] = useState(false)
  const [peutPartager, setPeutPartager] = useState(false)
  const [fait, setFait] = useState(false)
  const [taille, setTaille] = useState<(typeof TAILLES)[number]>('M')
  const [modele, setModele] = useState(0)
  const [etincelles, setEtincelles] = useState<
    { id: number; x: number; y: number; t: number; d: number; c: string }[]
  >([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  // La carte de l'apercu, qu'on retape a chaque changement de reponse.
  const carteRef = useRef<HTMLDivElement>(null)
  // Le t-shirt est un tirage, pas un envoi : il montre le meme dessin sans
  // les deux elements qui ne valent que pour les parents. Un canvas par
  // modele propose, pour que le choix se fasse sur le dessin et non sur le
  // nom d'une couleur.
  const teeRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const complet = metier !== '' && prenom.trim() !== ''

  const metierAffiche = useMemo(
    () => (metier.trim() || L.placeholderMetier).toUpperCase(),
    [metier, L.placeholderMetier],
  )
  const prenomAffiche = useMemo(
    () => prenom.trim() || L.placeholderPrenom,
    [prenom, L.placeholderPrenom],
  )
  const couleurUI = useMemo(() => teinte(PALETTES[palette]), [palette])
  const couleurTee = useMemo(
    () => teinte(PALETTES[MODELES_TEE[modele].palette]),
    [modele],
  )

  // Une pichenette au doigt a chaque choix. Ignoree sur iOS, sentie sur
  // Android : c'est du bonus, jamais le seul retour d'une action.
  const tap = useCallback(() => {
    try {
      navigator.vibrate?.(8)
    } catch {
      /* le telephone n'en veut pas, tant pis */
    }
  }, [])

  useEffect(() => {
    // navigator.canShare n'existe pas partout : on teste avec un fichier vide.
    try {
      const test = new File([new Blob()], 'x.png', { type: 'image/png' })
      setPeutPartager(Boolean(navigator.canShare?.({ files: [test] })))
    } catch {
      setPeutPartager(false)
    }
  }, [])

  const dessiner = useCallback(async (
    canvas: HTMLCanvasElement | null,
    // Sur le t-shirt : ni prenom ni pastille de rentree. Le prenom n'a de
    // sens que dans le message aux parents, et une date de rentree imprimee
    // perimerait le vetement des le 15 septembre.
    // Un tirage textile ne depend d'aucune reponse : il porte son propre
    // metier et ses propres encres, et perd le prenom comme la pastille de
    // rentree, qui ne valent que pour l'image envoyee aux parents.
    tirage?: { metier: string; palette: number },
  ) => {
    if (!canvas) return
    const indexPalette = tirage ? tirage.palette : palette
    const motMetier = tirage ? tirage.metier.toUpperCase() : metierAffiche
    const aQui = tirage ? qui[0] : destinataire
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { fond, encre, signature } = PALETTES[indexPalette]

    // next/font génère des noms de famille obfusqués : on lit les variables
    // CSS pour retrouver le nom réel, seul utilisable dans ctx.font. Elles
    // sont portées par la page, pas par la racine : on interroge donc le
    // canvas, qui en hérite.
    const styles = getComputedStyle(canvas)
    const serif =
      styles.getPropertyValue('--font-affiche-serif').trim() || 'Georgia'
    const script =
      styles.getPropertyValue('--font-affiche-script').trim() || 'cursive'

    // document.fonts.load() n'accepte qu'une seule famille : on isole la
    // première de la liste. Lui passer la liste complète échoue en silence
    // et le canvas dessinerait alors avec les polices de repli.
    const premiere = (liste: string) => liste.split(',')[0].trim()
    const fSerif = premiere(serif)
    const fScript = premiere(script)

    const F = {
      capitales: (t: number) => `400 ${t}px ${fSerif}, Georgia, serif`,
      roman: (t: number) => `400 ${t}px ${fSerif}, Georgia, serif`,
      gras: (t: number) => `900 ${t}px ${fSerif}, Georgia, serif`,
      italique: (t: number) => `italic 400 ${t}px ${fSerif}, Georgia, serif`,
      anglaise: (t: number) => `400 ${t}px ${fScript}, cursive`,
    }

    try {
      await Promise.all([
        document.fonts.load(`400 60px ${fSerif}`),
        document.fonts.load(`900 140px ${fSerif}`),
        document.fonts.load(`italic 400 46px ${fSerif}`),
        document.fonts.load(`400 110px ${fScript}`),
      ])
    } catch {
      /* si le chargement échoue, le fallback système fera l'affaire */
    }

    ctx.fillStyle = fond
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = encre
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'center'

    const cx = W / 2
    const marge = 110
    const largeur = W - marge * 2

    // L'interlettrage n'existe pas partout : on l'applique quand il existe.
    const espacer = (v: string) => {
      if ('letterSpacing' in ctx) {
        ;(ctx as CanvasRenderingContext2D & { letterSpacing: string })
          .letterSpacing = v
      }
    }

    // Une étincelle à quatre branches, comme sur les t-shirts.
    const etincelle = (x: number, y: number, r: number) => {
      const c = r * 0.16
      ctx.beginPath()
      ctx.moveTo(x, y - r)
      ctx.quadraticCurveTo(x + c, y - c, x + r, y)
      ctx.quadraticCurveTo(x + c, y + c, x, y + r)
      ctx.quadraticCurveTo(x - c, y + c, x - r, y)
      ctx.quadraticCurveTo(x - c, y - c, x, y - r)
      ctx.fill()
    }

    // La pastille d'urgence, en diagonale dans le coin, comme un tampon
    // colle apres coup. Encre pleine et texte dans la couleur du fond :
    // c'est le seul element inverse de l'affiche, donc le plus voyant.
    if (!tirage) {
    ctx.save()
    ctx.fillStyle = signature
    espacer('4px')
    ctx.font = F.gras(27)
    const lp = ctx.measureText(L.pastille.toUpperCase()).width
    const pw = lp + 54
    const ph = 66
    // La pastille est inclinee : c'est son cadre apres rotation qui doit
    // tenir dans la page, pas sa largeur brute. Sans ce calcul, un libelle
    // plus long qu'en francais sort du cadre.
    const angle = (13 * Math.PI) / 180
    const debord =
      (pw / 2) * Math.cos(angle) + (ph / 2) * Math.sin(angle)
    ctx.translate(W - 26 - debord, 166)
    ctx.rotate(-angle)
    ctx.beginPath()
    ctx.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2)
    ctx.fill()
    ctx.fillStyle = fond
    ctx.textBaseline = 'middle'
    ctx.fillText(L.pastille.toUpperCase(), 0, 2)
    ctx.restore()
    ctx.fillStyle = encre
    ctx.textBaseline = 'alphabetic'
    espacer('0px')
    }

    let y = 92

    // Bandeau de tête, en micro-capitales espacées
    espacer('7px')
    ctx.font = F.capitales(27)
    ctx.fillStyle = signature
    ctx.fillText('CAD BRUSSELS  ·  SINCE 1961', cx, y)
    ctx.fillStyle = encre
    espacer('0px')
    y += 190

    // « Papa, maman, » à l'anglaise : la part d'enfance, décalée à gauche
    ctx.font = F.anglaise(126)
    const largPapa = ctx.measureText(`${aQui},`).width
    ctx.textAlign = 'left'
    const xPapa = Math.max(marge, cx - largPapa / 2 - 70)
    ctx.fillText(`${aQui},`, xPapa, y)
    ctx.textAlign = 'center'
    // L'étincelle passe à gauche : le coin droit est pris par la pastille.
    etincelle(Math.max(marge - 20, xPapa - 58), y - 58, 25)
    y += 74

    // « plus tard je serai » en petit romain
    ctx.font = F.roman(52)
    ctx.fillText(L.prefix, cx, y)

    // Le métier, en capitales grasses et interlignage serré. La taille cède
    // jusqu'à tenir en trois lignes ET en largeur : un mot seul trop large
    // ne peut pas être coupé.
    let taille = 176
    let lgs: string[] = []
    for (; taille >= 40; taille -= 4) {
      ctx.font = F.gras(taille)
      lgs = lignes(ctx, motMetier, largeur)
      const plusLarge = Math.max(...lgs.map((l) => ctx.measureText(l).width))
      if (lgs.length <= 3 && plusLarge <= largeur) break
    }
    const interligne = taille * 0.88
    y += taille + 10
    for (const ligne of lgs) {
      ctx.fillText(ligne, cx, y)
      y += interligne
    }

    // La chute : le petit romain, puis « Moi ! » en très grand à l'anglaise.
    // C'est le même geste que « Little Big player Heart » sur le t-shirt :
    // on change de registre au milieu de la phrase, là où ça compte.
    y += 84
    ctx.font = F.roman(50)
    ctx.fillText(L.thanks, cx, y)
    y += 158
    ctx.font = F.anglaise(200)
    ctx.fillText(L.punch, cx, y)

    // La signature du jeune, absente du tirage
    if (!tirage) {
      y += 78
      espacer('5px')
      ctx.font = F.capitales(32)
      ctx.fillText(`— ${prenomAffiche.toUpperCase()}`, cx, y)
      espacer('0px')
    }

    // La chute et le pied appartiennent a l'ecole : ils passent dans la
    // seconde encre, ce qui les detache de la voix du jeune.
    ctx.fillStyle = signature
    const [ps1, ps2] = L.ps(aQui === qui[0])
    ctx.font = F.italique(34)
    ctx.fillText(ps1, cx, H - 172)
    ctx.fillText(ps2, cx, H - 130)

    espacer('3px')
    ctx.font = F.capitales(24)
    // La chute de la campagne, la meme que sur l'affiche des outils : elle
    // signe l'image au lieu de la localiser.
    ctx.fillText('A GOOD IDEA RUNS ON BRAIN JUICE.', cx, H - 68)
    espacer('0px')
    ctx.fillStyle = encre
  }, [destinataire, metierAffiche, prenomAffiche, palette, L])

  // L'apercu se retape comme un tampon quand la reponse change : sans ce
  // battement, le dessin se substitue sans qu'on voie ce qui a bouge.
  useEffect(() => {
    const el = carteRef.current
    if (!el) return
    el.classList.remove('jf-tampon')
    void el.offsetWidth
    el.classList.add('jf-tampon')
  }, [metier, destinataire, palette])

  // Les etincelles du moment ou l'image part. Deux encres, celles du
  // dessin, et rien qui reste a l'ecran plus de deux secondes.
  useEffect(() => {
    if (!fait) {
      setEtincelles([])
      return
    }
    const { encre, signature } = PALETTES[palette]
    setEtincelles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 4 + Math.random() * 90,
        y: 6 + Math.random() * 84,
        t: 11 + Math.random() * 17,
        d: Math.round(Math.random() * 420),
        c: i % 2 ? signature : encre,
      })),
    )
    const h = setTimeout(() => setEtincelles([]), 1900)
    return () => clearTimeout(h)
  }, [fait, palette])

  useEffect(() => {
    void dessiner(canvasRef.current)
    MODELES_TEE.forEach((m, i) => {
      void dessiner(teeRefs.current[i], m)
    })
  }, [dessiner])

  // Un JPG plutot qu'un PNG : plus leger, mieux accepte par les messageries,
  // et le fond etant plein aplat la compression ne se voit pas.
  const nomFichier = useMemo(
    () =>
      `avenir-de-${prenomAffiche
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')}.jpg`,
    [prenomAffiche],
  )

  const fichier = useCallback(async (): Promise<File | null> => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.92),
    )
    if (!blob) return null
    return new File([blob], nomFichier, { type: 'image/jpeg' })
  }, [nomFichier])

  const telecharger = useCallback(async () => {
    const f = await fichier()
    if (!f) return
    const url = URL.createObjectURL(f)
    const a = document.createElement('a')
    a.href = url
    a.download = nomFichier
    a.click()
    URL.revokeObjectURL(url)
    setFait(true)
  }, [fichier, nomFichier])

  const envoyer = useCallback(async () => {
    setBusy(true)
    try {
      const f = await fichier()
      if (!f) return
      if (navigator.canShare?.({ files: [f] })) {
        await navigator.share({
          files: [f],
          text: `${L.shareText} ${metierAffiche.toLowerCase()}.`,
        })
        setFait(true)
      } else {
        await telecharger()
      }
    } catch {
      /* partage annulé par l'utilisateur : rien à signaler */
    } finally {
      setBusy(false)
    }
  }, [fichier, telecharger, metierAffiche, L.shareText])

  // Le mail part de la messagerie du jeune, donc de sa propre adresse.
  // Un lien mailto ne sait pas porter de piece jointe, c'est une limite des
  // navigateurs : on telecharge donc l'image juste avant d'ouvrir le mail,
  // et il ne reste qu'a la glisser dedans.
  const parMail = useCallback(async () => {
    setBusy(true)
    try {
      await telecharger()
      const sujet = encodeURIComponent(L.mailSujet(prenomAffiche))
      const corps = encodeURIComponent(
        `${destinataire},\n\n${L.prefix} ${metierAffiche.toLowerCase()}.\n\n${L.thanks} ${L.punch}\n\n${prenomAffiche}`,
      )
      window.location.href = `mailto:?subject=${sujet}&body=${corps}`
      setFait(true)
    } finally {
      setBusy(false)
    }
  }, [telecharger, L, prenomAffiche, destinataire, metierAffiche])

  const champ =
    'w-full rounded-lg border-2 border-ink/15 bg-white px-4 py-3 text-lg text-ink outline-none transition focus:border-ink'

  return (
    <div className="flex flex-col gap-16">
      {/* Tout ce qui bouge est enferme dans prefers-reduced-motion : ceux
          qui ont demande le calme a leur systeme gardent l'outil entier,
          simplement sans mouvement. */}
      <style>{`
        .jf-etincelle { position: absolute; opacity: 0; pointer-events: none }
        @media (prefers-reduced-motion: no-preference) {
          .jf-tampon { animation: jf-tampon .42s cubic-bezier(.22,1,.36,1) }
          @keyframes jf-tampon {
            0%   { transform: scale(.978) rotate(-.35deg); opacity: .6 }
            58%  { transform: scale(1.008) rotate(.12deg); opacity: 1 }
            100% { transform: none }
          }
          .jf-etincelle { animation: jf-etincelle 1s ease-out forwards }
          @keyframes jf-etincelle {
            0%   { opacity: 0; transform: scale(.15) rotate(0) }
            32%  { opacity: 1; transform: scale(1) rotate(40deg) }
            100% { opacity: 0; transform: scale(.35) rotate(90deg) translateY(-30px) }
          }
          .jf-prete { animation: jf-prete 2.6s ease-in-out infinite }
          @keyframes jf-prete {
            0%, 100% { box-shadow: 0 0 0 0 rgba(20,20,15,.18) }
            50%      { box-shadow: 0 0 0 12px rgba(20,20,15,0) }
          }
        }
      `}</style>
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      {/* Le formulaire */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/50">
            {L.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            {L.title}
          </h1>
          <p className="mt-4 max-w-md text-lg text-ink/70">{L.intro}</p>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
            {L.labelDest}
          </legend>
          <div className="flex flex-wrap gap-2">
            {qui.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  tap()
                  setDestinataire(d)
                }}
                aria-pressed={destinataire === d}
                className={`min-h-[44px] rounded-full border-2 px-4 text-base font-semibold transition active:scale-95 ${
                  destinataire === d
                    ? 'text-paper'
                    : 'border-ink/20 text-ink hover:border-ink/50'
                }`}
                style={
                  destinataire === d
                    ? {
                        background: couleurUI,
                        borderColor: couleurUI,
                        color: lisible(couleurUI),
                      }
                    : undefined
                }
              >
                {d}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
            {L.labelMetier}
          </legend>
          <div className="flex flex-wrap gap-2">
            {METIERS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  tap()
                  setMetier(m)
                }}
                aria-pressed={metier === m}
                className={`min-h-[44px] rounded-full border-2 px-4 text-base font-semibold transition active:scale-95 ${
                  metier === m
                    ? 'text-paper'
                    : 'border-ink/20 text-ink hover:border-ink/50'
                }`}
                style={
                  metier === m
                    ? {
                        background: couleurUI,
                        borderColor: couleurUI,
                        color: lisible(couleurUI),
                      }
                    : undefined
                }
              >
                {m}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
            {L.labelPrenom}
          </span>
          <input
            className={champ}
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder={L.placeholderPrenom}
            maxLength={20}
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
            {L.labelCouleur}
          </legend>
          <div className="flex flex-wrap gap-3">
            {PALETTES.map((p, i) => (
              <button
                key={p.nom}
                type="button"
                onClick={() => {
                  tap()
                  setPalette(i)
                }}
                aria-label={p.nom}
                aria-pressed={palette === i}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition duration-200 active:scale-95 ${
                  palette === i
                    ? 'border-ink scale-110'
                    : 'border-ink/15 hover:scale-105 hover:border-ink/40'
                }`}
                style={{ background: p.fond }}
              >
                <span
                  className="block h-6 w-6 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${p.encre} 0 50%, ${p.signature} 50% 100%)`,
                  }}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={envoyer}
            disabled={busy || !complet}
            className={`min-h-[56px] rounded-full px-8 text-lg font-bold transition active:scale-[.98] hover:opacity-90 disabled:opacity-60 ${
              complet && !fait && !busy ? 'jf-prete' : ''
            }`}
            style={{
              background: complet ? couleurUI : undefined,
              color: complet ? lisible(couleurUI) : undefined,
            }}
          >
            {busy ? L.sending : peutPartager ? L.send : L.download}
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={parMail}
              disabled={busy || !complet}
              className="min-h-[48px] flex-1 rounded-full border-2 border-ink px-6 text-base font-semibold text-ink transition hover:bg-ink hover:text-paper disabled:opacity-40"
            >
              {L.byMail}
            </button>
            {peutPartager && (
              <button
                type="button"
                onClick={telecharger}
                disabled={busy || !complet}
                className="min-h-[48px] flex-1 rounded-full border-2 border-ink/20 px-6 text-base font-semibold text-ink transition hover:border-ink disabled:opacity-40"
              >
                {L.download}
              </button>
            )}
          </div>

          {fait && (
            <div className="rounded-xl border-2 border-accent bg-accent/10 p-5">
              <p className="text-xl font-extrabold leading-snug text-ink">
                {L.merci}
              </p>
              <p className="mt-1 text-sm text-ink/60">{L.merciFait}</p>
              <button
                type="button"
                onClick={() => setFait(false)}
                className="mt-3 text-sm font-semibold text-ink underline underline-offset-4"
              >
                {L.recommencer}
              </button>
            </div>
          )}

          {!complet && <p className="text-sm text-ink/50">{L.manque}</p>}
          {complet && (
            <p className="text-sm text-ink/50">
              {peutPartager ? L.hintMail : L.hintDesktop}
            </p>
          )}

          {/* Piste, pas encore une fonctionnalite : rien ne stocke l'adresse
              ni ne programme d'envoi. Le cadre en pointilles et le libelle
              le disent, pour que personne ne la prenne pour une promesse. */}
          <div className="mt-2 rounded-xl border-2 border-dashed border-ink/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
              {L.souvenirLabel}
            </p>
            <p className="mt-1 text-base font-medium italic text-ink/70">
              {L.souvenir}
            </p>
          </div>
        </div>
      </div>

      {/* L'aperçu. Sur téléphone il passe en tête et sa hauteur est bridée :
          à pleine largeur il occuperait tout l'écran avant la première
          question, alors qu'il doit rester visible pendant qu'on répond. */}
      <div className="order-first lg:order-none lg:sticky lg:top-24">
        <div
          ref={carteRef}
          className="relative mx-auto w-fit lg:w-full lg:max-w-[420px]"
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="mx-auto max-h-[40vh] w-auto rounded-xl shadow-lg lg:max-h-none lg:w-full"
            aria-label="Aperçu de ton affiche"
          />
          {etincelles.map((e) => (
            <svg
              key={e.id}
              className="jf-etincelle"
              style={{
                left: `${e.x}%`,
                top: `${e.y}%`,
                width: e.t,
                height: e.t,
                animationDelay: `${e.d}ms`,
              }}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 0c1.1 8.9 3 10.9 12 12-9 1.1-10.9 3.1-12 12-1.1-8.9-3-10.9-12-12 9-1.1 10.9-3.1 12-12z"
                fill={e.c}
              />
            </svg>
          ))}
        </div>
      </div>
    </div>

    {/* La précommande du t-shirt */}
    <section className="rounded-2xl border-2 border-ink/15 p-6 sm:p-8">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
          {L.teeTitre}
        </h2>
        <p className="mt-2 text-lg text-ink/70">{L.teeIntro}</p>
      </div>

      {/* Le choix se fait sur le dessin, pas sur un nom de couleur */}
      <fieldset className="mt-7">
        <legend className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
          {L.teeModele}
        </legend>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:gap-4">
          {MODELES_TEE.map((m, i) => (
            <button
              key={m.metier}
              type="button"
              onClick={() => {
                tap()
                setModele(i)
              }}
              aria-pressed={modele === i}
              className={`rounded-xl border-2 p-1.5 transition duration-200 active:scale-95 ${
                modele === i
                  ? '-translate-y-1'
                  : 'border-transparent hover:-translate-y-0.5 hover:border-ink/25'
              }`}
              style={
                modele === i
                  ? { borderColor: teinte(PALETTES[m.palette]) }
                  : undefined
              }
            >
              <canvas
                ref={(el) => {
                  teeRefs.current[i] = el
                }}
                width={W}
                height={H}
                className="block w-full rounded-lg shadow-md sm:w-40"
                aria-label={`${L.teeApercu} ${m.metier}`}
              />

              {/* Le compteur de précommandes du modèle, avec sa jauge. Il
                  n'apparaît que tant que les chiffres sont simulés : remis
                  à false, ils disparaissent au lieu de mentir en silence. */}
              {COMPTEURS_SIMULES && (
                <span className="mt-2 block px-0.5">
                  <span
                    className="block text-center text-[11px] font-bold leading-tight sm:text-xs"
                    style={{ color: teinte(PALETTES[m.palette]) }}
                  >
                    {L.teeCompteur(m.precommandes)}
                  </span>
                  <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-ink/10">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (m.precommandes / OBJECTIF_TEE) * 100,
                        )}%`,
                        background: teinte(PALETTES[m.palette]),
                      }}
                    />
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      </fieldset>

      {COMPTEURS_SIMULES && (
        <p className="mt-4 text-sm font-semibold text-ink/50">{L.teeSeuil}</p>
      )}

      <p className="mt-5 max-w-2xl text-base text-ink/60">{L.teeSansPrenom}</p>

      <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
            {L.teeTaille}
          </legend>
          <div className="flex gap-2">
            {TAILLES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  tap()
                  setTaille(t)
                }}
                aria-pressed={taille === t}
                className={`h-12 w-14 rounded-lg border-2 text-base font-bold transition active:scale-95 ${
                  taille === t
                    ? ''
                    : 'border-ink/20 text-ink hover:border-ink/50'
                }`}
                style={
                  taille === t
                    ? {
                        background: couleurTee,
                        borderColor: couleurTee,
                        color: lisible(couleurTee),
                      }
                    : undefined
                }
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        {SHOPIFY_PRODUIT ? (
          <a
            href={`${SHOPIFY_PRODUIT}?modele=${encodeURIComponent(
              MODELES_TEE[modele].metier,
            )}&taille=${taille}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[56px] items-center justify-center rounded-full bg-ink px-8 text-lg font-bold text-paper transition hover:opacity-90"
          >
            {L.teeCta}
          </a>
        ) : (
          <div className="flex min-h-[56px] items-center justify-center rounded-full border-2 border-dashed border-ink/25 px-8 text-base font-semibold text-ink/45">
            {L.teeBientot}
          </div>
        )}
      </div>

      {/* Le parti pris de production, dit franchement */}
      <p className="mt-6 max-w-2xl border-t-2 border-ink/10 pt-5 text-base text-ink/70">
        {L.teeRaison}
      </p>
    </section>
    </div>
  )
}
