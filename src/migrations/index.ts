import * as migration_20260825_215828_ajout_blocs_et_collections from './20260825_215828_ajout_blocs_et_collections';
import * as migration_20260826_100000_corrige_appellations_en_base from './20260826_100000_corrige_appellations_en_base';

export const migrations = [
  {
    up: migration_20260825_215828_ajout_blocs_et_collections.up,
    down: migration_20260825_215828_ajout_blocs_et_collections.down,
    name: '20260825_215828_ajout_blocs_et_collections'
  },
  {
    up: migration_20260826_100000_corrige_appellations_en_base.up,
    down: migration_20260826_100000_corrige_appellations_en_base.down,
    name: '20260826_100000_corrige_appellations_en_base'
  },
];
