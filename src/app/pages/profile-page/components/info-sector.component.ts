import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { User }              from '../../../models/user.model';

@Component({
  selector: 'app-info-sector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-[32px] rounded-[24px] border border-[var(--color-gray-20)]
                bg-[var(--color-white)] p-[16px] lg:gap-[48px] lg:p-[32px]
                xxl:col-start-2 xxl:col-end-8 xxl:grid xxl:grid-cols-8 xxl:gap-[20px]">
      <!-- Top row: avatar + name/city -->
      <div class="lg:flex lg:justify-between xxl:col-span-8">
        <div class="flex items-start gap-[20px] lg:flex-row">
          <img [src]="editableUser.photoUrl"
               alt="Profile"
               class="h-[100px] min-w-[100px] rounded-full object-cover"/>

          <div class="flex flex-col gap-[8px]">
            <!-- Name -->
            <h5 class="flex gap-2">
              <ng-container *ngIf="!isEditing; else editName">
                <span>{{ editableUser.firstName }}</span>
                <span>{{ editableUser.lastName }}</span>
              </ng-container>
              <ng-template #editName>
                <input type="text"
                       [(ngModel)]="editableUser.firstName"
                       (ngModelChange)="fieldChange.emit({ field: 'firstName', value: $event })"
                       [readonly]="!isEditing"
                       class="input-field"/>
                <input type="text"
                       [(ngModel)]="editableUser.lastName"
                       (ngModelChange)="fieldChange.emit({ field: 'lastName',  value: $event })"
                       [readonly]="!isEditing"
                       class="input-field"/>
              </ng-template>
            </h5>

            <!-- City -->
            <span class="body-font-1 flex gap-1">
              <ng-container *ngIf="!isEditing; else editCity">
                <span>{{ editableUser.defaultCity }}, Ukraine</span>
              </ng-container>
              <ng-template #editCity>
                <input type="text"
                       [(ngModel)]="editableUser.defaultCity"
                       (ngModelChange)="fieldChange.emit({ field: 'defaultCity', value: $event })"
                       [readonly]="!isEditing"
                       class="input-field city-input"/>
                <span>, Ukraine</span>
              </ng-template>
            </span>
          </div>
        </div>

        <!-- Edit/Save desktop button -->
        <div class="hidden lg:flex">
          <button (click)="onToggleEdit.emit()" class="menu-text-font button-bg-transparent">
            {{ isEditing ? 'Save' : 'Edit Profile' }}
          </button>
        </div>
      </div>

      <!-- Bottom row: repeat Full Name, Location, Email -->
      <div class="flex flex-col gap-[20px] lg:flex-row lg:justify-between xxl:col-span-8">
        <div class="flex gap-3">
          <div class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]">
            <img src="/icons/id-pass.png" alt="" class="h-[26px] w-[20px]"/>
          </div>
          <div class="flex flex-col gap-1">
            <p class="body-font-1">Full Name</p>
            <p>{{ editableUser.firstName }} {{ editableUser.lastName }}</p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]">
            <img src="/icons/location.png" alt="" class="h-[26px] w-[20px]"/>
          </div>
          <div class="flex flex-col gap-1">
            <p class="body-font-1">Location</p>
            <p>{{ editableUser.defaultCity }}, Ukraine</p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="flex h-[50px] w-[50px] items-center justify-center rounded-[25px] bg-[var(--color-bg-2)]">
            <img src="/icons/letter.png" alt="" class="h-[26px] w-[20px]"/>
          </div>
          <div class="flex flex-col gap-1">
            <p class="body-font-1">Email</p>
            <p>{{ editableUser.email }}</p>
          </div>
        </div>
      </div>

      <!-- Edit/Save mobile button -->
      <div class="flex h-[48px] rounded-[40px] border border-[var(--color-primary)]
                  text-[var(--color-primary)] lg:hidden">
        <button (click)="onToggleEdit.emit()" class="menu-text-font flex-1 bg-transparent">
          {{ isEditing ? 'Save' : 'Edit Profile' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .input-field {
      border: none;
      border-bottom: 1px solid transparent;
      background: transparent;
      outline: none;
      font-size: 1rem;
      cursor: default;
      width: auto;
      max-width: 140px;
      transition: border-color .2s, background-color .2s;
    }
    .input-field.city-input { max-width: 150px; }
    .input-field[readonly] { color: var(--color-gray-70); }
  `]
})
export class InfoSectorComponent {
  @Input() editableUser!: User;
  @Input() isEditing = false;

  /** match parent (onToggleEdit) */
  @Output() onToggleEdit = new EventEmitter<void>();

  /** match parent (fieldChange) */
  @Output() fieldChange = new EventEmitter<{ field: keyof User; value: any }>();
}
