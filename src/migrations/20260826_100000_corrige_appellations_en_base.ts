import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Corrige les appellations protégées DANS LA BASE, et plus seulement à
 * l'affichage. Réversible.
 *
 * ── Le problème ────────────────────────────────────────────────────
 * Le garde-fou de `src/lib/appellations.ts` corrige les libellés au
 * moment du rendu, parce qu'en août la base de production n'était pas
 * joignable. Le site public est donc propre, mais la donnée stockée
 * porte toujours « Bachelor », « Master » et « Home & Living ».
 *
 * Relevé du 26/08/2026 sur la production, les deux langues :
 * 139 occurrences, 94 textes distincts.
 *   fr : pages 48, posts 4, événements 8, en-tête 4, pied de page 5
 *   en : pages 48, posts 4, événements 9, en-tête 4, pied de page 5
 *
 * Ce n'est pas un enjeu de propreté mais d'exposition : l'interface
 * REST de Payload est en lecture publique (`read: () => true`) et sert
 * la donnée BRUTE, sans garde-fou. Ces appellations sont lisibles sur
 * /api/pages sans authentification. Le `noindex` posé en août ne
 * protège rien ici, il est conditionné à l'hôte `vercel.app` et tombe
 * le jour où `cad.be` sert le site.
 *
 * ── Ce qui a été vérifié avant écriture ────────────────────────────
 *  - Les 14 règles, testées sur PostgreSQL 16 sur 18 cas : casse des
 *    formes spécifiques, « Masterclass » et le verbe anglais « to
 *    master » intacts, esperluette littérale, texte riche JSON valide.
 *  - Essai à blanc sur les 94 textes réels de production : aucun
 *    n'échappe aux règles, et un seul demande une reprise humaine
 *    (« du Undergraduate » au lieu de « de l'Undergraduate »).
 *  - Les adresses de pages ne peuvent pas être touchées : elles sont
 *    en minuscules (`/masters`, `home-living-design`,
 *    `masterclass-motion-design`) et les règles sont sensibles à la
 *    casse. La liste d'exclusion des colonnes est une seconde barrière,
 *    pas la seule.
 *
 * ── Réversibilité ──────────────────────────────────────────────────
 * Chaque valeur est copiée dans `cad_sauvegarde_appellations` AVANT
 * d'être modifiée, avec sa table, sa colonne et son identifiant de
 * ligne. `down()` restaure depuis cette table. La sauvegarde n'est
 * exposée par aucune interface : ce n'est pas une collection Payload.
 *
 * Le garde-fou du rendu reste en place après cette migration. C'est
 * même sa vraie vocation : empêcher qu'une ressaisie dans l'admin
 * remette une appellation en ligne sans que personne s'en aperçoive.
 */

/**
 * Écrit avec ses apostrophes : à l'intérieur d'un bloc `DO`, PostgreSQL
 * n'accepte aucun paramètre lié, tout doit être présent dans le texte
 * SQL. D'où `sql.raw()` à chaque interpolation ci-dessous.
 */
const MOTIF = "'[[:<:]](Bachelors?|Masters?)[[:>:]]|Home & Living'"

const TABLE_SAUVEGARDE = 'cad_sauvegarde_appellations'

/**
 * `replace()` et non `regexp_replace()` pour les deux dernières règles :
 * dans un remplacement d'expression régulière, PostgreSQL interprète
 * l'esperluette comme « le motif entier ». Un remplacement littéral
 * évite cet écueil.
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
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace(
    regexp_replace($1,
      -- Élisions, AVANT les règles générales : « Undergraduate »
      -- commence par une voyelle, « Bachelor » non. Miroir exact de
      -- src/lib/appellations.ts, à tenir synchronisé.
      '[[:<:]]du Bachelor[[:>:]]',            'de l''Undergraduate',          'g'),
      '[[:<:]]Du Bachelor[[:>:]]',            'De l''Undergraduate',          'g'),
      '[[:<:]]le Bachelor[[:>:]]',            'l''Undergraduate',             'g'),
      '[[:<:]]Le Bachelor[[:>:]]',            'L''Undergraduate',             'g'),
      '[[:<:]]au Bachelor[[:>:]]',            'à l''Undergraduate',           'g'),
      '[[:<:]]Au Bachelor[[:>:]]',            'À l''Undergraduate',           'g'),
      '[[:<:]]ce Bachelor[[:>:]]',            'cet Undergraduate',            'g'),
      '[[:<:]]Ce Bachelor[[:>:]]',            'Cet Undergraduate',            'g'),
      '[[:<:]]Tous les Masters[[:>:]]',       'Tous les postgraduates',       'g'),
      '[[:<:]]Tous les Bachelors[[:>:]]',     'Tous les undergraduates',      'g'),
      '[[:<:]]Voir tous les Masters[[:>:]]',  'Voir tous les postgraduates',  'g'),
      '[[:<:]]Voir tous les Bachelors[[:>:]]','Voir tous les undergraduates', 'g'),
      '[[:<:]]All Masters[[:>:]]',            'All postgraduates',            'g'),
      '[[:<:]]All Bachelors[[:>:]]',          'All undergraduates',           'g'),
      '[[:<:]]See all Masters[[:>:]]',        'See all postgraduates',        'g'),
      '[[:<:]]See all Bachelors[[:>:]]',      'See all undergraduates',       'g'),
      '[[:<:]]Masters[[:>:]]',                'Postgraduates',                'g'),
      '[[:<:]]Master[[:>:]]',                 'Postgraduate',                 'g'),
      '[[:<:]]Bachelors[[:>:]]',              'Undergraduates',               'g'),
      '[[:<:]]Bachelor[[:>:]]',               'Undergraduate',                'g'),
    'Home & Living Design', 'Furniture & Product Design'),
    'Home & Living',        'Furniture & Product Design')
`

/**
 * Tables internes de Payload (migrations, préférences, verrous,
 * sessions) et la table de sauvegarde elle-même, qu'il serait absurde
 * de corriger puisqu'elle existe pour conserver l'avant.
 */
const TABLES_EXCLUES = `(
  'payload_migrations', 'payload_preferences', 'payload_preferences_rels',
  'payload_locked_documents', 'payload_locked_documents_rels', 'payload_kv',
  'users', 'users_sessions', '${TABLE_SAUVEGARDE}'
)`

/** Adresses de pages, identifiants et colonnes d'identité. */
const COLONNES_EXCLUES = `(
  'id', '_parent_id', 'parent_id', 'slug', 'path', 'url', 'href',
  'filename', 'mime_type', 'email', 'hash', 'salt',
  'reset_password_token', '_locale', '_order', 'value', 'data'
)`

const SELECTION_COLONNES = `
  SELECT table_name, column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND data_type IN ('character varying', 'text', 'jsonb')
    AND table_name  NOT IN ${TABLES_EXCLUES}
    AND column_name NOT IN ${COLONNES_EXCLUES}
`

/** Les instructions SQL, exportées pour être rejouables telles quelles
 *  dans un banc d'essai. La migration ne fait que les exécuter : ce qui
 *  est testé est donc exactement ce qui tournera en production. */

export const SQL_CREER_SAUVEGARDE = `
  CREATE TABLE IF NOT EXISTS ${TABLE_SAUVEGARDE} (
    id           bigserial PRIMARY KEY,
    applique_le  timestamptz NOT NULL DEFAULT now(),
    nom_table    text NOT NULL,
    nom_colonne  text NOT NULL,
    cle          text NOT NULL,
    valeur_avant text NOT NULL
  );
`

export const SQL_CREER_FONCTION = `
  CREATE OR REPLACE FUNCTION cad_assainir_appellations(text)
  RETURNS text AS $fn$ ${CORPS_FONCTION} $fn$
  LANGUAGE sql IMMUTABLE;
`

export const SQL_BALAYAGE = `
  DO $balayage$
  DECLARE
    colonne    RECORD;
    a_corriger INTEGER;
    touchees   INTEGER;
    total      INTEGER := 0;
  BEGIN
    FOR colonne IN ${SELECTION_COLONNES}
    LOOP
      -- Compter AVANT de rien modifier, pour que le journal du
      -- deploiement dise ce qui allait etre touche, et pas seulement
      -- ce qui l'a ete.
      EXECUTE format('SELECT count(*) FROM %I WHERE %I::text ~ %L',
        colonne.table_name, colonne.column_name, ${MOTIF})
        INTO a_corriger;

      CONTINUE WHEN a_corriger = 0;

      -- Sauvegarde AVANT modification.
      EXECUTE format(
        'INSERT INTO %I (nom_table, nom_colonne, cle, valeur_avant)
         SELECT %L, %L, id::text, %I::text FROM %I WHERE %I::text ~ %L',
        '${TABLE_SAUVEGARDE}',
        colonne.table_name, colonne.column_name,
        colonne.column_name, colonne.table_name,
        colonne.column_name, ${MOTIF}
      );

      IF colonne.data_type = 'jsonb' THEN
        EXECUTE format(
          'UPDATE %I SET %I = cad_assainir_appellations(%I::text)::jsonb
           WHERE %I::text ~ %L',
          colonne.table_name, colonne.column_name, colonne.column_name,
          colonne.column_name, ${MOTIF});
      ELSE
        EXECUTE format(
          'UPDATE %I SET %I = cad_assainir_appellations(%I)
           WHERE %I ~ %L',
          colonne.table_name, colonne.column_name, colonne.column_name,
          colonne.column_name, ${MOTIF});
      END IF;

      GET DIAGNOSTICS touchees = ROW_COUNT;
      total := total + touchees;
      RAISE NOTICE 'appellations: %.% -> % ligne(s) sauvegardee(s) puis corrigee(s)',
        colonne.table_name, colonne.column_name, touchees;
    END LOOP;

    RAISE NOTICE 'appellations: TOTAL % ligne(s) corrigee(s)', total;
  END
  $balayage$;
`

export const SQL_SUPPRIMER_FONCTION = `DROP FUNCTION IF EXISTS cad_assainir_appellations(text);`

/**
 * Restaure chaque valeur depuis la sauvegarde. Utile si le relevé
 * d'après déploiement révélait une correction indésirable : on revient
 * à l'état exact d'avant, puis on ajuste les règles.
 *
 * La sauvegarde n'est pas supprimée : elle reste la trace de ce qui a
 * été modifié, et elle n'est exposée par aucune interface publique.
 */
export const SQL_RESTAURATION = `
  DO $restauration$
  DECLARE
    cible      RECORD;
    restaurees INTEGER;
    total      INTEGER := 0;
  BEGIN
    IF to_regclass('${TABLE_SAUVEGARDE}') IS NULL THEN
      RAISE NOTICE 'appellations: aucune sauvegarde, rien a restaurer';
      RETURN;
    END IF;

    FOR cible IN
      SELECT DISTINCT s.nom_table, s.nom_colonne, c.data_type
      FROM ${TABLE_SAUVEGARDE} s
      JOIN information_schema.columns c
        ON c.table_schema = 'public'
       AND c.table_name  = s.nom_table
       AND c.column_name = s.nom_colonne
    LOOP
      IF cible.data_type = 'jsonb' THEN
        EXECUTE format(
          'UPDATE %I t SET %I = s.valeur_avant::jsonb
           FROM %I s
           WHERE s.nom_table = %L AND s.nom_colonne = %L
             AND t.id::text = s.cle',
          cible.nom_table, cible.nom_colonne, '${TABLE_SAUVEGARDE}',
          cible.nom_table, cible.nom_colonne);
      ELSE
        EXECUTE format(
          'UPDATE %I t SET %I = s.valeur_avant
           FROM %I s
           WHERE s.nom_table = %L AND s.nom_colonne = %L
             AND t.id::text = s.cle',
          cible.nom_table, cible.nom_colonne, '${TABLE_SAUVEGARDE}',
          cible.nom_table, cible.nom_colonne);
      END IF;

      GET DIAGNOSTICS restaurees = ROW_COUNT;
      total := total + restaurees;
      RAISE NOTICE 'appellations: %.% -> % ligne(s) restauree(s)',
        cible.nom_table, cible.nom_colonne, restaurees;
    END LOOP;

    RAISE NOTICE 'appellations: TOTAL % ligne(s) restauree(s)', total;
  END
  $restauration$;
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(SQL_CREER_SAUVEGARDE))
  await db.execute(sql.raw(SQL_CREER_FONCTION))
  await db.execute(sql.raw(SQL_BALAYAGE))
  await db.execute(sql.raw(SQL_SUPPRIMER_FONCTION))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(SQL_RESTAURATION))
}
