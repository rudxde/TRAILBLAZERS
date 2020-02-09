import { createReducer, on } from '@ngrx/store';
import { loadWeatherAction, loadedWeatherAction } from '../actions/weather.actions';
import { IHikingRoute, IWeather } from '@tb/interfaces';

export interface IWeatherState {
    weatherData: IWeather;
    weatherPending: 'loading' | 'loaded' | 'initial';
    city: IHikingRoute['startingPoint'];
}

export const initialState: IWeatherState = {
    weatherData: undefined,
    weatherPending: 'initial',
    city: { lon: 11.576124, lat: 48.137154 }
};

const _weatherReducer = createReducer<IWeatherState>(
    initialState,
    on(loadWeatherAction, (state, { city }) => ({ ...state, city, weatherPending: 'loading' })),
    on(loadedWeatherAction, (state, { weatherData }) => ({ ...state, weatherData, weatherPending: 'loaded' }))
);

export function weatherReducer(state: IWeatherState, action): IWeatherState {
    return _weatherReducer(state, action);
}
