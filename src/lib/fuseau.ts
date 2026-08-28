/**
 * Le fuseau de l'école, source unique pour tout affichage de date d'événement.
 *
 * Pourquoi cette constante existe : jusqu'au 28/08/2026, le sélecteur de séances
 * de la page admissions appliquait `Europe/Brussels` alors que les fiches
 * d'événement ne l'appliquaient pas. Le serveur Vercel tournant en UTC, le même
 * événement s'affichait à deux heures différentes selon la page, avec un écart
 * d'une heure en hiver et de deux en été.
 *
 * Toute date d'événement affichée DOIT passer par ce fuseau. Ne jamais formater
 * un `startDate` ou un `endDate` sans l'option `timeZone: FUSEAU_ECOLE`.
 *
 * Les dates d'articles (`publishedAt`) n'en dépendent pas : elles n'affichent
 * pas d'heure et sont enregistrées loin de minuit, donc aucun risque de bascule
 * de jour. Elles sont laissées telles quelles, délibérément.
 */
export const FUSEAU_ECOLE = 'Europe/Brussels' as const
