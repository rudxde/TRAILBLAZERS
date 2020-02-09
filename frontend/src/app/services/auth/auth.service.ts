import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@tb/environment/dist/prod';
import { Auth, IUserProfile } from '@tb/interfaces';
import { Observable, of, throwError, interval, Subject } from 'rxjs';
import { catchError, mapTo, tap, takeUntil, map, filter, concatMap } from 'rxjs/operators';
import { addSeconds, isAfter, isPast } from 'date-fns';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { showSnackbarAction, navigateToRouteAction, loadSessionAction } from 'src/app/actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public token: Auth.ICertifiedUserToken;

  public logout$: Subject<void>;
  public stopOldTokenRefresher$: Subject<void>;

  constructor(
    private http: HttpClient,
    private store: Store<IState>,
  ) {
    this.logout$ = new Subject<void>();
    this.stopOldTokenRefresher$ = new Subject<void>();
    this.store.pipe(select('auth', 'loggedIn'), filter(Boolean)).subscribe(() => this.tokenRefresher());
  }

  public init(): void {
    const localStorageToken = window.localStorage.getItem('token');
    this.store.dispatch(loadSessionAction({ token: localStorageToken ? JSON.parse(localStorageToken) : undefined }));
  }

  public login(login: string, password: string): Observable<boolean> {
    return this.http.put<Auth.ICertifiedUserToken>(environment.api.auth.route + '/login', {
      login,
      password,
    }).pipe(
      tap(token => {
        this.setToken(token);
      }),
      mapTo(true),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return of(false);
        }
        return throwError(err);
      }),
    );
  }

  public logout(): Observable<void> {
    this.logout$.next();
    return this.http.get<void>(environment.api.auth.route + '/logout', {
      headers: this.setHeader(new HttpHeaders()),
    }).pipe(
      map(() => {
        this.setToken(undefined);
      }),
    );
  }

  public updateProfile(updatedProfile: IUserProfile): Observable<void> {
    return this.http.patch(`${environment.api.user}/me`, updatedProfile).pipe(
      map((): void => { return; }),
    );
  }

  public updateToken(): Observable<Auth.ICertifiedUserToken> {
    if (!this.token) {
      this.store.dispatch(navigateToRouteAction({ route: '/login' }));
    }
    if (isPast(new Date(this.token.renewableUntil))) {
      this.store.dispatch(showSnackbarAction({ message: 'Ihre Sitzung ist abgelaufen.' }));
      this.store.dispatch(navigateToRouteAction({ route: '/login' }));
    }
    return this.http.get<Auth.ICertifiedUserToken>(environment.api.auth.route + '/token/refresh', {
      headers: this.setHeader(new HttpHeaders()),
    }).pipe(
      tap(token => this.setToken(token)),
    );
  }

  public setHeader(header: HttpHeaders): HttpHeaders {
    return header.set('authorization', JSON.stringify(this.token));
  }

  public setToken(token: Auth.ICertifiedUserToken | undefined): void {
    this.token = token;
    if (token) {
      window.localStorage.setItem('token', JSON.stringify(token));
    } else {
      window.localStorage.removeItem('token');
    }
  }

  private tokenRefresher(): void {
    let validUntil: Date = new Date(this.token.validUntil);
    let refreshAt: Date = addSeconds(validUntil, -30);
    this.stopOldTokenRefresher$.next();
    interval(1000).pipe(
      takeUntil(this.logout$),
      takeUntil(this.stopOldTokenRefresher$),
      filter(() => isAfter(new Date(), refreshAt)),
      concatMap(() => this.updateToken()),
      tap(token => {
        validUntil = new Date(token.validUntil);
        refreshAt = addSeconds(validUntil, -30);
      }),
      catchError((err, caught) => {
        this.store.dispatch(showSnackbarAction({ message: err.message }));
        this.store.dispatch(navigateToRouteAction({ route: '/login' }));
        return of();
      }),
    ).subscribe();
  }

}
