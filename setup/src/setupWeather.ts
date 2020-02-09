import { Db } from 'mongodb';
import { IApiDef } from '@tb/interfaces';
/**
 *  Setup script for the weather service.
 *
 * @export
 * @param {Db} db
 * @param {IApiDef} service
 * @returns {Promise<void>}
 */
export async function setupWeather(db: Db, service: IApiDef): Promise<void> {
    return;
}
