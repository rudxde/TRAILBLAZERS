import { createAction, props } from '@ngrx/store';
import { IHikingRoute, IHikeReport } from '@tb/interfaces';

export const loadHikingRouteRecomendationsAction = createAction('[Hiking-Route] load Recomendations');
export const loadHikingRouteRecomendationsFinishedAction = createAction(
    '[Hiking-Route] load Recomendations finished',
    props<{ hikingRoutes: IHikingRoute[] }>(),
);
export const selectHikingRouteAction = createAction('[Hiking-Route] select', props<{ id: string }>());

export const searchHikingRouteAction = createAction('[Hiking-Route] search');
export const searchResultHikingRouteAction = createAction('[Hiking-Route] search results', props<{ searchResults: IHikingRoute[] }>());
export const noSearchResultsHikingRouteAction = createAction('[Hiking-Route] no search results');

export const loadHikingRouteAction = createAction('[Hiking-Route] load', props<{ id: string }>());
export const loadedHikingRouteAction = createAction('[Hiking-Route] load results', props<{ result: IHikingRoute }>());

export const loadNextHikeAction = createAction('[Hiking-Route] Load next Hike');
export const loadedNextHikeAction = createAction('[Hiking-Route] Next Hike loaded', props<{ nextHikeResult: IHikingRoute }>());

// Ending - Rating
export const setHikeReport = createAction('[Hiking-Route] open rate hike', props<{ report: Partial<IHikeReport> }>());
export const rateHikeAction = createAction('[Hiking-Route] rate hike', props<{ rating: number }>());
