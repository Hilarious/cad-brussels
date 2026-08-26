import * as migration_20260825_215828_ajout_blocs_et_collections from './20260825_215828_ajout_blocs_et_collections';

export const migrations = [
  {
    up: migration_20260825_215828_ajout_blocs_et_collections.up,
    down: migration_20260825_215828_ajout_blocs_et_collections.down,
    name: '20260825_215828_ajout_blocs_et_collections'
  },
];
