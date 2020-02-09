import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { showSnackbarAction, openBottomSheetAction, closeBottomSheetAction, addFriendAction, removeFriendAction } from '../actions';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { EMPTY, merge } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class CoreEffects {

    public showSnackbar$ = createEffect(() => this.actions$.pipe(
        ofType(showSnackbarAction),
        switchMap(({ message, duration }) => {
            this.snackBar.open(message, undefined, { duration: duration || 5000 });
            return EMPTY;
        }),
    ));

    public openBottomSheet$ = createEffect(() => this.actions$.pipe(
        ofType(openBottomSheetAction),
        switchMap(({ component }) => {
            this.bottomSheet.open(component);
            return EMPTY;
        }),
    ));

    public closeBottomSheet$ = createEffect(() => this.actions$.pipe(
        ofType(closeBottomSheetAction),
        switchMap(() => {
            this.bottomSheet.dismiss();
            return EMPTY;
        }),
    ));

    public notImplemented$ = createEffect(() => merge(
        this.actions$.pipe(ofType(addFriendAction)),
        this.actions$.pipe(ofType(removeFriendAction)),
    ).pipe(
        map((action: Action) => showSnackbarAction({ message: `Not Implemented (${action.type})` }))
    ));

    constructor(
        private actions$: Actions,
        private snackBar: MatSnackBar,
        private bottomSheet: MatBottomSheet,
    ) { }

}
