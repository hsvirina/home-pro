import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../core/models/place.model';
import { PlacesService } from '../../core/services/places.service';
import { CatalogFiltersComponent } from './components/catalog-filters.components';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogFilters } from '../../core/models/catalog-filter.model';
import { FILTER_CATEGORIES } from '../../core/models/catalog-filter.config';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs.component';
import { FormsModule } from '@angular/forms';
import { slideDownAnimation } from '../../../styles/animations/animations';
import { PaginationComponent } from './components/pagination.component';
import { PlaceCardComponent } from '../../shared/components/place-card.component';
import { IconComponent } from '../../shared/components/icon.component';
import { ICONS } from '../../core/constants/icons.constant';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    CommonModule,
    CatalogFiltersComponent,
    PlaceCardComponent,
    BreadcrumbsComponent,
    PaginationComponent,
    FormsModule,
    IconComponent,
  ],
  animations: [slideDownAnimation],
  template: `
    <div
      class="grid grid-cols-4 gap-[16px] px-[20px] xxl:grid-cols-8 xxl:gap-[20px] xxl:px-[0px]"
    >
      <!-- Хлебные крошки -->
      <div class="col-span-4 xxl:col-span-8">
        <app-breadcrumbs></app-breadcrumbs>
      </div>

      <!-- Заголовок -->
      <h2
        class="col-span-4 mb-[60px] text-center text-[32px] xxl:col-span-8 xxl:text-[64px]"
      >
        Best Places to
        <span class="text-[var(--color-primary)]">Sip & Chill</span>
      </h2>

      <!-- Кнопка открытия фильтров (только на мобилке) -->
      <div
        class="col-span-4 mb-[40px] h-[48px] rounded-[40px] border border-[var(--color-gray-20)] xxl:hidden"
      >
        <button
          class="flex h-full w-full items-center justify-center"
          (click)="toggleFilters()"
        >
          Filters
        </button>
      </div>

      <!-- Селектор количества карточек -->
      <div class="col-span-4 xxl:col-span-8">
        <div class="mb-4 flex justify-end">
          <div class="custom-dropdown relative flex items-center gap-2">
            <span>Show:</span>

            <!-- Триггер выпадающего меню -->
            <div
              class="shadow-hover flex w-[80px] cursor-pointer items-center justify-between rounded bg-[var(--color-white)] px-3 py-1"
              (click)="toggleDropdown()"
            >
              {{ getSelectedLabel() }}
              <svg
                class="ml-2 h-4 w-4 transform transition-transform duration-200"
                [class.rotate-180]="dropdownOpen"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <!-- Выпадающее меню -->
            <div
              *ngIf="dropdownOpen"
              [@slideDownAnimation]
              class="absolute right-0 top-[110%] z-10 w-[80px] rounded bg-[var(--color-white)]"
            >
              <div
                *ngFor="let option of sizeOptions"
                (click)="selectOption(option.value)"
                class="cursor-pointer px-3 py-2 hover:bg-gray-100"
                [class.font-bold]="itemsPerPage === option.value"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Боковая панель фильтров (только на десктопе) -->
      <div class="col-span-4 hidden xxl:col-span-2 xxl:block">
        <app-catalog-filters
          [filters]="filters"
          (filtersChange)="onFiltersChange($event)"
        ></app-catalog-filters>
      </div>

      <!-- Панель фильтров (только на мобилке, модальное окно) -->
      <div
        *ngIf="showFilters"
        class="fixed left-0 top-0 z-50 h-full w-full xxl:hidden"
        (click)="toggleFilters()"
      >
        <div
          class="relative h-full w-full overflow-y-auto bg-[var(--color-gray-20)] px-[20px] pt-[12px]"
          (click)="$event.stopPropagation()"
        >
          <div
            class="mb-[25px] ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-[40px] bg-white"
          >
            <app-icon
              [icon]="ICONS.Close"
              class="cursor-pointer"
              (click)="toggleFilters()"
            />
          </div>

          <app-catalog-filters
            [filters]="filters"
            (filtersChange)="onFiltersChange($event)"
          ></app-catalog-filters>
        </div>
      </div>

      <!-- Карточки -->
      <div class="col-span-6">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <app-place-card
            *ngFor="let place of paginatedPlaces"
            [place]="place"
          ></app-place-card>
        </div>
      </div>

      <!-- Пагинация -->
      <div
        class="col-span-6 mt-6 flex flex-col items-center gap-4 xxl:col-span-8 xxl:mb-[148px]"
      >
        <app-pagination
          [totalItems]="filteredPlaces.length"
          [selectedSize]="itemsPerPage"
          [currentPage]="currentPage"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class CatalogPageComponent implements OnInit {
  ICONS = ICONS;
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  paginatedPlaces: Place[] = [];

  filters: CatalogFilters = {};
  showFilters = false;

  itemsPerPage = -1;
  currentPage = 1;

  dropdownOpen = false;

  sizeOptions = [
    { label: '6', value: 6 },
    { label: '12', value: 12 },
    { label: 'All', value: -1 },
  ];

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // ---------- Жизненный цикл ----------

  ngOnInit() {
    this.placesService.getPlaces().subscribe({
      next: (data) => {
        this.places = data;
        this.initializeFilters();
        this.applyFiltersFromQuery();
      },
      error: (err) => console.error('Error loading places:', err),
    });
  }

  // ---------- Фильтрация ----------

  initializeFilters() {
    for (const category of FILTER_CATEGORIES) {
      this.filters[category.key] = {};
      for (const option of category.options) {
        this.filters[category.key][option.key] = false;
      }
    }
  }

  applyFiltersFromQuery() {
    this.route.queryParams.subscribe((params) => {
      for (const key in params) {
        if (!this.filters[key]) {
          this.filters[key] = {};
        }

        const values = Array.isArray(params[key]) ? params[key] : [params[key]];
        values.forEach((val: string) => {
          this.filters[key][val] = true;
        });
      }

      // Форсируем реактивное обновление
      this.filters = JSON.parse(JSON.stringify(this.filters));

      this.filteredPlaces = this.filterPlaces();
      this.updatePaginatedPlaces();
    });
  }

  onFiltersChange(updatedFilters: CatalogFilters) {
    this.filters = updatedFilters;

    const queryParams: Record<string, string[]> = {};
    for (const category in this.filters) {
      const activeKeys = Object.keys(this.filters[category]).filter(
        (key) => this.filters[category][key],
      );
      if (activeKeys.length) {
        queryParams[category] = activeKeys;
      }
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });

    this.filteredPlaces = this.filterPlaces();
    this.currentPage = 1;
    this.updatePaginatedPlaces();
  }

  private filterPlaces(): Place[] {
    return this.places.filter((place) => {
      const tags = place.tags || [];
      const city = place.city.toLowerCase();

      for (const category in this.filters) {
        const selected = Object.keys(this.filters[category]).filter(
          (key) => this.filters[category][key],
        );
        if (selected.length === 0) continue;

        if (category === 'location') {
          const matches = selected.some((key) =>
            city.includes(key.toLowerCase()),
          );
          if (!matches) return false;
        } else {
          const matches = selected.some((key) => {
            const label = this.getLabelByKey(category, key);
            return tags.includes(label);
          });
          if (!matches) return false;
        }
      }

      return true;
    });
  }

  private getLabelByKey(categoryKey: string, optionKey: string): string {
    const category = FILTER_CATEGORIES.find((cat) => cat.key === categoryKey);
    return category?.options.find((opt) => opt.key === optionKey)?.label || '';
  }

  // ---------- Пагинация ----------

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedPlaces();

    // Автоскролл вверх при переходе по страницам
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(value: number) {
    this.itemsPerPage = value;
    this.currentPage = 1;
    this.updatePaginatedPlaces();
  }

  private updatePaginatedPlaces() {
    if (this.itemsPerPage === -1) {
      // "All" — показываем всё
      setTimeout(() => {
        this.paginatedPlaces = [...this.filteredPlaces];
      });
    } else {
      setTimeout(() => {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.paginatedPlaces = this.filteredPlaces.slice(start, end);
      });
    }
  }

  // ---------- UI взаимодействие ----------

  toggleFilters() {
    this.showFilters = !this.showFilters;
    document.body.style.overflow = this.showFilters ? 'hidden' : '';
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(value: number) {
    this.itemsPerPage = value;
    this.currentPage = 1;
    this.updatePaginatedPlaces();
    this.dropdownOpen = false;
  }

  getSelectedLabel(): string {
    const selected = this.sizeOptions.find(
      (opt) => opt.value === this.itemsPerPage,
    );
    return selected ? selected.label : 'Select';
  }

  // ---------- Обработка клика вне дропдауна ----------

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.custom-dropdown');
    if (!clickedInsideDropdown) {
      this.dropdownOpen = false;
    }
  }
}
