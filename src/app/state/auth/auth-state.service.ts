import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { AuthApiService } from '../../core/services/auth-api.service';
import { StorageService } from '../../core/services/storage.service';
import { User } from '../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private tokenSubject: BehaviorSubject<string | null>;
  token$: Observable<string | null>;

  private userSubject: BehaviorSubject<User | null>;
  user$: Observable<User | null>;

  constructor(
    private authApi: AuthApiService,
    private storage: StorageService,
  ) {
    this.tokenSubject = new BehaviorSubject<string | null>(this.storage.getToken());
    this.token$ = this.tokenSubject.asObservable();

    this.userSubject = new BehaviorSubject<User | null>(this.storage.getUser());
    this.user$ = this.userSubject.asObservable();
  }
  // Handle user login and store token
  login(email: string, password: string): Observable<string> {
    return this.authApi.login(email, password).pipe(
      tap(({ token }) => {
        this.setToken(token);
        this.loadUserInfo().subscribe();
      }),
      map((res) => res.token),
      catchError((err) => throwError(() => err)),
    );
  }

  // Fetch and store current user info
  loadUserInfo(): Observable<User> {
    return this.authApi.loadUserInfo().pipe(
      tap((user) => this.setUser(user)),
      catchError((err) => {
        this.clearUser();
        return throwError(() => err);
      }),
    );
  }

  // Handle user registration
  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Observable<string> {
    return this.authApi
      .register(email, password, firstName, lastName)
      .pipe(
        map((res) => res),
        catchError((err) => throwError(() => err)),
      );
  }

  // Update and store user profile
  updateUserProfile(updatedData: Partial<User>): Observable<User> {
    return this.authApi.updateUserProfile(updatedData).pipe(
      tap((user) => this.setUser(user)),
      catchError((err) => throwError(() => err)),
    );
  }

  // Update user language preference
  updateUserLanguage(lang: 'ENG' | 'UKR'): Observable<User> {
    return this.updateUserProfile({ language: lang });
  }

  // Clear token and user data
  logout(): void {
    this.clearToken();
    this.clearUser();
  }

  private setToken(token: string): void {
    this.storage.setToken(token);
    this.tokenSubject.next(token);
  }

  private clearToken(): void {
    this.storage.removeToken();
    this.tokenSubject.next(null);
  }

  private setUser(user: User): void {
    this.storage.setUser(user);
    this.userSubject.next(user);
  }

  private clearUser(): void {
    this.storage.removeUser();
    this.userSubject.next(null);
  }

  // Get current token value
  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  // Get current user object
  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }
}
