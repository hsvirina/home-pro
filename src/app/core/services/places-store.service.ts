import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Place } from '../models/place.model';
import { PlacesService } from './places.service';
import { finalize } from 'rxjs/operators';

import { LanguageService } from './language.service';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlacesStoreService {
  private placesSubject = new BehaviorSubject<Place[] | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  places$: Observable<Place[] | null> = this.placesSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private currentLang = 'en';
  private langSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private languageService: LanguageService,
  ) {
    this.langSub = this.languageService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      this.loadPlaces(true);
    });
  }

  loadPlaces(force = false): void {
    if (this.placesSubject.value && !force) {
      return;
    }
    this.loadingSubject.next(true);

    this.placesService
      .getPlaces(this.currentLang)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (places) => this.placesSubject.next(places),
        error: (error) => {
          console.error('[PlacesStore] Error loading places:', error);
          this.placesSubject.next([]);
        },
      });
  }

  getCached(): Place[] {
    return this.placesSubject.value ?? [];
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }
}
