import { describe, it, expect } from 'vitest'
import { estVide, fusionnerVersAnglais } from './copie-locale'

const texteRiche = (t: string) => ({ root: { children: [{ children: [{ text: t }] }] } })
const texteRicheVide = { root: { children: [{ children: [{ text: '' }] }] } }

describe('estVide', () => {
  it('considère vides la chaîne blanche, le nul et la liste vide', () => {
    expect(estVide('')).toBe(true)
    expect(estVide('   ')).toBe(true)
    expect(estVide(null)).toBe(true)
    expect(estVide(undefined)).toBe(true)
    expect(estVide([])).toBe(true)
  })

  it('reconnaît un texte riche réduit à un paragraphe vide', () => {
    // Un éditeur Lexical jamais rempli ne renvoie pas null mais une
    // structure complète contenant une chaîne vide : sans ce cas, le
    // bouton croirait le champ rédigé et ne le remplirait jamais.
    expect(estVide(texteRicheVide)).toBe(true)
    expect(estVide(texteRiche('Bonjour'))).toBe(false)
  })

  it('ne confond pas une valeur fausse avec une valeur absente', () => {
    // Zéro et faux sont des réponses, pas des vides.
    expect(estVide(0)).toBe(false)
    expect(estVide(false)).toBe(false)
  })
})

describe('fusionnerVersAnglais', () => {
  it('N’ÉCRASE JAMAIS un texte anglais déjà saisi', () => {
    // L'invariant de la fonction. S'il tombe, une traduction faite à la
    // main disparaît au clic suivant, ce qui est pire que la friction
    // que le bouton est censé supprimer.
    const { correctif, remplis } = fusionnerVersAnglais(
      { title: 'Titre français' },
      { title: 'Existing English' },
    )
    expect(correctif).toEqual({})
    expect(remplis).toBe(0)
  })

  it('remplit un champ anglais vide ou absent', () => {
    expect(fusionnerVersAnglais({ title: 'T' }, { title: '' }).correctif).toEqual({ title: 'T' })
    expect(fusionnerVersAnglais({ title: 'T' }, {}).correctif).toEqual({ title: 'T' })
  })

  it('ne copie jamais une adresse de page', () => {
    // Recopier un slug créerait deux pages à la même adresse.
    const { correctif } = fusionnerVersAnglais(
      { slug: 'a-propos', path: '/a-propos', title: 'À propos' },
      { slug: '', path: '', title: '' },
    )
    expect(correctif).toEqual({ title: 'À propos' })
  })

  it('descend dans un objet et n’y remplit que le vide', () => {
    const { correctif } = fusionnerVersAnglais(
      { meta: { title: 'T FR', description: 'D FR' } },
      { meta: { title: 'T EN', description: '' } },
    )
    expect(correctif).toEqual({ meta: { title: 'T EN', description: 'D FR' } })
  })

  it('copie une liste absente mais ne touche pas une liste déjà remplie', () => {
    // Fusionner ligne à ligne supposerait le même nombre d'éléments dans
    // le même ordre dans les deux langues, ce que rien ne garantit.
    expect(fusionnerVersAnglais({ blocs: [{ h: 'A' }] }, { blocs: [] }).correctif).toEqual({
      blocs: [{ h: 'A' }],
    })
    expect(
      fusionnerVersAnglais({ blocs: [{ h: 'A' }, { h: 'B' }] }, { blocs: [{ h: 'Z' }] }).correctif,
    ).toEqual({})
  })

  it('traite le texte riche d’un bloc et non clé par clé', () => {
    expect(
      fusionnerVersAnglais({ corps: texteRiche('Bonjour') }, { corps: texteRicheVide }).correctif,
    ).toEqual({ corps: texteRiche('Bonjour') })
    expect(
      fusionnerVersAnglais({ corps: texteRiche('Bonjour') }, { corps: texteRiche('Hello') })
        .correctif,
    ).toEqual({})
  })

  it('ignore les champs techniques et l’état de publication', () => {
    // Copier `_status` publierait un brouillon anglais au passage.
    const { correctif } = fusionnerVersAnglais(
      { id: 12, createdAt: 'x', updatedAt: 'x', _status: 'published', title: 'T' },
      { id: 12, createdAt: 'y', updatedAt: 'y', _status: 'draft', title: '' },
    )
    expect(correctif).toEqual({ title: 'T' })
  })

  it('rend le compte et le chemin des champs remplis', () => {
    // Le nombre est affiché à l'éditeur pour qu'il sache s'il doit
    // relire beaucoup ou pas du tout.
    const r = fusionnerVersAnglais(
      { title: 'T', meta: { description: 'D' }, corps: texteRiche('C') },
      { title: '', meta: { description: '' }, corps: texteRicheVide },
    )
    expect(r.remplis).toBe(3)
    expect(r.chemins).toEqual(['title', 'meta.description', 'corps'])
  })

  it('ne fait rien quand le français est vide', () => {
    expect(fusionnerVersAnglais({ title: '' }, { title: '' }).correctif).toEqual({})
    expect(fusionnerVersAnglais(null, null).correctif).toEqual({})
  })
})
