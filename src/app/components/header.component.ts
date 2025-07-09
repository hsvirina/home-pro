import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

type User = {
  id: string;
  fullName: string;
  email: string;
  photoUrl: string;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <!-- Основная шапка -->
    <header
      class="relative z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px] lg:h-[72px] lg:px-[40px] xxl:h-[80px] xxl:px-0"
    >
      <!-- Левый блок -->
      <div class="flex items-center gap-[8px]">
        <button class="lg:hidden" (click)="toggleDropdown('menu')">
          <img src="/icons/menu.png" alt="menu" class="h-6 w-6" />
        </button>
        <a routerLink="/">
          <img
            src="./logo.svg"
            alt="beanly"
            class="h-[24px] w-[93px] object-contain lg:h-[28px] lg:w-[130px] xxl:h-[32px] xxl:w-[165px]"
          />
        </a>
      </div>

      <!-- Центр: Поиск -->
      <div class="hidden flex-1 justify-center lg:flex">
        <div
          class="relative flex h-[48px] w-full items-center gap-[8px] rounded-[40px] border border-[var(--color-gray-20)] px-[24px] py-[12px] lg:max-w-[300px] xxl:max-w-[500px]"
        >
          <img src="/icons/search-dark.svg" alt="Search" class="h-6 w-6" />
          <input
            type="text"
            placeholder="Search cafés or areas…"
            class="body-font-1 w-full border-none bg-transparent focus:outline-none"
          />
        </div>
      </div>

      <!-- Правый блок -->
      <div class="flex items-center gap-[30px]">
        <!-- Навигация (только десктоп) -->
        <div class="hidden items-center gap-[30px] lg:flex">
          <nav class="menu-text-font flex items-center gap-[30px]">
            <a
              routerLink="/catalog"
              routerLinkActive="underline"
              class="text-[var(--color-gray-100)]"
              >Catalog</a
            >
            <div class="relative" (click)="toggleDropdown('city')">
              <div class="flex cursor-pointer items-center gap-1">
                {{ city }}
                <img src="/icons/chevron-down.svg" class="h-6 w-6" />
              </div>
              <div *ngIf="activeDropdown === 'city'" class="dropdown">
                <div (click)="setCity('Kyiv')">Kyiv</div>
                <div (click)="setCity('Lviv')">Lviv</div>
              </div>
            </div>
            <div class="relative" (click)="toggleDropdown('lang')">
              <div class="flex cursor-pointer items-center gap-1">
                {{ language }}
                <img src="/icons/chevron-down.svg" class="h-6 w-6" />
              </div>
              <div *ngIf="activeDropdown === 'lang'" class="dropdown">
                <div (click)="setLanguage('ENG')">ENG</div>
                <div (click)="setLanguage('UKR')">UKR</div>
              </div>
            </div>
          </nav>
        </div>

        <!-- Мобильная иконка логина -->
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

        <!-- Аватар/логин (десктоп) -->
        <div class="hidden items-center gap-[30px] lg:flex">
          <ng-container *ngIf="user; else showLogin">
            <div class="relative">
              <button (click)="toggleDropdown('userMenu')">
                <img
                  [src]="user.photoUrl"
                  alt="avatar"
                  class="h-8 w-8 rounded-full"
                />
              </button>
              <div
                *ngIf="activeDropdown === 'userMenu'"
                class="absolute right-0 mt-2 w-40 rounded bg-white shadow-md"
              >
                <a
                  routerLink="/profile"
                  class="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </a>
                <button
                  (click)="handleLogout()"
                  class="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </ng-container>
          <ng-template #showLogin>
            <button class="flex items-center gap-1" (click)="navigateToAuth()">
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
    <div
      *ngIf="screenIsMobile && activeDropdown === 'menu'"
      class="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]"
    >
      <!-- Фиксированная шапка -->
      <div
        class="fixed left-0 right-0 top-0 z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px]"
      >
        <a routerLink="/">
          <img src="./logo.svg" alt="beanly" class="h-[24px] w-[93px]" />
        </a>
        <button (click)="toggleDropdown('menu')">
          <img src="/icons/close.svg" alt="Icon close" class="h-6 w-6" />
        </button>
      </div>

      <!-- Контент меню с прокруткой -->
      <div class="mt-[48px] flex flex-1 flex-col overflow-y-auto px-[20px]">
        <div
          class="mb-[48px] mt-[40px] flex items-center gap-[8px] rounded-[40px] border border-[var(--color-gray-20)] px-[24px] py-[12px]"
        >
          <img src="/icons/search-dark.svg" class="h-6 w-6" />
          <input
            type="text"
            placeholder="Search cafés or areas…"
            class="body-font-1 w-full border-none bg-transparent focus:outline-none"
          />
        </div>

        <nav class="menu-text-font flex flex-col gap-6">
          <a routerLink="/catalog" class="text-lg text-[var(--color-gray-100)]"
            >Catalog</a
          >
          <div (click)="toggleDropdown('city')" class="flex items-center gap-2">
            {{ city }}<img src="/icons/chevron-down.svg" class="h-5 w-5" />
          </div>
          <div (click)="toggleDropdown('lang')" class="flex items-center gap-2">
            {{ language }}<img src="/icons/chevron-down.svg" class="h-5 w-5" />
          </div>
        </nav>

        <!-- Логин/Логаут внизу слева -->
        <div class="mb-[35px] mt-auto">
          <ng-container *ngIf="user; else mobileLogin">
            <button
              (click)="handleLogout()"
              class="text-left text-[var(--color-gray-100)]"
            >
              <h5>Logout</h5>
            </button>
          </ng-container>
          <ng-template #mobileLogin>
            <button
              (click)="navigateToAuth()"
              class="text-left text-[var(--color-gray-100)]"
            >
              <h5>Log in</h5>
            </button>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dropdown {
        position: absolute;
        left: 0;
        top: 100%;
        z-index: 50;
        margin-top: 0.25rem;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 0.375rem;
        padding: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  city: 'Kyiv' | 'Lviv' = 'Kyiv';
  language: 'ENG' | 'UKR' = 'ENG';
  activeDropdown: 'city' | 'lang' | 'menu' | 'userMenu' | null = null;
  user: User | null = null;
  screenIsMobile = false;

  private userSub?: Subscription;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth);

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.activeDropdown === 'menu') {
          this.activeDropdown = null;
          document.body.classList.remove('overflow-hidden');
        }
      });
  }
  ngOnDestroy() {
    this.userSub?.unsubscribe();
    window.removeEventListener('resize', this.checkScreenWidth);
    document.body.classList.remove('overflow-hidden');
  }

  toggleDropdown(name: typeof this.activeDropdown) {
    const isOpening = this.activeDropdown !== name;
    this.activeDropdown = isOpening ? name : null;

    // Блокировать прокрутку при открытии мобильного меню
    if (this.screenIsMobile && name === 'menu') {
      if (isOpening) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }
  setCity(city: 'Kyiv' | 'Lviv') {
    this.city = city;
    this.activeDropdown = null;
  }

  setLanguage(lang: 'ENG' | 'UKR') {
    this.language = lang;
    this.activeDropdown = null;
  }

  checkScreenWidth = () => {
    this.screenIsMobile = window.innerWidth < 1024;
  };

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }

  handleLogout() {
    this.authService.logout();
    this.activeDropdown = null;
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.activeDropdown = null;
    }
  }
}
