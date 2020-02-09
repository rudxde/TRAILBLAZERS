import { MongoClient, Db } from 'mongodb';
import { apiDef } from '../../app';

export async function mongoConnection<T>(dbName: string, task: (db: Db) => Promise<T>): Promise<T> {
    let mongoClient: MongoClient = await MongoClient.connect(apiDef.mongoDb);
    const db = mongoClient.db(dbName);
    const result: T = await task(db);
    mongoClient.close();
    return result;
}
