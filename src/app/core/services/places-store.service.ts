import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { Place } from '../models/place.model';
import { PlacesService } from './places.service';
import { LanguageService } from './language.service';

/**
 * Service that manages the state of places including loading,
 * caching, and reacting to language changes.
 * Provides observable streams for places, loading state,
 * and derived popular places data.
 */
@Injectable({ providedIn: 'root' })
export class PlacesStoreService implements OnDestroy {
  // BehaviorSubject holding the list of places
  private readonly placesSubject = new BehaviorSubject<Place[]>([]);
  // BehaviorSubject holding loading status
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  // Observable for components to subscribe to places data
  public readonly places$: Observable<Place[]> = this.placesSubject.asObservable();
  // Observable for components to subscribe to loading status
  public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // Derived observable: top 10 places sorted by rating descending
  public readonly popularPlaces$: Observable<Place[]> = this.places$.pipe(
    map(places => [...places].sort((a, b) => b.rating - a.rating).slice(0, 10))
  );

  private currentLang: string = 'en'; // Default language
  private langSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private languageService: LanguageService,
  ) {
    // Subscribe to language changes to reload places accordingly
    this.langSub = this.languageService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.loadPlaces(true); // Force reload on language change
    });
  }

  /**
   * Loads places from the API.
   * If data already loaded and 'force' flag is false, it skips loading.
   *
   * @param force - Whether to force reload data even if already loaded
   */
  loadPlaces(force: boolean = false): void {
    if (this.placesSubject.value.length > 0 && !force) {
      return; // Data already loaded, skip loading unless forced
    }

    this.loadingSubject.next(true);

    this.placesService
      .getPlaces(this.currentLang)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (places) => this.placesSubject.next(places),
        error: (error) => {
          console.error('[PlacesStoreService] Error loading places:', error);
          this.placesSubject.next([]); // Fallback to empty list on error
        },
      });
  }

  /**
   * Provides a synchronous snapshot of the cached places.
   * Returns an empty array if no data loaded yet.
   *
   * @returns Cached array of Place objects
   */
  getCached(): Place[] {
    return this.placesSubject.value ?? [];
  }

  /**
   * Cleanup subscriptions when service is destroyed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }
}
