import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FILTER_CATEGORIES } from '../../../core/constants/catalog-filter.config';
import {
  fadeInBackdrop,
  slideDownAnimation,
  slideUpModal,
} from '../../../../styles/animations/animations';
import { UiStateService } from '../../../state/ui/ui-state.service';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  animations: [slideDownAnimation, fadeInBackdrop, slideUpModal],
  template: `
    <div
      class="mb-[80px] mt-[64px] grid grid-cols-4 gap-[16px] px-[20px] lg:flex lg:h-[72px] lg:gap-[20px] lg:px-0 xxl:mb-[150px] xxl:h-[84px] xxl:max-w-[896px] xxl:grid-cols-none xxl:gap-[24px]"
    >
      <!-- Mobile filter toggle button -->
      <button
        class="shadow-hover button-bg-transparent col-span-2 flex h-[48px] w-full lg:hidden"
        type="button"
        (click)="toggleMobileFilter()"
      >
        Filters
      </button>

      <!-- Filters (desktop or mobile open) -->
      <div
        class="gap-[24px]"
        [ngClass]="{
          'hidden h-[100%] lg:flex': !isMobileFilterOpen,
          'flex flex-col': isMobileFilterOpen,
        }"
      >
        <div
          class="relative flex w-[688px] items-center justify-between gap-[4px] rounded-[40px] border border-[var(--color-gray-20)] lg:h-[72px] xxl:h-[84px]"
        >
          <div
            *ngFor="let category of filterCategories; let i = index"
            class="relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-[4px] whitespace-nowrap rounded-[40px] text-center transition-colors duration-300 hover:bg-[var(--color-white)]"
            [ngClass]="{
              'bg-[var(--color-white)] font-semibold text-[var(--color-primary)] shadow-sm':
                selectedOptions[category.key],
            }"
            (click)="toggleDropdown(i)"
            (mouseenter)="handleMouseEnter(i)"
          >
            <span class="menu-text-font text-[var(--color-gray-100)]">
              {{ category.title }}
            </span>
            <span class="body-font-1 text-[var(--color-gray-75)]">
              {{ selectedOptions[category.key] || category.description }}
            </span>

            <!-- Desktop dropdown -->
            <ul
              *ngIf="openedDropdownIndex === i"
              @slideDownAnimation
              class="absolute left-0 top-full z-50 mt-2 w-max rounded-[40px] bg-[var(--color-white)] p-2"
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
                  class="h-[56px] w-[56px]"
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
        class="button-bg-blue col-span-2 flex h-[48px] w-full gap-3 lg:h-[72px] lg:w-[168px] xxl:h-[84px] xxl:w-[184px]"
        type="button"
        (click)="onSearchClick()"
      >
        <app-icon [icon]="ICONS.SearchWhite" />
        <span class="button-font">Search</span>
      </button>

      <!-- Backdrop for mobile filter -->
      <div
        *ngIf="isMobileFilterOpen"
        @fadeInBackdrop
        class="bg-[var(--color-bg)]/70 fixed inset-0 z-40 backdrop-blur-3xl lg:hidden"
      ></div>

      <!-- Mobile filter modal -->
      <div
        *ngIf="isMobileFilterOpen"
        @slideUpModal
        class="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto px-5 pt-3 lg:hidden"
        #mobileFilterModal
      >
        <!-- Top bar with close button -->
        <div class="flex justify-end">
          <button
            (click)="toggleMobileFilter()"
            class="mb-[25px] flex h-10 w-10 items-center justify-center rounded-[40px] bg-[var(--color-white)]"
            aria-label="Close"
          >
            <app-icon [icon]="ICONS.Close" class="h-5 w-5" />
          </button>
        </div>

        <!-- Filter categories container -->
        <div class="flex-grow" (click)="onMobileModalClick($event)">
          <div class="flex-grow">
            <div class="relative flex h-full flex-col">
              <!-- Filter categories -->
              <div class="flex flex-col gap-[16px] px-[20px]">
                <div
                  *ngFor="let category of filterCategories; let i = index"
                  class="category-filter-block col-span-4"
                >
                  <!-- Header and description -->
                  <div
                    class="flex cursor-pointer rounded-[24px] bg-[var(--color-white)] px-6 py-4 transition-all duration-300 hover:rounded-[24px] hover:bg-[var(--color-bg)]"
                    (click)="toggleMobileFilterCategory(i)"
                    (mouseenter)="onMobileCategoryHover(i)"
                    [ngClass]="{
                      'flex-row items-center justify-between gap-2':
                        mobileOpenedIndex !== i,
                      'flex-col': mobileOpenedIndex === i,
                    }"
                  >
                    <div class="menu-text-font">{{ category.title }}</div>
                    <div class="body-font-1 text-[var(--color-gray-75)]">
                      {{
                        selectedOptions[category.key] || category.description
                      }}
                    </div>
                  </div>

                  <!-- Collapsible options block -->
                  <div
                    class="mt-1 flex flex-col gap-1 rounded-[24px] bg-[var(--color-white)] p-4 transition-all duration-300 ease-in-out"
                    [ngStyle]="{
                      maxHeight: mobileOpenedIndex === i ? '1000px' : '0',
                      opacity: mobileOpenedIndex === i ? '1' : '0',
                      paddingTop: mobileOpenedIndex === i ? '12px' : '0',
                      overflow: mobileOpenedIndex === i ? 'visible' : 'hidden',
                    }"
                  >
                    <div
                      *ngFor="let option of category.options"
                      (click)="selectOption(category.key, option.label)"
                      class="flex cursor-pointer items-center gap-2 p-2 transition-colors duration-300 hover:rounded-[24px] hover:bg-[var(--color-bg)]"
                    >
                      <img
                        [src]="option.imageURL"
                        alt="icon"
                        class="h-[40px] w-[40px] rounded-full"
                      />
                      <div class="flex flex-col">
                        <span class="menu-text-font">{{ option.label }}</span>
                        <span class="body-font-2">{{
                          option.description
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex w-full gap-4">
          <button
            class="button-bg-blue mb-4 mt-4 h-12 flex-1"
            (click)="applyFilters(); toggleMobileFilter()"
          >
            Apply Filters
          </button>

          <button
            class="button-bg-transparent shadow-hover mb-4 mt-4 h-12 flex-1 text-[var(--color-primary)]"
            (click)="clearAllFilters()"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  `,
})
export class FilterBarComponent implements OnDestroy {
  @ViewChild('mobileFilterModal', { static: false })
  mobileFilterModal?: ElementRef;

