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

type Palette = { nom: string; fond: string; encre: string }

// Impression une seule couleur sur fond teinté, comme les t-shirts.
// Les encres viennent de la palette CAD, les fonds sont des textiles.
const PALETTES: Palette[] = [
  { nom: 'Crème et nuit', fond: '#F1EDE3', encre: '#2f346d' },
  { nom: 'Crème et rose', fond: '#F1EDE3', encre: '#ff277f' },
  { nom: 'Nuit et crème', fond: '#2f346d', encre: '#F1EDE3' },
  { nom: 'Encre et crème', fond: '#14140F', encre: '#F1EDE3' },
]

const DESTINATAIRES = ['Papa, maman', 'Maman', 'Papa', 'Mamie'] as const

const COPY = {
  fr: {
    eyebrow: 'Plus tard',
    title: 'Annonce-le à tes parents.',
    intro:
      "Complète la phrase, on en fait une image. Tu n'auras plus qu'à la leur envoyer.",
    labelDest: 'Tu l\'annonces à qui ?',
    labelMetier: 'Plus tard, tu seras...',
    placeholderMetier: 'directeur artistique',
    labelPrenom: 'Ton prénom',
    placeholderPrenom: 'Lina',
    labelCouleur: 'La couleur',
    send: 'L\'envoyer à mes parents',
    download: 'Télécharger l\'image',
    sending: 'Un instant...',
    shareText: 'Plus tard, je serai',
    hintDesktop:
      'Sur ordinateur, l\'image se télécharge. Depuis un téléphone, elle part directement dans WhatsApp.',
    baseline: 'Créer son avenir, ça s\'apprend.',
    thanks: 'Merci de croire en mon',
    punch: 'Moi !',
    prefix: 'plus tard je serai',
  },
  en: {
    eyebrow: 'Later',
    title: 'Tell your parents.',
    intro: 'Fill in the blank, we turn it into an image. All you do is send it.',
    labelDest: 'Who are you telling?',
    labelMetier: 'Later, you will be...',
    placeholderMetier: 'art director',
    labelPrenom: 'Your first name',
    placeholderPrenom: 'Lina',
    labelCouleur: 'Colour',
    send: 'Send it to my parents',
    download: 'Download the image',
    sending: 'One moment...',
    shareText: 'Later, I will be',
    hintDesktop:
      'On desktop the image downloads. From a phone it goes straight into WhatsApp.',
    baseline: 'Building a future is something you learn.',
    thanks: 'Thank you for believing in',
    punch: 'Me !',
    prefix: 'later I will be',
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
  const L = COPY[locale === 'fr' ? 'fr' : 'en']

  const [destinataire, setDestinataire] =
    useState<(typeof DESTINATAIRES)[number]>('Papa, maman')
  const [metier, setMetier] = useState('')
  const [prenom, setPrenom] = useState('')
  const [palette, setPalette] = useState(0)
  const [busy, setBusy] = useState(false)
  const [peutPartager, setPeutPartager] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const dessiner = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { fond, encre } = PALETTES[palette]

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

    let y = 130

    // Bandeau de tête, en micro-capitales espacées
    espacer('7px')
    ctx.font = F.capitales(27)
    ctx.fillText('CAD BRUSSELS  ·  SINCE 1961', cx, y)
    espacer('0px')
    y += 150

    // « Papa, maman, » à l'anglaise : la part d'enfance, décalée à gauche
    ctx.font = F.anglaise(126)
    const largPapa = ctx.measureText(`${destinataire},`).width
    ctx.textAlign = 'left'
    const xPapa = Math.max(marge, cx - largPapa / 2 - 70)
    ctx.fillText(`${destinataire},`, xPapa, y)
    ctx.textAlign = 'center'
    // L'étincelle se pose à côté, en haut, comme sur le t-shirt.
    etincelle(Math.min(W - marge - 30, xPapa + largPapa + 52), y - 62, 27)
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

    // La signature et le pied, en micro-capitales
    y += 78
    espacer('5px')
    ctx.font = F.capitales(32)
    ctx.fillText(`— ${prenomAffiche.toUpperCase()}`, cx, y)
    espacer('3px')
    ctx.font = F.capitales(24)
    ctx.fillText('CREATED WITH PASSION IN BRUSSELS', cx, H - 88)
    espacer('0px')
  }, [destinataire, metierAffiche, prenomAffiche, palette, L])

  useEffect(() => {
    void dessiner()
  }, [dessiner])

  const fichier = useCallback(async (): Promise<File | null> => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    )
    if (!blob) return null
    return new File([blob], 'plus-tard.png', { type: 'image/png' })
  }, [])

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
      } else {
        const url = URL.createObjectURL(f)
        const a = document.createElement('a')
        a.href = url
        a.download = 'plus-tard.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      /* partage annulé par l'utilisateur : rien à signaler */
    } finally {
      setBusy(false)
    }
  }, [fichier, metierAffiche, L.shareText])

  const champ =
    'w-full rounded-lg border-2 border-ink/15 bg-white px-4 py-3 text-lg text-ink outline-none transition focus:border-ink'

  return (
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

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
            {L.labelMetier}
          </span>
          <input
            className={champ}
            value={metier}
            onChange={(e) => setMetier(e.target.value)}
            placeholder={L.placeholderMetier}
            maxLength={40}
          />
        </label>

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
          <div className="flex gap-3">
            {PALETTES.map((p, i) => (
              <button
                key={p.nom}
                type="button"
                onClick={() => setPalette(i)}
                aria-label={p.nom}
                aria-pressed={palette === i}
                className={`h-11 w-11 rounded-full border-2 transition ${
                  palette === i
                    ? 'border-ink scale-110'
                    : 'border-ink/15 hover:border-ink/40'
                }`}
                style={{ background: p.fond }}
              />
            ))}
          </div>
        </fieldset>

        <div className="mt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={envoyer}
            disabled={busy}
            className="min-h-[56px] rounded-full bg-ink px-8 text-lg font-bold text-paper transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? L.sending : peutPartager ? L.send : L.download}
          </button>
          {!peutPartager && (
            <p className="text-sm text-ink/50">{L.hintDesktop}</p>
          )}
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
  )
}
