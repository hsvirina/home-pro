// import {
//   Component,
//   ElementRef,
//   NgZone,
//   OnDestroy,
//   OnInit,
//   ViewChild,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';

// import { Observable, Subject, takeUntil } from 'rxjs';

// import { Place } from '../../core/models/place.model';
// import { CatalogFilters } from '../../core/models/catalog-filter.model';
// import { Theme } from '../../core/models/theme.type';

// import { FILTER_CATEGORIES } from '../../core/constants/catalog-filter.config';
// import { FILTER_CATEGORIES_UK } from '../../core/constants/catalog-filter.uk.config';
// import { ICONS } from '../../core/constants/icons.constant';
// import { PlaceCardType } from '../../core/constants/place-card-type.enum';

// import { slideDownAnimation } from '../../../styles/animations/animations';

// import { PlacesStoreService } from '../../core/services/places-store.service';
// import { LoaderService } from '../../core/services/loader.service';
// import { ThemeService } from '../../core/services/theme.service';
// import { CatalogFilterService } from '../../core/services/catalog-filter.service';

// import {
//   TranslateService,
//   LangChangeEvent,
//   TranslateModule,
// } from '@ngx-translate/core';

// import { CatalogFiltersComponent } from './components/catalog-filters.components';
// import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs.component';
// import { PaginationComponent } from './components/pagination.component';
// import { IconComponent } from '../../shared/components/icon.component';
// import { PlaceCardComponent } from '../../shared/components/place-card.component';
// import { PageSizeDropdownComponent } from './components/page-size-dropdown.component';

// import { paginate } from '../../core/utils/pagination.util';
// import { ModalComponent } from '../../shared/components/modal.component';

// @Component({
//   selector: 'app-catalog-page',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     TranslateModule,
//     CatalogFiltersComponent,
//     BreadcrumbsComponent,
//     PaginationComponent,
//     IconComponent,
//     PlaceCardComponent,
//     PageSizeDropdownComponent,
//     ModalComponent,
//   ],
//   animations: [slideDownAnimation],
//   template: `
//     <div
//       class="mx-auto grid w-full max-w-[1320px] grid-cols-4 gap-[16px] px-[20px] xxl:grid-cols-8 xxl:gap-[20px] xxl:px-[0px]"
//     >
//       <div class="col-span-4 xxl:col-span-8">
//         <app-breadcrumbs></app-breadcrumbs>
//       </div>

//       <h2
//         class="col-span-4 mb-[60px] text-center text-[32px] xxl:col-span-8 xxl:text-[64px]"
//       >
//         {{ 'CATALOG.TITLE' | translate }}
//         <span class="text-[var(--color-primary)]">{{
//           'CATALOG.HIGHLIGHT' | translate
//         }}</span>
//       </h2>

//       <div
//         class="col-span-4 mb-[40px] h-[48px] rounded-[40px] border border-[var(--color-gray-20)] xxl:hidden"
//       >
//         <button
//           class="flex h-full w-full items-center justify-center"
//           (click)="toggleFilters()"
//         >
//           {{ 'CATALOG.FILTERS_BUTTON' | translate }}
//         </button>
//       </div>

//       <div class="col-span-4 xxl:col-span-8">
//         <div class="mb-4 flex justify-end">
//           <app-page-size-dropdown
//             [(selectedValue)]="itemsPerPage"
//             (selectedValueChange)="onPageSizeChange($event)"
//           ></app-page-size-dropdown>
//         </div>
//       </div>

//       <div class="col-span-4 hidden xxl:col-span-2 xxl:block">
//         <app-catalog-filters
//           [filters]="filters"
//           [filterCategories]="filterCategories"
//           (filtersChange)="onFiltersChange($event)"
//         ></app-catalog-filters>
//       </div>

//       <div
//         *ngIf="showFilters"
//         class="fixed left-0 top-0 z-50 h-full w-full xxl:hidden"
//         appClickOutside
//         (click)="toggleFilters()"
//       >
//         <div
//           #filtersPanel
//           class="relative h-full w-full overflow-y-auto bg-[var(--color-gray-20)] px-[20px] pt-[12px]"
//           (click)="$event.stopPropagation()"
//         >
//           <div
//             class="mb-[25px] ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-[40px] bg-white"
//           >
//             <app-icon
//               [icon]="ICONS.Close"
//               class="cursor-pointer"
//               (click)="toggleFilters()"
//             />
//           </div>

