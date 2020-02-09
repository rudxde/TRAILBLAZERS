import { zip } from 'compressing';

// from docker-compose:
const DB_DIR = '/usr/src/app/db';
const MAP_DB_DIR = DB_DIR + '/map';
const TEMPLATE_DIR = '/usr/src/app/template';
const DB_TEMPLATE_DIR = TEMPLATE_DIR + '/map-db.zip';

/**
 * Exports the map database into an zip archive.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function exportTemplate(): Promise<void> {
    console.log('Exporting map database. This may take a while.');
    await zip.compressDir(MAP_DB_DIR, DB_TEMPLATE_DIR);
}

/**
 * Imports an zip-compressed zip template for the map template.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function importTemplate(): Promise<void> {
    console.log('Importing map database. This may take a while.');
    await zip.uncompress(DB_TEMPLATE_DIR, DB_DIR);
}
