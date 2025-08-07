import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  fadeInBackdrop,
  slideDownAnimation,
  slideUpModal,
} from '../../../../styles/animations/animations';
import { UiStateService } from '../../../state/ui/ui-state.service';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { Theme } from '../../../core/models/theme.type';
import { FilterService } from '../../../core/services/filter.service';
import { FilterCategory } from '../../../core/models/catalog-filter.model';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslateModule],
  animations: [
    slideDownAnimation,
    fadeInBackdrop,
    slideUpModal,
    trigger('slideDownMobile', [
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('closed <=> open', animate('300ms ease')),
    ]),
  ],
  styles: [
    `
      /* Scrollable container for mobile dropdown options */
      .dropdown-mobile-options {
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
      }
    `,
  ],
  template: `
    <!-- Filter bar wrapper -->
    <div
      class="flex w-full flex-col gap-[16px] px-[20px] lg:h-[72px] lg:flex-row lg:gap-[20px] lg:px-0 xxl:h-[84px] xxl:max-w-[896px] xxl:gap-[24px]"
    >
      <!-- Mobile filter toggle button -->
      <button
        class="button-bg-transparent flex h-[48px] w-full lg:hidden"
        type="button"
        (click)="toggleMobileFilter()"
      >
        Filters
      </button>

      <!-- Filters container: hidden on mobile unless open -->
      <div
        class="gap-[24px]"
        [ngClass]="{
          'hidden h-[100%] lg:flex': !isMobileFilterOpen,
          'flex flex-col': isMobileFilterOpen
        }"
      >
        <div
          class="relative flex w-[688px] items-center justify-between gap-[4px] rounded-[40px] border lg:h-[72px] xxl:h-[84px]"
          [ngClass]="{
            'border-[var(--color-gray-20)]': (currentTheme$ | async) === 'light',
            'border-[var(--color-gray-75)]': (currentTheme$ | async) === 'dark'
          }"
        >
          <!-- Filter categories -->
          <div
            *ngFor="let category of filterCategories; let i = index"
            class="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-[4px] whitespace-nowrap rounded-[40px] text-center transition-colors duration-300"
            [ngClass]="{
              'text-[var(--color-primary)]': selectedOptions[category.key],
              'bg-[var(--color-white)]':
                selectedOptions[category.key] && (currentTheme$ | async) === 'light',
              'bg-[var(--color-bg-card)]':
                selectedOptions[category.key] && (currentTheme$ | async) === 'dark',
              'hover:bg-[var(--color-white)]': !selectedOptions[category.key]
            }"
            (click)="toggleDropdown(i)"
            (mouseenter)="handleMouseEnter(i)"
          >
            <!-- Category title -->
            <span
              class="menu-text-font"
              [ngClass]="{
                'text-[var(--color-gray-100)]': (currentTheme$ | async) === 'light',
                'text-[var(--color-gray-10)]': (currentTheme$ | async) === 'dark'
              }"
            >
              {{ category.title }}
            </span>

            <!-- Selected option or default description -->
            <span
              class="body-font-1"
              [ngClass]="{
                'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
                'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark'
              }"
            >
              {{ selectedOptions[category.key] || category.description }}
            </span>

            <!-- Dropdown options (desktop) -->
            <ul
              *ngIf="openedDropdownIndex === i"
              @slideDownAnimation
              class="absolute left-0 top-full z-50 mt-2 w-max rounded-[40px] border border-[var(--color-white)] p-2"
              [ngClass]="{
                'bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
                'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark'
              }"
              (click)="$event.stopPropagation()"
            >
              <li
                *ngFor="let option of category.options"
                class="flex cursor-pointer gap-[12px] rounded-[40px] p-2 hover:bg-[var(--color-bg)]"
                (click)="selectOption(category.key, option.label, $event)"
              >
                <img
                  [src]="option.imageURL"
                  alt="image"
                  class="h-[56px] w-[56px] rounded-full"
                />
                <div class="flex flex-col gap-[4px] text-left">
                  <span class="menu-text-font">{{ option.label }}</span>
                  <span class="body-font-2">{{ option.description }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Search button -->
      <button
        class="button-bg-blue flex h-[48px] w-full gap-3 lg:h-[72px] lg:w-[168px] xxl:h-[84px] xxl:w-[184px]"
        type="button"
        (click)="onSearchClick()"
      >
        <app-icon [icon]="ICONS.SearchWhite" />
        <span class="button-font">{{ 'BUTTON.SEARCH' | translate }}</span>
      </button>

      <!-- Backdrop overlay for mobile filter -->
      <div
        *ngIf="isMobileFilterOpen"
        @fadeInBackdrop
        class="bg-[var(--color-bg)]/90 fixed inset-0 z-40 backdrop-blur-3xl lg:hidden"
      ></div>

      <!-- Mobile filter modal -->
      <div
        *ngIf="isMobileFilterOpen"
        @slideUpModal
        class="fixed inset-0 z-40 flex max-w-full flex-col justify-between overflow-x-hidden overflow-y-scroll overscroll-contain px-5 pt-3 lg:hidden"
        #mobileFilterModal
      >
        <!-- Close button -->
        <div class="flex justify-end">
          <button
            (click)="toggleMobileFilter()"
            class="mb-[25px] flex h-10 w-10 items-center justify-center rounded-[40px] bg-[var(--color-white)]"
            aria-label="Close"
          >
            <app-icon [icon]="ICONS.Close" [width]="20" [height]="20" />
          </button>
        </div>

        <!-- Mobile filter categories -->
        <div class="flex-grow" (click)="onMobileModalClick($event)">
          <div class="flex-grow">
            <div class="relative flex h-full flex-col">
              <div class="flex flex-col">
                <div
                  *ngFor="let category of filterCategories; let i = index"
                  class="category-filter-block col-span-4"
                  style="max-width: 100%; overflow-x: hidden"
                >
                  <!-- Category header -->
                  <div
                    class="flex cursor-pointer rounded-[24px] px-4 py-6 transition-all duration-300"
                    (click)="toggleMobileFilterCategory(i)"
                    (mouseenter)="onMobileCategoryHover(i)"
                    [ngClass]="{
                      'flex-row items-center justify-between gap-2': mobileOpenedIndex !== i,
                      'flex-col': mobileOpenedIndex === i,
                      'bg-[var(--color-white)] text-[var(--color-gray-100)]': (currentTheme$ | async) === 'light',
                      'border border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
                      'hover:bg-[var(--color-bg)]': true
                    }"
                  >
                    <div class="menu-text-font">{{ category.title }}</div>
                    <div
                      class="body-font-1 text-[var(--color-gray-75)]"
                      [ngClass]="{ 'text-[var(--color-white)]': (currentTheme$ | async) === 'dark' }"
                    >
                      {{ selectedOptions[category.key] || category.description }}
                    </div>
                  </div>

                  <!-- Mobile dropdown options -->
                  <div
                    #dropdownOptions
                    [@slideDownMobile]="isMobileFilterOpenAt(i) ? 'open' : 'closed'"
                    class="dropdown-mobile-options mt-1 mb-4 flex flex-col gap-1 rounded-[24px] border p-4"
                    [ngClass]="{
                      'border-[var(--color-white)] bg-[var(--color-white)]': (currentTheme$ | async) === 'light',
                      'border-[var(--color-gray-75)] bg-[var(--color-bg)]': (currentTheme$ | async) === 'dark'
                    }"
                  >
                    <div
                      *ngFor="let option of category.options"
                      (click)="selectOption(category.key, option.label)"
                      class="flex cursor-pointer items-center gap-2 p-2 transition-colors duration-300 hover:rounded-[24px] hover:bg-[var(--color-bg-card)]"
                    >
                      <img
                        [src]="option.imageURL"
                        alt="icon"
                        class="h-[40px] w-[40px] rounded-full"
                      />
                      <div class="flex flex-col">
                        <span class="menu-text-font">{{ option.label }}</span>
                        <span class="body-font-2">{{ option.description }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile action buttons -->
        <div class="flex w-full gap-4">
          <button
            class="button-bg-blue mb-4 mt-4 h-12 flex-1"
            (click)="applyFilters(); toggleMobileFilter()"
          >
            Apply Filters
          </button>

          <button
            class="button-bg-transparent mb-4 mt-4 h-12 flex-1 text-[var(--color-primary)]"
            (click)="clearAllFilters()"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  `,
})
export class FilterBarComponent implements OnDestroy, AfterViewInit {
  @ViewChild('mobileFilterModal', { static: false }) mobileFilterModal?: ElementRef;
  @ViewChildren('dropdownOptions') dropdownOptions!: QueryList<ElementRef>;

