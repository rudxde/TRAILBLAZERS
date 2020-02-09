import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    loginAction,
    logedinAction,
    showSnackbarAction,
    navigateToRouteAction,
    logoutAction,
    loadSessionAction,
    notLogedInAction,
    registrationAction
} from '../actions';
import { map, switchMap, catchError, startWith } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { of } from 'rxjs';
import { ProfileService } from '../services/profile/profile.service';

@Injectable()
export class AuthEffects {

    public logout$ = createEffect(() => this.actions$.pipe(
        ofType(logoutAction),
        switchMap(() => this.authService.logout()),
        map(() => navigateToRouteAction({ route: '/login' })),
        catchError((err, caught) => {
            console.error(err);
            return caught.pipe(startWith(showSnackbarAction({ message: 'Beim Ausloggen ist ein Fehler aufgetreten!' })));
        }),
    ));

    public loadSession$ = createEffect(() => this.actions$.pipe(
        ofType(loadSessionAction),
        switchMap(({ token }) => {
            if (!token) {
                throw new Error('no Token');
            }
            this.authService.setToken(token);
            return this.authService.updateToken();
        }),
        map(() => logedinAction()),
        catchError((_, caught) => caught.pipe(startWith(notLogedInAction())))
    ));

    public login$ = createEffect(() => this.actions$.pipe(
        ofType(loginAction),
        switchMap(({ login, password }) => this.authService.login(login, password)),
        switchMap(succes => {
            if (succes) {
                return of(logedinAction(), navigateToRouteAction({ route: '/home' }));
            } else {
                return of(showSnackbarAction({ message: 'Benutzername oder Passwort falsch!' }));
            }
        }),
    ));

    public register$ = createEffect(() => this.actions$.pipe(
        ofType(registrationAction),
        switchMap(({ registration }) => this.profileService.register$(registration)),
        switchMap(token => of(loadSessionAction({ token }), navigateToRouteAction({ route: '/home' }))),
        catchError((_, caught) => caught.pipe(startWith(
            notLogedInAction(),
            showSnackbarAction({ message: 'Etwas ist bei der Registrierung schief gelaufen. Bitte kontaktieren sie den Administrator.' }),
        ))),
    ));

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private profileService: ProfileService,
    ) { }

}
