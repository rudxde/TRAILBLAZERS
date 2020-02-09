import { createAction, props } from '@ngrx/store';
import { ISpecialAction } from '../reducers/navbar.reducre';

export const openAction = createAction('[Navbar] open');
export const closeAction = createAction('[Navbar] close');

export const setTitleAction = createAction('[Navbar] set Title', props<{ text: string }>());
export const setSpecialActionAction = createAction('[Navbar] set Title', props<{ specialAction: ISpecialAction | undefined }>());
