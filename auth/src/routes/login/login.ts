import { apiDef } from '../../app';
import { Auth } from '@tb/interfaces';
import { BadRequestError, NotAuthorizedError } from '@tb/service-utils';
import { mongoConnection } from '../mongo-connection';
import { storeSession } from '../session';
import { createUserToken, signUserToken } from '../token/token';
import { checkPassword } from '../password/check-password';
import { Db } from 'mongodb';
/**
 * Verify login credentials and returns a valid session.
 *
 * @export
 * @param {string} login
 * @param {string} password
 * @returns {Promise<Auth.ICertifiedUserToken>}
 */
export async function Login(login: string, password: string): Promise<Auth.ICertifiedUserToken> {
    if (!login || !password)
        throw new BadRequestError();
    return mongoConnection(apiDef.name, async (db: Db) => {
        const dbUser: Auth.IAuth = await getAuth(login, db);
        await checkPassword(dbUser, password);
        const userToken = createUserToken(dbUser.userId);
        await storeSession(userToken, db);
        return signUserToken(userToken);
    });
}

/**
 * Reads the authorization entry from the database for the given login name.
 *
 * @param {string} login
 * @param {Db} db
 * @returns {Promise<Auth.IAuth>}
 */
export async function getAuth(login: string, db: Db): Promise<Auth.IAuth> {
    const dbUser: Auth.IAuth | null = await db.collection('logins').find<Auth.IAuth>({ login }).next();
    if (!dbUser)
        throw new NotAuthorizedError();
    return dbUser;
}
