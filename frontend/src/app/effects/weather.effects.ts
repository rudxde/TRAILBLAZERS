import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { WeatherService } from '../services/weather/weather.service';
import { loadWeatherAction, loadedWeatherAction } from '../actions/weather.actions';
import { showSnackbarAction } from '../actions';

@Injectable()
export class WeatherEffect {

    public loadWeather$ = createEffect(() => this.actions$.pipe(ofType(loadWeatherAction),
        switchMap(({city}) => this.weatherService.loadWeather$(city).pipe(
            map(weather => loadedWeatherAction({ weatherData: weather })),
            catchError((err: Error) => [showSnackbarAction({ message: err.message })])
        ))
    ));

    constructor(
        private actions$: Actions,
        private weatherService: WeatherService,
    ) { }

}
