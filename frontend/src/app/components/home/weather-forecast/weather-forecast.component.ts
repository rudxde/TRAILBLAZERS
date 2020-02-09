import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { pluck } from 'rxjs/operators';
import { loadWeatherAction } from 'src/app/actions';
import { IHikingRoute, IWeather } from '@tb/interfaces';

@Component({
    selector: 'app-weather-forecast',
    templateUrl: './weather-forecast.component.html',
    styleUrls: ['./weather-forecast.component.less']
})
export class WeatherForecastComponent implements OnInit {

    @Input() public city: IHikingRoute['startingPoint'];
    public loading$: Observable<string>;
    public weatherData$: Observable<IWeather>;

    constructor(
        private store: Store<IState>
    ) {
        this.loading$ = store.pipe(select('weather'), pluck('weatherPending'));
        this.weatherData$ = store.pipe(select('weather'), pluck('weatherData'));
    }

    public ngOnInit(): void {
        this.loading$ = this.store.pipe(select('weather'), pluck('weatherPending'));
        this.store.dispatch(loadWeatherAction({ city: this.city }));
        this.weatherData$ = this.store.pipe(select('weather'), pluck('weatherData'));

    }
}
