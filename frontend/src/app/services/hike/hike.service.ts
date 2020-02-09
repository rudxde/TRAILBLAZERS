import { Injectable } from '@angular/core';
import { IHikingRoute, IHikingRouteSearchQuery } from '@tb/interfaces';
import { Observable, from, of } from 'rxjs';
import { switchMap, toArray, mergeMap, map, catchError } from 'rxjs/operators';
import { environment } from '@tb/environment/dist/prod';
import { HttpService } from '../http/http.service';
import fallbackHike from './fallback-hike';
import { Store } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { showSnackbarAction } from 'src/app/actions';

@Injectable()
export class HikeService {
    constructor(
        private httpClient: HttpService,
        private store : Store<IState>,
    ) { }

    public loadNextHike$(): Observable<IHikingRoute> {
        return this.httpClient.get<IHikingRoute>(environment.api.hikes.route + '/7692686');
    }

    public loadRecommendations$(): Observable<IHikingRoute[]> {
        return this.loadFromId$(this.httpClient.get<string[]>(environment.api.hikes.route + '/recommender'));
    }

    // anpassen auf backendpfad und 
    public search$(query: IHikingRouteSearchQuery): Observable<IHikingRoute[]> {
        return this.loadFromId$(this.httpClient.put<string[]>(environment.api.hikes.route + '/search', query));
    }

    public loadRoute$(id: string): Observable<IHikingRoute> {
        return this.httpClient.get<IHikingRoute>(environment.api.hikes.route + '/' + id).pipe(catchError(err => {
            this.store.dispatch(showSnackbarAction({ message: 'The requested hike was not found'}));
            console.log(err);
            return of(fallbackHike);
        }));
    }

    private loadFromId$(source$: Observable<string[]>): Observable<IHikingRoute[]> {
        return source$.pipe(
            switchMap(ids => from(ids)),
            mergeMap((id, index) => this.loadRoute$(id).pipe(map(x => ({ value: x, index })))),
            toArray(),
            map(x => x.sort((a, b) => a.index - b.index).map(x => x.value))
        );
    }

}
