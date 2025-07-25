import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { User } from '../../../core/models/user.model';
import { FILTER_CATEGORIES } from '../../../core/models/catalog-filter.config';
import { SearchSectionComponent } from '../../../layout/Header/components/search-section.component';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { LogoComponent } from "../../../shared/components/logo.component";

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchSectionComponent,
    ClickOutsideDirective,
    IconComponent,
    LogoComponent
],
  template: `
    <!-- Затемнённый фон -->
    <div
      @fadeInBackdrop
      class="bg-[var(--color-bg)]/70 fixed inset-0 z-40 backdrop-blur-3xl"
      (click)="closeMenu.emit()"
    ></div>

    <!-- Модальное окно меню с анимацией появления -->
    <div
      @slideUpModal
      class="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]"
      appClickOutside
      (appClickOutside)="activeDropdown = null"
    >
      <!-- Верхняя панель с логотипом и кнопкой закрытия меню -->
      <div
        class="fixed left-0 right-0 top-0 z-50 flex h-[48px] items-center justify-between bg-[var(--color-bg)] px-[20px]"
      >
        <button (click)="goHome()" class="m-0 border-none bg-transparent p-0">
          <app-logo></app-logo>
        </button>
        <button (click)="closeMenu.emit()">
          <app-icon [icon]="ICONS.Close" />
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
              <app-icon
                [icon]="ICONS.ChevronDown"
                [ngClass]="{ 'rotate-180': activeDropdown === 'city' }"
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
              <app-icon
                [icon]="ICONS.ChevronDown"
                [ngClass]="{ 'rotate-180': activeDropdown === 'lang' }"
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
  ICONS = ICONS;
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

  constructor(private router: Router) {}

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
}
