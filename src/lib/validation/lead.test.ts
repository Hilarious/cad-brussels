import { describe, it, expect } from 'vitest'
import { leadSchema } from './lead'

// Saisie minimale valide, réutilisée puis altérée champ par champ.
const valid = {
  firstName: 'Jeanne',
  lastName: 'Dupont',
  email: 'jeanne@example.com',
  intents: ['brochure'],
  desiredSection: 'bachelor-interior',
  acceptedTerms: true,
}

describe('leadSchema', () => {
  it('accepte une saisie minimale valide', () => {
    const r = leadSchema.safeParse(valid)
    expect(r.success).toBe(true)
  })

  it('applique les valeurs par défaut (profile, locale)', () => {
    const r = leadSchema.parse(valid)
    expect(r.profile).toBe('student')
    expect(r.locale).toBe('fr')
  })

  it('rejette une section hors catalogue', () => {
    // Garde-fou de la correction z.enum : une valeur libre ne doit plus passer.
    const r = leadSchema.safeParse({ ...valid, desiredSection: 'nimporte-quoi' })
    expect(r.success).toBe(false)
  })

  it('exige le consentement RGPD (acceptedTerms === true)', () => {
    expect(leadSchema.safeParse({ ...valid, acceptedTerms: false }).success).toBe(false)
    expect(leadSchema.safeParse({ ...valid, acceptedTerms: undefined }).success).toBe(false)
  })

  it('rejette un email invalide', () => {
    expect(leadSchema.safeParse({ ...valid, email: 'pas-un-email' }).success).toBe(false)
  })

  it('exige au moins une intention', () => {
    expect(leadSchema.safeParse({ ...valid, intents: [] }).success).toBe(false)
  })

  it('rejette une intention inconnue', () => {
    expect(leadSchema.safeParse({ ...valid, intents: ['spam'] }).success).toBe(false)
  })

  it('piège anti-spam : rejette si le champ honeypot est rempli', () => {
    const r = leadSchema.safeParse({ ...valid, website: 'http://bot.example' })
    expect(r.success).toBe(false)
  })

  it('accepte un honeypot vide ou absent', () => {
    expect(leadSchema.safeParse({ ...valid, website: '' }).success).toBe(true)
    expect(leadSchema.safeParse(valid).success).toBe(true)
  })

  it('exige un prénom et un nom non vides', () => {
    expect(leadSchema.safeParse({ ...valid, firstName: '' }).success).toBe(false)
    expect(leadSchema.safeParse({ ...valid, lastName: '' }).success).toBe(false)
  })
})
