import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
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

  constructor(private http: HttpClient) { }

  private getToken(): Observable<string> {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
      map(response => {
        this.accessToken = response.access_token;
        return this.accessToken;
      })
    );
  }

  getGenres(): Observable<string[]> {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<{ genres: string[] }>(`${this.baseUrl}/recommendations/available-genre-seeds`, { headers });
      }),
      map(response => response.genres)
    );
  }
}
