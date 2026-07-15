import { describe, it, expect } from 'vitest'
import { themeForSlug } from './program-themes'

describe('themeForSlug', () => {
  it('renvoie la classe de thème pour un programme connu', () => {
    expect(themeForSlug('interior-architecture-design')).toBe('theme-interior')
    expect(themeForSlug('fashion-accessory-design')).toBe('theme-fashion')
    expect(themeForSlug('image-3d-motion-video-ai')).toBe('theme-image-3d')
  })

  it('mappe les hubs sur l’accent dominant de leur groupe', () => {
    expect(themeForSlug('programmes')).toBe('theme-fashion')
    expect(themeForSlug('masters')).toBe('theme-image-3d')
  })

  it('renvoie une chaîne vide pour un slug inconnu', () => {
    // Contrat clé : la valeur se spread dans className sans condition, donc
    // jamais "undefined" ni "null" qui pollueraient l'attribut class.
    expect(themeForSlug('ceci-nexiste-pas')).toBe('')
  })

  it('renvoie une chaîne vide pour null, undefined ou vide', () => {
    expect(themeForSlug(null)).toBe('')
    expect(themeForSlug(undefined)).toBe('')
    expect(themeForSlug('')).toBe('')
  })
})
