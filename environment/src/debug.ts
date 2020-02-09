import { IEnvironment } from '@tb/interfaces';

const baseUrl = 'http://localhost:80';

const services = {
    auth: { name: 'auth', route: baseUrl + '/api/v1/auth', isPublic: true, port: 80, mongoDb: 'mongodb://mongo-auth:27017/', redis: { url: 'auth-redis' } },
    hikes: { name: 'hikes', route: baseUrl + '/api/v1/hikes', isPublic: true, port: 80, mongoDb: 'mongodb://mongo-hikes:27017/' },
    user: { name: 'user', route: baseUrl + '/api/v1/user', isPublic: true, port: 80, mongoDb: 'mongodb://mongo-user:27017/' },
    weather: { name: 'weather', route: baseUrl + '/api/v1/weather', isPublic: true, port: 80, mongoDb: 'mongodb://mongo-weather:27017/' },
    map: { name: 'map', route: baseUrl + '/api/v1/map', isPublic: true, port: 80, mongoDb: 'mongodb://mongo-map:27017/' },
    recommender: { name: 'recommender', route: '', port: 80, isPublic: false },
};

/**
 * Debug Environment for the frontend.
 */
export const environment: IEnvironment = {
    isDebug: true,
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
        apiKey: <any>undefined,
    },
    hikes: {
        gmapsApiKey: <any>undefined,
    }
};
