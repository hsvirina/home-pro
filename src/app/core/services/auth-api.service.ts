import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../environments/api-endpoints';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.auth.login, { email, password });
  }

  register(email: string, password: string, firstName: string, lastName: string): Observable<string> {
  return this.http.post(API_ENDPOINTS.auth.register, {
    email,
    password,
    firstName,
    lastName,
  }, { responseType: 'text' })  // принять как plain text
  .pipe(
    tap({
      next: (res) => console.log('Register response (text):', res),
      error: (err) => console.error('Register error:', err)
    })
  );
}

  loadUserInfo(): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS.user.me);
  }

  updateUserProfile(updatedData: Partial<User>): Observable<User> {
    return this.http.patch<User>(API_ENDPOINTS.user.settings, updatedData);
  }
}
