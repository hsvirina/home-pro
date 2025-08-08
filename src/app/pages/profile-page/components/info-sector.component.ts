import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { AuthUser } from '../../../core/models/user.model';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';
import { BadgeType } from '../../../core/utils/badge-utils';
import { BadgeImagePipe } from '../../../core/pipes/badge-image.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-info-sector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    ThemedIconPipe,
    BadgeImagePipe,
    TranslateModule,
  ],
  template: `
    <div
      class="px-5 lg:px-0 flex flex-col gap-[32px] rounded-[24px] border p-[16px] lg:gap-[48px] lg:p-[24px] xxl:gap-[48px]"
      [ngClass]="[
        (currentTheme$ | async) === 'light'
          ? 'border-[var(--color-gray-20)]'
          : 'border-[var(--color-gray-75)] bg-[var(--color-bg-card)]',
      ]"
    >
      <!-- Top section: user avatar, name, status -->
      <div class="lg:flex lg:justify-between lg:p-6">
        <div class="flex items-start gap-[20px] lg:flex-row">
          <div
            class="relative h-[58px] w-[58px] flex-shrink-0 lg:h-[120px] lg:w-[120px]"
          >
            <!-- Badge overlay on avatar -->
            <img
              *ngIf="badgeType"
              [src]="badgeType | badgeImage"
              [alt]="badgeType + ' badge'"
              class="absolute left-0 top-0 h-full w-full object-contain"
            />

            <!-- User photo or default icon -->
            <ng-container *ngIf="editableUser.photoUrl; else defaultIcon">
              <img
                [src]="editableUser.photoUrl"
                alt="Profile"
                class="absolute left-1/2 top-1/2 rounded-full object-cover"
                [ngClass]="
                  'translate-middle h-[50px] w-[50px] lg:h-[100px] lg:w-[100px]'
                "
                style="transform: translate(-50%, -50%)"
              />
            </ng-container>
            <ng-template #defaultIcon>
              <div
                class="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full bg-[var(--color-secondary)]"
                [ngClass]="
                  'translate-middle h-[50px] w-[50px] lg:h-[80px] lg:w-[80px]'
                "
                style="transform: translate(-50%, -50%)"
              >
                <app-icon
                  [icon]="ICONS.UserProfile"
                  [width]="64"
                  [height]="64"
                ></app-icon>
              </div>
            </ng-template>
          </div>

          <!-- User name and status -->
          <div
            class="flex flex-col gap-3"
            [ngClass]="{
              'text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
            }"
          >
            <h3 class="flex gap-2 text-[20px] lg:text-[40px]">
              <span>{{ editableUser.firstName }}</span>
              <span>{{ editableUser.lastName }}</span>
            </h3>

            <div class="flex">
              <span
                class="body-font-1 rounded-[40px] border border-[var(--color-gray-20)] p-3"
              >
                {{ editableUser.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Edit/Save button (desktop only) -->
        <div class="hidden h-12 lg:flex" *ngIf="!public">
          <button
            (click)="handleEditToggle()"
            class="menu-text-font button-bg-transparent px-6 py-3"
          >
            {{
              isEditing
                ? ('infoSector.save' | translate)
                : ('infoSector.editProfile' | translate)
            }}
          </button>
        </div>
      </div>

      <!-- Editable user info fields (hidden in public mode) -->
      <div *ngIf="!public" class="flex flex-col gap-[20px] lg:flex-row">
        <!-- Full Name block -->
        <div
          class="flex flex-1 gap-3 rounded-[40px] border p-2"
          [ngClass]="
            (currentTheme$ | async) === 'light'
              ? 'border-[var(--color-gray-20)]'
              : 'border-[var(--color-gray-75)]'
          "
        >
          <div
            class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px]"
            [ngClass]="
              (currentTheme$ | async) === 'light'
                ? 'bg-[var(--color-white)]'
                : 'bg-[var(--color-gray-100)]'
            "
          >
            <app-icon
              [icon]="'IdPass' | themedIcon"
              class="h-[26px] w-[20px]"
            ></app-icon>
          </div>

          <div class="flex w-full flex-col gap-1">
            <p class="body-font-1">{{ 'infoSector.fullName' | translate }}</p>

            <ng-container *ngIf="isEditing; else fullNameDisplay">
              <div class="flex gap-2">
                <input
                  type="text"
                  [(ngModel)]="editableUser.firstName"
                  (ngModelChange)="
                    fieldChange.emit({ field: 'firstName', value: $event })
                  "
                  class="input-field editable"
                />
                <input
                  type="text"
                  [(ngModel)]="editableUser.lastName"
                  (ngModelChange)="
                    fieldChange.emit({ field: 'lastName', value: $event })
                  "
                  class="input-field editable"
                />
              </div>
            </ng-container>
            <ng-template #fullNameDisplay>
              <p class="menu-text-font">
                {{ editableUser.firstName }} {{ editableUser.lastName }}
              </p>
            </ng-template>
          </div>
        </div>

        <!-- Location block -->
        <div
          class="flex flex-1 gap-3 rounded-[40px] border p-2"
          [ngClass]="
            (currentTheme$ | async) === 'light'
              ? 'border-[var(--color-gray-20)]'
              : 'border-[var(--color-gray-75)]'
          "
        >
          <div
            class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px]"
            [ngClass]="
              (currentTheme$ | async) === 'light'
                ? 'bg-[var(--color-white)]'
                : 'bg-[var(--color-gray-100)]'
            "
          >
            <app-icon [icon]="'Location' | themedIcon"></app-icon>
          </div>

          <div class="flex w-full flex-col gap-1">
            <p class="body-font-1">{{ 'infoSector.location' | translate }}</p>

            <ng-container *ngIf="isEditing; else cityDisplay">
              <input
                type="text"
                [(ngModel)]="editableUser.defaultCity"
                (ngModelChange)="
                  fieldChange.emit({ field: 'defaultCity', value: $event })
                "
                class="input-field editable city-input"
              />
            </ng-container>
            <ng-template #cityDisplay>
              <p class="menu-text-font">
                {{ editableUser.defaultCity }}, Ukraine
              </p>
            </ng-template>
          </div>
        </div>

        <!-- Email block -->
        <div
          class="flex flex-1 gap-3 rounded-[40px] border p-2"
          [ngClass]="
            (currentTheme$ | async) === 'light'
              ? 'border-[var(--color-gray-20)]'
              : 'border-[var(--color-gray-75)]'
          "
        >
          <div
            class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px]"
            [ngClass]="getBackgroundClass(currentTheme$ | async)"
          >
            <app-icon [icon]="'Letter' | themedIcon"></app-icon>
          </div>
          <div class="flex flex-col gap-1">
            <p class="body-font-1">{{ 'infoSector.email' | translate }}</p>
            <p
              class="menu-text-font"
              [ngClass]="{
                'text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
              }"
            >
              {{ editableUser.email }}
            </p>
          </div>
        </div>
      </div>

      <!-- Edit/Save button (mobile only) -->
      <div class="button-bg-transparent flex lg:hidden" *ngIf="!public">
        <button
          (click)="handleEditToggle()"
          class="menu-text-font flex items-center justify-center px-6 py-3"
        >
          {{
            isEditing
              ? ('infoSector.save' | translate)
              : ('infoSector.editProfile' | translate)
          }}
        </button>
      </div>

      <!-- Unsaved changes warning modal -->
      <div
        *ngIf="showInfoModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div
          class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)]"
        >
          <div class="flex flex-col gap-[20px]">
            <h4>{{ 'infoSector.unsavedChanges' | translate }}</h4>
            <p class="body-font-1 text-[var(--color-gray-100)]">
              {{ 'infoSector.unsavedChangesMessage' | translate }}
            </p>
          </div>
          <button
            (click)="showInfoModal = false"
            class="button-font button-bg-blue h-[48px] w-full px-[32px] py-[12px]"
          >
            {{ 'infoSector.gotIt' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Input fields styling */

      .input-field {
        border: none;
        border-bottom: 1px solid transparent;
        background: transparent;
        outline: none;
        font-size: 1rem;
        max-width: 140px;
        transition:
          border-color 0.2s,
          background-color 0.2s;
        color: var(--color-gray-100);
        cursor: default;
      }

      .input-field.city-input {
        max-width: 150px;
      }

      .input-field[readonly] {
        color: var(--color-gray-70);
      }

      .input-field.editable {
        border-bottom: 1px solid var(--color-primary);
        background-color: var(--color-bg-1);
        cursor: text;
      }

      .input-field.editable:focus {
        border-color: var(--color-secondary);
        background-color: var(--color-white);
      }
    `,
  ],
})
export class InfoSectorComponent {
  // Constants and Inputs/Outputs

