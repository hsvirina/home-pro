import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { AuthStateService } from '../../state/auth/auth-state.service';

import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly baseUrl = API_ENDPOINTS.user.favorites;

  constructor(
    private http: HttpClient,
    private authService: AuthStateService,
  ) {}

  private getAuthHeaders(): Observable<HttpHeaders> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Authorization token is missing'));
    }
    return of(
      new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    );
  }

  addFavorite(cafeId: number): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post(this.baseUrl, { cafeId }, { headers }),
      ),
    );
  }

  removeFavorite(cafeId: number): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.request('delete', this.baseUrl, {
          headers,
          body: { cafeId },
        }),
      ),
    );
  }
}
