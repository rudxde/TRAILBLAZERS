import { createAction, props } from '@ngrx/store';
import { IUserProfile, Auth } from '@tb/interfaces';

export const loadProfileAction = createAction('[Profile] load', props<{ id: string }>());
export const loadedProfileAction = createAction('[Profile] loaded', props<{ result: IUserProfile }>());

export const editProfileAction = createAction('[Profile] edit');
export const updateProfileAction = createAction('[Profile] update', props<{ updatedProfile: Partial<IUserProfile> }>());
export const updateProfileFailedAction = createAction('[Profile] update');
export const updatedProfileAction = createAction('[Profile] updated', props<{ updatedProfile: Partial<IUserProfile> }>());

export const openChangePasswordAction = createAction('[Profile] open change Password');
export const changePasswordAction = createAction('[Profile] change Password', props<{ changePasswort: Auth.IChangePasswordRequest }>());
export const changedPasswordAction = createAction('[Profile] changed Password');
