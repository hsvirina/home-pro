import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FavoritesService } from './favorites.service';
import { AuthStateService } from '../../state/auth/auth-state.service';

/**
 * Store service managing the list of favorite cafe IDs.
 * Keeps an internal BehaviorSubject with the current favorites state,
 * exposes an observable for components to subscribe to,
 * and synchronizes updates with the backend via FavoritesService.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesStoreService {
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthStateService,
  ) {
    this.loadFavorites();
  }

  /**
   * Loads the favorite cafe IDs from the current authenticated user
   * and updates the internal BehaviorSubject.
   */
  loadFavorites(): void {
    const user = this.authService.getCurrentUser();
    if (user?.favoriteCafeIds) {
      this.favoritesSubject.next(user.favoriteCafeIds);
    } else {
      this.favoritesSubject.next([]);
    }
  }

  /**
   * Adds a cafe ID to favorites.
   * Sends request to backend and updates the internal favorites list on success.
   *
   * @param cafeId - The ID of the cafe to add to favorites
   * @returns Observable which completes after the backend call and update
   */
  addFavorite(cafeId: number) {
    return this.favoritesService.addFavorite(cafeId).pipe(
      tap(() => {
        const current = this.favoritesSubject.value;
        if (!current.includes(cafeId)) {
          this.favoritesSubject.next([...current, cafeId]);
        }
      }),
    );
  }

  /**
   * Removes a cafe ID from favorites.
   * Sends request to backend and updates the internal favorites list on success.
   *
   * @param cafeId - The ID of the cafe to remove from favorites
   * @returns Observable which completes after the backend call and update
   */
  removeFavorite(cafeId: number) {
    return this.favoritesService.removeFavorite(cafeId).pipe(
      tap(() => {
        const updated = this.favoritesSubject.value.filter(id => id !== cafeId);
        this.favoritesSubject.next(updated);
      }),
    );
  }

  /**
   * Checks if a cafe ID is currently in the favorites list.
   *
   * @param cafeId - The ID to check for presence in favorites
   * @returns true if the cafe is favorited, false otherwise
   */
  isFavorite(cafeId: number): boolean {
    return this.favoritesSubject.value.includes(cafeId);
  }
}
