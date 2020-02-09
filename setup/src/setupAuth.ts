import { Db } from 'mongodb';
import { IApiDef, Auth } from '@tb/interfaces';
import { hashUserPassword } from '@tb/service-utils';

/**
 *
 *
 * @export
 * @param {Db} db
 * @param {IApiDef} service
 * @returns {Promise<void>}
 */
export async function setupAuth(db: Db, service: IApiDef): Promise<void> {
    await db.createCollection('logins');
    const {salt, hash} = hashUserPassword('password');
    await db.collection('logins').insertOne(<Auth.IAuth>{
        login: 'admin',
        salt,
        hash,
        userId: '0'
    });
}
