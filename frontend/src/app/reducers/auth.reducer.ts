import { createReducer, on, Action } from '@ngrx/store';
import { loginAction, logedinAction, logoutAction, loadSessionAction, notLogedInAction, registrationAction } from '../actions';

export interface IAuthState {
    loggedIn: boolean;
    loginPending: 'initial' | 'loading' | 'loaded';
}

export const initialState: IAuthState = {
    loginPending: 'initial',
    loggedIn: false,
};

const _authReducer = createReducer<IAuthState>(
    initialState,
    on(loginAction,state => ({ ...state, loggedIn: false, loginPending: 'loading' })),
    on(logedinAction,state => ({ ...state, loggedIn: true, loginPending: 'loaded' })),
    on(logoutAction,state => ({ ...state, loggedIn: false })),
    on(loadSessionAction,state => ({ ...state, loginPending: 'loading' })),
    on(notLogedInAction,state => ({ ...state, loggedIn: false, loginPending: 'loaded' })),
    on(registrationAction,state => ({...state, loginPending: 'loading'}))
);

export function authReducer<A extends Action>(state: IAuthState, action: A): IAuthState {
    return _authReducer(state, action);
}
