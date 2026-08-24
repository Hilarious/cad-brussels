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

const DESTINATAIRES = ['Papa, maman', 'Maman', 'Papa', 'Mamie'] as const

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
      "L'affiche existe aussi en t-shirt. Édition limitée, deux encres sur gris chiné.",
    teeSansPrenom:
      "Le t-shirt reprend ton métier et tes deux couleurs, mais pas ton prénom ni la pastille de rentrée. Ce qui est personnel reste dans l'image que tu envoies à tes parents.",
    teeApercu: 'Aperçu du t-shirt, sans le prénom ni la pastille',
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
    pastille: 'Term starts 14/09',
    merci: 'We wish you a happy creative future.',
    merciFait: 'Your image is ready.',
    recommencer: 'Make another one',
    teeTitre: 'The t-shirt',
    teeIntro:
      'The poster also comes as a t-shirt. Limited edition, two inks on heather grey.',
    teeSansPrenom:
      'The t-shirt keeps your job title and your two inks, but not your first name and not the term-start sticker. What is personal stays in the image you send your parents.',
    teeApercu: 'Preview of the t-shirt, without the first name or the sticker',
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

  const [destinataire, setDestinataire] =
    useState<(typeof DESTINATAIRES)[number]>('Papa, maman')
  const [metier, setMetier] = useState('')
  const [prenom, setPrenom] = useState('')
  const [palette, setPalette] = useState(0)
  const [busy, setBusy] = useState(false)
  const [peutPartager, setPeutPartager] = useState(false)
  const [fait, setFait] = useState(false)
  const [taille, setTaille] = useState<(typeof TAILLES)[number]>('M')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Le t-shirt est un tirage, pas un envoi : il montre le meme dessin sans
  // les deux elements qui ne valent que pour les parents.
  const teeCanvasRef = useRef<HTMLCanvasElement>(null)
  const complet = metier !== '' && prenom.trim() !== ''

  const metierAffiche = useMemo(
    () => (metier.trim() || L.placeholderMetier).toUpperCase(),
    [metier, L.placeholderMetier],
  )
  const prenomAffiche = useMemo(
    () => prenom.trim() || L.placeholderPrenom,
    [prenom, L.placeholderPrenom],
  )

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
    tirage = false,
  ) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { fond, encre, signature } = PALETTES[palette]

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
    ctx.translate(W - 158, 166)
    ctx.rotate((-13 * Math.PI) / 180)
    espacer('4px')
    ctx.font = F.gras(27)
    const lp = ctx.measureText(L.pastille.toUpperCase()).width
    const pw = lp + 54
    const ph = 66
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
    const largPapa = ctx.measureText(`${destinataire},`).width
    ctx.textAlign = 'left'
    const xPapa = Math.max(marge, cx - largPapa / 2 - 70)
    ctx.fillText(`${destinataire},`, xPapa, y)
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
      lgs = lignes(ctx, metierAffiche, largeur)
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
    const [ps1, ps2] = L.ps(destinataire === 'Papa, maman')
    ctx.font = F.italique(34)
    ctx.fillText(ps1, cx, H - 172)
    ctx.fillText(ps2, cx, H - 130)

    espacer('3px')
    ctx.font = F.capitales(24)
    ctx.fillText('CREATED WITH PASSION IN BRUSSELS', cx, H - 68)
    espacer('0px')
    ctx.fillStyle = encre
  }, [destinataire, metierAffiche, prenomAffiche, palette, L])

  useEffect(() => {
    void dessiner(canvasRef.current)
    void dessiner(teeCanvasRef.current, true)
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
            {DESTINATAIRES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDestinataire(d)}
                aria-pressed={destinataire === d}
                className={`min-h-[44px] rounded-full border-2 px-4 text-base font-semibold transition ${
                  destinataire === d
                    ? 'border-ink bg-ink text-paper'
                    : 'border-ink/20 text-ink hover:border-ink/50'
                }`}
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
                onClick={() => setMetier(m)}
                aria-pressed={metier === m}
                className={`min-h-[44px] rounded-full border-2 px-4 text-base font-semibold transition ${
                  metier === m
                    ? 'border-ink bg-ink text-paper'
                    : 'border-ink/20 text-ink hover:border-ink/50'
                }`}
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
                onClick={() => setPalette(i)}
                aria-label={p.nom}
                aria-pressed={palette === i}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                  palette === i
                    ? 'border-ink scale-110'
                    : 'border-ink/15 hover:border-ink/40'
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
            className="min-h-[56px] rounded-full bg-ink px-8 text-lg font-bold text-paper transition hover:opacity-90 disabled:opacity-60"
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
            <button
              type="button"
              onClick={telecharger}
              disabled={busy || !complet}
              className="min-h-[48px] flex-1 rounded-full border-2 border-ink/20 px-6 text-base font-semibold text-ink transition hover:border-ink disabled:opacity-40"
            >
              {L.download}
            </button>
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

      {/* L'aperçu */}
      <div className="lg:sticky lg:top-24">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full max-w-[420px] rounded-xl shadow-lg"
          aria-label="Aperçu de ton affiche"
        />
      </div>
    </div>

    {/* La précommande du t-shirt */}
    <section className="rounded-2xl border-2 border-ink/15 p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-xl flex-col gap-5 sm:flex-row sm:items-start">
          <canvas
            ref={teeCanvasRef}
            width={W}
            height={H}
            className="w-36 shrink-0 rounded-lg shadow-md sm:w-44"
            aria-label={L.teeApercu}
          />
          <div>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              {L.teeTitre}
            </h2>
            <p className="mt-2 text-lg text-ink/70">{L.teeIntro}</p>
            <p className="mt-3 text-base text-ink/60">{L.teeSansPrenom}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
              {L.teeTaille}
            </legend>
            <div className="flex gap-2">
              {TAILLES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTaille(t)}
                  aria-pressed={taille === t}
                  className={`h-12 w-14 rounded-lg border-2 text-base font-bold transition ${
                    taille === t
                      ? 'border-ink bg-ink text-paper'
                      : 'border-ink/20 text-ink hover:border-ink/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          {SHOPIFY_PRODUIT ? (
            <a
              href={`${SHOPIFY_PRODUIT}?taille=${taille}`}
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
      </div>

      {/* Le parti pris de production, dit franchement */}
      <p className="mt-6 max-w-2xl border-t-2 border-ink/10 pt-5 text-base text-ink/70">
        {L.teeRaison}
      </p>
    </section>
    </div>
  )
}
