import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CatalogFilters {
  // Opening Hours
  earlyBird: boolean;
  nightOwl: boolean;
  weekendHours: boolean;

  // Price Range
  budgetFriendly: boolean;
  midRange: boolean;
  premium: boolean;

  // Amenities
  freeWifi: boolean;
  powerOutlets: boolean;
  parkingAvailable: boolean;
  wheelchairAccessible: boolean;

  // Vibe & Style
  cozyIntimate: boolean;
  modernMinimalist: boolean;
  rusticVintage: boolean;
  artsyCreative: boolean;
}

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex flex-col gap-6 rounded-[40px]
             border border-[var(--color-white)]
             bg-[var(--color-white)] p-6 text-[var(--color-black)]"
    >
      <div class="flex items-center justify-between">
        <h5 class="text-[var(--color-black)]">Filters</h5>
        <button (click)="clearAll()" class="text-[var(--color-black)]">
          Clear All
        </button>
      </div>

      <!-- Opening Hours -->
      <div class="flex flex-col gap-3">
        <h6>🕒 Opening Hours</h6>
        <div class="flex flex-col gap-2">
          <label class="body-font-1 flex items-center gap-3">
            <input
              type="checkbox"
              class="peer sr-only"
              [(ngModel)]="filters.earlyBird"
            />
            <span
              class="relative flex h-8 w-8 items-center justify-center
                     rounded-lg border border-[var(--color-gray-20)]
                     before:absolute before:left-1/2 before:top-1/2
                     before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%]
                     before:rotate-45 before:border-r-2 before:border-b-2 before:border-[var(--color-primary)]
                     before:opacity-0 before:transition-opacity
                     peer-checked:border-[var(--color-primary)]
                     peer-checked:before:opacity-100"
            ></span>
            Early Bird (Opens before 7 am)
          </label>

          <label class="body-font-1 flex items-center gap-3">
            <input
              type="checkbox"
              class="peer sr-only"
              [(ngModel)]="filters.nightOwl"
            />
            <span
              class="relative flex h-8 w-8 items-center justify-center
                     rounded-lg border border-[var(--color-gray-20)]
                     before:absolute before:left-1/2 before:top-1/2
                     before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%]
                     before:rotate-45 before:border-r-2 before:border-b-2 before:border-[var(--color-primary)]
                     before:opacity-0 before:transition-opacity
                     peer-checked:border-[var(--color-primary)]
                     peer-checked:before:opacity-100"
            ></span>
            Night Owl (Open past 10 pm)
          </label>

          <label class="body-font-1 flex items-center gap-3">
            <input
              type="checkbox"
              class="peer sr-only"
              [(ngModel)]="filters.weekendHours"
            />
            <span
              class="relative flex h-8 w-8 items-center justify-center
                     rounded-lg border border-[var(--color-gray-20)]
                     before:absolute before:left-1/2 before:top-1/2
                     before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%]
                     before:rotate-45 before:border-r-2 before:border-b-2 before:border-[var(--color-primary)]
                     before:opacity-0 before:transition-opacity
                     peer-checked:border-[var(--color-primary)]
                     peer-checked:before:opacity-100"
            ></span>
            Weekend Hours
          </label>
        </div>
      </div>

      <div class="h-px bg-[var(--color-gray-20)]"></div>

      <!-- Price Range -->
      <div class="flex flex-col gap-3">
        <h6>💰 Price Range</h6>
        <div class="flex flex-col gap-2">
          <label class="body-font-1 flex items-center gap-3">
            <input
              type="checkbox"
              class="peer sr-only"
              [(ngModel)]="filters.budgetFriendly"
            />
            <span
              class="relative flex h-8 w-8 items-center justify-center
                     rounded-lg border border-[var(--color-gray-20)]
                     before:absolute before:left-1/2 before:top-1/2
                     before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%]
                     before:rotate-45 before:border-r-2 before:border-b-2 before:border-[var(--color-primary)]
                     before:opacity-0 before:transition-opacity
                     peer-checked:border-[var(--color-primary)]
                     peer-checked:before:opacity-100"
            ></span>
            Budget‑friendly
          </label>

          <label class="body-font-1 flex items-center gap-3">
            <input
              type="checkbox"
              class="peer sr-only"
              [(ngModel)]="filters.midRange"
            />
            <span
              class="relative flex h-8 w-8 items-center justify-center
                     rounded-lg border border-[var(--color-gray-20)]
                     before:absolute before:left-1/2 before:top-1/2
                     before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%]
                     before:rotate-45 before:border-r-2 before:border-b-2 before:border-[var(--color-primary)]
                     before:opacity-0 before:transition-opacity
                     peer-checked:border-[var(--color-primary)]
                     peer-checked:before:opacity-100"
            ></span>
            Mid‑range
          </label>

          <label class="body-font-1 flex items-center gap-3">
            <input
              type="checkbox"
              class="peer sr-only"
              [(ngModel)]="filters.premium"
            />
            <span
              class="relative flex h-8 w-8 items-center justify-center
                     rounded-lg border border-[var(--color-gray-20)]
                     before:absolute before:left-1/2 before:top-1/2
                     before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%]
                     before:rotate-45 before:border-r-2 before:border-b-2 before:border-[var(--color-primary)]
                     before:opacity-0 before:transition-opacity
                     peer-checked:border-[var(--color-primary)]
                     peer-checked:before:opacity-100"
            ></span>
            Premium
          </label>
        </div>
      </div>

      <div class="h-px bg-[var(--color-gray-20)]"></div>

      <!-- Amenities -->
      <div class="flex flex-col gap-3">
        <h6>⚡ Amenities</h6>
        <div class="flex flex-col gap-2">
          <label class="body-font-1 flex items-center gap-3" *ngFor="let amenity of amenityKeys">
            <input
              type="checkbox"
              class="peer sr-only"
              [(ngModel)]="filters[amenity]"
            />
            <span
              class="relative flex h-8 w-8 items-center justify-center
                     rounded-lg border border-[var(--color-gray-20)]
                     before:absolute before:left-1/2 before:top-1/2
                     before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%]
                     before:rotate-45 before:border-r-2 before:border-b-2 before:border-[var(--color-primary)]
                     before:opacity-0 before:transition-opacity
                     peer-checked:border-[var(--color-primary)]
                     peer-checked:before:opacity-100"
            ></span>
            {{ amenityDisplay[amenity] }}
          </label>
        </div>
      </div>

      <div class="h-px bg-[var(--color-gray-20)]"></div>

      <!-- Vibe & Style -->
      <div class="flex flex-col gap-3">
        <h6>✨ Vibe & Style</h6>
        <div class="flex flex-col gap-2">
          <label class="body-font-1 flex items-center gap-3" *ngFor="let vibe of vibeKeys">
            <input
              type="checkbox"
              class="peer sr-only"
              [(ngModel)]="filters[vibe]"
            />
            <span
              class="relative flex h-8 w-8 items-center justify-center
                     rounded-lg border border-[var(--color-gray-20)]
                     before:absolute before:left-1/2 before:top-1/2
                     before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%]
                     before:rotate-45 before:border-r-2 before:border-b-2 before:border-[var(--color-primary)]
                     before:opacity-0 before:transition-opacity
                     peer-checked:border-[var(--color-primary)]
                     peer-checked:before:opacity-100"
            ></span>
            {{ vibeDisplay[vibe] }}
          </label>
        </div>
      </div>

      <button
        (click)="applyFilters()"
        class="button-font h-12 rounded-[40px]
               bg-[var(--color-primary)] px-6 py-3 text-[var(--color-white)]"
      >
        Apply Filters
      </button>
    </div>
  `
})
export class CatalogFiltersComponent {
  @Output() filtersChange = new EventEmitter<CatalogFilters>();

  filters: CatalogFilters = {
    earlyBird: false,
    nightOwl: false,
    weekendHours: false,
    budgetFriendly: false,
    midRange: false,
    premium: false,
    freeWifi: false,
    powerOutlets: false,
    parkingAvailable: false,
    wheelchairAccessible: false,
    cozyIntimate: false,
    modernMinimalist: false,
    rusticVintage: false,
    artsyCreative: false,
  };

  // ключи и отображение для *ngFor
  amenityKeys = ['freeWifi','powerOutlets','parkingAvailable','wheelchairAccessible'] as const;
  amenityDisplay: Record<string,string> = {
    freeWifi: 'Free Wi‑Fi',
    powerOutlets: 'Power Outlets',
    parkingAvailable: 'Parking Available',
    wheelchairAccessible: 'Wheelchair Accessible'
  };

  vibeKeys = ['cozyIntimate','modernMinimalist','rusticVintage','artsyCreative'] as const;
  vibeDisplay: Record<string,string> = {
    cozyIntimate: 'Cozy & Intimate',
    modernMinimalist: 'Modern & Minimalist',
    rusticVintage: 'Rustic & Vintage',
    artsyCreative: 'Artsy & Creative'
  };

  applyFilters() {
    this.filtersChange.emit({ ...this.filters });
  }

  clearAll() {
    Object.keys(this.filters).forEach(k => (this.filters as any)[k] = false);
    this.filtersChange.emit({ ...this.filters });
  }
}
