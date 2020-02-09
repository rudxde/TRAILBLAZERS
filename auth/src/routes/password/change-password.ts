import { apiDef } from '../../app';
import { Auth } from '@tb/interfaces';
import { NotAuthorizedError, BadRequestError, hashUserPassword } from '@tb/service-utils';
import { mongoConnection } from '../mongo-connection';
import { checkPassword } from './check-password';
import { Db } from 'mongodb';

/**
 * changes the password from an login.
 *
 * @export
 * @param {string} userId
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function ChangePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    if (!userId || !oldPassword || !newPassword)
        throw new BadRequestError();
    return mongoConnection(apiDef.name, async (db: Db) => {
        const collection = db.collection('logins');
        const dbUser: Auth.IAuth | null = await collection.find<Auth.IAuth>(<Partial<Auth.IAuth>>{ userId: userId }).next();
        if (!dbUser)
            throw new NotAuthorizedError();
        await checkPassword(dbUser, oldPassword);
        const { salt, hash } = hashUserPassword(newPassword);
        await collection.updateOne(<Partial<Auth.IAuth>>{ userId: userId }, { $set: <Partial<Auth.IAuth>>{ salt, hash } });
    });
}