//           <app-catalog-filters
//             [filters]="filters"
//             [filterCategories]="filterCategories"
//             (filtersChange)="onFiltersChange($event)"
//           ></app-catalog-filters>
//         </div>
//       </div>

//       <div class="col-span-4 lg:col-span-6">
//         <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           <app-place-card
//             *ngFor="let place of paginatedPlaces"
//             [place]="place"
//             [cardType]="PlaceCardType.Catalog"
//             (unauthorizedFavoriteClick)="showLoginModal()"
//           ></app-place-card>

//           <div
//             *ngIf="paginatedPlaces.length === 0 && hasActiveFilters"
//             class="col-span-full flex flex-col items-center justify-center gap-4 p-12 text-center"
//           >
//             <h3>
//               {{ 'CATALOG.NO_CAFES_FOUND_TITLE' | translate }}
//             </h3>
//             <p class="max-w-sm">
//               {{ 'CATALOG.NO_CAFES_FOUND_DESC' | translate }}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div
//         class="col-span-4 mt-6 flex flex-col items-center gap-4 lg:col-span-6 xxl:col-span-8 xxl:mb-[148px]"
//       >
//         <app-pagination
//           [totalItems]="filteredPlaces.length"
//           [selectedSize]="itemsPerPage"
//           [currentPage]="currentPage"
//           (pageChange)="onPageChange($event)"
//         ></app-pagination>
//       </div>

//       <app-modal
//         [isOpen]="isLoginModalVisible"
//         (close)="isLoginModalVisible = false"
//         width="400px"
//       >
//         <div class="flex flex-col items-center gap-3">
//           <h2 class="mb-4 text-xl font-semibold">Please log in</h2>
//           <p class="mb-6">
//             You need to be logged in to add cafes to your favorites.
//           </p>
//           <div class="flex flex-wrap justify-end gap-4">
//             <button
//               class="button-bg-blue min-w-[120px] px-6 py-3"
//               (click)="onLoginClick()"
//             >
//               Login
//             </button>
//             <button
//               class="button-bg-transparent px-6 py-3"
//               (click)="isLoginModalVisible = false"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </app-modal>
//     </div>
//   `,
// })
// export class CatalogPageComponent implements OnInit, OnDestroy {
//   ICONS = ICONS;
//   PlaceCardType = PlaceCardType;

//   @ViewChild('filtersPanel', { static: false }) filtersPanel?: ElementRef;

//   places: Place[] = [];
//   isLoginModalVisible = false;
//   filteredPlaces: Place[] = [];
//   paginatedPlaces: Place[] = [];

//   filters: CatalogFilters = {};
//   filterCategories = FILTER_CATEGORIES;
//   showFilters = false;

//   itemsPerPage = -1; // Show all items by default
//   currentPage = 1;

//   currentTheme$: Observable<Theme>;

//   private destroy$ = new Subject<void>();
//   private updatingFromQueryParams = false;

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     public loaderService: LoaderService,
//     private themeService: ThemeService,
//     private translate: TranslateService,
//     private placesStore: PlacesStoreService,
//     private catalogFilterService: CatalogFilterService,
//     private ngZone: NgZone,
//   ) {
//     this.currentTheme$ = this.themeService.theme$;
//   }

//   ngOnInit(): void {
//   this.loaderService.show();

//   this.placesStore.loadPlaces();

//   this.placesStore.places$.pipe(takeUntil(this.destroy$)).subscribe({
//     next: (data) => {
//       this.places = data || [];
//       this.setFilterCategories(this.translate.currentLang);
//       this.initializeFilters();
//       this.filterAndPaginate();

//       this.ngZone.runOutsideAngular(() => {
//         setTimeout(() => {
//           this.ngZone.run(() => {
//             // Выключаем лоадер с задержкой 300мс
//             setTimeout(() => {
//               this.loaderService.hide();
//             }, 300);
//           });
//         }, 0);
//       });
//     },
//     error: (error) => {
//       console.error('Error loading places:', error);
//       // Ошибка — лоадер выключаем сразу
//       this.loaderService.hide();
//     },
//   });

