import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  CatalogFilters,
  FilterCategory,
} from '../../../core/models/catalog-filter.model';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div
      class="flex flex-col gap-6 rounded-[24px] p-6 xxl:w-full"
      [ngClass]="{
        'border border-[var(--color-white)] bg-[var(--color-white)] text-[var(--color-gray-100)]':
          (currentTheme$ | async) === 'light',
        'border border-[var(--color-bg)] bg-[var(--color-bg-card)] text-[var(--color-gray-10)]':
          (currentTheme$ | async) === 'dark'
      }"
    >
      <div class="flex items-center justify-between">
        <h5>{{ 'catalog_page.filters.header' | translate }}</h5>
        <button
          type="button"
          (click)="clearAll()"
          [attr.aria-label]="'catalog_page.filters.clear_all_aria' | translate"
        >
          {{ 'catalog_page.filters.clear_all' | translate }}
        </button>
      </div>

      <ng-container *ngFor="let category of filterCategories">
        <div class="flex flex-col gap-3" *ngIf="internalFilters[category.key]">
          <h5>{{ category.title | translate }}</h5>
          <div class="flex flex-col gap-2">
            <label
              class="body-font-1 flex cursor-pointer select-none items-center gap-3"
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

      <button
        type="button"
        (click)="onApplyClick()"
        class="button-font button-bg-blue h-12 px-6 py-3"
      >
        {{ 'catalog_page.filters.apply' | translate }}
      </button>
    </div>
  `,
})
export class CatalogFiltersComponent {
  /** Emits updated filters to parent */
  @Output() filtersChange = new EventEmitter<CatalogFilters>();
  /** Emits when user clicks apply to close mobile menu */
  @Output() applyFiltersClicked = new EventEmitter<void>();

  private _filterCategories: FilterCategory[] = [];
  private _filters: CatalogFilters = {};

  /** Sets filter categories and initializes internal filter state */
  @Input()
  set filterCategories(value: FilterCategory[]) {
    this._filterCategories = value;
    this.internalFilters = this.initializeFilters(this._filters);
  }
  get filterCategories(): FilterCategory[] {
    return this._filterCategories;
  }

  /** Sets selected filters and syncs internal filter state */
  @Input()
  set filters(value: CatalogFilters) {
    this._filters = value;
    this.internalFilters = this.initializeFilters(value);
  }
  get filters(): CatalogFilters {
    return this._filters;
  }

  /** Internal filters bound to checkboxes */
  internalFilters: CatalogFilters = {};

  /** Current app theme for styling */
  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /** Called when user clicks "Apply" */
  onApplyClick(): void {
    this.filtersChange.emit(this.deepClone(this.internalFilters));
    this.applyFiltersClicked.emit(); // Родителю сигнал закрыть мобильное меню
  }

  /** Clears all filters and emits reset */
  clearAll(): void {
    for (const categoryKey in this.internalFilters) {
      for (const optionKey in this.internalFilters[categoryKey]) {
        this.internalFilters[categoryKey][optionKey] = false;
      }
    }
    this.filtersChange.emit(this.deepClone(this.internalFilters));
    this.applyFiltersClicked.emit();
  }

  /** Initializes internal filter state based on categories and current filters */
  private initializeFilters(source: CatalogFilters): CatalogFilters {
    const result: CatalogFilters = {};
    for (const category of this._filterCategories) {
      result[category.key] = {};
      for (const option of category.options) {
        result[category.key][option.key] =
          source?.[category.key]?.[option.key] ?? false;
      }
    }
    return result;
  }

  /** Deep clones the filter object to avoid reference mutations */
  private deepClone(obj: CatalogFilters): CatalogFilters {
    return JSON.parse(JSON.stringify(obj));
  }
}
