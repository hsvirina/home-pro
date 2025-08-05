import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
      class="flex flex-col gap-6 rounded-[40px] p-6 xxl:w-full"
      [ngClass]="{
        'border border-[var(--color-white)] bg-[var(--color-white)] text-[var(--color-gray-100)]':
          (currentTheme$ | async) === 'light',
        'border border-[var(--color-bg)] bg-[var(--color-bg-card)] text-[var(--color-gray-10)]':
          (currentTheme$ | async) === 'dark'
      }"
    >
      <div class="flex items-center justify-between">
        <h5>{{ 'CATALOG.FILTERS.HEADER' | translate }}</h5>
        <button
          type="button"
          (click)="clearAll()"
          [attr.aria-label]="'CATALOG.FILTERS.CLEAR_ALL_ARIA' | translate"
        >
          {{ 'CATALOG.FILTERS.CLEAR_ALL' | translate }}
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
                class="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-gray-20)]
                  before:absolute before:left-1/2 before:top-1/2 before:h-4 before:w-2
                  before:-translate-x-1/2 before:-translate-y-[60%] before:rotate-45
                  before:border-b-2 before:border-r-2 before:border-[var(--color-primary)]
                  before:opacity-0 before:transition-opacity
                  peer-checked:border-[var(--color-primary)]
                  peer-checked:before:opacity-100"
              ></span>
              {{ option.label }}
            </label>
          </div>

          <div class="my-2 h-px bg-[var(--color-gray-20)]"></div>
        </div>
      </ng-container>

      <button
        type="button"
        (click)="applyFilters()"
        class="button-font button-bg-blue h-12 px-6 py-3"
      >
        {{ 'CATALOG.FILTERS.APPLY' | translate }}
      </button>
    </div>
  `,
})
export class CatalogFiltersComponent {
  // Событие, эмитит выбранные фильтры наружу
  @Output() filtersChange = new EventEmitter<CatalogFilters>();

  // Входящий список категорий фильтров
  private _filterCategories: FilterCategory[] = [];
  @Input()
  set filterCategories(value: FilterCategory[]) {
    this._filterCategories = value;
    // Инициализируем внутренние фильтры при обновлении категорий
    this.internalFilters = this.initializeFilters(this._filters);
  }
  get filterCategories(): FilterCategory[] {
    return this._filterCategories;
  }

  // Входящие текущие фильтры (выбранные опции)
  private _filters: CatalogFilters = {};
  @Input()
  set filters(value: CatalogFilters) {
    this._filters = value;
    // Инициализируем внутренние фильтры при обновлении внешних фильтров
    this.internalFilters = this.initializeFilters(value);
  }
  get filters(): CatalogFilters {
    return this._filters;
  }

  // Внутреннее состояние выбранных фильтров (для биндинга в шаблоне)
  internalFilters: CatalogFilters = {};

  // Текущая тема из сервиса (для стилизации)
  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  // Эмитит выбранные фильтры наружу (например, в родительский компонент)
  applyFilters(): void {
    this.filtersChange.emit(this.deepClone(this.internalFilters));
  }

  // Сброс всех фильтров (снимает все галочки)
  clearAll(): void {
    for (const categoryKey in this.internalFilters) {
      for (const optionKey in this.internalFilters[categoryKey]) {
        this.internalFilters[categoryKey][optionKey] = false;
      }
    }
    this.applyFilters();
  }

  // Глубокое копирование объекта фильтров (чтобы не мутировать внутренние данные)
  private deepClone(obj: CatalogFilters): CatalogFilters {
    return JSON.parse(JSON.stringify(obj));
  }

  // Инициализация внутреннего объекта фильтров на основе категорий и входящих фильтров
  private initializeFilters(source: CatalogFilters): CatalogFilters {
    const result: CatalogFilters = {};

    for (const category of this._filterCategories) {
      result[category.key] = {};
      for (const option of category.options) {
        result[category.key][option.key] = source?.[category.key]?.[option.key] ?? false;
      }
    }

    return result;
  }
}
