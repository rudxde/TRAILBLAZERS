import { IEnvironment } from '@tb/interfaces';

const ANY: any = {};

export const services = {
    auth: { name: 'auth', route: '/api/v1/auth', port: 80, ...ANY },
    hikes: { name: 'hikes', route: '/api/v1/hikes', port: 80, ...ANY },
    user: { name: 'user', route: '/api/v1/user', port: 80, ...ANY },
    weather: { name: 'weather', route: '/api/v1/weather', ...ANY },
    map: { name: 'map', route: '/api/v1/map', port: 80, ...ANY },
};

/**
 * Environment for production mode. Does not contain backend-internals. Can be used in Frontend.
 */
export let environment: IEnvironment = {
    isDebug: false,
    api: {
        ...services,
        recommender: <any>undefined,
        all: [
            services.auth,
            services.hikes,
            services.user,
            services.weather,
            services.map,
        ]
    },
    defaultTokenValidity: <any>undefined,
    defaultTokenRenewability: <any>undefined,
    map: {
        defaultScale: 400000,
        preRenderBorderWidth: 200,
        useGpsMock: false,
    },
    weather: <any>undefined,
    hikes: <any>undefined,
};

/**
 * replaces the environment configuration with an given one. This is recommended to replace the environment with a debug configuration.
 *
 * @export
 * @param {IEnvironment} newEnv
 */
export function replaceEnvironment(newEnv: IEnvironment): void {
    environment = newEnv;
}
