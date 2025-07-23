import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../models/review.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private baseUrl = 'https://coffeespot.54-221-160-23.nip.io/api/reviews';

  constructor(private http: HttpClient) {}

  getReviewsByCafeId(cafeId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/cafe/${cafeId}`);
  }

  addReview(review: {
    cafeId: number;
    rating: number;
    text: string;
  }): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, review, {
  headers: {
    'Content-Type': 'application/json'
  }
});
  }

  deleteReview(reviewId: number) {
  return this.http.delete(`${this.baseUrl}/${reviewId}`);
}
}
