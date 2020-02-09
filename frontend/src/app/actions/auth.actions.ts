import { createAction, props } from '@ngrx/store';
import { Auth, IRegistration } from '@tb/interfaces';

export const loginAction = createAction('[Auth] login', props<{ login: string, password: string }>());
export const notLogedInAction = createAction('[Auth] not loggedin');
export const logedinAction = createAction('[Auth] loggedin');
export const logoutAction = createAction('[Auth] logout');
export const loadSessionAction = createAction('[Auth] load session action', props<{ token: Auth.ICertifiedUserToken }>());
export const registrationAction = createAction('[Auth] register', props<{ registration: IRegistration }>());
