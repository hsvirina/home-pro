import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CatalogFilters,
  FilterCategory,
} from '../../../models/catalog-filter.model';
import { FILTER_CATEGORIES } from '../../../models/catalog-filter.config';

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Контейнер фильтров -->
    <div
      class="flex flex-col gap-6 rounded-[40px] border border-[var(--color-white)] bg-[var(--color-white)] p-6 text-[var(--color-black)] xxl:w-full"
    >
      <!-- Заголовок и кнопка очистки -->
      <div class="flex items-center justify-between">
        <h5 class="text-[var(--color-black)]">Filters</h5>
        <button (click)="clearAll()" class="text-[var(--color-black)]">
          Clear All
        </button>
      </div>

      <!-- Перебор категорий фильтров -->
      <ng-container *ngFor="let category of filterCategories">
        <div class="flex flex-col gap-3" *ngIf="internalFilters[category.key]">
          <h6>{{ category.title }}</h6>

          <!-- Опции с чекбоксами -->
          <div class="flex flex-col gap-2">
            <label
              class="body-font-1 flex items-center gap-3 shadow-hover"
              *ngFor="let option of category.options"
            >
              <input
                type="checkbox"
                class="peer sr-only"
                [(ngModel)]="internalFilters[category.key][option.key]"
              />
              <span
                class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-gray-20)] before:absolute before:left-1/2 before:top-1/2 before:h-4 before:w-2 before:-translate-x-1/2 before:-translate-y-[60%] before:rotate-45 before:border-b-2 before:border-r-2 before:border-[var(--color-primary)] before:opacity-0 before:transition-opacity peer-checked:border-[var(--color-primary)] peer-checked:before:opacity-100"
              ></span>
              {{ option.label }}
            </label>
          </div>

          <div class="my-2 h-px bg-[var(--color-gray-20)]"></div>
        </div>
      </ng-container>

      <!-- Кнопка применения фильтров -->
      <button
        (click)="applyFilters()"
        class="button-font h-12 button-bg-blue px-6 py-3"
      >
        Apply Filters
      </button>
    </div>
  `,
})
export class CatalogFiltersComponent {
  // Входные данные - фильтры от родителя
  private _filters: CatalogFilters = {};

  @Input() set filters(value: CatalogFilters) {
    this._filters = value;
    this.internalFilters = this.initializeFilters(this._filters);
  }

  // Событие для вывода выбранных фильтров
  @Output() filtersChange = new EventEmitter<CatalogFilters>();

  // Внутреннее состояние фильтров для биндинга с чекбоксами
  internalFilters: CatalogFilters = {};

  // Категории фильтров из конфига
  filterCategories: FilterCategory[] = FILTER_CATEGORIES;

  // --- Публичные методы ---

  /** Применение фильтров — эмитим наружу */
  applyFilters() {
    this.filtersChange.emit(this.deepCloneFilters(this.internalFilters));
  }

  /** Очистка всех фильтров и применение */
  clearAll() {
    for (const categoryKey in this.internalFilters) {
      for (const optionKey in this.internalFilters[categoryKey]) {
        this.internalFilters[categoryKey][optionKey] = false;
      }
    }
    this.applyFilters();
  }

  // --- Приватные методы ---

  /** Глубокое клонирование объекта фильтров */
  private deepCloneFilters(obj: CatalogFilters): CatalogFilters {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Инициализация внутреннего состояния фильтров на основе
   * конфигурации и входящих данных.
   * Гарантирует, что структура совпадает с FILTER_CATEGORIES.
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
