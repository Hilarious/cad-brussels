import { describe, it, expect } from 'vitest'
import { FUSEAU_ECOLE } from './fuseau'

/**
 * Ces tests verrouillent la correction du 28/08/2026 : les heures d'événements
 * s'affichaient différemment selon la page, le sélecteur d'admissions appliquant
 * le fuseau de Bruxelles et les fiches ne l'appliquant pas.
 */
describe('FUSEAU_ECOLE', () => {
  const heure = (iso: string, tz?: string) =>
    new Intl.DateTimeFormat('fr-BE', {
      hour: '2-digit',
      minute: '2-digit',
      ...(tz ? { timeZone: tz } : {}),
    }).format(new Date(iso))

  it("vaut le fuseau de Bruxelles", () => {
    expect(FUSEAU_ECOLE).toBe('Europe/Brussels')
  })

  it("ajoute deux heures en été, l'heure d'été belge étant UTC+2", () => {
    // Portes Ouvertes 2026 : stocké 08:00 UTC, doit s'afficher 10:00 à Bruxelles.
    expect(heure('2026-09-03T08:00:00.000Z', FUSEAU_ECOLE)).toBe('10:00')
    expect(heure('2026-09-03T16:00:00.000Z', FUSEAU_ECOLE)).toBe('18:00')
  })

  it("ajoute une heure en hiver, l'heure d'hiver belge étant UTC+1", () => {
    // Journée portes ouvertes d'automne : stocké 12:00 UTC, affiché 13:00.
    expect(heure('2026-11-12T12:00:00.000Z', FUSEAU_ECOLE)).toBe('13:00')
  })

  it("donne un résultat différent d'un formatage sans fuseau, ce qui est le bug d'origine", () => {
    // Sur Vercel le serveur tourne en UTC : sans le fuseau, l'heure sort brute.
    // C'est exactement l'écart qui faisait afficher deux heures pour un même événement.
    const avecFuseau = heure('2026-09-03T08:00:00.000Z', FUSEAU_ECOLE)
    const enUTC = heure('2026-09-03T08:00:00.000Z', 'UTC')
    expect(avecFuseau).not.toBe(enUTC)
    expect(enUTC).toBe('08:00')
  })
})
