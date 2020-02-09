import { getSignatureByInput } from '@tb/service-utils';
import { privateKey } from '../../app';
import { Auth } from '@tb/interfaces';
import { addSeconds, addMinutes, addHours, addDays } from 'date-fns';
import { environment } from '@tb/environment/dist/service';
import {
    generateSalt,
    serializeUserToken,
} from '@tb/service-utils';
import { apiDef, publicKeys } from '../../app';
import { isPast } from 'date-fns';
import { VerifyToken, NotAuthorizedError } from '@tb/service-utils';
import { mongoConnection } from '../mongo-connection';
import { storeSession, readSession, deleteSession } from '../session';
import { Db } from 'mongodb';

export function signUserToken(userToken: Auth.IUserToken): Auth.ICertifiedUserToken {
    const sign = getSignatureByInput(serializeUserToken(userToken), privateKey);
    return {
        ...userToken,
        sign,
    };
}

/**
 * Returns a date till which an user-token is valid.
 *
 * @export
 * @returns {Date}
 */
export function getTokenValidity(): Date {
    let date = new Date();
    const defaultTokenValidity = environment.defaultTokenValidity;
    if (defaultTokenValidity.seconds) date = addSeconds(date, defaultTokenValidity.seconds);
    if (defaultTokenValidity.min) date = addMinutes(date, defaultTokenValidity.min);
    if (defaultTokenValidity.hours) date = addHours(date, defaultTokenValidity.hours);
    if (defaultTokenValidity.days) date = addDays(date, defaultTokenValidity.days);
    return date;
}

/**
 * Returns a date till which an user-token is renewable.
 *
 * @export
 * @returns {Date}
 */
export function getTokenRenewability(): Date {
    let date = new Date();
    const defaultTokenRenewability = environment.defaultTokenRenewability;
    if (defaultTokenRenewability.seconds) date = addSeconds(date, defaultTokenRenewability.seconds);
    if (defaultTokenRenewability.min) date = addMinutes(date, defaultTokenRenewability.min);
    if (defaultTokenRenewability.hours) date = addHours(date, defaultTokenRenewability.hours);
    if (defaultTokenRenewability.days) date = addDays(date, defaultTokenRenewability.days);
    return date;
}

/**
 * Creates an simple user-token for an given user-id.
 *
 * @param {string} userId
 * @returns {Auth.IUserToken}
 */
export function createUserToken(userId: string): Auth.IUserToken {
    const salt = generateSalt(32);
    return {
        salt,
        userId,
        validUntil: getTokenValidity(),
        renewableUntil: getTokenRenewability(),
    };
}

/**
 * Refreshes an valid token.
 * It removes the old token from the database and creates an new one.
 *
 * @export
 * @param {(string | undefined)} authToken old token
 * @returns {Promise<Auth.ICertifiedUserToken>} new valid token
 */
export async function RefreshToken(authToken: string | undefined): Promise<Auth.ICertifiedUserToken> {
    return mongoConnection(apiDef.name, async (db: Db) => {
        const oldToken = await VerifyToken(authToken, apiDef, publicKeys, true);
        if (isPast(new Date(oldToken.renewableUntil)))
            throw new NotAuthorizedError();
        if ((await readSession(oldToken!, db)) === null)
            throw new NotAuthorizedError();
        await deleteSession(oldToken, db);
        const newToken = createUserToken(oldToken.userId);
        await storeSession(newToken, db);
        return signUserToken(newToken);
    });
}