  ICONS = ICONS;

  @Input() badgeType: BadgeType | null = null;
  @Input() public = false; // When true, hides editable user info fields
  @Input() editableUser!: AuthUser;

  @Input() isEditing = false; // Controls whether the form is in edit mode
  @Input() hasPendingChanges = false; // Indicates if there are unsaved changes

  @Output() onToggleEdit = new EventEmitter<void>(); // Emits on edit/save toggle button click
  @Output() fieldChange = new EventEmitter<{
    field: keyof AuthUser;
    value: any;
  }>(); // Emits on individual field changes

  showInfoModal = false; // Controls display of unsaved changes modal

  currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Show a modal warning about unsaved changes for 5 seconds
   */
  showTemporaryInfoModal() {
    this.showInfoModal = true;
    setTimeout(() => (this.showInfoModal = false), 5000);
  }

  /**
   * Handle click on Edit/Save button
   * Shows unsaved changes warning if editing and changes are pending
   * Emits onToggleEdit event
   */
  handleEditToggle() {
    if (this.isEditing && this.hasPendingChanges) {
      this.showTemporaryInfoModal();
    }
    this.onToggleEdit.emit();
  }

  /**
   * Get background CSS class for icon container based on theme
   * @param theme Current theme ('light' or 'dark')
   * @returns CSS class string
   */
  getBackgroundClass(theme: Theme | null): string {
    if (!theme) return 'bg-[var(--color-white)]'; // fallback

    return theme === 'light'
      ? 'bg-[var(--color-white)]'
      : 'bg-[var(--color-gray-100)]';
  }
}
