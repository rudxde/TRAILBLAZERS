import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { navigateToRouteAction, closeAction, routedAction, setTitleAction, setSpecialActionAction } from '../actions';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class NavigationEffects {

  public closeActionMenu$ = createEffect(() => this.actions$.pipe(
    ofType(navigateToRouteAction),
    map(() => closeAction())
  ));

  public removeTitle$ = createEffect(() => this.actions$.pipe(
    ofType(navigateToRouteAction),
    switchMap(() => [
      setTitleAction({ text: '' }),
      setSpecialActionAction({ specialAction: undefined })
    ])
  ));

  public navigate$ = createEffect(() => this.actions$.pipe(
    ofType(navigateToRouteAction),
    mergeMap(({ route }) =>
      this.router.navigateByUrl(route)
    ),
    map(() => routedAction())
  ));

  constructor(
    private actions$: Actions,
    private router: Router
  ) { }

}
