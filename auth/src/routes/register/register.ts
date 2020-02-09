import { apiDef } from '../../app';
import { Auth, IAuthRegistration } from '@tb/interfaces';
import { hashUserPassword } from '@tb/service-utils';
import { mongoConnection } from '../mongo-connection';
import { Login } from '../login/login';
import { Db } from 'mongodb';

/**
 * registers an new login
 *
 * @export
 * @param {IAuthRegistration} registration
 * @returns {Promise<Auth.ICertifiedUserToken>}
 */
export async function Register(registration: IAuthRegistration): Promise<Auth.ICertifiedUserToken> {
    if (registration.login.length > 250) {
        throw new Error(`loginname to long`);
    }
    if (registration.login.length > 250) {
        throw new Error(`userId to long`);
    }
    await mongoConnection(apiDef.name, async (db: Db) => {
        const loginsCollection = db.collection('logins');
        const userWithSameId = await loginsCollection.count({
            userId: registration.userid,
        });
        if (userWithSameId !== 0) {
            throw new Error(`userid ${registration.userid} is already taken!`);
        }
        const userWithSameLogin = await loginsCollection.count({
            login: registration.login,
        });
        if (userWithSameLogin !== 0) {
            throw new Error(`login ${registration.login} is already taken!`);
        }
        const { salt, hash } = hashUserPassword(registration.password);
        await loginsCollection.insertOne(<Auth.IAuth>{
            hash,
            salt,
            login: registration.login,
            userId: registration.userid,
        });
    });
    return Login(registration.login, registration.password);
}
