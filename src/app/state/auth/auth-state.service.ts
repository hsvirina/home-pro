import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { AuthApiService } from '../../core/services/auth-api.service';
import { StorageService } from '../../core/services/storage.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';

import { Theme } from '../../core/models/theme.type';
import { AuthUser, PublicUserProfile } from '../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  /** Observable holding the current authentication token */
  private tokenSubject: BehaviorSubject<string | null>;

  /** Token as observable stream */
  token$: Observable<string | null>;

  /** Observable holding the currently authenticated user */
  private userSubject: BehaviorSubject<AuthUser | null>;

  /** Current user as observable stream */
  user$: Observable<AuthUser | null>;

  /** Public profile observable for other users */
  private publicProfileSubject = new BehaviorSubject<PublicUserProfile | null>(null);
  publicProfile$ = this.publicProfileSubject.asObservable();

  constructor(
    private authApi: AuthApiService,
    private storage: StorageService,
    private themeService: ThemeService,
    private languageService: LanguageService,
  ) {
    // Initialize BehaviorSubjects with stored values
    this.tokenSubject = new BehaviorSubject<string | null>(this.storage.getToken());
    this.token$ = this.tokenSubject.asObservable();

    this.userSubject = new BehaviorSubject<AuthUser | null>(this.storage.getUser());
    this.user$ = this.userSubject.asObservable();
  }

  /**
   * Performs user login and loads user info upon success.
   * Emits the authentication token as string.
   *
   * @param email User email
   * @param password User password
   * @returns Observable emitting authentication token string
   */
  login(email: string, password: string): Observable<string> {
    return this.authApi.login(email, password).pipe(
      tap(({ token }) => this.setToken(token)),
      switchMap(() => this.loadUserInfo()),
      map(() => this.getToken()!), // Non-null assertion because token must exist after login
    );
  }

  /**
   * Loads the authenticated user's profile info from API,
   * updates internal state, theme, and language accordingly.
   *
   * @returns Observable emitting the loaded AuthUser
   */
  loadUserInfo(): Observable<AuthUser> {
    return this.authApi.loadUserInfo().pipe(
      tap((user) => {
        this.setUser(user);
        this.themeService.setTheme(user.theme as Theme);
        this.languageService.syncFromUser(user);
      }),
    );
  }

  /**
   * Registers a new user.
   *
   * @param email User email
   * @param password User password
   * @param firstName User first name
   * @param lastName User last name
   * @returns Observable emitting registration result (e.g. token)
   */
  register(email: string, password: string, firstName: string, lastName: string): Observable<string> {
    return this.authApi.register(email, password, firstName, lastName);
  }

  /**
   * Updates the authenticated user's profile partially.
   * Applies changes locally and updates theme and language if applicable.
   *
   * @param updatedData Partial user data to update
   * @returns Observable emitting updated AuthUser
   */
  updateUserProfile(updatedData: Partial<AuthUser>): Observable<AuthUser> {
    return this.authApi.updateUserProfile(updatedData).pipe(
      tap((user) => {
        this.setUser(user);
        this.themeService.setTheme(user.theme as Theme);
        this.languageService.syncFromUser(user);
      }),
    );
  }

  /**
   * Convenience method to update user's preferred language.
   *
   * @param lang Language code ('ENG' or 'UKR')
   * @returns Observable emitting updated AuthUser
   */
  updateUserLanguage(lang: 'ENG' | 'UKR'): Observable<AuthUser> {
    return this.updateUserProfile({ language: lang });
  }

  /**
   * Loads a public profile of a user by their ID.
   *
   * @param userId Target user ID
   * @returns Observable emitting PublicUserProfile
   */
  loadPublicProfile(userId: number): Observable<PublicUserProfile> {
    return this.authApi.getPublicUserProfile(userId).pipe(
      tap((profile) => this.publicProfileSubject.next(profile)),
    );
  }

  /**
   * Logs out the current user, clears all stored data and resets theme.
   */
  logout(): void {
    this.clearToken();
    this.clearUser();
    this.clearPublicProfile();
    this.storage.removeUnlockedAchievements();
    this.themeService.setTheme('light');
  }

  /**
   * Returns the current authentication token synchronously.
   */
  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  /**
   * Returns the currently authenticated user synchronously.
   */
  getCurrentUser(): AuthUser | null {
    return this.userSubject.getValue();
  }

  /**
   * Updates the current user data in state and storage.
   *
   * @param user Updated AuthUser object
   */
  updateCurrentUser(user: AuthUser): void {
    this.setUser(user);
  }

  // ----------------------------------
  // Private helper methods
  // ----------------------------------

  /** Saves the token to storage and updates observable */
  private setToken(token: string): void {
    this.storage.setToken(token);
    this.tokenSubject.next(token);
  }

  /** Clears token from storage and observable */
  private clearToken(): void {
    this.storage.removeToken();
    this.tokenSubject.next(null);
  }

  /** Saves the user to storage and updates observable */
  private setUser(user: AuthUser): void {
    this.storage.setUser(user);
    this.userSubject.next(user);
  }

  /** Clears user from storage and observable */
  private clearUser(): void {
    this.storage.removeUser();
    this.userSubject.next(null);
  }

  /** Clears public profile from storage and observable */
  private clearPublicProfile(): void {
    this.publicProfileSubject.next(null);
    this.storage.removePublicUserProfile();
  }

  /**
   * Returns public user profile without updating internal state.
   * Use loadPublicProfile() if you want to update internal observable.
   */
  getPublicProfile(userId: number): Observable<PublicUserProfile> {
    return this.authApi.getPublicUserProfile(userId);
  }
}
