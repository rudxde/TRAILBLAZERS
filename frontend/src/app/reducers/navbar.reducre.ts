import { createReducer, on } from '@ngrx/store';
import { openAction, closeAction, setTitleAction, setSpecialActionAction } from '../actions';
import { TypedAction, Action } from '@ngrx/store/src/models';

export interface ISpecialAction {
    icon: string;
    action: TypedAction<string>;
}

export interface INavbarState {
    sideBarOpened: boolean;
    title: string;
    specialAction?: ISpecialAction;
}

export const initialState: INavbarState = {
    sideBarOpened: false,
    title: '',
};

const _navbarReducer = createReducer(
    initialState,
    on(openAction, state => ({ ...state, sideBarOpened: true })),
    on(closeAction, state => ({ ...state, sideBarOpened: false })),
    on(setTitleAction, (state, { text }) => ({ ...state, title: text })),
    on(setSpecialActionAction, (state, { specialAction }) => ({ ...state, specialAction }))
);

export function navbarReducer<A extends Action>(state: INavbarState, action: A): INavbarState {
    return _navbarReducer(state, action);
}
