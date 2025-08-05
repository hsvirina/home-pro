import { Injectable } from '@angular/core';
import { AuthUser, PublicUserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

getToken(): string | null {
  const token = localStorage.getItem(this.TOKEN_KEY);
  if (!token) return null;

  if (this.isTokenExpired(token)) {
    this.removeToken();
    this.removeUser(); // желательно удалить и связанную информацию о пользователе
    return null;
  }

  return token;
}

private isTokenExpired(token: string): boolean {
  try {
    // Парсим payload JWT (вторая часть)
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp < now;
  } catch (e) {
    // Если парсинг не удался — считаем токен просроченным
    return true;
  }
}

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  getPublicUserProfile(): PublicUserProfile | null {
    const json = localStorage.getItem('publicUserProfile');
    return json ? JSON.parse(json) : null;
  }

  setPublicUserProfile(profile: PublicUserProfile): void {
    localStorage.setItem('publicUserProfile', JSON.stringify(profile));
  }

  removePublicUserProfile(): void {
    localStorage.removeItem('publicUserProfile');
  }

  removeUnlockedAchievements(): void {
    localStorage.removeItem('unlockedAchievements');
  }
}
