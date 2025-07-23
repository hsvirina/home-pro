import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
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

import { AuthService } from '../../services/auth.service';
import { PlacesService } from '../../services/places.service';
import { FILTER_CATEGORIES } from '../../models/catalog-filter.config';
import { User } from '../../models/user.model';

import { slideDownAnimation } from '../../../styles/animations';

import { SearchSectionComponent } from './components/search-section.component';
import { CityDropdownComponent } from './components/city-dropdown.component';
import { LanguageDropdownComponent } from './components/language-dropdown.component';
import { UserMenuComponent } from './components/user-menu.component';
import { MobileMenuComponent } from './components/mobile-menu.component';

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
  ],
  animations: [slideDownAnimation],
  template: `
    <!-- Шапка сайта -->
    <header
      class="relative z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px] lg:h-[72px] lg:px-[40px] xxl:h-[80px] xxl:px-0"
    >
      <!-- Логотип и кнопка меню для мобильных -->
      <div class="flex items-center gap-[8px]">
        <button class="lg:hidden" (click)="toggleDropdown('menu')">
          <img src="/icons/menu.png" alt="menu" class="h-6 w-6" />
        </button>
        <a routerLink="/">
          <img
            src="./logo.svg"
            alt="beanly"
            class="shadow-hover h-[24px] w-[93px] object-contain lg:h-[28px] lg:w-[130px] xxl:h-[32px] xxl:w-[165px]"
          />
        </a>
      </div>

      <!-- Поиск (только на больших экранах) -->
      <div class="hidden flex-1 justify-center lg:flex">
        <app-search-section></app-search-section>
      </div>

      <!-- Навигация и пользователь -->
      <div class="flex items-center gap-[30px]">
        <!-- Основное меню -->
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
              [opened]="isCityDropdown"
              (toggle)="toggleDropdown('city')"
              (cityChange)="setCity($event)"
            ></app-city-dropdown>
            <app-language-dropdown
              [selectedLanguage]="language"
              [opened]="isLangDropdown"
              (toggle)="toggleDropdown('lang')"
              (close)="toggleDropdown('lang')"
              (languageChange)="setLanguage($event)"
            ></app-language-dropdown>
          </nav>
        </div>

        <!-- Иконка профиля в мобильной версии -->
        <button
          *ngIf="screenIsMobile && activeDropdown !== 'menu'"
          (click)="navigateToAuth()"
          class="flex items-center lg:hidden"
        >
          <img
            src="/icons/user-profile.svg"
            alt="user-profile"
            class="h-6 w-6"
          />
        </button>

        <!-- Пользователь (на больших экранах) -->
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
              <img
                src="/icons/user-profile.svg"
                alt="user-profile"
                class="h-6 w-6"
              />
            </button>
          </ng-template>
        </div>
      </div>
    </header>

    <!-- Мобильное меню -->
    <app-mobile-menu
      *ngIf="screenIsMobile && activeDropdown === 'menu'"
      [cityLabel]="cityLabel"
      [language]="language"
      [user]="user"
      (toggleDropdown)="toggleDropdown($event)"
      (closeMenu)="toggleDropdown('menu')"
      (navigateToAuth)="navigateToAuth()"
      (logout)="handleLogout()"
      (cityChange)="setCity($event)"
    ></app-mobile-menu>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  // === Состояние ===
  cityKey: string | null = null;
  cityLabel = 'City';
  language: 'ENG' | 'UKR' = 'ENG';
  activeDropdown: 'city' | 'lang' | 'menu' | 'userMenu' | null = null;
  user: User | null = null;
  screenIsMobile = false;

  private userSub?: Subscription;
  private queryParamsSub?: Subscription;
  private routerEventsSub?: Subscription;

  locationOptions =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private authService: AuthService,
    private placesService: PlacesService,
    private cdr: ChangeDetectorRef,
  ) {}

  get isCityDropdown(): boolean {
    return this.activeDropdown === 'city';
  }

  get isLangDropdown(): boolean {
    return this.activeDropdown === 'lang';
  }

  ngOnInit() {
    // Получаем пользователя
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

      // Устанавливаем город из URL-параметра, если не найден в профиле
      this.setCityFromQueryParams();
    });

    // Определяем, мобильный ли экран
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth);

    // Закрытие дропдаунов при навигации
    this.routerEventsSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.activeDropdown = null;
        document.body.classList.remove('overflow-hidden');
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
    this.queryParamsSub?.unsubscribe();
    this.routerEventsSub?.unsubscribe();
    window.removeEventListener('resize', this.checkScreenWidth);
    document.body.classList.remove('overflow-hidden');
  }

  /**
   * Получает город из query параметров
   */
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

  /**
   * Переключает открытие выпадающих меню
   */
  toggleDropdown(name: typeof this.activeDropdown) {
    const isOpening = this.activeDropdown !== name;
    this.activeDropdown = isOpening ? name : null;

    if (this.screenIsMobile && name === 'menu') {
      document.body.classList.toggle('overflow-hidden', isOpening);
    }
  }

  /**
   * Устанавливает выбранный город и обновляет URL
   */
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

  /**
   * Устанавливает язык интерфейса
   */
  setLanguage(lang: 'ENG' | 'UKR') {
    if (this.user) {
      this.authService.updateUserLanguage(lang).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.authService.setUser(updatedUser);
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

  /**
   * Проверяет, является ли экран мобильным
   */
  checkScreenWidth = () => {
    this.screenIsMobile = window.innerWidth < 1024;
  };

  /**
   * Навигация к странице логина
   */
  navigateToAuth() {
    this.router.navigate(['/auth']);
  }

  /**
   * Выход из аккаунта
   */
  handleLogout() {
    this.authService.logout();
    this.activeDropdown = null;
    this.router.navigate(['/']);
  }

  /**
   * Закрытие выпадающих меню при клике вне компонента
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.activeDropdown = null;
    }
  }
}
