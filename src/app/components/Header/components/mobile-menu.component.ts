import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { User } from '../../../models/user.model';
import { FILTER_CATEGORIES } from '../../../models/catalog-filter.config';
import { slideDownAnimation } from '../../../../styles/animations';
import { SearchSectionComponent } from './search-section.component';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchSectionComponent],
  animations: [slideDownAnimation],
  template: `
    <div class="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]">
      <!-- Верхняя панель с логотипом и кнопкой закрытия меню -->
      <div
        class="fixed left-0 right-0 top-0 z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px]"
      >
        <button (click)="goHome()" class="p-0 m-0 border-none bg-transparent">
          <img src="./logo.svg" alt="beanly" class="h-[24px] w-[93px]" />
        </button>
        <button (click)="closeMenu.emit()">
          <img src="/icons/close.svg" alt="Close" class="h-6 w-6" />
        </button>
      </div>

      <!-- Основной контент меню -->
      <div class="mt-[48px] flex flex-1 flex-col overflow-y-auto px-[20px]">
        <!-- Поиск -->
        <div class="mb-[48px] mt-[40px] px-[4px]">
          <app-search-section></app-search-section>
        </div>

        <!-- Навигация -->
        <nav class="menu-text-font flex flex-col gap-6">
          <a routerLink="/catalog" class="text-lg text-[var(--color-gray-100)]">
            <h5>Catalog</h5>
          </a>

          <!-- Дропдаун города -->
          <div class="relative">
            <div
              (click)="toggleCityDropdown()"
              class="flex cursor-pointer items-center gap-2"
            >
              {{ cityLabel }}
              <img
                src="/icons/chevron-down.svg"
                class="h-4 w-4"
                [class.rotate-180]="activeDropdown === 'city'"
              />
            </div>

            <div
              *ngIf="activeDropdown === 'city'"
              @slideDownAnimation
              class="absolute left-0 top-full z-50 mt-2 flex w-full flex-col gap-[12px] rounded-[8px] bg-[var(--color-white)] p-2 shadow-lg"
            >
              <div
                *ngFor="let loc of locationOptions"
                (click)="selectCity(loc.key)"
                class="cursor-pointer rounded-[8px] px-2 py-1 hover:bg-[var(--color-bg)]"
              >
                {{ loc.label }}
              </div>
            </div>
          </div>

          <!-- Дропдаун языка -->
          <div class="relative">
            <div
              (click)="toggleLanguageDropdown()"
              class="flex cursor-pointer items-center gap-2"
            >
              {{ language }}
              <img
                src="/icons/chevron-down.svg"
                class="h-4 w-4"
                [class.rotate-180]="activeDropdown === 'lang'"
              />
            </div>

            <div
              *ngIf="activeDropdown === 'lang'"
              @slideDownAnimation
              class="absolute left-0 top-full z-50 mt-2 flex w-full flex-col gap-[12px] rounded-[8px] bg-[var(--color-white)] p-2 shadow-lg"
            >
              <div
                (click)="selectLanguage('ENG')"
                class="cursor-pointer rounded-[8px] px-2 py-1 hover:bg-[var(--color-bg)]"
              >
                ENG
              </div>
              <div
                (click)="selectLanguage('UKR')"
                class="cursor-pointer rounded-[8px] px-2 py-1 hover:bg-[var(--color-bg)]"
              >
                UKR
              </div>
            </div>
          </div>
        </nav>

        <!-- Логин / Логаут -->
        <div class="mb-[35px] mt-auto">
          <ng-container *ngIf="user; else login">
            <button
              (click)="logout.emit()"
              class="text-left text-[var(--color-gray-100)]"
            >
              <h5>Logout</h5>
            </button>
          </ng-container>
          <ng-template #login>
            <button
              (click)="navigateToAuth.emit()"
              class="text-left text-[var(--color-gray-100)]"
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
  // === Входные данные ===
  @Input() cityLabel: string = 'City';
  @Input() language: string = 'ENG';
  @Input() user: User | null = null;

  // === События для родителя ===
  @Output() toggleDropdown = new EventEmitter<'city' | 'lang'>();
  @Output() closeMenu = new EventEmitter<void>();
  @Output() navigateToAuth = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() cityChange = new EventEmitter<string>();

  // === Внутренние состояния ===
  activeDropdown: 'city' | 'lang' | null = null;

  // Опции городов из конфига
  locationOptions =
    FILTER_CATEGORIES.find((c) => c.key === 'location')?.options || [];

  constructor(
    private elementRef: ElementRef,
    private router: Router
  ) {}

  // === Навигация на главную ===
  goHome() {
    this.router.navigate(['/']).then(() => {
      this.closeMenu.emit();
    });
  }

  // === Переключение дропдаунов ===
  toggleCityDropdown() {
    this.activeDropdown = this.activeDropdown === 'city' ? null : 'city';
  }

  toggleLanguageDropdown() {
    this.activeDropdown = this.activeDropdown === 'lang' ? null : 'lang';
  }

  // === Выбор города ===
  selectCity(key: string) {
    this.activeDropdown = null;
    this.cityChange.emit(key);
  }

  // === Выбор языка ===
  selectLanguage(lang: 'ENG' | 'UKR') {
    this.activeDropdown = null;
    this.language = lang;
    this.toggleDropdown.emit('lang');
  }

  // === Закрытие дропдаунов при клике вне ===
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      event.target instanceof Node &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.activeDropdown = null;
    }
  }
}
