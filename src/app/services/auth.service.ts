import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://coffeespot.54-221-160-23.nip.io/api/auth';

  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token'),
  );
  token$ = this.tokenSubject.asObservable();

  private userSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          this.tokenSubject.next(res.token);
          this.loadUserInfo().subscribe();
        }),
        catchError(this.handleError),
      );
  }

  public loadUserInfo() {
    return this.http
      .get<User>('https://coffeespot.54-221-160-23.nip.io/api/users/me')
      .pipe(
        tap((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }),
        catchError((err) => {
          console.warn('⚠️ Ошибка загрузки пользователя. Возможно, неавторизован:', err);
          localStorage.removeItem('user');
          this.userSubject.next(null);
          return throwError(() => err);
        }),
      );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(
        `${this.baseUrl}/register`,
        { email, password, firstName, lastName },
        {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'text' as 'json',
        },
      )
      .pipe(
        catchError(this.handleError),
      );
  }

updateUserProfile(updatedData: Partial<User>) {
    return this.http
      .patch<User>(
        'https://coffeespot.54-221-160-23.nip.io/api/users/settings',
        updatedData,
      )
      .pipe(
        tap((updatedUser) => {
          this.userSubject.next(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  updateUserLanguage(lang: 'ENG' | 'UKR') {
    return this.updateUserProfile({ language: lang });
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getToken(): string | null {
    const token = this.tokenSubject.getValue();
    return token;
  }

  getCurrentUser(): User | null {
    const user = this.userSubject.getValue();
    return user;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('❌ Ошибка в HTTP-запросе:', error);
    let message = 'Что-то пошло не так';
    if (error.error && typeof error.error === 'object' && error.error.message) {
      message = error.error.message;
    } else if (typeof error.error === 'string') {
      message = error.error;
    } else if (error.status) {
      message = `Ошибка: код ${error.status}`;
    }
    return throwError(() => new Error(message));
  }
}
