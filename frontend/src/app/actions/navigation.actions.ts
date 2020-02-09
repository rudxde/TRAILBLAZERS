import { createAction, props } from '@ngrx/store';

export const navigateToRouteAction = createAction('[Navigation] to Route', props<{ route: string }>());
export const routedAction = createAction('[Navigation] routed');
