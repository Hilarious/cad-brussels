import { describe, it, expect } from 'vitest'
import { applicationSchema } from './application'

// Saisie complète valide, réutilisée puis altérée champ par champ.
const valid = {
  firstName: 'Jeanne',
  lastName: 'Dupont',
  email: 'jeanne@example.com',
  phone: '+32470112233',
  birthDate: '2005-06-15',
  nationality: 'Belge',
  desiredProgram: 'bachelor-interior',
  startYear: '2026',
  startLevel: 'bac1',
  motivation:
    'Je veux rejoindre le CAD pour développer mon regard de designer et travailler sur des projets réels.',
  acceptedTerms: true,
}

describe('applicationSchema', () => {
  it('accepte une candidature complète valide', () => {
    const r = applicationSchema.safeParse(valid)
    expect(r.success).toBe(true)
  })

  it('applique la langue par défaut', () => {
    expect(applicationSchema.parse(valid).locale).toBe('fr')
  })

  it('rejette un programme hors catalogue', () => {
    // Garde-fou de la correction z.enum.
    const r = applicationSchema.safeParse({ ...valid, desiredProgram: 'nimporte-quoi' })
    expect(r.success).toBe(false)
  })

  it("rejette une année de rentrée hors des choix proposés", () => {
    expect(applicationSchema.safeParse({ ...valid, startYear: '2030' }).success).toBe(false)
  })

  it('rejette un niveau de départ inconnu', () => {
    expect(applicationSchema.safeParse({ ...valid, startLevel: 'doctorat' }).success).toBe(false)
  })

  it('exige une motivation d’au moins 20 caractères', () => {
    expect(applicationSchema.safeParse({ ...valid, motivation: 'trop court' }).success).toBe(false)
  })

  it('exige le consentement RGPD', () => {
    expect(applicationSchema.safeParse({ ...valid, acceptedTerms: false }).success).toBe(false)
  })

  it('rejette un portfolio qui n’est pas une URL', () => {
    expect(applicationSchema.safeParse({ ...valid, portfolioUrl: 'pas-une-url' }).success).toBe(false)
  })

  it('accepte un portfolio URL valide', () => {
    const r = applicationSchema.safeParse({ ...valid, portfolioUrl: 'https://behance.net/jeanne' })
    expect(r.success).toBe(true)
  })

  it('piège anti-spam : rejette si le honeypot est rempli', () => {
    expect(applicationSchema.safeParse({ ...valid, website: 'x' }).success).toBe(false)
  })

  it('exige un téléphone (candidature = contact obligatoire)', () => {
    const { phone: _drop, ...sansTel } = valid
    expect(applicationSchema.safeParse(sansTel).success).toBe(false)
  })
})
