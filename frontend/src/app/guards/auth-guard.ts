import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IState } from '../reducers';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, tap, filter, switchMap } from 'rxjs/operators';
import { navigateToRouteAction } from '../actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<IState>,
  ) { }

  /**
   * Prevents routing to secured locations, when no user is logged in.
   *
   * @returns {Observable<boolean>}
   * @memberof AuthGuard
   */
  public canActivate(): Observable<boolean> {
    return this.store.pipe(select('auth'), pluck('loginPending')).pipe(
      filter(x => x === 'loaded'),
      switchMap(() => this.store.pipe(select('auth'), pluck('loggedIn')).pipe(tap(loggedIn => {
        if (!loggedIn) {
          this.store.dispatch(navigateToRouteAction({ route: '/login' }));
        }
      })))
    );
  }
}
