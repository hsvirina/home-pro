import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../core/models/place.model';
import { PlacesService } from '../../core/services/places.service';
import { CatalogFiltersComponent } from './components/catalog-filters.components';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogFilters } from '../../core/models/catalog-filter.model';
import { FILTER_CATEGORIES } from '../../core/constants/catalog-filter.config';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs.component';
import { FormsModule } from '@angular/forms';
import { slideDownAnimation } from '../../../styles/animations/animations';
import { PaginationComponent } from './components/pagination.component';

import { IconComponent } from '../../shared/components/icon.component';
import { ICONS } from '../../core/constants/icons.constant';
import { LoaderService } from '../../core/services/loader.service';
import { ThemeService } from '../../core/services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { Theme } from '../../core/models/theme.type';
import { PlaceCardComponent } from '../../shared/components/place-card.component';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { PlacesStoreService } from '../../core/services/places-store.service';
import { FILTER_CATEGORIES_UK } from '../../core/constants/catalog-filter.uk.config';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    CommonModule,
    CatalogFiltersComponent,
    BreadcrumbsComponent,
    PaginationComponent,
    FormsModule,
    IconComponent,
    PlaceCardComponent,
    TranslateModule,
  ],
  animations: [slideDownAnimation],
  template: `
    <div
      class="mx-auto grid w-full max-w-[1320px] grid-cols-4 gap-[16px] px-[20px] xxl:grid-cols-8 xxl:gap-[20px] xxl:px-[0px]"
    >
      <!-- Breadcrumbs -->
      <div class="col-span-4 xxl:col-span-8">
        <app-breadcrumbs></app-breadcrumbs>
      </div>

      <!-- Title -->
      <h2
        class="col-span-4 mb-[60px] text-center text-[32px] xxl:col-span-8 xxl:text-[64px]"
      >
        {{ 'CATALOG.TITLE' | translate }}
        <span class="text-[var(--color-primary)]">{{
          'CATALOG.HIGHLIGHT' | translate
        }}</span>
      </h2>

      <!-- Filters toggle button (mobile only) -->
      <div
        class="col-span-4 mb-[40px] h-[48px] rounded-[40px] border border-[var(--color-gray-20)] xxl:hidden"
      >
        <button
          class="flex h-full w-full items-center justify-center"
          (click)="toggleFilters()"
        >
          {{ 'CATALOG.FILTERS_BUTTON' | translate }}
        </button>
      </div>

      <!-- Items per page selector -->
      <div class="col-span-4 xxl:col-span-8">
        <div class="mb-4 flex justify-end">
          <div class="custom-dropdown relative flex items-center gap-2">
            <span>{{ 'CATALOG.SHOW_LABEL' | translate }}</span>

            <!-- Dropdown trigger -->
            <div
              class="flex w-[80px] cursor-pointer items-center justify-between rounded px-3 py-1"
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

            <!-- Dropdown menu -->
            <div
              *ngIf="dropdownOpen"
              [@slideDownAnimation]
              class="absolute right-0 top-[110%] z-20 w-[80px] rounded-[16px] border p-2"
              [ngClass]="{
                'border-[var(--color-white)] bg-[var(--color-white)]':
                  (currentTheme$ | async) === 'light',
                'border-[var(--color-white)] bg-[var(--color-bg-card)]':
                  (currentTheme$ | async) === 'dark',
              }"
            >
              <div
                *ngFor="let option of sizeOptions"
                (click)="selectOption(option.value)"
                class="cursor-pointer rounded px-2 py-1 transition-colors duration-300"
                [ngClass]="{
                  'hover:bg-[var(--color-bg)]': true,
                  'font-bold': itemsPerPage === option.value,
                }"
              >
                {{
                  'CATALOG.ITEMS_PER_PAGE.' +
                    (option.label === 'All' ? 'ALL' : option.label) | translate
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar filters (desktop only) -->
      <div class="col-span-4 hidden xxl:col-span-2 xxl:block">
        <app-catalog-filters
          [filters]="filters"
          [filterCategories]="filterCategories"
          (filtersChange)="onFiltersChange($event)"
        ></app-catalog-filters>
      </div>

      <!-- Filters modal (mobile only) -->
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
            [filterCategories]="filterCategories"
            (filtersChange)="onFiltersChange($event)"
          ></app-catalog-filters>
        </div>
      </div>

      <!-- Places cards -->
      <div class="col-span-4 lg:col-span-6">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <app-place-card
            *ngFor="let place of paginatedPlaces"
            [place]="place"
          ></app-place-card>

          <div
            *ngIf="paginatedPlaces.length === 0"
            class="col-span-full flex flex-col items-center justify-center gap-4 rounded-[40px] bg-white p-12 text-center text-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-700">
              {{ 'CATALOG.NO_CAFES_FOUND_TITLE' | translate }}
            </h3>
            <p class="max-w-sm text-gray-500">
              {{ 'CATALOG.NO_CAFES_FOUND_DESC' | translate }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        class="col-span-4 lg:col-span-6 mt-6 flex flex-col items-center gap-4 xxl:col-span-8 xxl:mb-[148px]"
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
  filterCategories = FILTER_CATEGORIES;
  dropdownOpen = false;
  sizeOptions = [
    { label: '6', value: 6 },
    { label: '12', value: 12 },
    { label: 'All', value: -1 },
  ];

  currentTheme$: Observable<Theme>;
  langChangeSub!: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private route: ActivatedRoute,
    public loaderService: LoaderService,
    private themeService: ThemeService,
    private translate: TranslateService,
    private placesStore: PlacesStoreService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    this.loaderService.show();

    this.placesStore.loadPlaces();

    this.placesStore.places$.subscribe({
      next: (data) => {
        this.places = data || [];

        // Устанавливаем категории фильтров в зависимости от текущего языка
        this.setFilterCategories(this.translate.currentLang);

        this.initializeFilters();
        this.applyFiltersFromQuery();

        this.loaderService.hide();
      },
      error: (err) => {
        console.error('Error loading places:', err);
        this.loaderService.hide();
      },
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.setFilterCategories(event.lang);
        this.initializeFilters();
        this.filteredPlaces = this.filterPlaces();
        this.updatePaginatedPlaces();
      },
    );
  }

  initializeFilters(): void {
    for (const category of this.filterCategories) {
      this.filters[category.key] = {};
      for (const option of category.options) {
        this.filters[category.key][option.key] = false;
      }
    }
  }
  setFilterCategories(lang: string) {
    if (lang === 'uk') {
      this.filterCategories = FILTER_CATEGORIES_UK;
    } else {
      this.filterCategories = FILTER_CATEGORIES;
    }
  }

  getSelectedLabel(): string {
    const selected = this.sizeOptions.find(
      (opt) => opt.value === this.itemsPerPage,
    );
    if (!selected) return 'Select';
    switch (selected.label) {
      case 'All':
        return this.translate.instant('CATALOG.ITEMS_PER_PAGE.ALL');
      case '6':
        return this.translate.instant('CATALOG.ITEMS_PER_PAGE.6');
      case '12':
        return this.translate.instant('CATALOG.ITEMS_PER_PAGE.12');
      default:
        return selected.label;
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

      this.filters = JSON.parse(JSON.stringify(this.filters));

      this.filteredPlaces = this.filterPlaces();
      this.updatePaginatedPlaces();
    });
  }

  onFiltersChange(updatedFilters: CatalogFilters) {
    this.loaderService.show();

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

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: '',
      })
      .then(() => {
        this.filteredPlaces = this.filterPlaces();
        this.currentPage = 1;
        this.updatePaginatedPlaces();

        this.loaderService.hide();

        if (this.showFilters) {
          this.toggleFilters();
        }
      });
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
          const locationCategory = this.filterCategories.find(
            (cat) => cat.key === 'location',
          );
          const selectedLabels = selected.map((key) => {
            const option = locationCategory?.options.find(
              (opt) => opt.key === key,
            );
            return option ? option.label.toLowerCase() : key.toLowerCase();
          });

          const matches = selectedLabels.some((label) => city.includes(label));
          if (!matches) {
            return false;
          }
        } else {
          const matches = selected.some((key) => {
            const label = this.getLabelByKey(category, key);
            return tags.some((tag) => tag.name === label);
          });
          if (!matches) {
            return false;
          }
        }
      }

      return true;
    });
  }

  private getLabelByKey(categoryKey: string, optionKey: string): string {
    const category = this.filterCategories.find(
      (cat) => cat.key === categoryKey,
    );
    return category?.options.find((opt) => opt.key === optionKey)?.label || '';
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedPlaces();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(value: number) {
    this.itemsPerPage = value;
    this.currentPage = 1;
    this.updatePaginatedPlaces();
  }

  private updatePaginatedPlaces() {
    if (this.itemsPerPage === -1) {
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.custom-dropdown');
    if (!clickedInsideDropdown) {
      this.dropdownOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }
}
