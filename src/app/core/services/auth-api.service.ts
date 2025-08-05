import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { AuthUser, PublicUserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(API_ENDPOINTS.auth.login, {
      email,
      password,
    });
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Observable<string> {
    return this.http.post(
      API_ENDPOINTS.auth.register,
      {
        email,
        password,
        firstName,
        lastName,
      },
      { responseType: 'text' },
    );
  }

  loadUserInfo(): Observable<AuthUser> {
    return this.http.get<AuthUser>(API_ENDPOINTS.user.me);
  }

  updateUserProfile(updatedData: Partial<AuthUser>): Observable<AuthUser> {
    return this.http.patch<AuthUser>(API_ENDPOINTS.user.settings, updatedData);
  }

  getPublicUserProfile(userId: number): Observable<PublicUserProfile> {
    return this.http.get<PublicUserProfile>(
      API_ENDPOINTS.user.publicProfile(userId),
    );
  }



  likeReview(reviewId: number): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.reviewLikes.base}/${reviewId}`, null);
  }

  // Получить информацию о лайках: { likedByCurrentUser, totalLikes }
  getReviewLikesInfo(reviewId: number): Observable<{ likedByCurrentUser: boolean; totalLikes: number }> {
    return this.http.get<{ likedByCurrentUser: boolean; totalLikes: number }>(
      `${API_ENDPOINTS.reviewLikes.base}/${reviewId}`
    );
  }

  // Удалить лайк текущего пользователя
  unlikeReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.reviewLikes.base}/${reviewId}`);
  }
}
