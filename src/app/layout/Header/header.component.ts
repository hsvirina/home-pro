import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, filter } from 'rxjs';

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
        <button class="lg:hidden" (click)="toggleDropdown('menu')">
          <app-icon [icon]="ICONS.Menu" />
        </button>
        <app-logo></app-logo>
      </div>

      <div class="hidden flex-1 justify-center lg:flex">
        <app-search-section></app-search-section>
      </div>

      <div class="flex items-center gap-[24px] lg:gap-[20px] xxl:gap-[24px]">
        <div class="hidden items-center lg:flex">
          <nav
            class="menu-text-font flex items-center gap-[24px] lg:gap-[20px] xxl:gap-[24px]"
          >
            <a routerLink="/catalog">{{ 'NAV.CATALOG' | translate }}</a>

            <app-city-dropdown
              [selectedKey]="cityKey"
              [selectedLabel]="cityLabel"
              [opened]="activeDropdown === 'city'"
              (toggle)="toggleDropdown('city')"
              (cityChange)="setCity($event)"
            ></app-city-dropdown>

            <app-language-dropdown
              [opened]="activeDropdown === 'lang'"
              (toggle)="toggleDropdown('lang')"
            ></app-language-dropdown>
          </nav>
        </div>

        <div class="flex gap-1 p-1">
          <!-- Кнопка: Светлая тема -->
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
                    : ICONS.SunDarkThema
                  : ('Sun' | themedIcon)
              "
            />
          </button>

          <!-- Кнопка: Тёмная тема (луна) -->
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

        <!-- mobile user button -->
        <ng-container *ngIf="screenIsMobile && activeDropdown !== 'menu'">
          <ng-container *ngIf="user; else mobileLogin">
            <div class="relative h-[64px] w-[64px]">
              <!-- Бейдж (больше и позади) -->
              <img
                *ngIf="userBadge | badgeImage as badgeImg"
                [src]="badgeImg"
                alt="badge"
                class="absolute left-1/2 top-1/2 z-0"
                style="width: 60px; height: 60px; transform: translate(-50%, -50%); object-fit: contain;"
              />

              <!-- Аватар (меньше и по центру) -->
              <div
                class="absolute left-1/2 top-1/2 z-10"
                style="width: 50px; height: 50px; transform: translate(-50%, -50%);"
              >
                <app-user-menu
                  [user]="user"
                  [opened]="activeDropdown === 'userMenu'"
                  (toggle)="toggleDropdown('userMenu')"
                  (logout)="handleLogout()"
                ></app-user-menu>
              </div>
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

        <div class="hidden items-center gap-[30px] lg:flex">
          <ng-container *ngIf="user; else showLogin">
            <div class="relative h-[64px] w-[64px]">
              <!-- Бейдж (больше и позади) -->
              <img
                *ngIf="userBadge | badgeImage as badgeImg"
                [src]="badgeImg"
                alt="badge"
                class="absolute left-1/2 top-1/2 z-0"
                style="width: 60px; height: 60px; transform: translate(-50%, -50%); object-fit: contain;"
              />

              <!-- Аватар (меньше и по центру) -->
              <div
                class="absolute left-1/2 top-1/2 z-10"
                style="width: 50px; height: 50px; transform: translate(-50%, -50%);"
              >
                <app-user-menu
                  [user]="user"
                  [opened]="activeDropdown === 'userMenu'"
                  (toggle)="toggleDropdown('userMenu')"
                  (logout)="handleLogout()"
                ></app-user-menu>
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

  private readonly locationOptions =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public uiState: UiStateService,
    private authService: AuthStateService,
    private themeService: ThemeService,
    public languageService: LanguageService,
    private authApiService: AuthApiService, // ← добавь
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.user$.subscribe((user) => {
        this.user = user;
        this.initializeCityFromUserOrQuery(user);
      }),
    );

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
    );

    this.checkScreenWidth();
    window.addEventListener('resize', this.resizeListener);
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    window.removeEventListener('resize', this.resizeListener);
  }

  toggleDropdown(name: typeof this.activeDropdown): void {
    const isOpening = this.activeDropdown !== name;
    this.activeDropdown = isOpening ? name : null;

    if (this.screenIsMobile && name === 'menu') {
      isOpening
        ? this.uiState.openMobileMenu()
        : this.uiState.closeMobileMenu();
    }
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
          // TODO: handle error properly
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

  private checkScreenWidth(): void {
    this.screenIsMobile = window.innerWidth < 1024;
  }
}
