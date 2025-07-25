import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { AuthStateService } from '../../state/auth/auth-state.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly baseUrl = API_ENDPOINTS.user.favorites;

  constructor(
    private http: HttpClient,
    private authService: AuthStateService,
  ) {}

  /**
   * Creates HTTP headers with Authorization token.
   * Returns HttpHeaders or an Observable error if token is missing.
   */
  private getAuthHeaders(): HttpHeaders | Observable<never> {
    const token = this.authService.getToken();
    if (!token) {
      // Return observable error instead of throwing exception
      return throwError(() => new Error('Authorization token is missing'));
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Add a cafe to user's favorites.
   * @param cafeId - ID of the cafe to add
   * @returns Observable with the server response
   */
  addFavorite(cafeId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (headers instanceof Observable) {
      return headers; // Early return if token is missing
    }

    return this.http.post(this.baseUrl, { cafeId }, { headers });
  }

  /**
   * Remove a cafe from user's favorites.
   * @param cafeId - ID of the cafe to remove
   * @returns Observable with the server response
   */
  removeFavorite(cafeId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (headers instanceof Observable) {
      return headers; // Early return if token is missing
    }

    return this.http.request('delete', this.baseUrl, {
      headers,
      body: { cafeId },
    });
  }
}
