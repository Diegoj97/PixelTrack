import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SpotifyArtist, SpotifySearchResponse, SpotifyAlbumsResponse, SpotifyAlbum } from '../interfaces/spotify.interfaces';

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

  getRandomArtist(countryCode?: string): Observable<{ artist: SpotifyArtist, album: SpotifyAlbum }> {
    return this.getToken().pipe(
      switchMap(token => this.searchRandomArtistRecursive(token, countryCode))
    );
  }

  private searchRandomArtistRecursive(token: string, countryCode?: string): Observable<{ artist: SpotifyArtist, album: SpotifyAlbum }> {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    const randomOffset = Math.floor(Math.random() * 1000);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('q', randomChar)
      .set('type', 'artist')
      .set('limit', '1')
      .set('offset', randomOffset.toString());

    if (countryCode) {
      params = params.set('market', countryCode);
    }

    return this.http.get<SpotifySearchResponse>(`${this.baseUrl}/search`, { headers, params }).pipe(
      switchMap(response => {
        if (response.artists && response.artists.items.length > 0) {
          const artist = response.artists.items[0];
          // Verificar si tiene al menos 3 álbumes
          // Pedimos más de 3 para poder filtrar duplicados si los hubiera
          return this.http.get<SpotifyAlbumsResponse>(`${this.baseUrl}/artists/${artist.id}/albums?include_groups=album&limit=10`, { headers }).pipe(
            switchMap(albumResponse => {
              // Filtrar álbumes duplicados por nombre
              const uniqueAlbums = albumResponse.items.filter((album, index, self) =>
                index === self.findIndex((t) => (
                  t.name === album.name
                ))
              );

              if (uniqueAlbums.length >= 3) {
                const randomAlbum = uniqueAlbums[Math.floor(Math.random() * uniqueAlbums.length)];
                return of({ artist, album: randomAlbum });
              } else {
                // Si no tiene suficientes álbumes, buscamos otro
                return this.searchRandomArtistRecursive(token, countryCode);
              }
            })
          );
        }
        // Si no se encontró artista en la búsqueda, intentamos de nuevo
        return this.searchRandomArtistRecursive(token, countryCode);
      })
    );
  }
}
