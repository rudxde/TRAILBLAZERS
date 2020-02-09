import { apiDef } from '../../app';
import { Auth } from '@tb/interfaces';
import { BadRequestError } from '@tb/service-utils';
import { mongoConnection } from '../mongo-connection';
import { Db } from 'mongodb';

/**
 * Changes the loginname
 *
 * @export
 * @param {string} userId
 * @param {string} newLogin
 * @returns {Promise<void>}
 */
export async function UpdateLogin(userId: string, newLogin: string): Promise<void> {
    if (!userId)
        throw new BadRequestError();
    if (!newLogin)
        throw new BadRequestError();
    return mongoConnection(apiDef.name, async (db: Db) => {
        await db.collection('logins').updateOne(<Partial<Auth.IAuth>>{ userId: userId }, { $set: <Partial<Auth.IAuth>>{ login: newLogin } });
    });
}
