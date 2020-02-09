import * as prod from './prod';
import { IEnvironment } from '@tb/interfaces';

export const services = {
    auth: {...prod.services.auth, isPublic: true, mongoDb: 'mongodb://mongo-auth:27017/', redis: { url: 'auth-redis' } },
    hikes: {...prod.services.hikes, isPublic: true, mongoDb: 'mongodb://mongo-hikes:27017/' },
    user: {...prod.services.user, isPublic: true, mongoDb: 'mongodb://mongo-user:27017/' },
    weather: {...prod.services.weather, isPublic: true, port: 80, mongoDb: 'mongodb://mongo-weather:27017/' },
    map: {...prod.services.map, isPublic: true, mongoDb: 'mongodb://mongo-map:27017/' },
    recommender: { name: 'recommender', route: '', port: 80, isPublic: false },
};

/**
 * Environment for backend-services. Do not use in frontend!
 */
export const environment: IEnvironment = {
    isDebug: false,
    api: {
        ...services,
        all: [
            services.auth,
            services.hikes,
            services.user,
            services.weather,
            services.map,
            services.recommender,
        ]
    },
    defaultTokenValidity: {
        min: 5,
    },
    defaultTokenRenewability: {
        days: 2
    },
    map: {
        defaultScale: 400000,
        preRenderBorderWidth: 200,
        useGpsMock: false,
    },
    weather: {
        apiKey: '', // Enter open weather api-key
    },
    hikes: {
        gmapsApiKey: '', // Enter google maps-api key
    }
};
