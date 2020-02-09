import { mongoConnection } from './mongoconnection';
import { apiDef } from '../../app';
import { IHikingRoute } from '@tb/interfaces';
import { NotFoundError } from '@tb/service-utils';
import got from 'got';

// API Key for Outdooractive
const projectKey = 'api-dev-oa';
const apiKey = 'yourtest-outdoora-ctiveapi';

/**
 * Generic method to search the Hike DB 
 *
 * @export
 * @param {object} searchQuery the search query formated as a Mongo Query
 * @param {object} projection the fields to be included in the response e.g. {} = all , {id:1} only the field id 1=true, 0=false
 * @param {boolean} returnArray the response type either as an array (returnArray = true) or just the next occuring hike
 * @returns {Promise<any>} either returns the hike(s) or an NotFoundError
 */
export async function findHikesDb(searchQuery: object, projection: object, returnArray: boolean): Promise<any> {
    return mongoConnection(apiDef.name, async db => {
        let hike: any[] | IHikingRoute | null;
        if (returnArray) {
            hike = await db.collection('hikingroutes').find(searchQuery).project(projection).toArray();
        } else {
            hike = await db.collection('hikingroutes').find<IHikingRoute>(searchQuery).project(projection).next();
        }
        if (!hike) {
            throw new NotFoundError();
        }
        return hike;
    });
}
/**
 * Method that connect to the OutdoorActive API to retrieve a Hike
 *
 * @export
 * @param {string} hikeId unique hike id 
 * @returns {Promise<IHikingRoute>} Returns the HikingRoute or an Error
 */
export async function findHikeByIdAPI(hikeId: string): Promise<IHikingRoute> {
    var url = 'http://www.outdooractive.com/api/project/' +
        projectKey + '/oois/' +
        hikeId +
        '?key=' + apiKey;
    return await got(url).json();
}