//   this.route.queryParams
//     .pipe(takeUntil(this.destroy$))
//     .subscribe((params) => {
//       this.loaderService.show();

//       if (this.updatingFromQueryParams) {
//         this.updatingFromQueryParams = false;
//       } else {
//         this.initializeFilters();

//         for (const key in params) {
//           if (!this.filters[key]) {
//             this.filters[key] = {};
//           }
//           const values = Array.isArray(params[key]) ? params[key] : [params[key]];
//           values.forEach((val: string) => {
//             this.filters[key][val] = true;
//           });
//         }
//       }

//       this.filterAndPaginate();

//       // Выключаем лоадер с задержкой 300 мс
//       setTimeout(() => {
//         this.loaderService.hide();
//       }, 300);
//     });

//   this.translate.onLangChange
//     .pipe(takeUntil(this.destroy$))
//     .subscribe((event: LangChangeEvent) => {
//       this.setFilterCategories(event.lang);
//       this.initializeFilters();
//       this.filterAndPaginate();
//     });
// }

//   onFiltersChange(updatedFilters: CatalogFilters): void {
//     this.loaderService.show();
//     this.filters = { ...updatedFilters };

//     const queryParams: Record<string, string[]> = {};
//     for (const category in this.filters) {
//       const activeKeys = Object.keys(this.filters[category]).filter(
//         (key) => this.filters[category][key],
//       );
//       if (activeKeys.length) {
//         queryParams[category] = activeKeys;
//       }
//     }

//     this.updatingFromQueryParams = true;
//     this.router.navigate([], {
//       relativeTo: this.route,
//       queryParams,
//       queryParamsHandling: '',
//     });
//     // Убираем вызов hide() здесь,
//     // отключение будет в подписке на queryParams
//   }

//   // onFiltersChange(updatedFilters: CatalogFilters): void {
//   //   this.loaderService.show();
//   //   this.filters = { ...updatedFilters };

//   //   const queryParams: Record<string, string[]> = {};
//   //   for (const category in this.filters) {
//   //     const activeKeys = Object.keys(this.filters[category]).filter(
//   //       (key) => this.filters[category][key],
//   //     );
//   //     if (activeKeys.length) {
//   //       queryParams[category] = activeKeys;
//   //     }
//   //   }

//   //   this.updatingFromQueryParams = true;
//   //   this.router
//   //     .navigate([], {
//   //       relativeTo: this.route,
//   //       queryParams,
//   //       queryParamsHandling: '',
//   //     })
//   //     .then(() => {
//   //       this.currentPage = 1;
//   //       this.filterAndPaginate();
//   //       this.loaderService.hide();
//   //       if (this.showFilters) this.toggleFilters();
//   //     });
//   // }

//   initializeFilters(): void {
//     this.filters = {};
//     for (const category of this.filterCategories) {
//       this.filters[category.key] = {};
//       for (const option of category.options) {
//         this.filters[category.key][option.key] = false;
//       }
//     }
//   }

//   toggleFilters(): void {
//     this.showFilters = !this.showFilters;
//     document.body.style.overflow = this.showFilters ? 'hidden' : '';
//   }

//   setFilterCategories(lang: string): void {
//     this.filterCategories =
//       lang === 'uk' ? FILTER_CATEGORIES_UK : FILTER_CATEGORIES;
//   }

