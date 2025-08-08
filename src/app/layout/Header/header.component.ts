import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { FILTER_CATEGORIES } from '../../core/constants/catalog-filter.config';
import { slideDownAnimation } from '../../../styles/animations/animations';

import { UiStateService } from '../../state/ui/ui-state.service';
import { AuthStateService } from '../../state/auth/auth-state.service';

import { SearchSectionComponent } from './components/search-section.component';
import { CityDropdownComponent } from './components/city-dropdown.component';
import { LanguageDropdownComponent } from './components/language-dropdown.component';
import { UserMenuComponent } from './components/user-menu.component';
import { MobileMenuComponent } from './components/mobile-menu.component';

import { IconComponent } from '../../shared/components/icon.component';
import { LogoComponent } from '../../shared/components/logo.component';
import { ThemedIconPipe } from '../../core/pipes/themed-icon.pipe';
import { BadgeImagePipe } from '../../core/pipes/badge-image.pipe';

import { TranslateModule } from '@ngx-translate/core';

import { ICONS } from '../../core/constants/icons.constant';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { AuthApiService } from '../../core/services/auth-api.service';

import { Theme } from '../../core/models/theme.type';
import { AuthUser } from '../../core/models/user.model';
import { BadgeType, calculateBadgeType } from '../../core/utils/badge-utils';
import { getUnlockedAchievements } from '../../core/utils/achievement.utils';
import { ACHIEVEMENTS } from '../../core/constants/achievements';

