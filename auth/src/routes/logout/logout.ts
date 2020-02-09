import { apiDef } from '../../app';
import { Auth } from '@tb/interfaces';
import { BadRequestError } from '@tb/service-utils';
import { mongoConnection } from '../mongo-connection';
import { deleteSession } from '../session';
import { Db } from 'mongodb';

/**
 * removes the token from the database.
 *
 * @export
 * @param {(string | undefined)} token
 * @returns {Promise<void>}
 */
export async function Logout(token: string | undefined): Promise<void> {
    if (!token)
        throw new BadRequestError();
    const userToken: Auth.ICertifiedUserToken = JSON.parse(token);
    await mongoConnection(apiDef.name, async (db: Db) => {
        await deleteSession(userToken, db);
    });
}
