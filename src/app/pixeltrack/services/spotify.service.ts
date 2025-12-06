import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private clientId = environment.spotify.clientId;
  private clientSecret = environment.spotify.clientSecret;
  private tokenUrl = environment.spotify.tokenUrl;
  private baseUrl = environment.spotify.baseUrl;

  private accessToken: string = '';

  constructor(private http: HttpClient) {
    console.log('SpotifyService initialized');
  }

  public getToken(): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret);

    return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
      map(response => {
        console.log('Token response:', response);
        this.accessToken = response.access_token;
        return this.accessToken;
      }),
      catchError(err => {
        console.error('Error al obtener el token:', err);
        return throwError(() => err);
      })
    );
  }
}
