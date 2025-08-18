import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-page-size-dropdown',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="custom-dropdown relative flex items-center gap-2">
      <!-- Label for dropdown -->
      <span>{{ 'catalog_page.show_label' | translate }}</span>

      <!-- Dropdown toggle button -->
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Dropdown menu with size options -->
      <div
        *ngIf="dropdownOpen"
        class="absolute right-0 top-[110%] z-20 w-[80px] rounded-[16px] border p-2 bg-white dark:bg-gray-800 border-gray-300"
      >
        <div
          *ngFor="let option of sizeOptions"
          (click)="selectOption(option.value)"
          class="cursor-pointer rounded px-2 py-1 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          [class.font-bold]="option.value === selectedValue"
        >
          <!-- Translate option label -->
          {{
            'catalog_page.items_per_page.' +
              (option.label === 'all' ? 'all' : option.label) | translate
          }}
        </div>
      </div>
    </div>
  `,
})
export class PageSizeDropdownComponent {
  /** Currently selected page size */
  @Input() selectedValue!: number;

  /** Emits when selected page size changes */
  @Output() selectedValueChange = new EventEmitter<number>();

  /** Controls the visibility of the dropdown menu */
  dropdownOpen = false;

  /** List of available page size options */
  sizeOptions = [
    { label: '6', value: 6 },
    { label: '12', value: 12 },
    { label: 'all', value: -1 },
  ];

  constructor(private translate: TranslateService) {}

  /** Toggle the dropdown open/close state */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Emits selected option value and closes the dropdown
   * @param value - Selected page size
   */
  selectOption(value: number) {
    this.selectedValueChange.emit(value);
    this.dropdownOpen = false;
  }

  /**
   * Returns the translated label of the currently selected page size
   * Uses ngx-translate to get the localized string
   */
  getSelectedLabel(): string {
    const selected = this.sizeOptions.find((opt) => opt.value === this.selectedValue);
    if (!selected) return 'Select';
    switch (selected.label) {
      case 'all':
        return this.translate.instant('catalog_page.items_per_page.all');
      case '6':
        return this.translate.instant('catalog_page.items_per_page.6');
      case '12':
        return this.translate.instant('catalog_page.items_per_page.12');
      default:
        return selected.label;
    }
  }
}
