import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { AuthStateService } from '../../state/auth/auth-state.service';

/**
 * Service responsible for managing user's favorite cafes via backend API calls.
 * Adds or removes cafes from favorites list with proper authorization headers.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly baseUrl = API_ENDPOINTS.user.favorites;

  constructor(
    private http: HttpClient,
    private authService: AuthStateService,
  ) {}

  /**
   * Retrieves the HTTP headers containing authorization token.
   * Returns an Observable of HttpHeaders or an error if token is missing.
   */
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

  /**
   * Sends a POST request to add a cafe to the user's favorites.
   *
   * @param cafeId - The ID of the cafe to add
   * @returns Observable of the server response
   */
  addFavorite(cafeId: number): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post(this.baseUrl, { cafeId }, { headers }),
      ),
    );
  }

  /**
   * Sends a DELETE request with a request body to remove a cafe from favorites.
   *
   * @param cafeId - The ID of the cafe to remove
   * @returns Observable of the server response
   */
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
