import { Db } from 'mongodb';
import { Auth } from '@tb/interfaces';
import * as redis from 'redis';
import { apiDef } from '../app';
import { promisify } from 'util';

/**
 * stores the session-token in the database.
 *
 * @param {Auth.IUserToken} userToken
 * @param {Db} db
 * @returns {Promise<void>}
 */
export async function storeSession(userToken: Auth.IUserToken, db?: Db): Promise<void> {
    await redisConnection(async client => {
        const key = tokenToKey(userToken);
        const value = JSON.stringify(userToken);
        client.set(key, value);
    });
    // await db.collection('session').insertOne(userToken);
}

/**
 * Reads the session from the given token out of the database.
 *
 * @param {Auth.IUserToken} userToken
 * @param {Db} db
 * @returns {(Promise<Auth.IUserToken | null>)}
 */
export async function readSession(userToken: Auth.IUserToken, db?: Db): Promise<Auth.IUserToken | null> {
    return redisConnection(async client => {
        const getAsync = promisify(client.get).bind(client);
        const key = tokenToKey(userToken);
        const value = await getAsync(key);
        return JSON.parse(value);
    });
}

/**
 * Deletes an Session from the database.
 *
 * @param {Auth.IUserToken} userToken
 * @param {Db} db
 * @returns {Promise<void>}
 */
export async function deleteSession(userToken: Auth.IUserToken, db: Db): Promise<void> {
    redisConnection(async client => {
        const key = tokenToKey(userToken);
        client.del(key);
    });
}

function tokenToKey(userToken: Auth.IUserToken): string {
    return `${userToken.userId}//${userToken.salt}`;
}

async function redisConnection<T>(fn: (redisClient: redis.RedisClient) => Promise<T>): Promise<T> {
    const redisOptions: redis.ClientOpts = {};
    redisOptions.host = apiDef.redis.url;
    if (apiDef.redis.port) {
        redisOptions.port = apiDef.redis.port;
    }
    const redisClient: redis.RedisClient = redis.createClient(redisOptions);
    const result: T = await fn(redisClient);
    redisClient.quit();
    return result;
}
