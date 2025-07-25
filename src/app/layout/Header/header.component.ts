import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { FILTER_CATEGORIES } from '../../core/models/catalog-filter.config';
import { User } from '../../core/models/user.model';

import { slideDownAnimation } from '../../../styles/animations/animations';

import { UiStateService } from '../../state/ui/ui-state.service';
import { AuthStateService } from '../../state/auth/auth-state.service';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { SearchSectionComponent } from './components/search-section.component';
import { CityDropdownComponent } from './components/city-dropdown.component';
import { LanguageDropdownComponent } from './components/language-dropdown.component';
import { UserMenuComponent } from './components/user-menu.component';
import { MobileMenuComponent } from './components/mobile-menu.component';
import { ICONS } from '../../core/constants/icons.constant';
import { IconComponent } from '../../shared/components/icon.component';
import { LogoComponent } from "../../shared/components/logo.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    SearchSectionComponent,
    CityDropdownComponent,
    LanguageDropdownComponent,
    UserMenuComponent,
    MobileMenuComponent,
    ClickOutsideDirective,
    IconComponent,
    LogoComponent
],
  animations: [slideDownAnimation],
  template: `
    <header
      appClickOutside
      (appClickOutside)="activeDropdown = null"
      class="relative z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px] lg:h-[72px] lg:px-[40px] xxl:h-[80px] xxl:px-0"
    >
      <div class="flex items-center gap-[8px]">
        <button class="lg:hidden" (click)="toggleDropdown('menu')">
          <app-icon [icon]="ICONS.Menu" />
        </button>
        <app-logo></app-logo>
      </div>

      <div class="hidden flex-1 justify-center lg:flex">
        <app-search-section></app-search-section>
      </div>

      <div class="flex items-center gap-[30px]">
        <div class="hidden items-center gap-[30px] lg:flex">
          <nav class="menu-text-font flex items-center gap-[30px]">
            <a
              routerLink="/catalog"
              class="shadow-hover text-[var(--color-gray-100)]"
              >Catalog</a
            >
            <app-city-dropdown
              [selectedKey]="cityKey"
              [selectedLabel]="cityLabel"
              [opened]="activeDropdown === 'city'"
              (toggle)="toggleDropdown('city')"
              (cityChange)="setCity($event)"
            ></app-city-dropdown>
            <app-language-dropdown
              [selectedLanguage]="language"
              [opened]="activeDropdown === 'lang'"
              (toggle)="toggleDropdown('lang')"
              (close)="toggleDropdown('lang')"
              (languageChange)="setLanguage($event)"
            ></app-language-dropdown>
          </nav>
        </div>

        <!-- mobile user button -->
        <ng-container *ngIf="screenIsMobile && activeDropdown !== 'menu'">
          <ng-container *ngIf="user; else mobileLogin">
            <app-user-menu
              [user]="user"
              [opened]="activeDropdown === 'userMenu'"
              (toggle)="toggleDropdown('userMenu')"
              (logout)="handleLogout()"
              (close)="toggleDropdown(null)"
            ></app-user-menu>
          </ng-container>
          <ng-template #mobileLogin>
            <button
              (click)="navigateToAuth()"
              class="flex items-center lg:hidden"
            >
              <app-icon [icon]="ICONS.UserProfile" />
            </button>
          </ng-template>
        </ng-container>

        <div class="hidden items-center gap-[30px] lg:flex">
          <ng-container *ngIf="user; else showLogin">
            <app-user-menu
              [user]="user"
              [opened]="activeDropdown === 'userMenu'"
              (toggle)="toggleDropdown('userMenu')"
              (logout)="handleLogout()"
            ></app-user-menu>
          </ng-container>
          <ng-template #showLogin>
            <button
              class="shadow-hover flex items-center gap-1"
              (click)="navigateToAuth()"
            >
              <span class="hidden lg:inline">Log in</span>
              <app-icon [icon]="ICONS.UserProfile" />
            </button>
          </ng-template>
        </div>
      </div>
    </header>

    <app-mobile-menu
      *ngIf="(uiState.mobileMenuOpen$ | async) && screenIsMobile"
      class="fixed inset-0 z-[999]"
      (closeMenu)="uiState.closeMobileMenu()"
      [cityLabel]="cityLabel"
      [language]="language"
      [user]="user"
      (toggleDropdown)="toggleDropdown($event)"
      (navigateToAuth)="navigateToAuth()"
      (logout)="handleLogout()"
      (cityChange)="setCity($event)"
    ></app-mobile-menu>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  ICONS = ICONS;
  cityKey: string | null = null;
  cityLabel = 'City';
  language: 'ENG' | 'UKR' = 'ENG';
  activeDropdown: 'city' | 'lang' | 'menu' | 'userMenu' | null = null;
  user: User | null = null;
  screenIsMobile = false;

  private userSub?: Subscription;
  private queryParamsSub?: Subscription;
  private routerEventsSub?: Subscription;

  // Чтобы корректно удалять слушатель resize
  private resizeListener = () => this.checkScreenWidth();

  locationOptions =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public uiState: UiStateService,
    private authService: AuthStateService,
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe((user) => {
      this.user = user;

      if (user?.defaultCity) {
        const found = this.locationOptions.find(
          (opt) => opt.key.toLowerCase() === user.defaultCity.toLowerCase(),
        );
        if (found) {
          this.cityKey = found.key;
          this.cityLabel = found.label;
          return;
        }
      }

      this.setCityFromQueryParams();
    });

    this.checkScreenWidth();
    window.addEventListener('resize', this.resizeListener);

    this.routerEventsSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.activeDropdown = null;
        this.uiState.closeMobileMenu();
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
    this.queryParamsSub?.unsubscribe();
    this.routerEventsSub?.unsubscribe();
    window.removeEventListener('resize', this.resizeListener);
  }

  setCityFromQueryParams() {
    this.queryParamsSub?.unsubscribe();
    this.queryParamsSub = this.route.queryParams.subscribe((params) => {
      const loc = params['location'];
      const found = this.locationOptions.find((opt) => opt.key === loc);
      if (found) {
        this.cityKey = found.key;
        this.cityLabel = found.label;
      } else {
        this.cityKey = null;
        this.cityLabel = 'City';
      }
    });
  }

  toggleDropdown(name: typeof this.activeDropdown) {
    const isOpening = this.activeDropdown !== name;
    this.activeDropdown = isOpening ? name : null;

    if (this.screenIsMobile && name === 'menu') {
      if (isOpening) {
        this.uiState.openMobileMenu();
      } else {
        this.uiState.closeMobileMenu();
      }
    }
  }

  setCity(key: string) {
    const found = this.locationOptions.find((opt) => opt.key === key);
    if (!found) return;

    this.cityKey = found.key;
    this.cityLabel = found.label;

    this.router
      .navigate(['/catalog'], {
        queryParams: { location: this.cityKey },
        queryParamsHandling: 'merge',
      })
      .then(() => (this.activeDropdown = null));
  }

  setLanguage(lang: 'ENG' | 'UKR') {
    if (this.user) {
      this.authService.updateUserLanguage(lang).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.language = lang;
        },
        error: (err) => {
          console.error('Ошибка при обновлении языка', err);
          this.language = lang;
        },
      });
    } else {
      this.language = lang;
    }
  }

  checkScreenWidth() {
    this.screenIsMobile = window.innerWidth < 1024;
  }

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }

  handleLogout() {
    this.authService.logout();
    this.activeDropdown = null;
    this.router.navigate(['/']);
  }
}