  ICONS = ICONS;
  private langSub?: Subscription;

  selectedOptions: Record<string, string> = {};

  isMobileFilterOpen = false;
  mobileOpenedIndex: number | null = null;
  mobileMouseControlEnabled = false;
  openedDropdownIndex: number | null = null;
  filterCategories: FilterCategory[] = [];

  private globalClickUnlistener: () => void;

  readonly currentTheme$: Observable<Theme>;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uiState: UiStateService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private filterService: FilterService,
    private languageService: LanguageService,
  ) {
    this.currentTheme$ = this.themeService.theme$;

    // Update filter categories on language change
    this.langSub = this.languageService.lang$.subscribe(() => {
      this.filterCategories = this.filterService.categories;
      this.cdr.markForCheck();
    });

    // Listen for document clicks to handle closing dropdowns and modals
    this.globalClickUnlistener = this.renderer.listen(
      'document',
      'click',
      this.onDocumentClick.bind(this),
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions and listeners
    this.globalClickUnlistener?.();
    this.langSub?.unsubscribe();
    this.enableBodyScroll();
  }

  ngAfterViewInit(): void {
    // Debug dropdown sizes on options changes (optional)
    this.dropdownOptions.changes.subscribe(() => {
      this.logDropdownSizes();
    });
  }

  isMobileFilterOpenAt(index: number): boolean {
    return this.mobileOpenedIndex === index;
  }

  /** Toggle mobile filter modal visibility */
  toggleMobileFilter(): void {
    this.isMobileFilterOpen = !this.isMobileFilterOpen;

    if (this.isMobileFilterOpen) {
      this.disableBodyScroll();
      this.mobileOpenedIndex = null;
      this.mobileMouseControlEnabled = false;
    } else {
      this.enableBodyScroll();
      this.mobileOpenedIndex = null;
      this.mobileMouseControlEnabled = false;
      this.openedDropdownIndex = null;
    }
  }

  /** Toggle mobile category dropdown */
  toggleMobileFilterCategory(index: number): void {
    if (this.mobileOpenedIndex === index) {
      this.mobileOpenedIndex = null;
    } else {
      this.mobileOpenedIndex = index;
      this.mobileMouseControlEnabled = true;
    }
  }

  /** Select an option from category */
  selectOption(categoryKey: string, label: string, event?: MouseEvent): void {
    event?.stopPropagation();
    this.selectedOptions[categoryKey] = label;
    this.mobileOpenedIndex = null;
    this.mobileMouseControlEnabled = false;
    this.openedDropdownIndex = null;
  }

  /** Log dropdown sizes (for debugging) */
  logDropdownSizes(): void {
    this.dropdownOptions.forEach((el, idx) => {
      const native = el.nativeElement as HTMLElement;
      // console.log(`Dropdown ${idx} height: ${native.offsetHeight}px`);
    });
  }

  /** Handle search button click */
  onSearchClick(): void {
    if (window.innerWidth < 1024) {
      // On mobile: close filters and open mobile menu
      this.isMobileFilterOpen = false;
      this.enableBodyScroll();
      this.cdr.detectChanges();
      this.uiState.openMobileMenu();
    } else {
      // On desktop: apply filters immediately
      this.applyFilters();
    }
  }

  /** Handle click outside mobile modal to close category dropdown */
  onMobileModalClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideCategory = target.closest('.category-filter-block');

    if (!clickedInsideCategory && this.mobileOpenedIndex !== null) {
      this.mobileOpenedIndex = null;
      this.mobileMouseControlEnabled = false;
      this.cdr.detectChanges();
    }
  }

  /** Toggle desktop dropdown open/close */
  toggleDropdown(index: number): void {
    this.openedDropdownIndex = this.openedDropdownIndex === index ? null : index;
  }

  /** Handle mouse enter for desktop dropdown hover */
  handleMouseEnter(index: number): void {
    if (this.openedDropdownIndex !== null && this.openedDropdownIndex !== index) {
      this.openedDropdownIndex = index;
    }
  }

  /** Apply selected filters by navigating to catalog with query params */
  applyFilters(): void {
    const queryParams: Record<string, string> = {};

    for (const category of this.filterCategories) {
      const key = category.key;
      const selectedLabel = this.selectedOptions[key];

      if (selectedLabel) {
        const matched = category.options.find(opt => opt.label === selectedLabel);
        if (matched) {
          queryParams[key] = matched.key;
        }
      }
    }

    this.enableBodyScroll();
    this.router.navigate(['/catalog'], { queryParams });
  }

  /** Document click handler to close dropdowns/modals when clicking outside */
  private onDocumentClick(event: MouseEvent): void {
    const path = event.composedPath ? event.composedPath() : [];

    const clickedInsideModal = this.mobileFilterModal?.nativeElement
      ? path.includes(this.mobileFilterModal.nativeElement)
      : false;

    const clickedInsideComponent = path.includes(this.elementRef.nativeElement);

    // Close mobile filter modal if clicked outside
    if (!clickedInsideModal && !clickedInsideComponent && this.isMobileFilterOpen) {
      this.isMobileFilterOpen = false;
      this.enableBodyScroll();
      this.mobileOpenedIndex = null;
      this.mobileMouseControlEnabled = false;
      this.openedDropdownIndex = null;
    }

    // Close desktop dropdown if clicked outside
    if (!clickedInsideComponent && this.openedDropdownIndex !== null && !this.isMobileFilterOpen) {
      this.openedDropdownIndex = null;
      this.cdr.detectChanges();
    }
  }

  /** Handle hover on mobile category dropdown (for mouse users) */
  onMobileCategoryHover(index: number): void {
    if (!this.mobileMouseControlEnabled) {
      return;
    }
    if (this.mobileOpenedIndex !== index) {
      this.mobileOpenedIndex = index;
      this.cdr.detectChanges();
    }
  }

  /** Enable body scroll (used when modal is closed) */
  private enableBodyScroll(): void {
    document.body.style.overflow = '';
  }

  /** Disable body scroll (used when modal is open) */
  private disableBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  /** Clear all selected filters */
  clearAllFilters(): void {
    this.selectedOptions = {};
  }
}
