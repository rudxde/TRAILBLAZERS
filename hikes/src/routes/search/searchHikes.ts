import { IHikingRouteSearchQuery, Maps } from '@tb/interfaces';
import { findHikesDb } from './findHike';
import got from 'got';
import { NotFoundError, TimeSpanUtils } from '@tb/service-utils';
import { environment } from '@tb/environment/dist/service';
// tslint:disable-next-line: no-var-requires
var GeoPoint = require('geopoint');

/**
 * This function creates the MongoSearchQuery and passes it on to the findHikesDb method
 *
 * @export
 * @param {Partial<IHikingRouteSearchQuery>} searchQuery the parameters to be search for 
 * @returns {Promise<number[]>} returns either the matching hikes or an empty array
 */
export async function searchDB(searchQuery: Partial<IHikingRouteSearchQuery>): Promise<number[]> {
    let mongoSearch = '{';
    if (searchQuery.difficultyFrom) {
        mongoSearch += `"rating.difficulty": {"$gte":${searchQuery.difficultyFrom}}`;
    }
    if (searchQuery.difficultyTo) {
        if (!searchQuery.difficultyFrom) {
            mongoSearch += `"rating.difficulty": {"$lte":${searchQuery.difficultyTo}}`;
        } else {
            // removes the closing }
            mongoSearch = mongoSearch.substr(0, mongoSearch.length - 1);
            mongoSearch += `,"$lte":${searchQuery.difficultyTo}}`;
        }
    }
    if (searchQuery.minDuration) {
        // checks if its not the first on 
        if (mongoSearch.length > 1) {
            mongoSearch += ',';
        }
        mongoSearch += `"time.min": {"$gte":${TimeSpanUtils.timeSpanToMinutes(searchQuery.minDuration)}}`;
    }
    if (searchQuery.maxDuration) {
        if (!searchQuery.minDuration) {
            if (mongoSearch.length > 1) {
                mongoSearch += ',';
            }
            mongoSearch += `"time.min": {"$lte":${TimeSpanUtils.timeSpanToMinutes(searchQuery.maxDuration)}}`;
        } else {
            // removes the closing } 
            mongoSearch = mongoSearch.substr(0, mongoSearch.length - 1);
            mongoSearch += `,"$lte":${TimeSpanUtils.timeSpanToMinutes(searchQuery.maxDuration)}}`;
        }
    }
    if (searchQuery.atLocation) {
        if (mongoSearch.length > 1) {
            mongoSearch += ',';
        }
        let convertedLocation: Maps.ICoords = await getGeoOfString(searchQuery.atLocation.location);
        let searchCordinates = new GeoPoint(convertedLocation.lat, convertedLocation.lon);
        // 6371010 ~ radius of the earth in m, true ~ calculate in kms
        if (searchQuery.atLocation.distance !== 0) {
            let calculatedDistanceCoord = searchCordinates.boundingCoordinates(searchQuery.atLocation.distance, 6371010, true);
            mongoSearch += `"startingPoint.lat": {"$gte": ${calculatedDistanceCoord[0]._degLat}, "$lte": ${calculatedDistanceCoord[1]._degLat}},`;
            mongoSearch += `"startingPoint.lon": {"$gte": ${calculatedDistanceCoord[0]._degLon}, "$lte": ${calculatedDistanceCoord[1]._degLon}}`;
        } else {
            mongoSearch += `"startingPoint.lat": {"$eq": ${convertedLocation.lat}},`;
            mongoSearch += `"startingPoint.lon": {"$eq": ${convertedLocation.lon}}`;
        }
    }
    mongoSearch += '}';
    // projects only on the id ~ hikeId 
    let mongoProjection = { id: 1, _id: 0 };
    try {
        let jsonSearch = JSON.parse(mongoSearch);
        return findHikesDb(jsonSearch, mongoProjection, true).then((result: [{ id: number }]) => {
            let finalResult: number[] = [];
            result.forEach(value => {
                finalResult.push(value.id);
            });
            return finalResult;
        }).catch(err => {
            console.error('Error calling the mongodb with this search: ');
            console.error(mongoSearch);
            console.error(err);
            throw err;
        });
    } catch (error) {
        console.error('Fail to parse Search Query: ' + mongoSearch);
        console.error(error);
        throw error;
    }
}
/**
 * Function which uses the Gmaps API to convert the search query into latitude and longitude
 *
 * @export
 * @param {string} location the search parameter
 * @returns {Promise<any>} returns the geolocation or an error 
 */
export async function getGeoOfString(location: string): Promise<{ lat: number, lon: number }> {
    let gResponse = await gMapsAPICall(location);
    if (gResponse.status === 'OK') {
        return { lat: gResponse.results[0].geometry.location.lat, lon: gResponse.results[0].geometry.location.lng };
    } else if (gResponse.status === 'ZERO_RESULTS') {
        throw new NotFoundError;
    } else {
        console.error(gResponse.status);
        return Promise.reject('An unkown error occured');
    }
}

export async function gMapsAPICall(geolocation: string): Promise<{ results: [{ geometry: { location: { lat: number, lng: number } } }], status: string }> {
    const googleAPIKey = environment.hikes.gmapsApiKey;
    return got.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${geolocation}&key=${googleAPIKey}`).json();
}
