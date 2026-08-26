import { describe, it, expect } from 'vitest'
import { assainirLibelle } from './appellations'

describe('assainirLibelle', () => {
  it('remplace les appellations protégées des libellés de navigation', () => {
    expect(assainirLibelle('Bachelor')).toBe('Undergraduate')
    expect(assainirLibelle('Master')).toBe('Postgraduate')
    expect(assainirLibelle('Bachelors')).toBe('Undergraduates')
    expect(assainirLibelle('Masters')).toBe('Postgraduates')
  })

  it('traite les tournures complètes avant les mots isolés', () => {
    expect(assainirLibelle('Tous les Masters')).toBe('Tous les postgraduates')
    expect(assainirLibelle('Voir tous les Bachelors')).toBe('Voir tous les undergraduates')
    expect(assainirLibelle('See all Masters')).toBe('See all postgraduates')
  })

  it('élide devant Undergraduate, qui commence par une voyelle', () => {
    // Le remplacement mot à mot donnerait « du Undergraduate ». Relevé
    // sur la production : c'est le seul cas de mauvais français que
    // produisaient les règles.
    expect(assainirLibelle('du Bachelor au Master')).toBe(
      "de l'Undergraduate au Postgraduate",
    )
    expect(assainirLibelle('Le Bachelor du CAD')).toBe("L'Undergraduate du CAD")
    expect(assainirLibelle('inscrit au Bachelor')).toBe("inscrit à l'Undergraduate")
    expect(assainirLibelle('Ce Bachelor dure 3 ans')).toBe('Cet Undergraduate dure 3 ans')
  })

  it('n’élide pas devant Postgraduate, qui commence par une consonne', () => {
    expect(assainirLibelle('du Master')).toBe('du Postgraduate')
    expect(assainirLibelle('Le Master long')).toBe('Le Postgraduate long')
    expect(assainirLibelle('Ce Master 2 ans')).toBe('Ce Postgraduate 2 ans')
  })

  it('laisse intactes les tournures qui n’appellent pas d’élision', () => {
    expect(assainirLibelle('un Bachelor en design')).toBe('un Undergraduate en design')
    expect(assainirLibelle("d'un Bachelor")).toBe("d'un Undergraduate")
    expect(assainirLibelle('les Bachelors')).toBe('les Undergraduates')
  })

  it('applique le renommage du programme mobilier', () => {
    expect(assainirLibelle('Home & Living')).toBe('Furniture & Product Design')
    expect(assainirLibelle('Home & Living Design')).toBe('Furniture & Product Design')
  })

  it('laisse intact le verbe anglais et les mots communs', () => {
    // « masterclass » n'est pas un grade, et « master » en minuscule est
    // le verbe : les toucher casserait des libellés légitimes.
    expect(assainirLibelle('Masterclass motion design')).toBe('Masterclass motion design')
    expect(assainirLibelle('Workshop to master After Effects')).toBe(
      'Workshop to master After Effects',
    )
  })

  it('renvoie les libellés sans appellation tels quels', () => {
    expect(assainirLibelle('Événements')).toBe('Événements')
    expect(assainirLibelle('Architecture d’intérieur')).toBe('Architecture d’intérieur')
  })

  it('traite plusieurs occurrences dans un même libellé', () => {
    expect(assainirLibelle('Bachelor et Master')).toBe('Undergraduate et Postgraduate')
  })

  it('reste stable sur appels répétés (état des regex globales)', () => {
    // Une regex /g conserve son lastIndex : sans remise à zéro, le
    // deuxième appel renverrait un résultat différent du premier.
    expect(assainirLibelle('Master')).toBe('Postgraduate')
    expect(assainirLibelle('Master')).toBe('Postgraduate')
    expect(assainirLibelle('Master')).toBe('Postgraduate')
  })

  it('supporte les valeurs vides venant du CMS', () => {
    expect(assainirLibelle(null)).toBeNull()
    expect(assainirLibelle(undefined)).toBeUndefined()
    expect(assainirLibelle('')).toBe('')
  })
})
