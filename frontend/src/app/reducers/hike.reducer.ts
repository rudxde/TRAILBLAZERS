import { createReducer, on, Action } from '@ngrx/store';
import {
    loadHikingRouteRecomendationsAction,
    loadHikingRouteRecomendationsFinishedAction,
    searchHikingRouteAction,
    searchResultHikingRouteAction,
    noSearchResultsHikingRouteAction,
    loadHikingRouteAction,
    loadedHikingRouteAction,
    loadNextHikeAction,
    loadedNextHikeAction,
    setHikeReport,
} from '../actions';
import { IHikingRoute, IHikeReport } from '@tb/interfaces';

export interface IHikingRouteState {
    hikingRouteRecomendations: IHikingRoute[];
    hikingRouteRecomendationsPending: boolean;
    hikingRouteSearchResults: IHikingRoute[];
    hikingRouteSearchResultsPending: 'loading' | 'loaded' | 'initial';
    hikingRouteLoadPending: 'loading' | 'loaded' | 'initial';
    hikingRoute: IHikingRoute;
    nextHikingRoute: IHikingRoute;
    nextRoutePending: 'loading' | 'loaded' | 'initial';
    hikeReport: Partial<IHikeReport>;
}

export const initialState: IHikingRouteState = {
    hikingRouteRecomendations: [],
    hikingRouteRecomendationsPending: false,
    hikingRouteSearchResults: [],
    hikingRouteSearchResultsPending: 'initial',
    hikingRoute: undefined,
    hikingRouteLoadPending: 'initial',
    nextHikingRoute: undefined,
    nextRoutePending: 'initial',
    hikeReport: {}
};

const _hikeReducer = createReducer<IHikingRouteState>(
    initialState,
    on(loadHikingRouteRecomendationsAction, state => ({ ...state, hikingRouteRecomendationsPending: true })),
    on(
        loadHikingRouteRecomendationsFinishedAction,
        (state, { hikingRoutes }) => ({ ...state, hikingRouteRecomendations: hikingRoutes, hikingRouteRecomendationsPending: false }),
    ),
    on(searchHikingRouteAction, state => ({ ...state, hikingRouteSearchResultsPending: 'loading' })),
    on(noSearchResultsHikingRouteAction, state => ({ ...state, hikingRouteSearchResultsPending: 'initial' })),
    on(
        searchResultHikingRouteAction,
        (state, { searchResults }) => ({ ...state, hikingRouteSearchResultsPending: 'loaded', hikingRouteSearchResults: searchResults })
    ),
    on(loadHikingRouteAction, status => ({ ...status, hikingRouteLoadPending: 'loading' })),
    on(loadedHikingRouteAction, (status, { result }) => ({ ...status, hikingRoute: result, hikingRouteLoadPending: 'loaded' })),
    on(loadNextHikeAction, status => ({ ...status, nextRoutePending: 'loading' })),
    on(loadedNextHikeAction, (status, { nextHikeResult }) => ({ ...status, nextHikingRoute: nextHikeResult, nextRoutePending: 'loaded' })),
    on(setHikeReport, (state, { report }) => ({ ...state, hikeReport: report })),
);

export function hikeReducer<A extends Action>(state: IHikingRouteState, action: A): IHikingRouteState {
    return _hikeReducer(state, action);
}
