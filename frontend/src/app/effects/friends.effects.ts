import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadFriendsAction, loadedFriendsAction, navigateToRouteAction, showSnackbarAction } from '../actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ProfileService } from '../services/profile/profile.service';

@Injectable()
export class FriendsEffect {

    public closeActionMenu$ = createEffect(() => this.actions$.pipe(
        ofType(loadFriendsAction),
        switchMap(() => this.profileService.loadFriends$().pipe(
            map(x => loadedFriendsAction({result: x})),
            catchError((err: Error) => {
                return [
                    navigateToRouteAction({ route: '/home' }),
                    showSnackbarAction({ message: err.message }),
                ];
            }),
        )),
    ));

    constructor(
        private actions$: Actions,
        private profileService: ProfileService,
    ) { }

}
