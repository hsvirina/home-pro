import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { CheckIn } from '../models/CheckIn.model';

/**
 * Service to handle check-in operations related to cafes.
 * Provides methods for checking in and retrieving check-in data,
 * as well as a stream notifying subscribers about check-in updates.
 */
@Injectable({ providedIn: 'root' })
export class CheckInsService {
  /**
   * Subject to emit events when check-ins are updated.
   * Components can subscribe to react on changes.
   */
  private checkInsUpdatedSource = new Subject<void>();

  /**
   * Observable to notify subscribers when check-ins are updated.
   */
  checkInsUpdated$ = this.checkInsUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Performs a check-in to the specified cafe.
   * Emits an update event upon successful check-in.
   *
   * @param cafeId - The ID of the cafe to check in to.
   * @returns Observable of the server response.
   */
  checkInToCafe(cafeId: number): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.checkins.base}/${cafeId}`, null).pipe(
      tap(() => this.checkInsUpdatedSource.next())
    );
  }

  /**
   * Retrieves all check-ins associated with a specific cafe.
   *
   * @param cafeId - The ID of the cafe.
   * @returns Observable of an array of CheckIn objects.
   */
  getCheckInsByCafe(cafeId: number): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${API_ENDPOINTS.checkins.base}/cafe/${cafeId}`);
  }
}
