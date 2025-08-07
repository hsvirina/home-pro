import { Injectable } from '@angular/core';
import { AuthUser, PublicUserProfile } from '../models/user.model';

/**
 * Service for handling user-related data in local storage.
 * Provides methods for getting, setting, and removing tokens and user information.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private readonly PUBLIC_USER_PROFILE_KEY = 'publicUserProfile';
  private readonly ACHIEVEMENTS_KEY = 'unlockedAchievements';

  /**
   * Retrieves the token from local storage and validates its expiration.
   * If the token is expired, removes it from storage and returns null.
   * @returns Token string if valid, null otherwise.
   */
  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token || this.isTokenExpired(token)) {
      this.clearTokenData(); // Clear expired token and related data
      return null;
    }
    return token;
  }

  /**
   * Checks if the user is authenticated based on the presence of a valid token.
   * @returns true if the token exists and is valid, false otherwise.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Validates the expiration of the given token.
   * @param token The JWT token to check.
   * @returns true if the token is expired, false otherwise.
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.parseJwt(token);
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      return payload.exp && payload.exp < now;
    } catch (e) {
      return true; // If parsing fails, consider the token expired
    }
  }

  /**
   * Parses the JWT token to extract the payload.
   * @param token The JWT token.
   * @returns Parsed token payload.
   */
  private parseJwt(token: string): any {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) throw new Error('Invalid token format');
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  }

  /**
   * Removes the token and user-related data from local storage.
   */
  private clearTokenData(): void {
    this.removeToken();
    this.removeUser();
  }

  /**
   * Sets the token in local storage.
   * @param token The token to be stored.
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Removes the token from local storage.
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Retrieves the user data from local storage.
   * @returns User data object or null if not found.
   */
  getUser(): AuthUser | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Sets the user data in local storage.
   * @param user The user data to be stored.
   */
  setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Removes the user data from local storage.
   */
  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Retrieves the public user profile from local storage.
   * @returns Public user profile or null if not found.
   */
  getPublicUserProfile(): PublicUserProfile | null {
    const profile = localStorage.getItem(this.PUBLIC_USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  }

  /**
   * Sets the public user profile in local storage.
   * @param profile The public user profile to be stored.
   */
  setPublicUserProfile(profile: PublicUserProfile): void {
    localStorage.setItem(this.PUBLIC_USER_PROFILE_KEY, JSON.stringify(profile));
  }

  /**
   * Removes the public user profile from local storage.
   */
  removePublicUserProfile(): void {
    localStorage.removeItem(this.PUBLIC_USER_PROFILE_KEY);
  }

  /**
   * Removes unlocked achievements from local storage.
   */
  removeUnlockedAchievements(): void {
    localStorage.removeItem(this.ACHIEVEMENTS_KEY);
  }
}