@Component({
  selector: 'app-header',
  standalone: true,
  animations: [slideDownAnimation],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    SearchSectionComponent,
    CityDropdownComponent,
    LanguageDropdownComponent,
    UserMenuComponent,
    MobileMenuComponent,
    IconComponent,
    LogoComponent,
    ThemedIconPipe,
    BadgeImagePipe,
  ],

  template: `
    <!--
  HEADER COMPONENT
  Description: Main header bar containing navigation, theme switcher, user menu, and search (for large screens).
  Responsive: Adapts for mobile and desktop.
-->

    <header
      class="relative z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px] lg:h-[72px] xxl:h-[80px] xxl:px-0"
    >
      <!-- Left section: Logo and mobile menu toggle -->
      <div class="flex items-center gap-[8px]">
        <!-- Mobile menu button (visible on small screens) -->
        <button class="lg:hidden" (click)="uiState.toggleMobileMenu()">
          <app-icon [icon]="ICONS.Menu" />
        </button>

        <!-- App logo component -->
        <app-logo></app-logo>
      </div>

      <!-- Center section: Search bar (visible only on large screens) -->
      <div class="hidden flex-1 justify-center lg:flex">
        <app-search-section></app-search-section>
      </div>

      <!-- Right section: Nav, theme, user menu -->
      <div class="flex items-center gap-[24px] lg:gap-[20px] xxl:gap-[24px]">
        <!-- Desktop nav links and dropdowns -->
        <div class="hidden items-center lg:flex">
          <nav
            class="menu-text-font flex items-center gap-[24px] lg:gap-[20px] xxl:gap-[24px]"
          >
            <a routerLink="/catalog">{{ 'nav.catalog' | translate }}</a>

            <!-- City selection dropdown -->
            <app-city-dropdown
              [selectedKey]="cityKey"
              [selectedLabel]="cityLabel"
              [opened]="activeDropdown === 'city'"
              (toggle)="toggleDropdown('city')"
              (cityChange)="setCity($event)"
            ></app-city-dropdown>

            <!-- Language selection dropdown -->
            <app-language-dropdown
              [opened]="activeDropdown === 'lang'"
              (toggle)="toggleDropdown('lang')"
            ></app-language-dropdown>
          </nav>
        </div>

        <!-- Theme toggle: Light & Dark mode -->
        <div class="flex gap-1 p-1">
          <!-- Light theme button -->
          <button
            class="flex h-10 w-10 items-center justify-center rounded-full"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'bg-[var(--color-secondary)]'
                : 'hover:bg-[var(--color-gray-20)]',
            ]"
            (click)="setTheme('light')"
            (mouseenter)="isSunHovered = true"
            (mouseleave)="isSunHovered = false"
            [attr.aria-label]="'THEME.LIGHT' | translate"
          >
            <app-icon
              [icon]="
                (currentTheme$ | async) === 'dark'
                  ? isSunHovered
                    ? ICONS.Sun
                    : ICONS.SunDarkTheme
                  : ('Sun' | themedIcon)
              "
            />
          </button>

          <!-- Dark theme button -->
          <button
            class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--color-gray-20)]"
            [ngClass]="{
              'bg-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark',
            }"
            (click)="setTheme('dark')"
            [attr.aria-label]="'THEME.DARK' | translate"
          >
            <app-icon [icon]="ICONS.Moon" />
          </button>
        </div>

        <!-- Mobile user menu or login -->
        <ng-container *ngIf="screenIsMobile && activeDropdown !== 'menu'">
          <ng-container *ngIf="user; else mobileLogin">
            <div
              class="relative flex items-center justify-center"
              style="width: 38px; height: 38px;"
              (click)="toggleDropdown('userMenu')"
              (keydown.enter)="toggleDropdown('userMenu')"
              (keydown.space)="toggleDropdown('userMenu')"
              tabindex="0"
              role="button"
              aria-haspopup="true"
              [attr.aria-expanded]="activeDropdown === 'userMenu'"
            >
              <!-- Badge overlay -->
              <img
                *ngIf="userBadge | badgeImage as badgeImg"
                [src]="badgeImg"
                alt="badge"
                class="absolute left-1/2 top-1/2 z-0"
                style="width: 38px; height: 38px; transform: translate(-50%, -50%); object-fit: contain;"
              />

              <!-- Mobile user avatar -->
              <app-user-menu
                [userPhoto]="user.photoUrl"
                [opened]="activeDropdown === 'userMenu'"
                [avatarSize]="32"
                [badgeSize]="38"
                [hasBadge]="!!userBadge"

                (logout)="handleLogout()"
                class="relative z-10"
              ></app-user-menu>

              <!-- Добавляем выпадающее меню для мобилки -->
              <div
                *ngIf="activeDropdown === 'userMenu'"
                @slideDownAnimation
                class="absolute right-0 top-full z-[999] mt-2 w-auto origin-top rounded-[16px] border p-2"
                [ngClass]="{
                  'border-[var(--color-white)] bg-[var(--color-white)]':
                    (currentTheme$ | async) === 'light',
                  'border-[var(--color-white)] bg-[var(--color-bg-card)]':
                    (currentTheme$ | async) === 'dark',
                }"
                role="menu"
                aria-label="User menu"
                (click)="$event.stopPropagation()"
              >
                <a
                  routerLink="/profile"
                  class="block cursor-pointer rounded-[12px] px-4 py-2 transition-colors hover:bg-[var(--color-bg)]"
                  (click)="activeDropdown = null"
                  role="menuitem"
                  >Profile</a
                >
                <button
                  class="w-full cursor-pointer rounded-[12px] px-4 py-2 transition-colors hover:bg-[var(--color-bg)]"
                  (click)="handleLogout()"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          </ng-container>

          <!-- Mobile login button -->
          <ng-template #mobileLogin>
            <button
              (click)="navigateToAuth()"
              class="flex items-center lg:hidden"
            >
              <app-icon [icon]="ICONS.UserProfile" />
            </button>
          </ng-template>
        </ng-container>

        <!-- Desktop user menu or login -->
        <div class="hidden items-center gap-[30px] lg:flex">
          <ng-container *ngIf="user; else showLogin">
            <div
              class="relative h-[64px] w-[64px] overflow-visible"
            >
              <!-- Badge overlay -->
              <img
                *ngIf="userBadge | badgeImage as badgeImg"
                [src]="badgeImg"
                alt="badge"
                class="absolute left-1/2 top-1/2"
                style="width: 64px; height: 64px; transform: translate(-50%, -50%); object-fit: contain;"
              />

              <!-- Desktop user avatar -->
              <app-user-menu
                [userPhoto]="user.photoUrl"
                [opened]="activeDropdown === 'userMenu'"
                [avatarSize]="50"
                [badgeSize]="64"
                [hasBadge]="!!userBadge"
                (toggle)="toggleDropdown('userMenu')"
                (logout)="handleLogout()"
                [ngClass]="'absolute left-1/2 top-1/2'"
                style="transform: translate(-50%, -50%);"
              ></app-user-menu>

              <!-- Desktop dropdown menu -->
              <div
                *ngIf="activeDropdown === 'userMenu'"
                @slideDownAnimation
                class="absolute right-0 top-full z-[999] mt-2 w-auto origin-top rounded-[16px] border p-2"
                [ngClass]="{
                  'border-[var(--color-white)] bg-[var(--color-white)]':
                    (currentTheme$ | async) === 'light',
                  'border-[var(--color-white)] bg-[var(--color-bg-card)]':
                    (currentTheme$ | async) === 'dark',
                }"
                role="menu"
                aria-label="User menu"

                (click)="$event.stopPropagation()"
              >
                <a
                  routerLink="/profile"
                  class="block cursor-pointer rounded-[12px] px-4 py-2 transition-colors hover:bg-[var(--color-bg)]"
                  (click)="activeDropdown = null"
                  role="menuitem"
                >
                  Profile
                </a>
                <button
                  class="w-full cursor-pointer rounded-[12px] px-4 py-2 transition-colors hover:bg-[var(--color-bg)]"
                  (click)="handleLogout()"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          </ng-container>

          <!-- Desktop login button -->
          <ng-template #showLogin>
            <button class="flex items-center gap-1" (click)="navigateToAuth()">
              <span class="hidden lg:inline">{{
                'button.log_in' | translate
              }}</span>
              <app-icon [icon]="ICONS.UserProfile" />
            </button>
          </ng-template>
        </div>
      </div>
    </header>

    <!-- Mobile menu overlay -->
    <app-mobile-menu
      *ngIf="(uiState.mobileMenuOpen$ | async) && screenIsMobile"
      class="fixed inset-0 z-[999]"
      (closeMenu)="uiState.closeMobileMenu()"
      [cityLabel]="cityLabel"
      [language]="language"
      [user]="user"
      (dropdownToggle)="toggleDropdown($event)"
      (navigateToAuth)="navigateToAuth()"
      (logout)="handleLogout()"
      (cityChange)="setCity($event)"
      (toggle)="toggleDropdown('userMenu')"
    ></app-mobile-menu>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly ICONS = ICONS;

  // State
  cityKey: string | null = null;
  cityLabel = 'City';
  language: 'EN' | 'UK' = 'EN';
  activeDropdown: 'city' | 'lang' | 'menu' | 'userMenu' | null = null;
  user: AuthUser | null = null;
  userBadge: BadgeType | null = null;

  // Theme
  readonly currentTheme$: Observable<Theme>;
  isSunHovered = false;

  // UI
  screenIsMobile = false;
  avatarSize = 64;
  badgeSize = 64;

  // Subscriptions
  private subscriptions: Subscription[] = [];
  private readonly resizeListener = () => this.checkScreenWidth();

  private readonly locationOptions =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public uiState: UiStateService,
    private authService: AuthStateService,
    private themeService: ThemeService,
    public languageService: LanguageService,
    private authApiService: AuthApiService,
    private elementRef: ElementRef
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /** Lifecycle: Init */
  ngOnInit(): void {
    this.setupUserSubscription();
    this.setupRouterEvents();
    this.checkScreenWidth();
    window.addEventListener('resize', this.resizeListener);
  }

  /** Lifecycle: Cleanup */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    window.removeEventListener('resize', this.resizeListener);
  }

  /** Subscribe to auth state and set user info */
  private setupUserSubscription(): void {
    const sub = this.authService.user$.subscribe((user) => {
      this.user = user;
      this.initializeCityFromUserOrQuery(user);

      if (user) {
        this.authApiService.getPublicUserProfile(user.userId).subscribe({
          next: (profile) => {
            const unlocked = getUnlockedAchievements(profile);
            this.userBadge = calculateBadgeType(unlocked, ACHIEVEMENTS);
          },
          error: (err) => {
            console.error('Failed to fetch profile for badge', err);
            this.userBadge = null;
          },
        });
      } else {
        this.userBadge = null;
      }
    });

    this.subscriptions.push(sub);
  }

  /** Close dropdowns on route change */
  private setupRouterEvents(): void {
    const sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.activeDropdown = null;
      }
    });
    this.subscriptions.push(sub);
  }

  /** Toggle dropdown open/close */
  // toggleDropdown(name: typeof this.activeDropdown): void {
  //   this.activeDropdown = this.activeDropdown === name ? null : name;
  // }
  toggleDropdown(name: typeof this.activeDropdown): void {
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }
  /** Set selected city and update URL */
  setCity(key: string): void {
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

  /** Set language preference (user or guest) */
  setLanguage(lang: 'EN' | 'UK'): void {
    if (this.user) {
      this.authService.updateUserLanguage(lang).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.language = lang;
        },
        error: () => (this.language = lang),
      });
    } else {
      this.language = lang;
    }
  }

  /** Set theme */
  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  /** Close all dropdowns */
  closeDropdowns(): void {
    this.activeDropdown = null;
  }

  /** Navigate to auth page */
  navigateToAuth(): void {
    this.router.navigate(['/auth']);
  }

  /** Handle user logout */
  handleLogout(): void {
    this.authService.logout();
    this.activeDropdown = null;
    this.router.navigate(['/']);
  }

  /** Determine city from user default or URL */
  private initializeCityFromUserOrQuery(user: AuthUser | null): void {
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

    const sub = this.route.queryParams.subscribe((params) => {
      const loc = params['location'];
      const found = this.locationOptions.find((opt) => opt.key === loc);
      this.cityKey = found?.key ?? null;
      this.cityLabel = found?.label ?? 'City';
    });

    this.subscriptions.push(sub);
  }

  /** Adjust layout and avatar size based on screen width */
  checkScreenWidth(): void {
    this.screenIsMobile = window.innerWidth < 1024;
    this.avatarSize = this.screenIsMobile ? 50 : 64;
    this.badgeSize = this.screenIsMobile ? 50 : 64;
  }

  /** Triggered on search */
  onSearch(): void {
    this.closeDropdowns();
  }

  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  // Проверяем, что dropdown открыт и клик был вне компонента
  if (
    this.activeDropdown === 'userMenu' &&
    !this.elementRef.nativeElement.contains(event.target)
  ) {
    this.activeDropdown = null;
  }
}
}
