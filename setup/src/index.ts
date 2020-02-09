import { MongoClient, Db } from 'mongodb';
import { environment } from '@tb/environment/dist/service';
import { IApiDef, IApiDefMongo } from '@tb/interfaces';
import { setupAuth } from './setupAuth';
import { setupHikes } from './setupHikes';
import { setupUser } from './setupUser';
import { setupWeather } from './setupWeather';
import { setupKeys } from './setupApiKeys';
import { importTemplate, exportTemplate } from './mapTemplate';

async function setup(
    importMapTemplate: boolean,
    exportMapTemplate: boolean,
    keys: boolean,
    auth: boolean,
    hikes: boolean,
    user: boolean,
    weather: boolean,
): Promise<void> {
    if (importMapTemplate) await importTemplate();
    if (exportMapTemplate) await exportTemplate();
    if (keys) {
         await setupKeys();
        console.log('created API-keys');
    }
    const promises: Promise<void>[] = [];
    if (auth) promises.push(connectToDbAndSetUp(environment.api.auth, setupAuth));
    if (hikes) promises.push(connectToDbAndSetUp(environment.api.hikes, setupHikes));
    if (user) promises.push(connectToDbAndSetUp(environment.api.user, setupUser));
    if (weather) promises.push(connectToDbAndSetUp(environment.api.weather, setupWeather));
    await Promise.all(promises);
}

/**
 * Establishes an mongo-connection and runs the setup afterwards.
 *
 * @param {IApiDef} service service, to whose mongo-database the connection should be established.
 * @param {(db: Db, service: IApiDef) => Promise<void>} setup The setup function, that should be run when the connection is established.
 * @returns {Promise<void>}
 */
async function connectToDbAndSetUp(service: IApiDef & IApiDefMongo, setup: (db: Db, service: IApiDef) => Promise<void>): Promise<void> {
    let mongoConnection: MongoClient;
    let isConnected = false;
    let connectionTrys = 0;
    // Try to connect to mongo several times, because the database can take some time to be started.
    while (!isConnected) {
        if (connectionTrys++ > 100) {
            throw new Error(`Unable to connect to mongodb: '${service.mongoDb}'`);
        }
        await MongoClient.connect(service.mongoDb)
            .then(x => {
                isConnected = true;
                mongoConnection = x;
            })
            .catch(() => {
                isConnected = false;
                return (new Promise(resolve => setTimeout(resolve, 1000)));
            });
    }
    const db = mongoConnection!.db(service.name);
    await setup(db, service);
    await mongoConnection!.close();
}

/**
 * Configuration for the setup.
 */
const config: { [key: string]: boolean } = {
    importMapTemplate: true,
    exportMapTemplate: false,
    keys: true,
    auth: true,
    hikes: true,
    user: true,
    weather: true,
};

// Set configs from process args.
for (let i = 2; i < process.argv.length; i++) {
    const [key, value] = process.argv[i].split('=');
    if (key && value) {
        config[key] = value === 'true' ? true : false;
    }
}

// run setup
setup(config.importMapTemplate, config.exportMapTemplate, config.keys, config.auth, config.hikes, config.user, config.weather)
    .then(() => console.log('Setup done :)'));
