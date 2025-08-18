import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class SharedCafesService {
  constructor(private http: HttpClient) {}

  /**
   * Sends a request to share a cafe by its ID.
   * @param cafeId The unique identifier of the cafe to share.
   * @returns An Observable containing the server response.
   */
  shareCafe(cafeId: number): Observable<any> {
    return this.http
      .post(`${API_ENDPOINTS.sharedCafes.base}/${cafeId}`, null)
      .pipe(
        // Handle HTTP errors gracefully
        catchError(this.handleError)
      );
  }

  /**
   * Handles HTTP errors from the API.
   * @param error The error response object
   * @returns An observable throwing a user-friendly error message
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned code ${error.status}, body was: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
