import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import {
  CatalogFilters,
  CatalogFiltersComponent,
} from './components/catalog-filters.components';
import { PlaceCardComponent } from '../../components/place-card.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, CatalogFiltersComponent, PlaceCardComponent],
  template: `
    <div
      class="grid grid-cols-4 gap-[16px] px-[20px] xxl:grid-cols-8 xxl:gap-[20px] xxl:px-[0px]"
    >
      <!-- Заголовок -->
      <h2
        class="col-span-4 mb-[60px] text-center text-[32px] xxl:col-span-8 xxl:text-[64px]"
      >
        Best Places to
        <span class="text-[var(--color-primary)]">Sip & Chill</span>
      </h2>

      <!-- Кнопка Фильтров, видна только на маленьких экранах -->
      <div class="col-span-4 h-[48px] border border-[var(--color-gray-20)] rounded-[40px] xxl:hidden mb-[40px]">
        <button class="w-full h-full flex items-center justify-center" (click)="toggleFilters()">
          Filters
        </button>
      </div>

      <!-- Сайдбар с фильтрами
      На больших экранах фильтры всегда видны -->
      <div class="col-span-4 hidden xxl:col-span-2 xxl:flex">
        <app-catalog-filters
          (filtersChange)="onFiltersChange($event)"
        ></app-catalog-filters>
      </div>

      <!-- Фильтры для маленьких экранов, показываем по кнопке -->
      <div
        *ngIf="showFilters"
        class="fixed left-0 top-0 z-50 h-full w-full xxl:hidden"
        (click)="toggleFilters()"
      >
        <!-- Белый блок с фильтрами -->
        <div
          class="relative h-full w-full overflow-y-auto bg-[var(--color-gray-20)] px-[20px] pt-[12px]"
          (click)="$event.stopPropagation()"
        >
          <div
            class="mb-[25px] ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-[40px] bg-[var(--color-white)]"
          >
            <img
              src="/icons/close.svg"
              alt="Close icon"
              class="h-6 w-6 cursor-pointer"
              (click)="toggleFilters()"
            />
          </div>

          <app-catalog-filters
            (filtersChange)="onFiltersChange($event)"
          ></app-catalog-filters>

          <div class="mt-[25px] w-full">
            <div
              class="mx-[120px] mb-[8px] mt-[21px] h-[5px] bg-[var(--color-black)]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Список карточек мест -->
      <div class="col-span-6 grid grid-cols-1 gap-5 xxl:grid-cols-3">
        <app-place-card
          *ngFor="let place of filteredPlaces"
          [place]="place"
        ></app-place-card>
      </div>
    </div>
  `,
})
export class CatalogPageComponent implements OnInit {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  showFilters = false;

  constructor(private placesService: PlacesService) {}

  ngOnInit() {
    this.placesService.getPlaces().subscribe({
      next: (data) => {
        this.places = data;
        this.filteredPlaces = data;
      },
      error: (err) => console.error('Error loading places:', err),
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      document.body.style.overflow = 'hidden'; // запретить скролл
    } else {
      document.body.style.overflow = ''; // вернуть к дефолту
    }
  }

  onFiltersChange(filters: CatalogFilters) {
    this.filteredPlaces = this.places.filter((place) => {
      const tags = place.tags || [];
      const hours = place.workingHours || '';

      // — Opening Hours —
      if (filters.earlyBird) {
        // проверяем, открывается ли раньше 07:00
        const openTime = hours.match(/(\d{2}):(\d{2})/)?.[0];
        if (!openTime || openTime > '07:00') return false;
      }
      if (filters.nightOwl) {
        // проверяем, закрывается ли позже 22:00
        const closeTime = hours.split('–')[1]?.substring(0, 5);
        if (!closeTime || closeTime < '22:00') return false;
      }
      if (filters.weekendHours) {
        if (!/Sat|Sun|Sun/.test(hours)) return false;
      }

      // — Price Range — проверяем теги
      if (filters.budgetFriendly && !tags.includes('Budget-friendly'))
        return false;
      if (filters.midRange && !tags.includes('Mid-range')) return false;
      if (filters.premium && !tags.includes('Premium')) return false;

      // — Amenities —
      if (filters.freeWifi && !tags.includes('Free Wi‑Fi')) return false;
      if (filters.powerOutlets && !tags.includes('Power Outlets')) return false;
      if (filters.parkingAvailable && !tags.includes('Parking Available'))
        return false;
      if (
        filters.wheelchairAccessible &&
        !tags.includes('Wheelchair Accessible')
      )
        return false;

      // — Vibe & Style —
      if (filters.cozyIntimate && !tags.includes('Cozy & Intimate'))
        return false;
      if (filters.modernMinimalist && !tags.includes('Modern & Minimalist'))
        return false;
      if (filters.rusticVintage && !tags.includes('Rustic & Vintage'))
        return false;
      if (filters.artsyCreative && !tags.includes('Artsy & Creative'))
        return false;

      return true;
    });
  }
}