//   onPageChange(page: number): void {
//     this.currentPage = page;
//     this.updatePaginatedPlaces();
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   onPageSizeChange(value: number): void {
//     this.itemsPerPage = value;
//     this.currentPage = 1;
//     this.updatePaginatedPlaces();
//   }

//   private filterAndPaginate(): void {
//     this.filteredPlaces = this.catalogFilterService.filterPlaces(
//       this.places,
//       this.filters,
//       this.filterCategories,
//     );
//     this.updatePaginatedPlaces();
//   }

//   private updatePaginatedPlaces(): void {
//     this.paginatedPlaces = paginate(
//       this.filteredPlaces,
//       this.currentPage,
//       this.itemsPerPage,
//     );
//   }

//   showLoginModal(): void {
//     this.isLoginModalVisible = true;
//   }

//   onLoginClick(): void {
//     this.isLoginModalVisible = false;
//     // логика перехода на страницу логина, например:
//     this.router.navigate(['/login']);
//   }

//   get hasActiveFilters(): boolean {
//     return Object.values(this.filters).some((category) =>
//       Object.values(category).some((value) => value),
//     );
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
// }

import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import { Place } from '../../core/models/place.model';
import { CatalogFilters } from '../../core/models/catalog-filter.model';
import { Theme } from '../../core/models/theme.type';

import { FILTER_CATEGORIES } from '../../core/constants/catalog-filter.config';
import { FILTER_CATEGORIES_UK } from '../../core/constants/catalog-filter.uk.config';
import { ICONS } from '../../core/constants/icons.constant';
import { PlaceCardType } from '../../core/constants/place-card-type.enum';

import { slideDownAnimation } from '../../../styles/animations/animations';

import { PlacesStoreService } from '../../core/services/places-store.service';
import { LoaderService } from '../../core/services/loader.service';
import { ThemeService } from '../../core/services/theme.service';
import { CatalogFilterService } from '../../core/services/catalog-filter.service';

import {
  TranslateService,
  LangChangeEvent,
  TranslateModule,
} from '@ngx-translate/core';

import { CatalogFiltersComponent } from './components/catalog-filters.components';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs.component';
import { PaginationComponent } from './components/pagination.component';
import { IconComponent } from '../../shared/components/icon.component';
import { PlaceCardComponent } from '../../shared/components/place-card.component';
import { PageSizeDropdownComponent } from './components/page-size-dropdown.component';

import { paginate } from '../../core/utils/pagination.util';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CatalogFiltersComponent,
    BreadcrumbsComponent,
    PaginationComponent,
    IconComponent,
    PlaceCardComponent,
    PageSizeDropdownComponent,
    ModalComponent,
  ],
  animations: [slideDownAnimation],
  template: `
    <!--
  Main container grid with responsive columns and padding.
  Uses Tailwind-like utility classes for spacing and layout.
-->
    <div
      class="mx-auto grid w-full max-w-[1320px] grid-cols-4 gap-[16px] px-[20px] xxl:grid-cols-8 xxl:gap-[20px] xxl:px-[0px]"
    >
      <!-- Breadcrumbs occupy full width -->
      <div class="col-span-4 xxl:col-span-8">
        <app-breadcrumbs></app-breadcrumbs>
      </div>

      <!-- Page title with translation keys and highlighted part -->
      <h2
        class="col-span-4 mb-[60px] text-center text-[32px] xxl:col-span-8 xxl:text-[64px]"
      >
        {{ 'CATALOG.TITLE' | translate }}
        <span class="text-[var(--color-primary)]">{{
          'CATALOG.HIGHLIGHT' | translate
        }}</span>
      </h2>

      <!-- Mobile filter toggle button: visible only on smaller screens -->
      <div
        class="col-span-4 mb-[40px] h-[48px] rounded-[40px] border border-[var(--color-gray-20)] xxl:hidden"
      >
        <button
          class="flex h-full w-full items-center justify-center"
          (click)="toggleFilters()"
          aria-label="Toggle filters"
        >
          {{ 'CATALOG.FILTERS_BUTTON' | translate }}
        </button>
      </div>

      <!-- Page size dropdown aligned to right -->
      <div class="col-span-4 xxl:col-span-8">
        <div class="mb-4 flex justify-end">
          <app-page-size-dropdown
            [(selectedValue)]="itemsPerPage"
            (selectedValueChange)="onPageSizeChange($event)"
          ></app-page-size-dropdown>
        </div>
      </div>

      <!-- Sidebar filters for larger screens only -->
      <div
        class="col-span-4 hidden xxl:col-span-2 xxl:block"
        aria-label="Catalog filters sidebar"
      >
        <app-catalog-filters
          [filters]="filters"
          [filterCategories]="filterCategories"
          (filtersChange)="onFiltersChange($event)"
        ></app-catalog-filters>
      </div>

      <!-- Mobile filters panel overlay -->
      <div
        *ngIf="showFilters"
        class="fixed left-0 top-0 z-50 h-full w-full xxl:hidden"
        appClickOutside
        (click)="toggleFilters()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-panel-title"
      >
        <div
          #filtersPanel
          class="relative h-full w-full overflow-y-auto bg-[var(--color-gray-20)] px-[20px] pt-[12px]"
          (click)="$event.stopPropagation()"
        >
          <!-- Close button for filters panel -->
          <div
            class="mb-[25px] ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-[40px] bg-white"
          >
            <app-icon
              [icon]="ICONS.Close"
              class="cursor-pointer"
              (click)="toggleFilters()"
              aria-label="Close filters"
            />
          </div>

          <!-- Filters component inside mobile panel -->
          <app-catalog-filters
            [filters]="filters"
            [filterCategories]="filterCategories"
            (filtersChange)="onFiltersChange($event)"
          ></app-catalog-filters>
        </div>
      </div>

      <!-- Main catalog cards grid -->
      <div class="col-span-4 lg:col-span-6" aria-live="polite">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <app-place-card
            *ngFor="let place of paginatedPlaces"
            [place]="place"
            [cardType]="PlaceCardType.Catalog"
            (unauthorizedFavoriteClick)="showLoginModal()"
          ></app-place-card>

          <!-- Message shown when no results match active filters -->
          <div
            *ngIf="paginatedPlaces.length === 0 && hasActiveFilters"
            class="col-span-full flex flex-col items-center justify-center gap-4 p-12 text-center"
            role="alert"
            aria-live="assertive"
          >
            <h3>{{ 'CATALOG.NO_CAFES_FOUND_TITLE' | translate }}</h3>
            <p class="max-w-sm">
              {{ 'CATALOG.NO_CAFES_FOUND_DESC' | translate }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination controls -->
      <div
        class="col-span-4 mt-6 flex flex-col items-center gap-4 lg:col-span-6 xxl:col-span-8 xxl:mb-[148px]"
      >
        <app-pagination
          [totalItems]="filteredPlaces.length"
          [selectedSize]="itemsPerPage"
          [currentPage]="currentPage"
          (pageChange)="onPageChange($event)"
          aria-label="Catalog pagination"
        ></app-pagination>
      </div>

      <!-- Login modal for unauthorized favorites -->
      <app-modal
        [isOpen]="isLoginModalVisible"
        (close)="isLoginModalVisible = false"
        width="400px"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div class="flex flex-col items-center gap-3">
          <h2 id="login-modal-title" class="mb-4 text-xl font-semibold">
            Please log in
          </h2>
          <p class="mb-6">
            You need to be logged in to add cafes to your favorites.
          </p>
          <div class="flex flex-wrap justify-end gap-4">
            <button
              class="button-bg-blue min-w-[120px] px-6 py-3"
              (click)="onLoginClick()"
              aria-label="Login"
            >
              Login
            </button>
            <button
              class="button-bg-transparent px-6 py-3"
              (click)="isLoginModalVisible = false"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      </app-modal>
    </div>
  `,
})
export class CatalogPageComponent implements OnInit, OnDestroy {
  // Constants and enums for template usage
  ICONS = ICONS;
  PlaceCardType = PlaceCardType;

