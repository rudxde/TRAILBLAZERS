import { createAction, props } from '@ngrx/store';
import { SearchFilterT } from '@tb/interfaces';

export const openSearchFilterAction = createAction('[Search] open search filter', props<{filter: SearchFilterT}>());
export const updateSearchFilterAction = createAction('[Search] update search filter', props<{filter: SearchFilterT}>());
