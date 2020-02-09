import { createAction, props } from '@ngrx/store';
import { IUserProfile } from '@tb/interfaces';

export const loadFriendsAction = createAction('[Friends] load');
export const loadedFriendsAction = createAction('[Friends] loaded', props<{ result: IUserProfile[] }>());

export const addFriendAction = createAction('[Friends] add', props<{ userId: string }>());
export const removeFriendAction = createAction('[Friends] remove', props<{ userId: string }>());
