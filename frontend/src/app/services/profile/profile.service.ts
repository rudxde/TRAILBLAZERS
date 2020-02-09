import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { IUserProfile, IRegistration, Auth, IHikeReport } from '@tb/interfaces';
import { switchMap, mergeMap, toArray, map } from 'rxjs/operators';
import { environment } from '@tb/environment/dist/prod';
import { HttpService } from '../http/http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpService,
    private angularHttpClient: HttpClient,
  ) { }

  public loadMyProfile$(): Observable<IUserProfile> {
    return this.loadProfile$('me');
  }

  public loadProfile$(id: string): Observable<IUserProfile> {
    return this.http.get<IUserProfile>(`${environment.api.user.route}/${id}`);
  }

  public updateMyProfile$(updatedProfile: Partial<IUserProfile>): Observable<Partial<IUserProfile>> {
    return this.http.patch(`${environment.api.user.route}/me`, updatedProfile).pipe(
      map((): Partial<IUserProfile> => updatedProfile),
    );
  }

  public loadFriends$(): Observable<IUserProfile[]> {
    return this.http.get<string>(`/assets/profile/friends.json`).pipe(
      switchMap(ids => from(ids)),
      mergeMap((id, index) => this.loadProfile$(id).pipe(map(x => ({ value: x, index })))),
      toArray(),
      map(x => x.sort((a, b) => a.index - b.index).map(x => x.value))
    );
  }

  public register$(registration: IRegistration): Observable<Auth.ICertifiedUserToken> {
    return this.angularHttpClient.post<Auth.ICertifiedUserToken>(environment.api.user.route + '/register', registration);
  }

  public changePassword$(changePasswordRequest: Auth.IChangePasswordRequest): Observable<void> {
    return this.http.patch(`${environment.api.auth.route}/password`, changePasswordRequest).pipe(
      map((): void => { return; })
    );
  }

  public submitHikeReport$(report: IHikeReport): Observable<void> {
    return this.http.post(`${environment.api.user.route}/submit-report`, report)
      .pipe(map((): void => { return; }));
  }

}
