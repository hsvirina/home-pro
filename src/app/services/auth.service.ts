import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  photoUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://coffeespot.54-221-160-23.nip.io/api/auth';

  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );
  token$ = this.tokenSubject.asObservable();

  private userSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
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

          // Допустим, после логина у тебя есть эндпоинт /me или сервер возвращает данные пользователя
          // Здесь нужно получить данные пользователя и сохранить
          // Например, если сервер возвращает user в теле login, можно сразу сохранить
          // Или сделать отдельный запрос на /me — тут пример, как бы могло быть:
          this.loadUserInfo().subscribe();
        }),
        catchError(this.handleError)
      );
  }

  private loadUserInfo() {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      }),
      catchError(err => {
        // Если не удалось загрузить данные пользователя, очистить
        localStorage.removeItem('user');
        this.userSubject.next(null);
        return throwError(() => err);
      })
    );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<string> {
    return this.http
      .post(
        `${this.baseUrl}/register`,
        { email, password, firstName, lastName },
        {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'text',
        }
      )
      .pipe(catchError(this.handleError));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('handleError:', error);
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
