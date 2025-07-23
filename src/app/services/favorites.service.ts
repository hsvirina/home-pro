import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private baseUrl =
    'https://coffeespot.54-221-160-23.nip.io/api/users/me/favorites';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  addFavorite(cafeId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No auth token');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(this.baseUrl, { cafeId }, { headers });
  }

  removeFavorite(cafeId: number): Observable<any> {
  const token = this.authService.getToken();
  if (!token) {
    throw new Error('No auth token');
  }
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
  return this.http.request('delete', this.baseUrl, {
    headers,
    body: { cafeId },
  });
}
}
