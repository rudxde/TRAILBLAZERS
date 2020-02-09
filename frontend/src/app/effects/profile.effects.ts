import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    loadProfileAction,
    loadedProfileAction,
    navigateToRouteAction,
    showSnackbarAction,
    editProfileAction,
    openBottomSheetAction,
    updateProfileAction,
    closeBottomSheetAction,
    setSpecialActionAction,
    removeFriendAction,
    addFriendAction,
    updatedProfileAction,
    openChangePasswordAction,
    changePasswordAction,
    changedPasswordAction,
} from '../actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ProfileService } from '../services/profile/profile.service';
import { EditProfileComponent } from '../components/profile/edit-profile/edit-profile.component';
import { of } from 'rxjs';
import { ChangePasswordComponent } from '../components/profile/change-password/change-password.component';

@Injectable()
export class ProfileEffect {

    public loadProfile$ = createEffect(() => this.actions$.pipe(
        ofType(loadProfileAction),
        switchMap(({ id }) => this.profileService.loadProfile$(id).pipe(
            map(x => loadedProfileAction({ result: x })),
            catchError((err: Error) => {
                return [
                    navigateToRouteAction({ route: '/home' }),
                    showSnackbarAction({ message: err.message }),
                ];
            }),
        )),
    ));

    public editProfile$ = createEffect(() => this.actions$.pipe(
        ofType(editProfileAction),
        map(() => openBottomSheetAction({ component: EditProfileComponent }))
    ));

    public updateProfile$ = createEffect(() => this.actions$.pipe(
        ofType(updateProfileAction),
        switchMap(({ updatedProfile }) => this.profileService.updateMyProfile$(updatedProfile)),
        switchMap(updatedProfile => of(closeBottomSheetAction(), updatedProfileAction({ updatedProfile }))),
    ));

    public setProfileNavbarAction$ = createEffect(() => this.actions$.pipe(
        ofType(loadedProfileAction),
        map(profile => {
            if (profile.result.isMe) {
                return setSpecialActionAction({ specialAction: { icon: 'edit', action: editProfileAction() } });
            } else if (profile.result.isMyFriend) {
                return setSpecialActionAction({ specialAction: { icon: 'remove_circle_outline', action: removeFriendAction({ userId: profile.result.id }) } });
            } else {
                return setSpecialActionAction({ specialAction: { icon: 'person_add', action: addFriendAction({ userId: profile.result.id }) } });
            }
        })
    ));

    public openChangePassword = createEffect(() => this.actions$.pipe(
        ofType(openChangePasswordAction),
        map(() => openBottomSheetAction({ component: ChangePasswordComponent })),
    ));

    public changePassword = createEffect(() => this.actions$.pipe(
        ofType(changePasswordAction),
        switchMap(({ changePasswort }) => this.profileService.changePassword$(changePasswort)),
        switchMap(() => of(closeBottomSheetAction(), changedPasswordAction())),
    ));

    constructor(
        private actions$: Actions,
        private profileService: ProfileService,

    ) { }

}
