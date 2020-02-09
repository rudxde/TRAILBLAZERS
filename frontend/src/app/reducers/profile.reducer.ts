import { createReducer, on, Action } from '@ngrx/store';
import {
    loadProfileAction,
    loadedProfileAction,
    updatedProfileAction,
    updateProfileAction,
    changePasswordAction,
    changedPasswordAction,
    openChangePasswordAction,
} from '../actions';
import { IUserProfile } from '@tb/interfaces';

export interface IProfileState {
    loading: 'loading' | 'loaded' | 'initial';
    profile: IUserProfile;
    updatePending: boolean;
}

export const initialState: IProfileState = {
    loading: 'initial',
    profile: undefined,
    updatePending: false,
};

const _profileReducer = createReducer<IProfileState>(
    initialState,
    on(loadProfileAction, state => ({ ...state, loading: 'loading' })),
    on(loadedProfileAction, (state, { result }) => ({ ...state, loading: 'loaded', profile: result })),
    on(updateProfileAction, state => ({ ...state, updatePending: true })),
    on(updatedProfileAction, (state, { updatedProfile }) => ({ ...state, updatePending: false, profile: { ...state.profile, ...updatedProfile } })),
    on(openChangePasswordAction, state => ({ ...state })),
    on(changePasswordAction, state => ({ ...state, updatePending: true })),
    on(changedPasswordAction, state => ({ ...state, updatePending: false })),
);

export function profileReducer<A extends Action>(state: IProfileState, action: A): IProfileState {
    return _profileReducer(state, action);
}
