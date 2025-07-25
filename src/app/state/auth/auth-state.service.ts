import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthApiService } from '../../core/services/auth-api.service';
import { StorageService } from '../../core/services/storage.service';
import { User } from '../../core/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private tokenSubject: BehaviorSubject<string | null>;
  public token$: Observable<string | null>;

  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor(
    private authApi: AuthApiService,
    private storage: StorageService,
  ) {
    this.tokenSubject = new BehaviorSubject<string | null>(
      this.storage.getToken(),
    );
    this.token$ = this.tokenSubject.asObservable();

    this.userSubject = new BehaviorSubject<User | null>(this.storage.getUser());
    this.user$ = this.userSubject.asObservable();
  }

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

  loadUserInfo(): Observable<User> {
    return this.authApi.loadUserInfo().pipe(
      tap((user) => this.setUser(user)),
      catchError((err) => {
        this.clearUser();
        return throwError(() => err);
      }),
    );
  }

register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Observable<string> {
  return this.authApi.register(email, password, firstName, lastName).pipe(
    // Если res — строка, просто возвращаем ее или void:
    map((res) => res), // или map(() => '') если не нужен ответ
    catchError((err) => throwError(() => err)),
  );
}

  updateUserProfile(updatedData: Partial<User>): Observable<User> {
    return this.authApi.updateUserProfile(updatedData).pipe(
      tap((user) => this.setUser(user)),
      catchError((err) => throwError(() => err)),
    );
  }

  updateUserLanguage(lang: 'ENG' | 'UKR'): Observable<User> {
    return this.updateUserProfile({ language: lang });
  }

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

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }
}
