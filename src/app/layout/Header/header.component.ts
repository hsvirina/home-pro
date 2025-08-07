import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterModule, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { FILTER_CATEGORIES } from '../../core/constants/catalog-filter.config';
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
import { LogoComponent } from '../../shared/components/logo.component';
import { ThemeService } from '../../core/services/theme.service';
import { Theme } from '../../core/models/theme.type';
import { ThemedIconPipe } from '../../core/pipes/themed-icon.pipe';
import { AuthUser } from '../../core/models/user.model';
import { LanguageService } from '../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeType, calculateBadgeType } from '../../core/utils/badge-utils';
import { BadgeImagePipe } from '../../core/pipes/badge-image.pipe';
import { AuthApiService } from '../../core/services/auth-api.service';
import { getUnlockedAchievements } from '../../core/utils/achievement.utils';
import { ACHIEVEMENTS } from '../../core/constants/achievements';

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
    LogoComponent,
    ThemedIconPipe,
    TranslateModule,
    BadgeImagePipe,
  ],
  animations: [slideDownAnimation],
  template: `
    <header
      appClickOutside
      (appClickOutside)="activeDropdown = null"
      class="relative z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px] lg:h-[72px] xxl:h-[80px] xxl:px-0"
    >
      <div class="flex items-center gap-[8px]">
        <!-- Кнопка для открытия меню на мобильных устройствах -->
        <button class="lg:hidden" (click)="uiState.toggleMobileMenu()">
          <app-icon [icon]="ICONS.Menu" />
        </button>
        <!-- Логотип компании -->
        <app-logo></app-logo>
      </div>

      <!-- Секция поиска, которая скрыта на мобильных устройствах -->
      <div class="hidden flex-1 justify-center lg:flex">
        <app-search-section></app-search-section>
      </div>

      <div class="flex items-center gap-[24px] lg:gap-[20px] xxl:gap-[24px]">
        <!-- Навигация с городом и языком (показывается только на десктопах) -->
        <div class="hidden items-center lg:flex">
          <nav
            class="menu-text-font flex items-center gap-[24px] lg:gap-[20px] xxl:gap-[24px]"
          >
            <a routerLink="/catalog">{{ 'NAV.CATALOG' | translate }}</a>

            <!-- Выпадающий список с городами -->
            <app-city-dropdown
              [selectedKey]="cityKey"
              [selectedLabel]="cityLabel"
              [opened]="activeDropdown === 'city'"
              (toggle)="toggleDropdown('city')"
              (cityChange)="setCity($event)"
            ></app-city-dropdown>

            <!-- Выпадающий список с языками -->
            <app-language-dropdown
              [opened]="activeDropdown === 'lang'"
              (toggle)="toggleDropdown('lang')"
            ></app-language-dropdown>
          </nav>
        </div>

        <div class="flex gap-1 p-1">
          <!-- Кнопка для переключения на светлую тему -->
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

          <!-- Кнопка для переключения на тёмную тему (луна) -->
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

        <!-- Кнопка пользователя для мобильной версии -->
        <ng-container *ngIf="screenIsMobile && activeDropdown !== 'menu'">
          <ng-container *ngIf="user; else mobileLogin">
            <div
              class="relative flex items-center justify-center"
              style="width: 38px; height: 38px;"
              (keydown.enter)="toggleDropdown('userMenu')"
              (keydown.space)="toggleDropdown('userMenu')"
              tabindex="0"
              role="button"
              aria-haspopup="true"
              [attr.aria-expanded]="activeDropdown === 'userMenu'"
            >
              <!-- бейдж -->
              <img
                *ngIf="userBadge | badgeImage as badgeImg"
                [src]="badgeImg"
                alt="badge"
                class="absolute left-1/2 top-1/2 z-0"
                style="width: 38px; height: 38px; transform: translate(-50%, -50%); object-fit: contain;"
              />
              <!-- аватар -->
              <app-user-menu
                [userPhoto]="user.photoUrl"
                [opened]="activeDropdown === 'userMenu'"
                [avatarSize]="32"
                [badgeSize]="38"
                [hasBadge]="!!userBadge"
                (toggle)="toggleDropdown('userMenu')"
                (logout)="handleLogout()"
                class="relative z-10"
              ></app-user-menu>
            </div>
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

        <!-- Для десктопной версии -->
        <div class="hidden items-center gap-[30px] lg:flex">
          <ng-container *ngIf="user; else showLogin">
            <div class="relative h-[64px] w-[64px] overflow-visible">
              <img
                *ngIf="userBadge | badgeImage as badgeImg"
                [src]="badgeImg"
                alt="badge"
                class="absolute left-1/2 top-1/2"
                style="width: 64px; height: 64px; transform: translate(-50%, -50%); object-fit: contain;"
              />

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

              <div
                *ngIf="activeDropdown === 'userMenu'"
                @slideDownAnimation
                class="absolute right-0 top-full z-[999] mt-2 w-auto origin-top rounded-[16px] border bg-[var(--color-white)] p-2 dark:bg-[var(--color-bg-card)]"
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

          <ng-template #showLogin>
            <button class="flex items-center gap-1" (click)="navigateToAuth()">
              <span class="hidden lg:inline">{{
                'BUTTON.LOG_IN' | translate
              }}</span>
              <app-icon [icon]="ICONS.UserProfile" />
            </button>
          </ng-template>
        </div>
      </div>
    </header>

    <!-- Мобильное меню -->
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

  cityKey: string | null = null;
  cityLabel = 'City';
  language: 'ENG' | 'UKR' = 'ENG';
  activeDropdown: 'city' | 'lang' | 'menu' | 'userMenu' | null = null;
  user: AuthUser | null = null;
  screenIsMobile = false;
  isSunHovered = false;

  readonly currentTheme$: Observable<Theme>;

  private subscriptions: Subscription[] = [];
  private readonly resizeListener = () => this.checkScreenWidth();

  userBadge: BadgeType | null = null;

  avatarSize: number = 64;
  badgeSize: number = 64;

  showMobileSearch = false;
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
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  // ngOnInit(): void {
  //   this.subscriptions.push(
  //     this.authService.user$.subscribe((user) => {
  //       this.user = user;
  //       this.initializeCityFromUserOrQuery(user);

  //       if (user) {
  //         this.authApiService.getPublicUserProfile(user.userId).subscribe({
  //           next: (profile) => {
  //             const unlocked = getUnlockedAchievements(profile);
  //             this.userBadge = calculateBadgeType(unlocked, ACHIEVEMENTS);
  //           },
  //           error: (err) => {
  //             console.error('Failed to fetch profile for badge', err);
  //             this.userBadge = null;
  //           },
  //         });
  //       } else {
  //         this.userBadge = null;
  //       }
  //     }),
  //   );

  //   this.checkScreenWidth();
  //   window.addEventListener('resize', this.resizeListener);
  // }

  ngOnInit(): void {
  this.subscriptions.push(
    this.authService.user$.subscribe((user) => {
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
    }),

    // Слушаем изменения маршрута
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.activeDropdown = null;  // Закрыть все дропдауны
      }
    })
  );
}

closeDropdowns(): void {
  // Это можно сделать через событие, или вызов родительского метода
  // Здесь предполагаем, что родительский компонент (например, Header) передает этот метод
  this.activeDropdown = null;  // Сбросить активный дропдаун в родительском компоненте
}

  onSearch(): void {
    this.closeDropdowns();  // Закрыть все дропдауны при поиске
    // Логика поиска
  }




  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    window.removeEventListener('resize', this.resizeListener);
  }

  // toggleDropdown(name: typeof this.activeDropdown): void {
  //   const isOpening = this.activeDropdown !== name;
  //   this.activeDropdown = isOpening ? name : null;
  // }

      toggleDropdown(name: typeof this.activeDropdown): void {
    const isOpening = this.activeDropdown !== name;
    this.activeDropdown = isOpening ? name : null;
  }

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

  setLanguage(lang: 'ENG' | 'UKR'): void {
    if (this.user) {
      this.authService.updateUserLanguage(lang).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.language = lang;
        },
        error: () => {
          this.language = lang;
        },
      });
    } else {
      this.language = lang;
    }
  }

  navigateToAuth(): void {
    this.router.navigate(['/auth']);
  }

  handleLogout(): void {
    this.authService.logout();
    this.activeDropdown = null;
    this.router.navigate(['/']);
  }

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

    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        const loc = params['location'];
        const found = this.locationOptions.find((opt) => opt.key === loc);
        this.cityKey = found?.key ?? null;
        this.cityLabel = found?.label ?? 'City';
      }),
    );
  }

  checkScreenWidth(): void {
    this.screenIsMobile = window.innerWidth < 1024;

    if (this.screenIsMobile) {
      this.avatarSize = 50;
      this.badgeSize = 50;
    } else {
      this.avatarSize = 64;
      this.badgeSize = 64;
    }
  }
}
