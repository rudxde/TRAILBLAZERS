import { createReducer, on, Action } from '@ngrx/store';
import { loadFriendsAction, loadedFriendsAction } from '../actions';
import { IUserProfile } from '@tb/interfaces';

export interface IFriendsState {
    loading: 'loading' | 'loaded' | 'initial';
    profiles: IUserProfile[];
}

export const initialState: IFriendsState = {
    loading: 'initial',
    profiles: [],
};

const _friendsReducer = createReducer<IFriendsState>(
    initialState,
    on(loadFriendsAction,state => ({ ...state, loading: 'loading' })),
    on(loadedFriendsAction, (state, { result }) => ({ ...state, loading: 'loaded', profiles: result })),
);

export function friendsReducer<A extends Action>(state: IFriendsState, action: A): IFriendsState {
    return _friendsReducer(state, action);
}
