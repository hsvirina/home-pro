import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CatalogFilters,
  FilterCategory,
} from '../../../core/models/catalog-filter.model';
import { FILTER_CATEGORIES } from '../../../core/constants/catalog-filter.config';

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Filters container -->
    <div
      class="flex flex-col gap-6 rounded-[40px] border border-[var(--color-white)] bg-[var(--color-white)] p-6 text-[var(--color-black)] xxl:w-full"
    >
      <!-- Header with title and clear button -->
      <div class="flex items-center justify-between">
        <h5 class="text-[var(--color-black)]">Filters</h5>
        <button
          type="button"
          (click)="clearAll()"
          class="text-[var(--color-black)]"
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      </div>

      <!-- Loop through filter categories -->
      <ng-container *ngFor="let category of filterCategories">
        <div class="flex flex-col gap-3" *ngIf="internalFilters[category.key]">
          <h6>{{ category.title }}</h6>

          <!-- Filter options with checkboxes -->
          <div class="flex flex-col gap-2">
            <label
              class="body-font-1 shadow-hover flex cursor-pointer select-none items-center gap-3"
              *ngFor="let option of category.options"
            >
              <input
                type="checkbox"
                class="peer sr-only"
                [(ngModel)]="internalFilters[category.key][option.key]"
              />
              <span
                class="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-gray-20)] before:absolute before:left-1/2 before:top-1/2 before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%] before:rotate-45 before:border-b-2 before:border-r-2 before:border-[var(--color-primary)] before:opacity-0 before:transition-opacity peer-checked:border-[var(--color-primary)] peer-checked:before:opacity-100"
              ></span>
              {{ option.label }}
            </label>
          </div>

          <div class="my-2 h-px bg-[var(--color-gray-20)]"></div>
        </div>
      </ng-container>

      <!-- Apply filters button -->
      <button
        type="button"
        (click)="applyFilters()"
        class="button-font button-bg-blue h-12 px-6 py-3"
      >
        Apply Filters
      </button>
    </div>
  `,
})
export class CatalogFiltersComponent {
  /** Input filters from parent component */
  private _filters: CatalogFilters = {};

  @Input()
  set filters(value: CatalogFilters) {
    this._filters = value;
    this.internalFilters = this.initializeFilters(this._filters);
  }

  /** Emits updated filters to the parent component */
  @Output() filtersChange = new EventEmitter<CatalogFilters>();

  /** Internal filter state bound to checkboxes */
  internalFilters: CatalogFilters = {};

  /** Filter categories from configuration */
  filterCategories: FilterCategory[] = FILTER_CATEGORIES;

  // --- Public methods ---

  /** Emits the current filter selections */
  applyFilters() {
    this.filtersChange.emit(this.deepCloneFilters(this.internalFilters));
  }

  /** Resets all filters to false and applies the reset */
  clearAll() {
    for (const categoryKey in this.internalFilters) {
      for (const optionKey in this.internalFilters[categoryKey]) {
        this.internalFilters[categoryKey][optionKey] = false;
      }
    }
    this.applyFilters();
  }

  // --- Private methods ---

  /** Deep clones the filters object to avoid mutation issues */
  private deepCloneFilters(obj: CatalogFilters): CatalogFilters {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Initializes internal filter state ensuring it matches the filter config structure.
   * Sets default values from the input filters or false if missing.
   */
  private initializeFilters(source: CatalogFilters): CatalogFilters {
    const result: CatalogFilters = {};

    for (const category of FILTER_CATEGORIES) {
      result[category.key] = {};

      for (const option of category.options) {
        result[category.key][option.key] =
          source?.[category.key]?.[option.key] ?? false;
      }
    }

    return result;
  }
}
