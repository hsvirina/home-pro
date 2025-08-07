import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Review } from '../models/review.model';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

/**
 * Service to manage operations related to reviews for cafes.
 * Provides methods to fetch, add, and delete reviews.
 */
@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly baseUrl = API_ENDPOINTS.reviews.base;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all reviews associated with a specific cafe.
   *
   * @param cafeId - Unique identifier of the cafe
   * @returns Observable emitting an array of Review objects
   */
  getReviewsByCafeId(cafeId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/cafe/${cafeId}`);
  }

  /**
   * Creates a new review for a specified cafe.
   *
   * @param review - Object containing the review details (cafeId, rating, optional text)
   * @returns Observable emitting the created Review object
   */
  addReview(review: {
    cafeId: number;
    rating: number;
    text?: string;
  }): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, review, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Deletes a review by its unique ID.
   *
   * @param reviewId - Unique identifier of the review to delete
   * @returns Observable of the server response (any)
   */
  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${reviewId}`);
  }
}
