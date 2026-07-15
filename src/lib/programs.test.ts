import { describe, it, expect } from 'vitest'
import { PROGRAMS, programBySlug, isProgramSlug } from './programs'

describe('programBySlug', () => {
  it('retrouve un programme existant par son slug', () => {
    const p = programBySlug('interior-architecture-design')
    expect(p).toBeDefined()
    expect(p?.slug).toBe('interior-architecture-design')
  })

  it('renvoie undefined pour un slug inconnu', () => {
    expect(programBySlug('ceci-nexiste-pas')).toBeUndefined()
  })

  it('renvoie undefined pour un hub ou une page éditoriale', () => {
    // Ces routes existent mais ne sont pas des programmes du catalogue.
    expect(programBySlug('programmes')).toBeUndefined()
    expect(programBySlug('masters')).toBeUndefined()
    expect(programBySlug('about')).toBeUndefined()
  })

  it('renvoie undefined pour null, undefined ou chaîne vide', () => {
    expect(programBySlug(null)).toBeUndefined()
    expect(programBySlug(undefined)).toBeUndefined()
    expect(programBySlug('')).toBeUndefined()
  })

  it('chaque slug du catalogue est bien retrouvable (cohérence interne)', () => {
    for (const p of PROGRAMS) {
      expect(programBySlug(p.slug)?.slug).toBe(p.slug)
    }
  })
})

describe('isProgramSlug', () => {
  it('vrai pour un vrai programme', () => {
    expect(isProgramSlug('fashion-accessory-design')).toBe(true)
  })

  it('faux pour un hub, un slug inconnu ou une valeur vide', () => {
    expect(isProgramSlug('masters')).toBe(false)
    expect(isProgramSlug('ceci-nexiste-pas')).toBe(false)
    expect(isProgramSlug(null)).toBe(false)
    expect(isProgramSlug(undefined)).toBe(false)
  })
})