  @ViewChild('filtersPanel', { static: false }) filtersPanel?: ElementRef;

  // Data properties
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  paginatedPlaces: Place[] = [];
  filters: CatalogFilters = {};
  filterCategories = FILTER_CATEGORIES;

  // UI state
  showFilters = false;
  isLoginModalVisible = false;
  itemsPerPage = -1; // -1 means show all items by default
  currentPage = 1;

  // Observables
  currentTheme$: Observable<Theme>;

  // Internal helpers
  private destroy$ = new Subject<void>();
  private updatingFromQueryParams = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public loaderService: LoaderService,
    private themeService: ThemeService,
    private translate: TranslateService,
    private placesStore: PlacesStoreService,
    private catalogFilterService: CatalogFilterService,
    private ngZone: NgZone,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    // Show loader at the start of data loading
    this.loaderService.show();

    // Trigger data loading
    this.placesStore.loadPlaces();

    // Subscribe to places data stream
    this.placesStore.places$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.places = data || [];
        this.setFilterCategories(this.translate.currentLang);
        this.initializeFilters();
        this.filterAndPaginate();

        // Hide loader with a smooth 300ms delay outside Angular zone
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              setTimeout(() => this.loaderService.hide(), 300);
            });
          }, 0);
        });
      },
      error: (error) => {
        console.error('Error loading places:', error);
        // Hide loader immediately on error
        this.loaderService.hide();
      },
    });

    // Subscribe to query param changes for filters
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.loaderService.show();

        if (this.updatingFromQueryParams) {
          this.updatingFromQueryParams = false;
        } else {
          this.initializeFilters();
          for (const key in params) {
            if (!this.filters[key]) {
              this.filters[key] = {};
            }
            const values = Array.isArray(params[key])
              ? params[key]
              : [params[key]];
            values.forEach((val) => (this.filters[key][val] = true));
          }
        }

        this.filterAndPaginate();

        // Hide loader with delay to avoid flicker
        setTimeout(() => this.loaderService.hide(), 300);
      });

    // Update filters and categories on language change
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LangChangeEvent) => {
        this.setFilterCategories(event.lang);
        this.initializeFilters();
        this.filterAndPaginate();
      });
  }

  /**
   * Handler for filters changes from the child filter component.
   * Updates internal filters state, syncs URL query params and shows loader.
   */
  onFiltersChange(updatedFilters: CatalogFilters): void {
    this.loaderService.show();
    this.filters = { ...updatedFilters };

    const queryParams: Record<string, string[]> = {};
    for (const category in this.filters) {
      const activeKeys = Object.keys(this.filters[category]).filter(
        (key) => this.filters[category][key],
      );
      if (activeKeys.length) {
        queryParams[category] = activeKeys;
      }
    }

    this.updatingFromQueryParams = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });
    // Loader hide will be handled by queryParams subscription
  }

  /**
   * Initializes filters object with all filter options set to false.
   */
  initializeFilters(): void {
    this.filters = {};
    for (const category of this.filterCategories) {
      this.filters[category.key] = {};
      for (const option of category.options) {
        this.filters[category.key][option.key] = false;
      }
    }
  }

  /**
   * Toggles filter sidebar visibility and controls page scroll locking.
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    document.body.style.overflow = this.showFilters ? 'hidden' : '';
  }

  /**
   * Sets filter categories depending on the current language.
   */
  setFilterCategories(lang: string): void {
    this.filterCategories =
      lang === 'uk' ? FILTER_CATEGORIES_UK : FILTER_CATEGORIES;
  }

  /**
   * Handles page change event from pagination component.
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPlaces();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Handles page size change event from dropdown.
   */
  onPageSizeChange(value: number): void {
    this.itemsPerPage = value;
    this.currentPage = 1;
    this.updatePaginatedPlaces();
  }

  /**
   * Applies filters to the places list and updates paginated result.
   */
  private filterAndPaginate(): void {
    this.filteredPlaces = this.catalogFilterService.filterPlaces(
      this.places,
      this.filters,
      this.filterCategories,
    );
    this.updatePaginatedPlaces();
  }

  /**
   * Updates the paginated list based on current page and items per page.
   */
  private updatePaginatedPlaces(): void {
    this.paginatedPlaces = paginate(
      this.filteredPlaces,
      this.currentPage,
      this.itemsPerPage,
    );
  }

  /**
   * Shows the login modal dialog.
   */
  showLoginModal(): void {
    this.isLoginModalVisible = true;
  }

  /**
   * Handler for login button click inside modal.
   * Navigates user to the login page.
   */
  onLoginClick(): void {
    this.isLoginModalVisible = false;
    this.router.navigate(['/login']);
  }

  /**
   * Indicates if there is any active filter selected.
   */
  get hasActiveFilters(): boolean {
    return Object.values(this.filters).some((category) =>
      Object.values(category).some((value) => value),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
