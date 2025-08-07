import { Injectable } from '@angular/core';
import { FavoritesStoreService } from './favorites-store.service';
import { Place } from '../models/place.model';
import { Observable, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthStateService } from '../../state/auth/auth-state.service';

/**
 * Service to manage toggling the favorite status of places.
 * Handles both updating the local favorites store and syncing user state.
 */
@Injectable({ providedIn: 'root' })
export class FavoriteToggleService {
  constructor(
    private authService: AuthStateService,
    private favoritesStore: FavoritesStoreService,
  ) {}

  /**
   * Checks whether a given place is marked as favorite.
   * @param placeId - Unique identifier of the place
   * @returns true if the place is in favorites, false otherwise
   */
  isFavorite(placeId: number): boolean {
    return this.favoritesStore.isFavorite(placeId);
  }

  /**
   * Toggles the favorite status of a given place.
   * If user is not authenticated, throws an error observable.
   * Otherwise, adds or removes the place from favorites,
   * and updates the current user state accordingly.
   *
   * @param place - Place object to toggle favorite status for
   * @returns Observable that emits the new favorite status (true if added, false if removed)
   */
  toggleFavorite(place: Place): Observable<boolean> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return throwError(() => new Error('NOT_AUTHENTICATED'));
    }

    const placeId = place.id;
    const currentlyFavorite = this.favoritesStore.isFavorite(placeId);

    // Perform add or remove operation depending on current favorite status
    const operation$ = currentlyFavorite
      ? this.favoritesStore.removeFavorite(placeId)
      : this.favoritesStore.addFavorite(placeId);

    return operation$.pipe(
      tap(() => {
        // Update the user's favoriteCafeIds list in the auth state
        const updatedUser = this.authService.getCurrentUser();
        if (!updatedUser) return;

        updatedUser.favoriteCafeIds = currentlyFavorite
          ? updatedUser.favoriteCafeIds.filter((id) => id !== placeId)
          : [...updatedUser.favoriteCafeIds, placeId];

        this.authService.updateCurrentUser({ ...updatedUser });
      }),
      // Emit the new favorite status (inverted from current)
      map(() => !currentlyFavorite),
    );
  }
}
