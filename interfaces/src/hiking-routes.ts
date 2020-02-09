import { Maps } from './map';
import { ITimeSpan } from './time-span';

/**
 * Defines the difficulties, which a route can have.
 *
 * @export
 * @enum {number}
 */
export enum HikingRouteDifficulty {
    unknown,
    easy,
    intermediate,
    difficult
}

export interface IHikingRoute {
    lineOptions: { strokeColor: string };
    time: { min: number };
    length: number;
    elevation: {
        ascent: number;
        descent: number;
        minAltitude: number;
        maxAltitude: number
    };
    rating: {
        condition: number;
        difficulty: number;
        technique: number;
        qualityOfExperience: number;
        landscape: number;
    };
    labels: { top: boolean; publicTransportFriendly: boolean };
    startingPoint: { lon: number; lat: number };
    season: {
        jan: boolean; feb: boolean;
        mar: boolean; apr: boolean;
        may: boolean; jun: boolean;
        jul: boolean; aug: boolean;
        sep: boolean; oct: boolean;
        nov: boolean; dec: boolean;
    };
    publicTransit: string; // als HTML
    startingPointDescr: string;
    gettingThere: string; // als HTML
    parking: string; // als HTML
    directions: string; // als HTML
    safetyGuidelines: string;
    equipment: string;
    tip: string;
    additionalInformation: string; // als HTML 
    destination: string;
    groundDescription: string;
    crestDescription: string;
    dayOfInspection: Date;
    properties: { property: Array<JSON> };
    pois: { poi: Array<JSON> };
    elevationProfile: {
        url: string;
        fallBackUrl: string;
        id: number;
    };
    wayType: { legend: Array<JSON>; elements: Array<JSON> };
    difficulties: {
        difficulty:
        [
            { type: string; value: number; id: number; name: string }
        ]
    };
    maps: string;
    bookWorks?: Array<JSON>;
    category: JSON;
    title: string;
    localizedTitle?: Array<JSON>;
    shortText: string;
    longText: string;
    primaryImage: { title: string; author: string; id: number };
    logoImage?: { id: number };
    geometry: string;
    images: {
        image: [{
            video?: {};
            source?: string;
            description?: string;
            isVideo?: boolean;
            title: string;
            author: string;
            meta?: {};
            id: number;
            width: number;
            height: number;
            primary: boolean;
            gallery: boolean;

        }]
    };
    regions: Array<JSON>;
    winterActivity: boolean;
    meta: Array<JSON>;
    id: string;
    type: string;
    constructedImgUrl: string;
}

export interface IHikeReport {
    rating: number;
    pauses: { start: Date, end: Date, position: Maps.ICoords, duration: ITimeSpan }[];
    speed: {
        walking: number,
        slow: number,
        running: number,
        driving: number,
        all: number,
    };
    speedRatings: {
        walking: number,
        slow: number,
        running: number,
        driving: number,
        all: number
    };
}
