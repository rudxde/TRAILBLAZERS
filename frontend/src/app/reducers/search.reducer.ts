
import { createReducer, on, Action } from '@ngrx/store';
import { openSearchFilterAction, updateSearchFilterAction } from '../actions';
import { SearchFilterT } from '@tb/interfaces';

export interface ISearchState {
    filters: SearchFilterT[];
    editFilter: SearchFilterT;
}

export const initialState: ISearchState = {
    filters: [
        { id: '0', name: 'Ort', type: 'location', value: {} },
        { id: '1', name: 'Schwierigkeit', type: 'difficulty', value: {} },
        { id: '2', name: 'Dauer', type: 'duration', value: {} },
    ],
    editFilter: undefined,
};

export function searchReducer<A extends Action>(state: ISearchState, action: A): ISearchState {
    return createReducer<ISearchState>(
        initialState,
        on(openSearchFilterAction, (state, { filter }) => ({ ...state, editFilter: filter })),
        on(updateSearchFilterAction, (state, { filter }) => {
            const editedFilters = [...state.filters];
            const updateIndex = editedFilters.findIndex(x => x.id === filter.id);
            editedFilters[updateIndex] = filter;
            return { ...state, filters: editedFilters };
        }),
    )(state, action);
}
