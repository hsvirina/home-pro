import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class SharedCafesService {
  constructor(private http: HttpClient) {}

  shareCafe(cafeId: number): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.sharedCafes.base}/${cafeId}`, null);
  }
}
