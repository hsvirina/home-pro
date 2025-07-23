import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from '../../../models/theme.enum';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-settings-sector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-[16px] lg:gap-[12px]">
      <h4>Settings</h4>
      <!-- Appearance Section -->
      <div
        class="flex flex-col gap-[32px] rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-white)] p-[16px] lg:p-[24px]"
      >
        <h5>Appearance</h5>
        <div class="flex flex-col gap-[20px]">
          <!-- Theme selector -->
          <div
            class="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between shadow-hover"
          >
            <div class="flex flex-col gap-[8px]">
              <h6>Theme</h6>
              <span class="body-font-1"
                >Choose your preferred color scheme</span
              >
            </div>
            <div class="relative">
              <div
                class="flex w-full cursor-pointer items-center justify-between rounded-[40px] border border-[var(--color-gray-20)] px-[24px] py-[12px] lg:gap-[12px] lg:px-[16px] lg:py-[8px]"
                (click)="toggleThemeDropdown()"
              >
                <span class="capitalize">{{ user.theme }}</span>
                <img
                  src="/icons/chevron-down.svg"
                  alt="Expand"
                  class="h-[24px] w-[24px] transition-transform"
                  [ngClass]="{ 'rotate-180': isThemeDropdownOpen }"
                />
              </div>
              <ul
                *ngIf="isThemeDropdownOpen"
                class="absolute left-0 top-full z-10 mt-[4px] w-full rounded-[12px] border border-[var(--color-gray-20)] bg-white shadow-md"
              >
                <li
                  *ngFor="let option of themeOptions"
                  class="cursor-pointer px-[12px] py-[8px] capitalize hover:bg-[var(--color-gray-10)]"
                  (click)="selectTheme(option)"
                >
                  {{ option }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Language selector -->
          <div
            class="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between shadow-hover"
          >
            <div class="flex flex-col gap-[8px]">
              <h6>Language</h6>
              <span class="body-font-1">Select your preferred language</span>
            </div>
            <div class="relative">
              <div
                class="flex w-full cursor-pointer items-center justify-between rounded-[40px] border border-[var(--color-gray-20)] px-[24px] py-[12px] lg:h-[40px] lg:gap-[12px] lg:px-[16px] lg:py-[8px]"
                (click)="toggleLanguageDropdown()"
              >
                <span>
                  {{
                    user.language && languageMap[user.language]
                      ? languageLabels[languageMap[user.language]]
                      : 'English'
                  }}
                </span>
                <img
                  src="/icons/chevron-down.svg"
                  alt="Expand"
                  class="h-[24px] w-[24px] transition-transform"
                  [ngClass]="{ 'rotate-180': isLanguageDropdownOpen }"
                />
              </div>
              <ul
                *ngIf="isLanguageDropdownOpen"
                class="absolute left-0 top-full z-10 mt-[4px] w-full rounded-[12px] border border-[var(--color-gray-20)] bg-white shadow-md"
              >
                <li
                  *ngFor="let lang of languageOptions"
                  class="cursor-pointer px-[12px] py-[8px] uppercase hover:bg-[var(--color-gray-10)]"
                  (click)="selectLanguage(lang)"
                >
                  {{ languageLabels[lang] }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Section -->
      <div
        class="flex flex-col gap-[32px] rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-white)] p-[16px] lg:p-[24px]"
      >
        <h5>Notifications</h5>
        <div class="flex flex-col gap-[20px]">
          <!-- Email Notifications -->
          <div class="flex items-center justify-between gap-[16px] shadow-hover">
            <div class="flex flex-col gap-[6px]">
              <h6>Email Notifications</h6>
              <span class="body-font-1"
                >Receive updates about new cafés and reviews</span
              >
            </div>
            <button
              (click)="toggleEmailNotifications()"
              [class.bg-indigo-600]="user.emailNotifications"
              class="relative inline-flex h-[18px] w-[38px] items-center rounded-full bg-gray-300 px-[2px] transition-colors duration-300 focus:outline-none focus:ring-0 lg:h-[24px] lg:w-[50px] lg:px-[3px] xxl:h-[28px] xxl:w-[56px] xxl:px-[4px]"
              [attr.aria-pressed]="user.emailNotifications"
              aria-label="Toggle email notifications"
            >
              <span
                class="inline-block h-[14px] w-[14px] rounded-full bg-white shadow transition duration-300 ease-in-out lg:h-[18px] lg:w-[18px] xxl:h-[20px] xxl:w-[20px]"
                [ngClass]="{
                  'translate-x-0': !user.emailNotifications,
                  'translate-x-[20px]': user.emailNotifications,
                  'lg:translate-x-[26px]': user.emailNotifications,
                  'xxl:translate-x-[28px]': user.emailNotifications,
                }"
              ></span>
            </button>
          </div>

          <!-- Push Notifications -->
          <div class="flex items-center justify-between gap-[16px] shadow-hover">
            <div class="flex flex-col gap-[6px]">
              <h6>Push Notifications</h6>
              <span class="body-font-1"
                >Get notified when someone likes your reviews</span
              >
            </div>
            <button
              (click)="togglePushNotifications()"
              [class.bg-indigo-600]="user.pushNotifications"
              class="relative inline-flex h-[18px] w-[38px] items-center rounded-full bg-gray-300 px-[2px] transition-colors duration-300 focus:outline-none focus:ring-0 lg:h-[24px] lg:w-[50px] lg:px-[3px] xxl:h-[28px] xxl:w-[56px] xxl:px-[4px]"
              [attr.aria-pressed]="user.pushNotifications"
              aria-label="Toggle push notifications"
            >
              <span
                class="inline-block h-[14px] w-[14px] rounded-full bg-white shadow transition duration-300 ease-in-out lg:h-[18px] lg:w-[18px] xxl:h-[20px] xxl:w-[20px]"
                [ngClass]="{
                  'translate-x-0': !user.pushNotifications,
                  'translate-x-[20px]': user.pushNotifications,
                  'lg:translate-x-[26px]': user.pushNotifications,
                  'xxl:translate-x-[28px]': user.pushNotifications,
                }"
              ></span>
            </button>
          </div>

          <!-- Review Notifications -->
          <div class="flex items-center justify-between gap-[16px] shadow-hover">
            <div class="flex flex-col gap-[6px]">
              <h6>Review Notifications</h6>
              <span class="body-font-1"
                >Get notified when someone likes your reviews</span
              >
            </div>
            <button
              (click)="toggleReviewNotifications()"
              [class.bg-indigo-600]="user.reviewNotifications"
              class="relative inline-flex h-[18px] w-[38px] items-center rounded-full bg-gray-300 px-[2px] transition-colors duration-300 focus:outline-none focus:ring-0 lg:h-[24px] lg:w-[50px] lg:px-[3px] xxl:h-[28px] xxl:w-[56px] xxl:px-[4px]"
              [attr.aria-pressed]="user.reviewNotifications"
              aria-label="Toggle review notifications"
            >
              <span
                class="inline-block h-[14px] w-[14px] rounded-full bg-white shadow transition duration-300 ease-in-out lg:h-[18px] lg:w-[18px] xxl:h-[20px] xxl:w-[20px]"
                [ngClass]="{
                  'translate-x-0': !user.reviewNotifications,
                  'translate-x-[20px]': user.reviewNotifications,
                  'lg:translate-x-[26px]': user.reviewNotifications,
                  'xxl:translate-x-[28px]': user.reviewNotifications,
                }"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Privacy Section -->
      <div
        class="flex flex-col gap-[32px] rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-white)] p-[16px] lg:p-[24px]"
      >
        <h5>Privacy</h5>
        <div class="flex flex-col gap-[20px]">
          <div class="flex items-center justify-between gap-[16px] shadow-hover">
            <div class="flex flex-col gap-[6px]">
              <h6>Location Sharing</h6>
              <span class="body-font-1">
                Allow the app to access your location for recommendations
              </span>
            </div>
            <button
              (click)="toggleLocationSharing()"
              [class.bg-indigo-600]="user.locationSharing"
              class="relative inline-flex h-[18px] w-[38px] min-w-[38px] flex-none items-center rounded-full bg-gray-300 px-[2px] transition-colors duration-300 focus:outline-none focus:ring-0 lg:h-[24px] lg:w-[50px] lg:px-[3px] xxl:h-[28px] xxl:w-[56px] xxl:px-[4px]"
              [attr.aria-pressed]="user.locationSharing"
              aria-label="Toggle location sharing"
            >
              <span
                class="inline-block h-[14px] w-[14px] rounded-full bg-white shadow transition duration-300 ease-in-out lg:h-[18px] lg:w-[18px] xxl:h-[20px] xxl:w-[20px]"
                [ngClass]="{
                  'translate-x-0': !user.locationSharing,
                  'translate-x-[20px]': user.locationSharing,
                  'lg:translate-x-[26px]': user.locationSharing,
                  'xxl:translate-x-[28px]': user.locationSharing,
                }"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Account Section -->
      <div
        class="flex flex-col gap-[32px] rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-white)] p-[16px] lg:p-[24px]"
      >
        <h5>Account</h5>
        <div
          class="button-font flex flex-col gap-[16px] text-[var(--color-primary)] lg:flex-row"
        >
          <button
            class="flex h-[48px] w-full button-bg-transparent shadow-hover px-[12px] py-[24px]"
          >
            Export Data
          </button>
          <button
            class="flex h-[48px] w-full button-bg-transparent shadow-hover px-[12px] py-[24px]"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SettingsSectorComponent {
  @Input() user!: User;
  @Output() settingsChanged = new EventEmitter<void>();

  isThemeDropdownOpen = false;
  isLanguageDropdownOpen = false;

  readonly themeOptions = Object.values(Theme);
  readonly languageOptions: Array<'en' | 'uk'> = ['en', 'uk'];

  readonly languageLabels: Record<'en' | 'uk', string> = {
    en: 'English',
    uk: 'Ukrainian',
  };

  readonly languageMap: Record<string, 'en' | 'uk'> = {
    ENG: 'en',
    UKR: 'uk',
    en: 'en',
    uk: 'uk',
  };

  toggleThemeDropdown() {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
    this.isLanguageDropdownOpen = false;
  }

  toggleLanguageDropdown() {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.isThemeDropdownOpen = false;
  }

  selectTheme(theme: Theme) {
    this.user.theme = theme;
    this.isThemeDropdownOpen = false;
    this.settingsChanged.emit();
  }

  selectLanguage(lang: 'en' | 'uk') {
    this.user.language = lang;
    this.isLanguageDropdownOpen = false;
    this.settingsChanged.emit();
  }

  toggleEmailNotifications() {
    this.user.emailNotifications = !this.user.emailNotifications;
    this.settingsChanged.emit();
  }

  togglePushNotifications() {
    this.user.pushNotifications = !this.user.pushNotifications;
    this.settingsChanged.emit();
  }

  toggleReviewNotifications() {
    this.user.reviewNotifications = !this.user.reviewNotifications;
    this.settingsChanged.emit();
  }

  toggleLocationSharing() {
    this.user.locationSharing = !this.user.locationSharing;
    this.settingsChanged.emit();
  }
}
