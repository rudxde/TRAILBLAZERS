import { ITimeSpan } from './';
import { Maps } from './map';
export interface IEnvironment {
    /**
     * Is the app currently running in debug environment.
     *
     * @type {boolean}
     * @memberof IEnvironment
     */
    isDebug: boolean;
    /**
     * Collection of all api-configs.
     *
     * @memberof IEnvironment
     */
    api: {
        user: IApiDef & IApiDefMongo,
        auth: IApiDef & IApiDefMongo & IApiDefRedis,
        hikes: IApiDef & IApiDefMongo,
        weather: IApiDef & IApiDefMongo,
        map: IApiDef & IApiDefMongo,
        recommender: IApiDef,
        /**
         * All configs an an array
         *
         * @type {IApiDef[]}
         */
        all: IApiDef[],
    };
    /**
     * Time which an auth token's validity should last.
     *
     * @type {ITimeSpan}
     * @memberof IEnvironment
     */
    defaultTokenValidity: ITimeSpan;
    /**
     * Time how long an auth token can be refreshed.
     *
     * @type {ITimeSpan}
     * @memberof IEnvironment
     */
    defaultTokenRenewability: ITimeSpan;
    map: {
        /**
         * Initial scale of the map
         *
         * @todo not yet used
         * @type {number}
         */
        defaultScale: number,
        /**
         * Width of off-screen border which will be pre-rendered for potential movement of the map.
         *
         * @type {number}
         */
        preRenderBorderWidth: number,
        /**
         * Defines, if the GPS data should be emulated.
         * use ```false``` to request the gps data from the browser
         * use ```'tour'``` to emulate the hiking of an hard-coded tour
         * use ```{lon,lat}``` to set a specific position.
         * 
         * @type {(Maps.ICoords | 'tour' | false)}
         */
        useGpsMock: Maps.ICoords | 'tour' | false,
    };
    weather: {
        apiKey: string
    };
    hikes: {
        gmapsApiKey: string
    };
}

/**
 * Config of an api
 *
 * @export
 * @interface IApiDef
 */
export interface IApiDef {
    /**
     * Route to reach the service
     *
     * @type {string}
     * @memberof IApiDef
     */
    route: string;
    /**
     * Name of the service.
     * Correlates to the name of the service in the docker-compose file.
     * The name is also used for determining the internal docker dns of the service.
     *
     * @type {string}
     * @memberof IApiDef
     */
    name: string;
    /**
     * Port on which the service is reachable
     *
     * @type {number}
     * @memberof IApiDef
     */
    port: number;
    /**
     * Defines if the service reachable from outside the docker-network.
     *
     * @type {boolean}
     * @memberof IApiDef
     */
    isPublic:boolean;
}

/**
 * Addition to the IApiDef interface for a mongo connection string.
 *
 * @export
 * @interface IApiDefMongo
 */
export interface IApiDefMongo {
    /**
     * connection-string to the mongodb of the service.
     *
     * @type {string}
     * @memberof IApiDefMongo
     */
    mongoDb: string;
}

/**
 * Addition to the IApiDef interface for a redis connection.
 *
 * @export
 * @interface IApiDefRedis
 */
export interface IApiDefRedis {
    /**
     * connection config to the redis of the service.
     *
     * @type {{
     *         url: string,
     *         port?: number,
     *     }}
     * @memberof IApiDefRedis
     */
    redis: {
        url: string,
        port?: number,
    };
}
