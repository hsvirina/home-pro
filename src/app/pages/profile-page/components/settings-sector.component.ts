import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme, ThemeValues } from '../../../core/models/theme.type';
import { Place } from '../../../core/models/place.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';
import { ToggleSwitchComponent } from '../../../shared/components/toggle-switch.component';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthStateService } from '../../../state/auth/auth-state.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { slideDownAnimation } from '../../../../styles/animations/animations';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-settings-sector',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ToggleSwitchComponent,
    ClickOutsideDirective,
  ],
  animations: [slideDownAnimation],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h4>Settings</h4>
        <span class="body-font-1">Manage your account preferences</span>
      </div>

      <!-- Appearance Section -->
      <section
        class="flex flex-col gap-8 rounded-[24px] border p-4 lg:p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <h5>Appearance</h5>

        <div class="flex flex-col gap-5">
          <!-- Theme selector -->
          <div
            class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex flex-col gap-2">
              <h6>Theme</h6>
              <span class="body-font-1"
                >Choose your preferred color scheme</span
              >
            </div>
            <div class="relative">
              <div
                class="flex cursor-pointer items-center justify-between rounded-3xl border px-6 py-3 lg:gap-3 lg:px-6 lg:py-3"
                (click)="toggleThemeDropdown($event)"
                [ngClass]="{
                  'border-[var(--color-gray-20)] bg-[var(--color-white)]':
                    (currentTheme$ | async) === 'light',
                  'border-[var(--color-gray-75)] bg-[var(--color-bg-card)]':
                    (currentTheme$ | async) === 'dark',
                }"
              >
                <span class="capitalize">{{ user.theme }}</span>
                <app-icon
                  [icon]="ICONS.ChevronDown"
                  class="transition-transform"
                  [ngClass]="{ 'rotate-180': isThemeDropdownOpen }"
                />
              </div>

              <div
                *ngIf="isThemeDropdownOpen"
                @slideDownAnimation
                appClickOutside
                (appClickOutside)="isThemeDropdownOpen = false"
                class="absolute left-0 top-full z-10 mt-2 w-full"
              >
                <ul
                  class="flex origin-top flex-col gap-[12px] rounded-[16px] border p-2"
                  [ngClass]="{
                    'border-[var(--color-white)] bg-[var(--color-white)]':
                      (currentTheme$ | async) === 'light',
                    'border-[var(--color-white)] bg-[var(--color-bg-card)]':
                      (currentTheme$ | async) === 'dark',
                  }"
                >
                  <li
                    *ngFor="let option of themeOptions"
                    (click)="selectTheme(option)"
                    class="cursor-pointer rounded-[16px] px-2 py-1 capitalize transition-colors duration-300"
                    [ngClass]="{
                      'hover:bg-[var(--color-bg)]': true,
                    }"
                  >
                    {{ option }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Language selector -->
          <div
            class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex flex-col gap-2">
              <h6>Language</h6>
              <span class="body-font-1">Select your preferred language</span>
            </div>
            <div class="relative">
              <div
                class="flex cursor-pointer items-center justify-between rounded-[40px] border px-6 py-3 lg:gap-3 lg:px-6 lg:py-3"
                (click)="toggleLanguageDropdown($event)"
                [ngClass]="{
                  'border-[var(--color-gray-20)] bg-[var(--color-white)]':
                    (currentTheme$ | async) === 'light',
                  'border-[var(--color-gray-75)] bg-[var(--color-bg-card)]':
                    (currentTheme$ | async) === 'dark',
                }"
              >
                <span class="capitalize">
                  {{
                    user.language && languageMap[user.language]
                      ? languageLabels[languageMap[user.language]]
                      : 'English'
                  }}
                </span>
                <app-icon
                  [icon]="ICONS.ChevronDown"
                  class="transition-transform duration-300"
                  [ngClass]="{ 'rotate-180': isLanguageDropdownOpen }"
                />
              </div>

              <div
                *ngIf="isLanguageDropdownOpen"
                @slideDownAnimation
                appClickOutside
                (appClickOutside)="isLanguageDropdownOpen = false"
                class="absolute left-0 top-full z-10 mt-2 w-full"
              >
                <ul
                  class="flex origin-top flex-col gap-[12px] rounded-[16px] border p-2"
                  [ngClass]="{
                    'border-[var(--color-white)] bg-[var(--color-white)]':
                      (currentTheme$ | async) === 'light',
                    'border-[var(--color-white)] bg-[var(--color-bg-card)]':
                      (currentTheme$ | async) === 'dark',
                  }"
                >
                  <li
                    *ngFor="let lang of languageOptions"
                    (click)="selectLanguage(lang)"
                    class="cursor-pointer rounded-[16px] px-2 py-1 capitalize transition-colors duration-300"
                    [ngClass]="{
                      'hover:bg-[var(--color-bg)]': true,
                    }"
                  >
                    {{ languageLabels[lang] }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Notifications Section -->
      <section
        class="flex flex-col gap-8 rounded-[24px] border p-4 lg:p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <h5>Notifications</h5>

        <div class="flex flex-col gap-5">
          <!-- Email Notifications -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>Email Notifications</h6>
              <span class="body-font-1"
                >Receive updates about new cafés and reviews</span
              >
            </div>
            <app-toggle-switch
              [checked]="user.emailNotifications"
              (checkedChange)="toggleEmailNotifications()"
            ></app-toggle-switch>
          </div>

          <!-- Push Notifications -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>Push Notifications</h6>
              <span class="body-font-1"
                >Get notified when someone likes your reviews</span
              >
            </div>
            <app-toggle-switch
              [checked]="user.pushNotifications"
              (checkedChange)="togglePushNotifications()"
            ></app-toggle-switch>
          </div>

          <!-- Review Notifications -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>Review Notifications</h6>
              <span class="body-font-1"
                >Get notified when someone likes your reviews</span
              >
            </div>
            <app-toggle-switch
              [checked]="user.reviewNotifications"
              (checkedChange)="toggleReviewNotifications()"
            ></app-toggle-switch>
          </div>
        </div>
      </section>

      <!-- Privacy Section -->
      <section
        class="flex flex-col gap-8 rounded-[24px] border p-4 lg:p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <h5>Privacy</h5>
        <!-- Location Sharing -->
        <div class="flex items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h6>Location Sharing</h6>
            <span class="body-font-1">
              Allow the app to access your location for recommendations
            </span>
          </div>
          <app-toggle-switch
            [checked]="user.locationSharing"
            (checkedChange)="toggleLocationSharing()"
          ></app-toggle-switch>
        </div>
      </section>

      <!-- Account Section -->
      <section
        class="flex flex-col gap-8 rounded-[24px] border p-4 lg:p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <h5>Account</h5>
        <div class="button-font text-primary flex flex-col gap-4 lg:flex-row">
          <button
            class="button-bg-transparent flex h-12 w-full px-3 py-6"
            (click)="logout()"
          >
            Log out of the account
          </button>
          <button
            class="button-font flex h-12 w-full items-center justify-center rounded-[40px] border border-[var(--color-button-error)] px-3 py-6 text-[var(--color-button-error)]"
            (click)="openDeleteAccountModal()"
          >
            Delete account
          </button>
        </div>
      </section>
    </div>

    <!-- Delete Account Modal -->
    <div
      *ngIf="showDeleteAccountModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-6 text-center"
      >
        <h4 class="mb-4 text-lg font-semibold">Delete Account</h4>
        <p class="mb-6">This feature is currently under development.</p>
        <button
          (click)="closeDeleteAccountModal()"
          class="button-font rounded-full bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  `,
})
export class SettingsSectorComponent {
  // User object with current settings
  @Input() user!: AuthUser;

