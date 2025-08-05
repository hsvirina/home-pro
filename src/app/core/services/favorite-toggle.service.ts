import { Injectable } from '@angular/core';
import { FavoritesStoreService } from './favorites-store.service';
import { Place } from '../models/place.model';
import { Observable, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthStateService } from '../../state/auth/auth-state.service';

@Injectable({ providedIn: 'root' })
export class FavoriteToggleService {
  constructor(
    private authService: AuthStateService,
    private favoritesStore: FavoritesStoreService,
  ) {}

  isFavorite(placeId: number): boolean {
    return this.favoritesStore.isFavorite(placeId);
  }

  toggleFavorite(place: Place): Observable<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('NOT_AUTHENTICATED'));
    }

    const cafeId = place.id;
    const isFav = this.favoritesStore.isFavorite(cafeId);

    const obs = isFav
      ? this.favoritesStore.removeFavorite(cafeId)
      : this.favoritesStore.addFavorite(cafeId);

    return obs.pipe(
      tap(() => {
        const updatedUser = this.authService.getCurrentUser();
        if (!updatedUser) return;

        updatedUser.favoriteCafeIds = isFav
          ? updatedUser.favoriteCafeIds.filter((id) => id !== cafeId)
          : [...updatedUser.favoriteCafeIds, cafeId];

        this.authService.updateCurrentUser({ ...updatedUser });
      }),
      map(() => !isFav),
    );
  }
}
