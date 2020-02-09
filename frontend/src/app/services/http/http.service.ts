import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

/**
 * An proxy for the HttpClient, which adds the authorization headers.
 *
 * @export
 * @class HttpService
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) { }

  public get<T>(route: string): Observable<T> {
    return this.httpClient.get<T>(route, { headers: this.authService.setHeader(new HttpHeaders()) });
  }
  public post<T>(route: string, body: any): Observable<T> {
    return this.httpClient.post<T>(route, body, { headers: this.authService.setHeader(new HttpHeaders()) });
  }
  public put<T>(route: string, body: any): Observable<T> {
    return this.httpClient.put<T>(route, body, { headers: this.authService.setHeader(new HttpHeaders()) });
  }
  public patch<T>(route: string, body: any): Observable<T> {
    return this.httpClient.patch<T>(route, body, { headers: this.authService.setHeader(new HttpHeaders()) });
  }
  public delete<T>(route: string): Observable<T> {
    return this.httpClient.delete<T>(route, { headers: this.authService.setHeader(new HttpHeaders()) });
  }

}
