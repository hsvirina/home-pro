import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { CheckIn } from '../models/CheckIn.model';

@Injectable({ providedIn: 'root' })
export class CheckInsService {
  constructor(private http: HttpClient) {}

  checkInToCafe(cafeId: number): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.checkins.base}/${cafeId}`, null);
  }

  getCheckInsByCafe(cafeId: number): Observable<CheckIn[]> {
  return this.http.get<CheckIn[]>(`${API_ENDPOINTS.checkins.base}/cafe/${cafeId}`);
}
}
