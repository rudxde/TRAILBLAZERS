import { Maps } from '@tb/interfaces';

/**
 * Returns the id from the chunk at the given coordinates.
 *
 * @export
 * @param {Maps.ICoords} coords
 * @returns {string}
 */
export function getChunk(coords: Maps.ICoords): string {
    let shortLat: string = (coords.lat * Math.pow(10, 3)).toFixed(0);
    let shortLon: string = (coords.lon * Math.pow(10, 3)).toFixed(0);
    shortLat = shortLat.padStart(5, '0');
    shortLon = shortLon.padStart(5, '0');
    return shortLat + shortLon;
}

/**
 * Returns the base coordinates for the given chunk.
 *
 * @export
 * @param {Maps.IChunk} chunk
 * @returns {Maps.ICoords}
 */
export function getChunkBaseCoords(chunk: Maps.IChunk): Maps.ICoords {
    const lat = parseInt(chunk.id.substr(0, 5));
    const lon = parseInt(chunk.id.substr(5, 5));
    return {
        lat: lat / Math.pow(10, 3),
        lon: lon / Math.pow(10, 3),
    };
}
