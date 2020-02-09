import { createAction, props } from '@ngrx/store';
import { IHikingRoute, IWeather } from '@tb/interfaces';

export const loadWeatherAction = createAction('[Weather] load WeatherData', props<{city: IHikingRoute['startingPoint']}>());
export const loadedWeatherAction = createAction('[Weather] loaded WeatherData', props<{ weatherData: IWeather }>());
