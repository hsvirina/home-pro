import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FILTER_CATEGORIES } from '../../../models/catalog-filter.config';
import { slideDownAnimation } from '../../../../styles/animations';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  animations: [slideDownAnimation],
  template: `
    <div
      class="mb-[80px] mt-[64px] grid grid-cols-4 gap-[16px] px-[20px] lg:flex lg:h-[72px] lg:gap-[20px] lg:px-0 xxl:mb-[150px] xxl:h-[84px] xxl:max-w-[896px] xxl:grid-cols-none xxl:gap-[24px]"
    >
      <!-- Кнопка фильтров (мобилка) -->
      <button
        class="col-span-2 flex h-[48px] w-full items-center justify-center rounded-[40px] border border-[var(--color-primary)] text-[var(--color-primary)] lg:hidden"
        type="button"
      >
        Filters
      </button>

      <!-- Фильтры -->
      <div class="hidden h-[100%] gap-[24px] lg:flex">
        <div
          class="relative flex w-[688px] items-center justify-between gap-[4px] rounded-[40px] border border-[var(--color-gray-20)] lg:h-[72px] xxl:h-[84px]"
        >
          <div
            *ngFor="let category of filterCategories; let i = index"
            class="relative flex transition-colors duration-300 h-full flex-1 cursor-pointer flex-col items-center justify-center gap-[4px] whitespace-nowrap rounded-[40px] text-center hover:bg-[var(--color-white)]"
            [ngClass]="{
              'bg-[var(--color-white)] shadow-sm':
                selectedOptions[category.key],
              'font-semibold text-[var(--color-primary)]':
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

            <!-- Dropdown -->
            <ul
              *ngIf="openedDropdownIndex === i"
              @slideDownAnimation
              class="absolute left-0 top-full z-50 mt-2 w-max rounded-[40px] bg-[var(--color-white)] p-2"
            >
              <li
                *ngFor="let option of category.options"
                class="flex cursor-pointer gap-[12px] rounded-[40px] p-2 hover:bg-[var(--color-bg)]"
                (click)="
                  selectOption(category.key, option.label);
                  $event.stopPropagation()
                "
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

      <!-- Кнопка поиска -->
      <button
        class="button-bg-blue col-span-2 flex h-[48px] w-full  gap-3
        lg:h-[72px] lg:w-[168px] xxl:h-[84px] xxl:w-[184px]"
        type="button"
        (click)="applyFilters()"
      >
        <img
          src="./icons/search-white.svg"
          alt="search-button"
          class="h-[24px] w-[24px]"
        />
        <span class="button-font">Search</span>
      </button>
    </div>
  `,
})
export class FilterBarComponent implements OnDestroy {
  filterCategories = FILTER_CATEGORIES;
  openedDropdownIndex: number | null = null;
  selectedOptions: Record<string, string> = {};

  private globalClickUnlistener: () => void;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    this.globalClickUnlistener = this.renderer.listen(
      'document',
      'click',
      this.onDocumentClick.bind(this),
    );
  }

  ngOnDestroy() {
    if (this.globalClickUnlistener) {
      this.globalClickUnlistener();
    }
  }

  toggleDropdown(index: number) {
    this.openedDropdownIndex =
      this.openedDropdownIndex === index ? null : index;
  }

  handleMouseEnter(index: number) {
    if (
      this.openedDropdownIndex !== null &&
      this.openedDropdownIndex !== index
    ) {
      this.openedDropdownIndex = index;
    }
  }

  selectOption(categoryKey: string, label: string) {
    this.selectedOptions[categoryKey] = label;
    this.openedDropdownIndex = null;
  }

  applyFilters() {
    const queryParams: Record<string, string[]> = {};

    for (const category of this.filterCategories) {
      const key = category.key;
      const selectedLabel = this.selectedOptions[key];

      if (selectedLabel) {
        const matched = category.options.find(
          (opt) => opt.label === selectedLabel,
        );
        if (matched) {
          queryParams[key] = [matched.key];
        }
      }
    }

    this.router.navigate(['/catalog'], { queryParams });
  }

  private onDocumentClick(event: MouseEvent) {
    const clickInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickInside) {
      this.openedDropdownIndex = null;
    }
  }
}
