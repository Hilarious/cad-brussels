import { describe, it, expect } from 'vitest'
import {
  regardVers,
  ecartDuCentre,
  COURSE,
  RAYON_GLOBE,
  RAYON_PUPILLE,
  REPOS,
  CENTRE,
} from './oeil'

const LIMITE = RAYON_GLOBE - RAYON_PUPILLE // 35 : au-delà, le blanc déborde

describe('regardVers', () => {
  it('laisse la pupille à sa position dessinée quand le curseur est au centre', () => {
    expect(regardVers(0, 0)).toEqual({ x: 0, y: 0 })
  })

  it('regarde réellement à gauche, en dépassant le centre du globe', () => {
    // Le défaut corrigé : avec l'ancien plafond de 7 sur le déplacement,
    // la pupille ne faisait que revenir vers le centre sans le passer.
    const t = regardVers(-500, 0)
    const positionX = REPOS.x + t.x
    expect(positionX).toBeLessThan(CENTRE)
    expect(CENTRE - positionX).toBeCloseTo(COURSE, 5)
  })

  it('donne une course plus ample vers la gauche que vers la droite', () => {
    // Conséquence voulue du repos décalé en haut à droite : le geste
    // devient lisible des deux côtés.
    const gauche = Math.hypot(...Object.values(regardVers(-500, 200)))
    const droite = Math.hypot(...Object.values(regardVers(500, -200)))
    expect(gauche).toBeGreaterThan(droite)
  })

  it('vise à la distance de course sur tout le tour', () => {
    for (let a = 0; a < 360; a += 15) {
      const r = (a * Math.PI) / 180
      const t = regardVers(Math.cos(r) * 500, Math.sin(r) * 500)
      expect(ecartDuCentre(t)).toBeCloseTo(COURSE, 5)
    }
  })

  it('ne laisse jamais la pupille déborder du globe', () => {
    for (let a = 0; a < 360; a += 5) {
      const r = (a * Math.PI) / 180
      for (const d of [1, 10, 40, 200, 2000]) {
        const t = regardVers(Math.cos(r) * d, Math.sin(r) * d)
        expect(ecartDuCentre(t)).toBeLessThanOrEqual(LIMITE)
      }
    }
  })

  it('atténue le regard quand le curseur est tout près', () => {
    const proche = ecartDuCentre(regardVers(10, 0))
    const loin = ecartDuCentre(regardVers(400, 0))
    expect(proche).toBeLessThan(loin)
    expect(loin).toBeCloseTo(COURSE, 5)
  })

  it('garde une marge de sécurité sous la limite géométrique', () => {
    expect(COURSE).toBeLessThan(LIMITE)
  })
})