  ICONS = ICONS;
  filterCategories = FILTER_CATEGORIES;
  selectedOptions: Record<string, string> = {};

  isMobileFilterOpen = false;
  mobileOpenedIndex: number | null = null;
  mobileMouseControlEnabled = false;
  openedDropdownIndex: number | null = null;

  private globalClickUnlistener: () => void;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uiState: UiStateService,
    private cdr: ChangeDetectorRef,
  ) {
    // Listen for clicks on document to close dropdowns and mobile filter when clicking outside
    this.globalClickUnlistener = this.renderer.listen(
      'document',
      'click',
      this.onDocumentClick.bind(this),
    );
  }

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

  toggleMobileFilterCategory(index: number): void {
    if (this.mobileOpenedIndex === index) {
      this.mobileOpenedIndex = null;
      this.mobileMouseControlEnabled = false;
    } else {
      this.mobileOpenedIndex = index;
      this.mobileMouseControlEnabled = true;
    }
  }

  selectOption(categoryKey: string, label: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedOptions[categoryKey] = label;
    this.mobileOpenedIndex = null;
    this.mobileMouseControlEnabled = false;
    this.openedDropdownIndex = null;
  }

  onSearchClick(): void {
    if (window.innerWidth < 1024) {
      // On mobile, close filters and open mobile menu
      this.isMobileFilterOpen = false;
      this.enableBodyScroll();
      this.cdr.detectChanges();

      this.uiState.openMobileMenu();
    } else {
      this.applyFilters();
    }
  }

  onMobileModalClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideCategory = target.closest('.category-filter-block');

    if (!clickedInsideCategory && this.mobileOpenedIndex !== null) {
      this.mobileOpenedIndex = null;
      this.mobileMouseControlEnabled = false;
      this.cdr.detectChanges();
    }
  }

  toggleDropdown(index: number): void {
    this.openedDropdownIndex =
      this.openedDropdownIndex === index ? null : index;
  }

  handleMouseEnter(index: number): void {
    if (
      this.openedDropdownIndex !== null &&
      this.openedDropdownIndex !== index
    ) {
      this.openedDropdownIndex = index;
    }
  }

  applyFilters(): void {
    const queryParams: Record<string, string> = {};

    for (const category of this.filterCategories) {
      const key = category.key;
      const selectedLabel = this.selectedOptions[key];

      if (selectedLabel) {
        const matched = category.options.find(
          (opt) => opt.label === selectedLabel,
        );
        if (matched) {
          queryParams[key] = matched.key;
        }
      }
    }

    this.enableBodyScroll();
    this.router.navigate(['/catalog'], { queryParams });
  }

  private onDocumentClick(event: MouseEvent): void {
    const path = event.composedPath ? event.composedPath() : [];

    const clickedInsideModal = this.mobileFilterModal?.nativeElement
      ? path.includes(this.mobileFilterModal.nativeElement)
      : false;

    const clickedInsideComponent = path.includes(this.elementRef.nativeElement);

    // Close mobile filter if clicked outside
    if (
      !clickedInsideModal &&
      !clickedInsideComponent &&
      this.isMobileFilterOpen
    ) {
      this.isMobileFilterOpen = false;
      this.enableBodyScroll();
      this.mobileOpenedIndex = null;
      this.mobileMouseControlEnabled = false;
      this.openedDropdownIndex = null;
    }

    // Close desktop dropdown if clicked outside
    if (
      !clickedInsideComponent &&
      this.openedDropdownIndex !== null &&
      !this.isMobileFilterOpen
    ) {
      this.openedDropdownIndex = null;
      this.cdr.detectChanges();
    }
  }

  onMobileCategoryHover(index: number): void {
    if (this.mobileMouseControlEnabled && this.mobileOpenedIndex !== index) {
      this.mobileOpenedIndex = index;
      this.cdr.detectChanges();
    }
  }

  private enableBodyScroll(): void {
    document.body.style.overflow = '';
  }

  private disableBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    if (this.globalClickUnlistener) {
      this.globalClickUnlistener();
    }
    this.enableBodyScroll();
  }

  clearAllFilters(): void {
    this.selectedOptions = {};
  }
}
