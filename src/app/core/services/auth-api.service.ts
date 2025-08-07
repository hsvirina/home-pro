import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { AuthUser, PublicUserProfile } from '../models/user.model';

/**
 * Service for handling all authentication and user-related API requests.
 * Provides methods for login, registration, user info loading and updating,
 * fetching public user profiles, and managing review likes.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private http: HttpClient) {}

  /**
   * Sends login request with email and password.
   * Returns an observable emitting the authentication token.
   */
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(API_ENDPOINTS.auth.login, {
      email,
      password,
    });
  }

  /**
   * Sends registration request with user details.
   * Returns an observable emitting response text.
   */
  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Observable<string> {
    return this.http.post(
      API_ENDPOINTS.auth.register,
      { email, password, firstName, lastName },
      { responseType: 'text' },
    );
  }

  /**
   * Retrieves authenticated user's profile information.
   */
  loadUserInfo(): Observable<AuthUser> {
    return this.http.get<AuthUser>(API_ENDPOINTS.user.me);
  }

  /**
   * Updates authenticated user's profile with partial data.
   */
  updateUserProfile(updatedData: Partial<AuthUser>): Observable<AuthUser> {
    return this.http.patch<AuthUser>(API_ENDPOINTS.user.settings, updatedData);
  }

  /**
   * Fetches public profile information for a user by ID.
   */
  getPublicUserProfile(userId: number): Observable<PublicUserProfile> {
    return this.http.get<PublicUserProfile>(API_ENDPOINTS.user.publicProfile(userId));
  }

  /**
   * Likes a review by its ID.
   */
  likeReview(reviewId: number): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.reviewLikes.base}/${reviewId}`, null);
  }

  /**
   * Gets like status and total likes count for a review.
   * Returns an object with:
   * - likedByCurrentUser: boolean indicating if current user liked the review
   * - totalLikes: number of total likes on the review
   */
  getReviewLikesInfo(reviewId: number): Observable<{ likedByCurrentUser: boolean; totalLikes: number }> {
    return this.http.get<{ likedByCurrentUser: boolean; totalLikes: number }>(
      `${API_ENDPOINTS.reviewLikes.base}/${reviewId}`
    );
  }

  /**
   * Removes current user's like from a review.
   */
  unlikeReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.reviewLikes.base}/${reviewId}`);
  }
}
