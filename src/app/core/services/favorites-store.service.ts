import { BehaviorSubject, tap } from "rxjs";
import { FavoritesService } from "./favorites.service";
import { AuthStateService } from "../../state/auth/auth-state.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class FavoritesStoreService {
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthStateService,
  ) {
    this.loadFavorites();
  }

  loadFavorites() {
    const user = this.authService.getCurrentUser();
    if (user && user.favoriteCafeIds) {
      this.favoritesSubject.next(user.favoriteCafeIds);
    } else {
      this.favoritesSubject.next([]);
    }
  }

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

  removeFavorite(cafeId: number) {
    return this.favoritesService.removeFavorite(cafeId).pipe(
      tap(() => {
        const current = this.favoritesSubject.value.filter(id => id !== cafeId);
        this.favoritesSubject.next(current);
      }),
    );
  }

  isFavorite(cafeId: number): boolean {
    return this.favoritesSubject.value.includes(cafeId);
  }
}
