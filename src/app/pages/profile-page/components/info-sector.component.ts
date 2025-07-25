import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';

@Component({
  selector: 'app-info-sector',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div
      class="flex flex-col gap-[32px] rounded-[24px] border border-[var(--color-gray-20)] bg-[var(--color-white)] p-[16px] lg:gap-[48px] lg:p-[32px] xxl:gap-[20px]"
    >
      <!-- Top section: avatar, name and city -->
      <div class="lg:flex lg:justify-between xxl:col-span-8">
        <div class="flex items-start gap-[20px] lg:flex-row">
          <!-- Profile picture -->
          <img
            [src]="editableUser.photoUrl"
            alt="Profile"
            class="h-[100px] min-w-[100px] rounded-full object-cover"
          />

          <!-- Name and city -->
          <div class="flex flex-col gap-[8px]">
            <!-- User name display or edit inputs -->
            <h5 class="flex gap-2">
              <ng-container *ngIf="!isEditing; else editName">
                <span>{{ editableUser.firstName }}</span>
                <span>{{ editableUser.lastName }}</span>
              </ng-container>
              <ng-template #editName>
                <input
                  type="text"
                  [(ngModel)]="editableUser.firstName"
                  (ngModelChange)="
                    fieldChange.emit({ field: 'firstName', value: $event })
                  "
                  [readonly]="!isEditing"
                  class="input-field"
                  [ngClass]="{ editable: isEditing }"
                />
                <input
                  type="text"
                  [(ngModel)]="editableUser.lastName"
                  (ngModelChange)="
                    fieldChange.emit({ field: 'lastName', value: $event })
                  "
                  [readonly]="!isEditing"
                  class="input-field"
                  [ngClass]="{ editable: isEditing }"
                />
              </ng-template>
            </h5>

            <!-- City display or edit input -->
            <span class="body-font-1 flex gap-1">
              <ng-container *ngIf="!isEditing; else editCity">
                <span>{{ editableUser.defaultCity }}, Ukraine</span>
              </ng-container>
              <ng-template #editCity>
                <input
                  type="text"
                  [(ngModel)]="editableUser.defaultCity"
                  (ngModelChange)="
                    fieldChange.emit({ field: 'defaultCity', value: $event })
                  "
                  [readonly]="!isEditing"
                  class="input-field city-input"
                  [ngClass]="{ editable: isEditing }"
                />
                <span>, Ukraine</span>
              </ng-template>
            </span>
          </div>
        </div>

        <!-- Edit/Save button (desktop only) -->
        <div class="hidden h-12 lg:flex">
          <button
            (click)="handleEditToggle()"
            class="shadow-hover menu-text-font button-bg-transparent px-6 py-3"
          >
            {{ isEditing ? 'Save' : 'Edit Profile' }}
          </button>
        </div>
      </div>

      <!-- Repeated info: full name, location, email -->
      <div
        class="flex flex-col gap-[20px] lg:flex-row lg:justify-between xxl:col-span-8"
      >
        <!-- Full Name block -->
        <div class="flex gap-3">
          <div
            class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]"
          >
            <app-icon
              [icon]="ICONS.IdPass"
              class="h-[26px] w-[20px]"
            ></app-icon>
          </div>
          <div class="flex flex-col gap-1">
            <p class="body-font-1">Full Name</p>
            <p>{{ editableUser.firstName }} {{ editableUser.lastName }}</p>
          </div>
        </div>

        <!-- Location block -->
        <div class="flex gap-3">
          <div
            class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]"
          >
            <app-icon
              [icon]="ICONS.Location"
              class="h-[26px] w-[20px]"
            ></app-icon>
          </div>
          <div class="flex flex-col gap-1">
            <p class="body-font-1">Location</p>
            <p>{{ editableUser.defaultCity }}, Ukraine</p>
          </div>
        </div>

        <!-- Email block -->
        <div class="flex gap-3">
          <div
            class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]"
          >
            <app-icon
              [icon]="ICONS.Letter"
              class="h-[26px] w-[20px]"
            ></app-icon>
          </div>
          <div class="flex flex-col gap-1">
            <p class="body-font-1">Email</p>
            <p>{{ editableUser.email }}</p>
          </div>
        </div>
      </div>

      <!-- Edit/Save button (mobile only) -->
      <div class="shadow-hover button-bg-transparent flex lg:hidden">
        <button
          (click)="handleEditToggle()"
          class="menu-text-font flex items-center justify-center px-6 py-3"
        >
          {{ isEditing ? 'Save' : 'Edit Profile' }}
        </button>
      </div>

      <!-- Modal for unsaved changes warning -->
      <div
        *ngIf="showInfoModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div
          class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)] shadow-xl"
        >
          <div class="flex flex-col gap-[20px]">
            <h4>Unsaved Changes</h4>
            <p class="body-font-1 text-[var(--color-gray-100)]">
              You have updated your profile. To save changes, please click "Save
              All Changes" below.
            </p>
          </div>
          <button
            (click)="showInfoModal = false"
            class="button-font button-bg-blue h-[48px] w-full px-[32px] py-[12px]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Input styling: base, readonly and editable states */
      .input-field {
        border: none;
        border-bottom: 1px solid transparent;
        background: transparent;
        outline: none;
        font-size: 1rem;
        width: auto;
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
  ICONS = ICONS;

  // User data to display and edit
  @Input() editableUser!: User;

  // Flag indicating if form is in edit mode
  @Input() isEditing = false;

  // Flag for unsaved changes detection
  @Input() hasPendingChanges = false;

  // Event emitted when edit mode toggled (edit/save button pressed)
  @Output() onToggleEdit = new EventEmitter<void>();

  // Event emitted when a field value changes (two-way binding)
  @Output() fieldChange = new EventEmitter<{ field: keyof User; value: any }>();

  // Controls display of unsaved changes modal
  showInfoModal = false;

  // Shows modal warning about unsaved changes temporarily
  showTemporaryInfoModal() {
    this.showInfoModal = true;
    setTimeout(() => {
      this.showInfoModal = false;
    }, 5000);
  }

  // Handles Edit/Save button click
  handleEditToggle() {
    if (this.isEditing && this.hasPendingChanges) {
      this.showTemporaryInfoModal();
    }
    this.onToggleEdit.emit();
  }
}
