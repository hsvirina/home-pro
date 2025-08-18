import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { SearchSectionComponent } from '../../../layout/Header/components/search-section.component';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { IconComponent } from '../../../shared/components/icon.component';
import { LogoComponent } from '../../../shared/components/logo.component';
import { AuthUser } from '../../../core/models/user.model';
import { ICONS } from '../../../core/constants/icons.constant';
import { CityDropdownComponent } from '../../../layout/Header/components/city-dropdown.component';
import { LanguageDropdownComponent } from '../../../layout/Header/components/language-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SearchSectionComponent,
    ClickOutsideDirective,
    IconComponent,
    LogoComponent,
    CityDropdownComponent,
    LanguageDropdownComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop -->
    <div
      class="bg-[var(--color-bg)]/70 fixed inset-0 z-40 backdrop-blur-3xl"
      (click)="closeMenu.emit()"
    ></div>

    <!-- Modal menu -->
    <div
      class="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]"
      appClickOutside
      (appClickOutside)="closeDropdowns()"
    >
      <!-- Top bar -->
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

        <button
          (click)="closeMenu.emit()"
          class="flex h-10 w-10 items-center justify-center rounded-[40px] bg-[var(--color-white)]"
          aria-label="Close menu"
        >
          <app-icon [icon]="ICONS.Close" [width]="20" [height]="20" />
        </button>
      </div>

      <!-- Menu content -->
      <div class="mt-[48px] flex flex-1 flex-col overflow-y-auto px-[20px]">
        <!-- Search -->
        <div class="mb-[48px] mt-[40px] px-[4px]">
          <app-search-section [closeDropdowns]="closeMenu.emit.bind(closeMenu)"></app-search-section>
        </div>

        <!-- Nav and dropdowns -->
        <nav class="menu-text-font flex flex-col gap-6">
          <a routerLink="/catalog" (click)="closeMenu.emit()">
            <h5>{{ 'header.nav.catalog' | translate }}</h5>
          </a>

          <!-- City -->
          <app-city-dropdown
            [selectedKey]="cityKey"
            [selectedLabel]="cityLabel"
            [opened]="activeDropdown === 'city'"
            (toggle)="toggleDropdown('city')"
            (cityChange)="selectCity($event)"
          ></app-city-dropdown>

          <!-- Language -->
          <app-language-dropdown
            [opened]="activeDropdown === 'lang'"
            (toggle)="toggleDropdown('lang')"
          ></app-language-dropdown>
        </nav>

        <!-- Auth buttons -->
        <div class="mb-[35px] mt-auto">
          <ng-container *ngIf="user; else loginTemplate">
            <button
              (click)="logout.emit()"
              class="text-left text-[var(--color-gray-100)]"
              aria-label="Logout"
            >
              <h5>{{ 'header.users_menu.logout' | translate }}</h5>
            </button>
          </ng-container>
          <ng-template #loginTemplate>
            <button
              (click)="navigateToAuth.emit()"
              class="text-left"
              aria-label="Log in"
            >
              <h5>{{ 'catalog_page.login_modal.login_button' | translate }}</h5>
            </button>
          </ng-template>
        </div>
      </div>
    </div>
  `,
})
export class MobileMenuComponent {
  readonly ICONS = ICONS;

  // Inputs
  @Input() cityKey: string | null = null;
  @Input() cityLabel = 'City';
  @Input() language: 'EN' | 'UK' = 'EN';
  @Input() user: AuthUser | null = null;

  // Outputs
  @Output() closeMenu = new EventEmitter<void>();
  @Output() dropdownToggle = new EventEmitter<'city' | 'lang' | null>();
  @Output() navigateToAuth = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() cityChange = new EventEmitter<string>();
  @Output() languageChange = new EventEmitter<'EN' | 'UK'>();

  // Dropdown state
  activeDropdown: 'city' | 'lang' | null = null;

  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']).then(() => this.closeMenu.emit());
  }

  toggleDropdown(name: 'city' | 'lang'): void {
    this.activeDropdown = this.activeDropdown === name ? null : name;
    this.dropdownToggle.emit(this.activeDropdown);
  }

  closeDropdowns(): void {
    this.activeDropdown = null;
  }

  selectCity(key: string): void {
    this.activeDropdown = null;
    this.cityChange.emit(key);
     this.closeMenu.emit();
  }
}
