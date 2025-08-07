import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';

@Component({
  selector: 'app-auth-password-step',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ThemedIconPipe, TranslateModule],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header with back button and title -->
      <div class="flex flex-col gap-5">
        <div
          class="flex cursor-pointer select-none items-center"
          (click)="goBack.emit()"
          style="user-select: none;"
          [attr.aria-label]="'AUTH.BACK_BUTTON_LABEL' | translate"
          role="button"
          tabindex="0"
          (keydown.enter)="goBack.emit()"
          (keydown.space)="goBack.emit()"
        >
          <app-icon
            [icon]="'ArrowLeft' | themedIcon"
            [width]="32"
            [height]="32"
            class="mr-[32px]"
          ></app-icon>
          <h4 class="m-0">{{ 'AUTH.REGISTER_TITLE' | translate }}</h4>
        </div>
        <span class="body-font-1 text-center">
          {{ 'AUTH.EMAIL_PROMPT' | translate }}
          <span>{{ email }}</span>
        </span>
      </div>

      <!-- Password form -->
      <form autocomplete="off" class="flex flex-col gap-[12px]" (ngSubmit)="submitPassword()">
        <!-- Password input with toggle visibility -->
        <div class="relative flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'text-[var(--color-gray-75)]'
                : 'text-[var(--color-gray-55)]'
            ]"
          >
            {{ 'AUTH.PASSWORD_LABEL' | translate }}
          </span>
          <div class="relative">
            <input
              [type]="showPassword ? 'text' : 'password'"
              placeholder="{{ 'AUTH.PASSWORD_PLACEHOLDER' | translate }}"
              [(ngModel)]="password"
              name="password"
              (ngModelChange)="passwordChange.emit($event)"
              [class.border-red-600]="passwordTooWeak"
              [ngClass]="[
                (currentTheme$ | async) === 'light'
                  ? 'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]'
                  : 'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]'
              ]"
              class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 placeholder-[var(--color-gray-75)] outline-none"
              autocomplete="new-password"
              [attr.aria-invalid]="passwordTooWeak"
            />
            <button
              *ngIf="password"
              type="button"
              (click)="toggleShowPassword()"
              tabindex="-1"
              [attr.aria-label]="'AUTH.TOGGLE_PASSWORD_VISIBILITY' | translate"
              class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
            >
              <app-icon
                [icon]="(showPassword ? 'EyeSlash' : 'Eye') | themedIcon"
                class="h-[20px] w-[20px]"
              ></app-icon>
            </button>
          </div>

          <!-- Password strength validation message -->
          <div
            *ngIf="passwordTooWeak"
            class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
            role="alert"
          >
            <app-icon [icon]="ICONS.RedClose" />
            {{ 'AUTH.PASSWORD_TOO_WEAK' | translate }}
          </div>
        </div>

        <!-- Confirm password input with toggle visibility -->
        <div class="relative flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'text-[var(--color-gray-75)]'
                : 'text-[var(--color-gray-55)]'
            ]"
          >
            {{ 'AUTH.CONFIRM_PASSWORD_LABEL' | translate }}
          </span>
          <div class="relative">
            <input
              autocomplete="new-password"
              required
              [type]="showRepeatPassword ? 'text' : 'password'"
              placeholder="{{ 'AUTH.CONFIRM_PASSWORD_PLACEHOLDER' | translate }}"
              [(ngModel)]="repeatPassword"
              (ngModelChange)="repeatPasswordChange.emit($event)"
              name="confirmPass"
              [class.border-red-600]="passwordMismatch"
              [ngClass]="[
                (currentTheme$ | async) === 'light'
                  ? 'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]'
                  : 'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]'
              ]"
              class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 outline-none"
              [attr.aria-invalid]="passwordMismatch"
              aria-describedby="passwordMismatchMessage"
            />
            <button
              *ngIf="repeatPassword"
              type="button"
              (click)="toggleShowRepeatPassword()"
              tabindex="-1"
              [attr.aria-label]="'AUTH.TOGGLE_REPEAT_PASSWORD_VISIBILITY' | translate"
              class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
            >
              <app-icon
                [icon]="(showRepeatPassword ? 'EyeSlash' : 'Eye') | themedIcon"
                class="h-[20px] w-[20px]"
              />
            </button>
          </div>

          <!-- Password mismatch validation message -->
          <div
            *ngIf="passwordMismatch"
            id="passwordMismatchMessage"
            class="body-font-2 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
            role="alert"
          >
            <app-icon [icon]="ICONS.RedClose" />
            {{ 'AUTH.PASSWORD_MISMATCH' | translate }}
          </div>
        </div>

        <!-- First name input -->
        <div class="flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'text-[var(--color-gray-75)]'
                : 'text-[var(--color-gray-55)]'
            ]"
          >
            {{ 'AUTH.FIRST_NAME_LABEL' | translate }}
          </span>
          <input
            type="text"
            [(ngModel)]="firstName"
            name="firstName"
            (ngModelChange)="firstNameChange.emit($event)"
            placeholder="{{ 'AUTH.FIRST_NAME_PLACEHOLDER' | translate }}"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]'
                : 'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]'
            ]"
            class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 placeholder-[var(--color-gray-75)] outline-none"
            required
          />
        </div>

        <!-- Last name input -->
        <div class="flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'text-[var(--color-gray-75)]'
                : 'text-[var(--color-gray-55)]'
            ]"
          >
            {{ 'AUTH.LAST_NAME_LABEL' | translate }}
          </span>
          <input
            type="text"
            [(ngModel)]="lastName"
            name="lastName"
            (ngModelChange)="lastNameChange.emit($event)"
            placeholder="{{ 'AUTH.LAST_NAME_PLACEHOLDER' | translate }}"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]'
                : 'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]'
            ]"
            class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 placeholder-[var(--color-gray-75)] outline-none"
            required
          />
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          class="button-font button-bg-blue px-[32px] py-[12px]"
        >
          {{ 'AUTH.CREATE_ACCOUNT' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class AuthPasswordStepComponent {
  ICONS = ICONS;

  // Input properties for form data and validation flags
  @Input() email = '';
  @Input() password = '';
  @Input() repeatPassword = '';
  @Input() showPassword = false;
  @Input() showRepeatPassword = false;
  @Input() passwordTooWeak = false;
  @Input() passwordMismatch = false;
  @Input() firstName = '';
  @Input() lastName = '';

  // Output events to notify parent component about changes and actions
  @Output() firstNameChange = new EventEmitter<string>();
  @Output() lastNameChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() repeatPasswordChange = new EventEmitter<string>();
  @Output() passwordSubmit = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Toggle visibility of password input field
   */
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle visibility of repeat password input field
   */
  toggleShowRepeatPassword() {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  /**
   * Emit event to submit the password form
   */
  submitPassword() {
    this.passwordSubmit.emit();
  }
}
