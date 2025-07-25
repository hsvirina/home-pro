import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from '../../../core/models/theme.enum';
import { User } from '../../../core/models/user.model';
import jsPDF from 'jspdf';
import { Place } from '../../../core/models/place.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';

@Component({
  selector: 'app-settings-sector',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex flex-col gap-4 lg:gap-3">
      <h4>Settings</h4>

      <!-- Appearance Section -->
      <section
        class="flex flex-col gap-8 rounded-2xl border border-gray-200 bg-white p-4 lg:p-6"
      >
        <h5>Appearance</h5>

        <!-- Theme selector -->
        <div
          class="shadow-hover flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="flex flex-col gap-2">
            <h6>Theme</h6>
            <span class="body-font-1">Choose your preferred color scheme</span>
          </div>
          <div class="relative">
            <div
              class="flex cursor-pointer items-center justify-between rounded-3xl border border-gray-200 px-6 py-3 lg:gap-3 lg:px-4 lg:py-2"
              (click)="toggleThemeDropdown()"
            >
              <span class="capitalize">{{ user.theme }}</span>
              <app-icon
                [icon]="ICONS.ChevronDown"
                class="transition-transform"
                [ngClass]="{ 'rotate-180': isThemeDropdownOpen }"
              />
            </div>

            <ul
              *ngIf="isThemeDropdownOpen"
              class="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md"
            >
              <li
                *ngFor="let option of themeOptions"
                class="cursor-pointer px-3 py-2 capitalize hover:bg-gray-100"
                (click)="selectTheme(option)"
              >
                {{ option }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Language selector -->
        <div
          class="shadow-hover flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="flex flex-col gap-2">
            <h6>Language</h6>
            <span class="body-font-1">Select your preferred language</span>
          </div>
          <div class="relative">
            <div
              class="flex cursor-pointer items-center justify-between rounded-3xl border border-gray-200 px-6 py-3 lg:h-10 lg:gap-3 lg:px-4 lg:py-2"
              (click)="toggleLanguageDropdown()"
            >
              <span>
                {{
                  user.language && languageMap[user.language]
                    ? languageLabels[languageMap[user.language]]
                    : 'English'
                }}
              </span>
              <app-icon
                [icon]="ICONS.ChevronDown"
                class="transition-transform"
                [ngClass]="{ 'rotate-180': isLanguageDropdownOpen }"
              />
            </div>

            <ul
              *ngIf="isLanguageDropdownOpen"
              class="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md"
            >
              <li
                *ngFor="let lang of languageOptions"
                class="cursor-pointer px-3 py-2 uppercase hover:bg-gray-100"
                (click)="selectLanguage(lang)"
              >
                {{ languageLabels[lang] }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Notifications Section -->
      <section
        class="flex flex-col gap-8 rounded-2xl border border-gray-200 bg-white p-4 lg:p-6"
      >
        <h5>Notifications</h5>

        <div class="flex flex-col gap-5">
          <!-- Email Notifications -->
          <div class="shadow-hover flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>Email Notifications</h6>
              <span class="body-font-1"
                >Receive updates about new cafés and reviews</span
              >
            </div>
            <button
              (click)="toggleEmailNotifications()"
              [class.bg-indigo-600]="user.emailNotifications"
              class="h-4.5 relative inline-flex w-9 items-center rounded-full bg-gray-300 px-0.5 transition-colors duration-300 focus:outline-none focus:ring-0 lg:h-6 lg:w-12"
              [attr.aria-pressed]="user.emailNotifications"
              aria-label="Toggle email notifications"
            >
              <span
                class="lg:h-4.5 lg:w-4.5 inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition duration-300 ease-in-out"
                [ngClass]="{
                  'translate-x-0': !user.emailNotifications,
                  'translate-x-5': user.emailNotifications,
                  'lg:translate-x-6': user.emailNotifications,
                }"
              ></span>
            </button>
          </div>

          <!-- Push Notifications -->
          <div class="shadow-hover flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>Push Notifications</h6>
              <span class="body-font-1"
                >Get notified when someone likes your reviews</span
              >
            </div>
            <button
              (click)="togglePushNotifications()"
              [class.bg-indigo-600]="user.pushNotifications"
              class="h-4.5 relative inline-flex w-9 items-center rounded-full bg-gray-300 px-0.5 transition-colors duration-300 focus:outline-none focus:ring-0 lg:h-6 lg:w-12"
              [attr.aria-pressed]="user.pushNotifications"
              aria-label="Toggle push notifications"
            >
              <span
                class="lg:h-4.5 lg:w-4.5 inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition duration-300 ease-in-out"
                [ngClass]="{
                  'translate-x-0': !user.pushNotifications,
                  'translate-x-5': user.pushNotifications,
                  'lg:translate-x-6': user.pushNotifications,
                }"
              ></span>
            </button>
          </div>

          <!-- Review Notifications -->
          <div class="shadow-hover flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <h6>Review Notifications</h6>
              <span class="body-font-1"
                >Get notified when someone likes your reviews</span
              >
            </div>
            <button
              (click)="toggleReviewNotifications()"
              [class.bg-indigo-600]="user.reviewNotifications"
              class="h-4.5 relative inline-flex w-9 items-center rounded-full bg-gray-300 px-0.5 transition-colors duration-300 focus:outline-none focus:ring-0 lg:h-6 lg:w-12"
              [attr.aria-pressed]="user.reviewNotifications"
              aria-label="Toggle review notifications"
            >
              <span
                class="lg:h-4.5 lg:w-4.5 inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition duration-300 ease-in-out"
                [ngClass]="{
                  'translate-x-0': !user.reviewNotifications,
                  'translate-x-5': user.reviewNotifications,
                  'lg:translate-x-6': user.reviewNotifications,
                }"
              ></span>
            </button>
          </div>
        </div>
      </section>

      <!-- Privacy Section -->
      <section
        class="flex flex-col gap-8 rounded-2xl border border-gray-200 bg-white p-4 lg:p-6"
      >
        <h5>Privacy</h5>
        <div class="shadow-hover flex items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h6>Location Sharing</h6>
            <span class="body-font-1">
              Allow the app to access your location for recommendations
            </span>
          </div>
          <button
            (click)="toggleLocationSharing()"
            [class.bg-indigo-600]="user.locationSharing"
            class="h-4.5 relative inline-flex w-9 min-w-[38px] items-center rounded-full bg-gray-300 px-0.5 transition-colors duration-300 focus:outline-none focus:ring-0 lg:h-6 lg:w-12"
            [attr.aria-pressed]="user.locationSharing"
            aria-label="Toggle location sharing"
          >
            <span
              class="lg:h-4.5 lg:w-4.5 inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition duration-300 ease-in-out"
              [ngClass]="{
                'translate-x-0': !user.locationSharing,
                'translate-x-5': user.locationSharing,
                'lg:translate-x-6': user.locationSharing,
              }"
            ></span>
          </button>
        </div>
      </section>

      <!-- Account Section -->
      <section
        class="flex flex-col gap-8 rounded-2xl border border-gray-200 bg-white p-4 lg:p-6"
      >
        <h5>Account</h5>
        <div class="button-font text-primary flex flex-col gap-4 lg:flex-row">
          <button
            class="button-bg-transparent shadow-hover flex h-12 w-full px-3 py-6"
            (click)="exportData()"
          >
            Export Data
          </button>
          <button
            class="button-bg-transparent shadow-hover flex h-12 w-full px-3 py-6"
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
        class="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-6 text-center shadow-lg"
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
  @Input() user!: User;
  @Input() places: Place[] = [];
  @Output() settingsChanged = new EventEmitter<void>();

  isThemeDropdownOpen = false;
  ICONS = ICONS;
  isLanguageDropdownOpen = false;

  showDeleteAccountModal = false;

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

  toggleThemeDropdown(): void {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
    this.isLanguageDropdownOpen = false;
  }

  toggleLanguageDropdown(): void {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.isThemeDropdownOpen = false;
  }

  selectTheme(theme: Theme): void {
    this.user.theme = theme;
    this.isThemeDropdownOpen = false;
    this.settingsChanged.emit();
  }

  selectLanguage(lang: 'en' | 'uk'): void {
    this.user.language = lang;
    this.isLanguageDropdownOpen = false;
    this.settingsChanged.emit();
  }

  toggleEmailNotifications(): void {
    this.user.emailNotifications = !this.user.emailNotifications;
    this.settingsChanged.emit();
  }

  togglePushNotifications(): void {
    this.user.pushNotifications = !this.user.pushNotifications;
    this.settingsChanged.emit();
  }

  toggleReviewNotifications(): void {
    this.user.reviewNotifications = !this.user.reviewNotifications;
    this.settingsChanged.emit();
  }

  toggleLocationSharing(): void {
    this.user.locationSharing = !this.user.locationSharing;
    this.settingsChanged.emit();
  }

  exportData(): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('User Profile Data', 20, 20);

    doc.setFontSize(12);
    doc.text(`First Name: ${this.user.firstName}`, 20, 40);
    doc.text(`Last Name: ${this.user.lastName}`, 20, 50);
    doc.text(`Email: ${this.user.email}`, 20, 60);
    doc.text(`City: ${this.user.defaultCity}`, 20, 70);

    const favoriteIds =
      this.user.favoriteCafeIds?.map((id) => Number(id)) || [];


    const favoriteCafes = this.places.filter((place) =>
      favoriteIds.includes(place.id),
    );


    let y = 80;

    if (favoriteCafes.length > 0) {
      doc.text('Favorite Cafes:', 20, y);
      y += 10;
      favoriteCafes.forEach((cafe) => {
        doc.text(`- ${cafe.name}, ${cafe.address}`, 25, y);
        y += 10;
      });
    } else {
      doc.text('Favorite Cafes: None', 20, y);
      y += 10;
    }

    doc.save('user-profile.pdf');
  }

  // Методы для управления модальным окном
  openDeleteAccountModal(): void {
    this.showDeleteAccountModal = true;
  }

  closeDeleteAccountModal(): void {
    this.showDeleteAccountModal = false;
  }
}
