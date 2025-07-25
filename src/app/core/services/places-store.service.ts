import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Place } from '../models/place.model';
import { PlacesService } from './places.service';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlacesStoreService {
  private placesSubject = new BehaviorSubject<Place[] | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observable streams for components to subscribe
  places$: Observable<Place[] | null> = this.placesSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private placesService: PlacesService) {}

  /**
   * Loads places from the API unless they are already loaded,
   * or if forced to reload.
   * @param force - whether to force reload data from API
   */
  loadPlaces(force = false): void {
    if (this.placesSubject.value && !force) {
      // Data already loaded, no need to fetch again
      return;
    }

    this.loadingSubject.next(true);

    this.placesService
      .getPlaces()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (places) => this.placesSubject.next(places),
        error: (error) => {
          console.error('[PlacesStore] Error loading places:', error);
          this.placesSubject.next([]);
        },
      });
  }

  /**
   * Gets the currently cached places synchronously.
   * @returns cached Place array or empty array if none loaded
   */
  getCached(): Place[] {
    return this.placesSubject.value ?? [];
  }
}
