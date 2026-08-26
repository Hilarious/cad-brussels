import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Corrige les appellations protégées DANS LA BASE, et plus seulement à
 * l'affichage.
 *
 * Contexte. Le garde-fou de `src/lib/appellations.ts` corrige les
 * libellés au moment du rendu, parce qu'en août la base de production
 * n'était pas joignable. Le site public est donc propre, mais la donnée
 * stockée porte toujours « Bachelor », « Master » et « Home & Living » :
 * 65 occurrences relevées le 26/08/2026, dont 4 dans l'en-tête, 5 dans
 * le pied de page, 48 dans les pages et 8 dans les événements.
 *
 * Pourquoi c'est un vrai problème et pas un détail de propreté :
 * l'interface REST de Payload est en lecture publique (`read: () => true`)
 * et sert la donnée BRUTE, sans le garde-fou. N'importe qui peut lire
 * ces appellations sur /api/pages sans être connecté. Le `noindex` posé
 * en août ne protège rien ici : il est conditionné à l'hôte
 * `vercel.app`, donc il tombe le jour où `cad.be` sert le site.
 *
 * Méthode. Un balayage de toutes les colonnes texte et JSON du schéma
 * public, y compris les tables de versions (`_pages_v`, `_events_v`),
 * pour que revenir à une version antérieure ne réintroduise pas une
 * appellation. Les mêmes règles que le garde-fou, dans le même ordre :
 * le plus spécifique d'abord, pour contrôler la casse.
 *
 * Ce que la migration NE touche PAS, volontairement :
 *  - les adresses de pages (`slug`, `path`, `url`) : en production le hub
 *    a encore le slug `masters`, et le réécrire enverrait les visiteurs
 *    et les moteurs sur des pages inexistantes. C'est un chantier de
 *    redirections à part entière.
 *  - les tables internes de Payload (migrations, préférences, verrous,
 *    sessions) et les colonnes d'identité (identifiants, courriels,
 *    empreintes de mots de passe).
 *
 * Le garde-fou du rendu reste en place après cette migration. C'est
 * même sa vraie vocation : empêcher qu'une ressaisie dans l'admin
 * remette une appellation en ligne sans que personne s'en aperçoive.
 *
 * `Masterclass` et le verbe anglais « to master » ne sont pas touchés :
 * les règles portent des frontières de mot.
 */

const CORPS_FONCTION = `
  SELECT replace(replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace($1,
      '[[:<:]]Tous les Masters[[:>:]]',      'Tous les postgraduates',      'g'),
      '[[:<:]]Tous les Bachelors[[:>:]]',    'Tous les undergraduates',     'g'),
      '[[:<:]]Voir tous les Masters[[:>:]]', 'Voir tous les postgraduates', 'g'),
      '[[:<:]]Voir tous les Bachelors[[:>:]]','Voir tous les undergraduates','g'),
      '[[:<:]]All Masters[[:>:]]',           'All postgraduates',           'g'),
      '[[:<:]]All Bachelors[[:>:]]',         'All undergraduates',          'g'),
      '[[:<:]]See all Masters[[:>:]]',       'See all postgraduates',       'g'),
      '[[:<:]]See all Bachelors[[:>:]]',     'See all undergraduates',      'g'),
      '[[:<:]]Masters[[:>:]]',               'Postgraduates',               'g'),
      '[[:<:]]Master[[:>:]]',                'Postgraduate',                'g'),
      '[[:<:]]Bachelors[[:>:]]',             'Undergraduates',              'g'),
      '[[:<:]]Bachelor[[:>:]]',              'Undergraduate',               'g'),
    'Home & Living Design', 'Furniture & Product Design'),
    'Home & Living',        'Furniture & Product Design')
`

// `replace()` et non `regexp_replace()` pour les deux dernières règles :
// dans un remplacement d'expression régulière, PostgreSQL interprète
// l'esperluette comme « le motif entier ». Un remplacement littéral
// évite cet écueil.

const TABLES_EXCLUES = `(
  'payload_migrations', 'payload_preferences', 'payload_preferences_rels',
  'payload_locked_documents', 'payload_locked_documents_rels', 'payload_kv',
  'users', 'users_sessions'
)`

const COLONNES_EXCLUES = `(
  'id', '_parent_id', 'parent_id', 'slug', 'path', 'url', 'href',
  'filename', 'mime_type', 'email', 'hash', 'salt',
  'reset_password_token', '_locale', '_order', 'value', 'data'
)`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION cad_assainir_appellations(text)
    RETURNS text AS $fn$ ${sql.raw(CORPS_FONCTION)} $fn$
    LANGUAGE sql IMMUTABLE;
  `)

  await db.execute(sql`
    DO $balayage$
    DECLARE
      colonne RECORD;
      touchees INTEGER;
      total INTEGER := 0;
    BEGIN
      FOR colonne IN
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND data_type IN ('character varying', 'text', 'jsonb')
          AND table_name  NOT IN ${sql.raw(TABLES_EXCLUES)}
          AND column_name NOT IN ${sql.raw(COLONNES_EXCLUES)}
      LOOP
        IF colonne.data_type = 'jsonb' THEN
          EXECUTE format(
            'UPDATE %I SET %I = cad_assainir_appellations(%I::text)::jsonb
             WHERE %I::text ~ %L',
            colonne.table_name, colonne.column_name, colonne.column_name,
            colonne.column_name, '(Bachelor|Master|Home & Living)'
          );
        ELSE
          EXECUTE format(
            'UPDATE %I SET %I = cad_assainir_appellations(%I)
             WHERE %I ~ %L',
            colonne.table_name, colonne.column_name, colonne.column_name,
            colonne.column_name, '(Bachelor|Master|Home & Living)'
          );
        END IF;

        GET DIAGNOSTICS touchees = ROW_COUNT;
        total := total + touchees;
        IF touchees > 0 THEN
          RAISE NOTICE 'appellations corrigees: % ligne(s) dans %.%',
            touchees, colonne.table_name, colonne.column_name;
        END IF;
      END LOOP;

      RAISE NOTICE 'total: % ligne(s) corrigee(s)', total;
    END
    $balayage$;
  `)

  await db.execute(sql`DROP FUNCTION IF EXISTS cad_assainir_appellations(text);`)
}

/**
 * Pas de retour en arrière. Remettre « Bachelor » et « Master » dans la
 * base serait réintroduire volontairement une non-conformité que cette
 * migration existe précisément pour lever. Un `down` vide est ici le
 * comportement correct, pas un oubli.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}
