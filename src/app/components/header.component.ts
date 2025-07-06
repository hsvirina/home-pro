import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type User = {
  email: string;
  photoUrl: string;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <header
      class="relative z-50 flex h-[48px] items-center justify-between px-[20px] xxl:h-[80px] xxl:px-0"
    >
      <!-- 1) Левый блок: Иконка Меню и Лого -->
      <div class="flex items-center gap-[8px]">
        <button class="xxl:hidden" (click)="toggleDropdown('menu')">
          <img src="/icons/menu.png" alt="menu" class="h-6 w-6" />
        </button>
        <a routerLink="/">
          <img
            src="./logo.svg"
            alt="beanly"
            class="h-[24px] w-[93px] object-contain xxl:h-[32px] xxl:w-[165px]"
          />
        </a>
      </div>

      <!-- 2) Средний блок: Инпут для поиска -->
      <div
        *ngIf="!screenIsMobile || activeDropdown === 'menu'"
        class="relative box-border flex h-[48px] w-full max-w-[500px] items-center gap-[8px] rounded-[40px] border border-[var(--color-gray-20)] px-[24px] py-[12px]"
      >
        <img
          src="/icons/search-dark.svg"
          alt="Search"
          class="pointer-events-none h-6 w-6 object-contain"
        />
        <input
          type="text"
          placeholder="Search cafés or areas…"
          class="body-font-1 w-full border-none bg-transparent focus:outline-none"
        />
      </div>

      <!-- 3) Правый блок: Каталог, город, язык, логин -->
      <div class="flex items-center gap-[30px]">
        <!-- Desktop Nav -->
        <nav
          *ngIf="!screenIsMobile || activeDropdown === 'menu'"
          class="menu-text-font hidden items-center gap-[30px] lg:flex"
        >
          <a
            routerLink="/catalog"
            routerLinkActive="underline"
            class="text-[var(--color-gray-100)]"
          >
            Catalog
          </a>
          <!-- City -->
          <div class="relative" (click)="toggleDropdown('city')">
            <div class="flex cursor-pointer select-none items-center gap-1">
              {{ city }}
              <img
                src="/icons/chevron-down.svg"
                alt="chevron"
                class="h-6 w-6 object-contain"
              />
            </div>
            <div
              *ngIf="activeDropdown === 'city'"
              class="absolute left-0 top-full z-50 mt-1 flex flex-col gap-[13px] rounded-md bg-white p-2 shadow-md"
              (click)="$event.stopPropagation()"
            >
              <div
                class="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                (click)="setCity('Kyiv')"
              >
                Kyiv
              </div>
              <div
                class="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                (click)="setCity('Lviv')"
              >
                Lviv
              </div>
            </div>
          </div>
          <!-- Language -->
          <div class="relative" (click)="toggleDropdown('lang')">
            <div class="flex cursor-pointer select-none items-center gap-1">
              {{ language }}
              <img
                src="/icons/chevron-down.svg"
                alt="chevron"
                class="h-6 w-6 object-contain"
              />
            </div>
            <div
              *ngIf="activeDropdown === 'lang'"
              class="absolute left-0 top-full z-50 mt-1 flex flex-col gap-[13px] rounded-md bg-white p-2 shadow-md"
              (click)="$event.stopPropagation()"
            >
              <div
                class="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                (click)="setLanguage('ENG')"
              >
                ENG
              </div>
              <div
                class="cursor-pointer rounded px-2 py-1 hover:bg-gray-100"
                (click)="setLanguage('UKR')"
              >
                UKR
              </div>
            </div>
          </div>
        </nav>

        <!-- Log in Button -->
        <button
          class="flex items-center gap-1"
          (click)="toggleDropdown('login')"
        >
          <span class="hidden xxl:inline">Log in</span>
          <img
            src="/icons/user-profile.svg"
            alt="user-profile"
            class="h-6 w-6 object-contain"
          />
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent implements OnInit {
  city: 'Kyiv' | 'Lviv' = 'Kyiv';
  language: 'ENG' | 'UKR' = 'ENG';
  activeDropdown: 'city' | 'lang' | 'login' | 'menu' | null = null;
  user: User | null = null;
  email = '';
  password = '';
  screenIsMobile = false;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) this.user = JSON.parse(storedUser);

    this.checkScreenWidth();
    window.addEventListener('resize', () => {
      this.checkScreenWidth();
    });
  }

  toggleDropdown(name: 'city' | 'lang' | 'login' | 'menu') {
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  setCity(city: 'Kyiv' | 'Lviv') {
    this.city = city;
    this.activeDropdown = null;
  }

  setLanguage(lang: 'ENG' | 'UKR') {
    this.language = lang;
    this.activeDropdown = null;
  }

  checkScreenWidth() {
    this.screenIsMobile = window.innerWidth < 1320; // совпадает с твоим tailwind 'xxl'
  }

  handleLogin() {
    if (
      this.email.trim() === '123@gmail.com' &&
      this.password.trim() === '123'
    ) {
      this.user = { email: this.email, photoUrl: 'assets/profile-photo.jpg' };
      localStorage.setItem('user', JSON.stringify(this.user));
      this.activeDropdown = null;
      this.router.navigate(['/profile']);
    } else {
      alert('Invalid credentials');
    }
  }

  handleLogout() {
    this.user = null;
    localStorage.removeItem('user');
    this.activeDropdown = null;
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.activeDropdown = null;
    }
  }

  closeDropdown() {
    this.activeDropdown = null;
  }
}
