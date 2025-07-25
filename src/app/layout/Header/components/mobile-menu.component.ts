import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { User } from '../../../core/models/user.model';
import { FILTER_CATEGORIES } from '../../../core/constants/catalog-filter.config';
import { SearchSectionComponent } from '../../../layout/Header/components/search-section.component';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { LogoComponent } from '../../../shared/components/logo.component';

type DropdownType = 'city' | 'lang' | null;
type Language = 'ENG' | 'UKR';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchSectionComponent,
    ClickOutsideDirective,
    IconComponent,
    LogoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop overlay -->
    <div
      class="bg-[var(--color-bg)]/70 fixed inset-0 z-40 backdrop-blur-3xl"
      (click)="closeMenu.emit()"
    ></div>

    <!-- Modal menu container -->
    <div
      class="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]"
      appClickOutside
      (appClickOutside)="closeDropdowns()"
    >
      <!-- Top bar with logo and close button -->
      <div
        class="fixed left-0 right-0 top-0 z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px]"
      >
        <button
          (click)="goHome()"
          class="m-0 border-none bg-transparent p-0"
          aria-label="Go to home"
        >
          <app-logo></app-logo>
        </button>
        <button (click)="closeMenu.emit()" aria-label="Close menu">
          <app-icon [icon]="ICONS.Close" />
        </button>
      </div>

      <!-- Menu content area with vertical scrolling -->
      <div class="mt-[48px] flex flex-1 flex-col overflow-y-auto px-[20px]">
        <!-- Search section -->
        <div class="mb-[48px] mt-[40px] px-[4px]">
          <app-search-section></app-search-section>
        </div>

        <!-- Navigation links and dropdowns -->
        <nav
          class="menu-text-font flex flex-col gap-6"
          aria-label="Mobile menu navigation"
        >
          <a
            routerLink="/catalog"
            class="text-lg text-[var(--color-gray-100)]"
            (click)="closeMenu.emit()"
          >
            <h5>Catalog</h5>
          </a>

          <!-- City dropdown -->
          <div class="relative">
            <button
              type="button"
              (click)="toggleDropdown('city')"
              class="flex cursor-pointer items-center gap-2"
              [attr.aria-expanded]="activeDropdown === 'city'"
              aria-haspopup="listbox"
            >
              {{ cityLabel }}
              <app-icon
                [icon]="ICONS.ChevronDown"
                [ngClass]="{ 'rotate-180': activeDropdown === 'city' }"
              />
            </button>

            <ul
              *ngIf="activeDropdown === 'city'"
              class="absolute left-0 top-full z-50 mt-2 flex w-full flex-col gap-[12px] rounded-[8px] bg-[var(--color-white)] p-2 shadow-lg"
              role="listbox"
            >
              <li
                *ngFor="let loc of locationOptions"
                (click)="selectCity(loc.key)"
                class="cursor-pointer rounded-[8px] px-2 py-1 hover:bg-[var(--color-bg)]"
                role="option"
                tabindex="0"
                (keydown.enter)="selectCity(loc.key)"
                (keydown.space)="selectCity(loc.key)"
              >
                {{ loc.label }}
              </li>
            </ul>
          </div>

          <!-- Language dropdown -->
          <div class="relative">
            <button
              type="button"
              (click)="toggleDropdown('lang')"
              class="flex cursor-pointer items-center gap-2"
              [attr.aria-expanded]="activeDropdown === 'lang'"
              aria-haspopup="listbox"
            >
              {{ language }}
              <app-icon
                [icon]="ICONS.ChevronDown"
                [ngClass]="{ 'rotate-180': activeDropdown === 'lang' }"
              />
            </button>

            <ul
              *ngIf="activeDropdown === 'lang'"
              class="absolute left-0 top-full z-50 mt-2 flex w-full flex-col gap-[12px] rounded-[8px] bg-[var(--color-white)] p-2 shadow-lg"
              role="listbox"
            >
              <li
                *ngFor="let langOption of languages"
                (click)="selectLanguage(langOption)"
                class="cursor-pointer rounded-[8px] px-2 py-1 hover:bg-[var(--color-bg)]"
                role="option"
                tabindex="0"
                (keydown.enter)="selectLanguage(langOption)"
                (keydown.space)="selectLanguage(langOption)"
              >
                {{ langOption }}
              </li>
            </ul>
          </div>
        </nav>

        <!-- Login / Logout buttons -->
        <div class="mb-[35px] mt-auto">
          <ng-container *ngIf="user; else loginTemplate">
            <button
              (click)="logout.emit()"
              class="text-left text-[var(--color-gray-100)]"
              aria-label="Logout"
            >
              <h5>Logout</h5>
            </button>
          </ng-container>
          <ng-template #loginTemplate>
            <button
              (click)="navigateToAuth.emit()"
              class="text-left text-[var(--color-gray-100)]"
              aria-label="Log in"
            >
              <h5>Log in</h5>
            </button>
          </ng-template>
        </div>
      </div>
    </div>
  `,
})
export class MobileMenuComponent {
  ICONS = ICONS;

  // Input properties from parent
  @Input() cityLabel = 'City';
  @Input() language: Language = 'ENG';
  @Input() user: User | null = null;

  // Output events to notify parent about user actions
  @Output() dropdownToggle = new EventEmitter<'city' | 'lang' | null>();
  @Output() closeMenu = new EventEmitter<void>();
  @Output() navigateToAuth = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() cityChange = new EventEmitter<string>();
  @Output() languageChange = new EventEmitter<Language>();

  // Tracks which dropdown is currently active (open)
  activeDropdown: DropdownType = null;

  // Location options fetched from config
  locationOptions =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  // Supported language options
  readonly languages: Language[] = ['ENG', 'UKR'];

  constructor(private router: Router) {}

  /** Navigate to home and close the menu */
  goHome(): void {
    this.router.navigate(['/']).then(() => this.closeMenu.emit());
  }

  /** Toggle dropdowns open/close state */
  toggleDropdown(name: DropdownType): void {
    this.activeDropdown = this.activeDropdown === name ? null : name;
    this.dropdownToggle.emit(this.activeDropdown);
  }
  /** Close all dropdowns */
  closeDropdowns(): void {
    this.activeDropdown = null;
  }

  /** Select a city from dropdown, emit event and close dropdown */
  selectCity(key: string): void {
    this.activeDropdown = null;
    this.cityChange.emit(key);
  }

  /** Select a language from dropdown, emit event and close dropdown */
  selectLanguage(lang: Language): void {
    this.activeDropdown = null;
    this.languageChange.emit(lang);
  }
}