  // List of places (cafes) to extract favorites for export
  @Input() places: Place[] = [];

  // Emits when user changes any setting to notify parent component
  @Output() settingsChanged = new EventEmitter<void>();

  // Controls the visibility of the theme dropdown
  isThemeDropdownOpen = false;

  // Controls the visibility of the language dropdown
  isLanguageDropdownOpen = false;

  // Controls the visibility of the delete account modal
  showDeleteAccountModal = false;

  ICONS = ICONS;

  readonly currentTheme$: Observable<Theme>;

  // Available theme options from enum
  readonly themeOptions = ThemeValues;

  // Supported languages
  readonly languageOptions: Array<'en' | 'uk'> = ['en', 'uk'];

  // Human-readable language labels
  readonly languageLabels: Record<'en' | 'uk', string> = {
    en: 'English',
    uk: 'Ukrainian',
  };

  // Maps various language codes to supported keys
  readonly languageMap: Record<string, 'en' | 'uk'> = {
    ENG: 'en',
    UKR: 'uk',
    en: 'en',
    uk: 'uk',
  };

  constructor(
    private themeService: ThemeService,
    private authService: AuthStateService,
    private router: Router,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    if (this.user.theme !== this.themeService.currentTheme) {
      this.themeService.setTheme(this.user.theme as Theme);
    }
  }

  // Toggles theme dropdown and closes language dropdown
  toggleThemeDropdown(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  toggleLanguageDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.isThemeDropdownOpen = false;
  }

  // Selects a theme and emits change event
  selectTheme(theme: Theme): void {
    this.user.theme = theme;
    this.themeService.setTheme(theme); // устанавливаем тему глобально
    this.isThemeDropdownOpen = false;
    this.settingsChanged.emit();
  }

  // Selects a language and emits change event
  selectLanguage(lang: 'en' | 'uk'): void {
    this.user.language = lang;
    this.isLanguageDropdownOpen = false;
    this.settingsChanged.emit();
  }

  // Toggles email notifications setting and emits change event
  toggleEmailNotifications(): void {
    this.user.emailNotifications = !this.user.emailNotifications;
    this.settingsChanged.emit();
  }

  // Toggles push notifications setting and emits change event
  togglePushNotifications(): void {
    this.user.pushNotifications = !this.user.pushNotifications;
    this.settingsChanged.emit();
  }

  // Toggles review notifications setting and emits change event
  toggleReviewNotifications(): void {
    this.user.reviewNotifications = !this.user.reviewNotifications;
    this.settingsChanged.emit();
  }

  // Toggles location sharing setting and emits change event
  toggleLocationSharing(): void {
    this.user.locationSharing = !this.user.locationSharing;
    this.settingsChanged.emit();
  }

  // Opens the "Delete Account" modal
  openDeleteAccountModal(): void {
    this.showDeleteAccountModal = true;
  }

  // Closes the "Delete Account" modal
  closeDeleteAccountModal(): void {
    this.showDeleteAccountModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // переход на главную страницу после выхода
  }
}
