import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@tb/environment/dist/prod';
import { IHikingRoute, IWeather } from '@tb/interfaces';
import { HttpService } from '../http/http.service';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    constructor(private httpClient: HttpService) { }

    public loadWeather$(city: IHikingRoute['startingPoint']): Observable<IWeather> {
        return this.httpClient.get<IWeather>(`${environment.api.weather.route}/${city}`);
    }
}
