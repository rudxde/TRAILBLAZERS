import { Maps } from '@tb/interfaces';
export namespace Haversine {
    /**
     * calculates the distance between 2 coordinates in meters
     * 
     * source: https://stackoverflow.com/a/11172685
     *
     * @export
     * @param {number} lat1
     * @param {number} lon1
     * @param {number} lat2
     * @param {number} lon2
     * @returns {number} result in meters
     */
    export function haversineMeasure(from: Maps.ICoords, to: Maps.ICoords): number {  // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = to.lat * Math.PI / 180 - from.lat * Math.PI / 180;
        var dLon = to.lon * Math.PI / 180 - from.lon * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 1000; // meters
    }

    /**
     * Returns an approximated coordinate at the given distance, in a direction
     *
     * @export
     * @param {Maps.ICoords} from the Root coordinates.
     * @param {number} meters the distance in meters.
     * @param {number} accuracy The accuracy, the approximation should have in meters.
     * @param {('+lat' | '-lat' | '+lon' | '-lon')} direction The direction, in that the coordinate should be.
     * @param {Maps.ICoords} [base] Internal - the base for the next approximation iteration.
     * @param {Maps.ICoords} [resolution] Internal - the resolution of the last iteration
     * @returns {Maps.ICoords}
     */
    export function approximateDistanceWithAddedCoordinates(
        from: Maps.ICoords,
        meters: number,
        accuracy: number,
        direction: '+lat' | '-lat' | '+lon' | '-lon',
        base?: Maps.ICoords,
        resolution?: Maps.ICoords
    ): Maps.ICoords {
        if (!base || !resolution) {
            const newResolution: Maps.ICoords = {
                lat: direction === '+lat' ? 100 : (direction === '-lat' ? - 100 : 0),
                lon: direction === '+lon' ? 100 : (direction === '-lon' ? - 100 : 0),
            };
            return approximateDistanceWithAddedCoordinates(from, meters, accuracy, direction, from, newResolution);
        }
        const newResolution: Maps.ICoords = {
            lat: resolution.lat / 2,
            lon: resolution.lon / 2,
        };
        const pivot: Maps.ICoords = {
            lat: base.lat + newResolution.lat,
            lon: base.lon + newResolution.lon,
        };
        const pivotDistance = haversineMeasure(from, pivot) - meters;
        if (Math.abs(pivotDistance) < accuracy) {
            return pivot;
        }
        if (pivotDistance > 0) {
            return approximateDistanceWithAddedCoordinates(from, meters, accuracy, direction, base, newResolution);
        } else {
            return approximateDistanceWithAddedCoordinates(from, meters, accuracy, direction, pivot, newResolution);
        }
    }
}
