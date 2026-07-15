import { describe, it, expect } from 'vitest'
import { localized } from './localize'

describe('localized', () => {
  describe('valeurs vides', () => {
    it('renvoie "#" pour null, undefined ou chaîne vide', () => {
      expect(localized(null, 'fr')).toBe('#')
      expect(localized(undefined, 'fr')).toBe('#')
      expect(localized('', 'fr')).toBe('#')
    })
  })

  describe('URL externes (laissées intactes)', () => {
    it('ne touche pas une URL http ou https', () => {
      expect(localized('https://cad.be', 'fr')).toBe('https://cad.be')
      expect(localized('http://example.com/x', 'en')).toBe('http://example.com/x')
    })

    it('reconnaît le protocole quelle que soit la casse', () => {
      expect(localized('HTTPS://cad.be', 'fr')).toBe('HTTPS://cad.be')
    })
  })

  describe('chemins internes simples', () => {
    it('préfixe par la langue', () => {
      expect(localized('/contact', 'fr')).toBe('/fr/contact')
      expect(localized('/contact', 'en')).toBe('/en/contact')
    })

    it('gère un chemin profond', () => {
      expect(localized('/admissions/frais', 'fr')).toBe('/fr/admissions/frais')
    })
  })

  describe('chemins déjà préfixés par une langue', () => {
    it('bascule le préfixe vers la langue courante', () => {
      expect(localized('/en/about', 'fr')).toBe('/fr/about')
      expect(localized('/fr/about', 'en')).toBe('/en/about')
    })

    it('conserve un préfixe déjà correct', () => {
      expect(localized('/fr/contact', 'fr')).toBe('/fr/contact')
    })

    it('ne double jamais le préfixe (donnée héritée)', () => {
      // Le bug que la fonction prévient : "/fr/fr/contact".
      expect(localized('/fr/contact', 'fr')).not.toBe('/fr/fr/contact')
    })

    it('gère la racine préfixée', () => {
      expect(localized('/fr', 'en')).toBe('/en')
      expect(localized('/en', 'fr')).toBe('/fr')
    })
  })

  describe('cas particuliers', () => {
    it("ne confond pas un slug commençant par 'fr' ou 'en' avec un préfixe de langue", () => {
      // "/french-riviera" ne doit pas être traité comme préfixé "/fr".
      expect(localized('/french-riviera', 'en')).toBe('/en/french-riviera')
      expect(localized('/environnement', 'fr')).toBe('/fr/environnement')
    })

    it('renvoie tel quel un chemin relatif sans slash initial (mailto, tel, ancre)', () => {
      expect(localized('mailto:x@cad.be', 'fr')).toBe('mailto:x@cad.be')
      expect(localized('#section', 'fr')).toBe('#section')
    })
  })
})
