import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Place } from '../models/place.model';
import { PlacesService } from './places.service';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlacesStoreService {
  private placesSubject = new BehaviorSubject<Place[] | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  places$ = this.placesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private placesService: PlacesService) {}

  loadPlaces(force = false) {
    if (this.placesSubject.value && !force) return; // если уже загружены

    this.loadingSubject.next(true);
    this.placesService
      .getPlaces()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (data) => this.placesSubject.next(data),
        error: (err) => {
          console.error('[PlacesStore] Ошибка при загрузке кафе:', err);
          this.placesSubject.next([]);
        },
      });
  }

  getCached(): Place[] {
    return this.placesSubject.value || [];
  }
}
