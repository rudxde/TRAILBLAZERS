import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    loadHikingRouteRecomendationsAction,
    loadHikingRouteRecomendationsFinishedAction,
    searchHikingRouteAction,
    searchResultHikingRouteAction,
    navigateToRouteAction,
    showSnackbarAction,
    noSearchResultsHikingRouteAction,
    loadHikingRouteAction,
    loadedHikingRouteAction,
    loadNextHikeAction,
    loadedNextHikeAction,
    openBottomSheetAction,
    rateHikeAction,
    closeBottomSheetAction,
    setHikeReport,
} from '../actions';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { HikeService } from '../services/hike/hike.service';
import { Store, select } from '@ngrx/store';
import { IState } from '../reducers';
import { searchFilterToQuery } from '@tb/utils';
import { RateHikeComponent } from '../components/rate-hike/rate-hike.component';
import { of } from 'rxjs';

@Injectable()
export class HikeRouteEffects {

    public loadNextHike$ = createEffect(() => this.actions$.pipe(ofType(loadNextHikeAction),
        switchMap(() => this.hikeService.loadNextHike$().pipe(
            map(nextHike => loadedNextHikeAction({ nextHikeResult: nextHike })),
            catchError((err: Error) => [showSnackbarAction({ message: err.message })])
        )
        )));

    public loadRecommendation$ = createEffect(() => this.actions$.pipe(
        ofType(loadHikingRouteRecomendationsAction),
        switchMap(() => this.hikeService.loadRecommendations$().pipe(
            map(recommendations => loadHikingRouteRecomendationsFinishedAction({ hikingRoutes: recommendations })),
            catchError((err: Error) => [showSnackbarAction({ message: err.message })])
        )),
    ));

    public search$ = createEffect(() => this.actions$.pipe(
        ofType(searchHikingRouteAction),
        withLatestFrom(this.store),
        switchMap(([action, storeState]) => this.hikeService.search$(searchFilterToQuery(storeState.search.filters)).pipe(
            map(searchResults => searchResultHikingRouteAction({ searchResults })),
            catchError((err: Error) => {
                return [
                    noSearchResultsHikingRouteAction(),
                    showSnackbarAction({ message: err.message }),
                ];
            })
        )),
    ));

    public searchRedirect$ = createEffect(() => this.actions$.pipe(
        ofType(searchHikingRouteAction),
        map(() => navigateToRouteAction({ route: '/search/results' }))
    ));

    public noSearchResultRedirect$ = createEffect(() => this.actions$.pipe(
        ofType(noSearchResultsHikingRouteAction),
        map(() => navigateToRouteAction({ route: '/search' }))
    ));

    public loadRouteEffect$ = createEffect(() => this.actions$.pipe(
        ofType(loadHikingRouteAction),
        withLatestFrom(this.store.pipe(select('hikingRoute', 'hikingRoute'))),
        map(([{ id }, last]) => {
            if (last && last.id === id) {
                return of(last);
            }
            return this.hikeService.loadRoute$(id);
        }),
        switchMap(hikeObservable =>
            hikeObservable.pipe(
                map(result => loadedHikingRouteAction({ result })),
                catchError((err: Error) => {
                    return [
                        navigateToRouteAction({ route: '/home' }),
                        showSnackbarAction({ message: err.message }),
                    ];
                })
            )),
    ));

    public openRating$ = createEffect(() => this.actions$.pipe(
        ofType(setHikeReport),
        map(() => openBottomSheetAction({ component: RateHikeComponent })),
    ));

    public closeRating$ = createEffect(() => this.actions$.pipe(
        ofType(rateHikeAction),
        map(() => closeBottomSheetAction()),
    ));

    constructor(
        private actions$: Actions,
        private store: Store<IState>,
        private hikeService: HikeService,
    ) { }

}
