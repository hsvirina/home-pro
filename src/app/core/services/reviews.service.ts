import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../models/review.model';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly baseUrl = API_ENDPOINTS.reviews.base;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all reviews for a specific cafe by its ID.
   * @param cafeId - ID of the cafe
   * @returns Observable of Review array
   */
  getReviewsByCafeId(cafeId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/cafe/${cafeId}`);
  }

  /**
   * Adds a new review for a cafe.
   * @param review - Review data including cafeId, rating, and text
   * @returns Observable of the created Review
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
   * Deletes a review by its ID.
   * @param reviewId - ID of the review to delete
   * @returns Observable of any (response)
   */
  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${reviewId}`);
  }
}
