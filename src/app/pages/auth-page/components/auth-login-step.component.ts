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
  selector: 'app-auth-login-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    ThemedIconPipe,
    TranslateModule,
  ],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header section with back button and localized title -->
      <div
        class="flex cursor-pointer select-none"
        (click)="goBack.emit()"
        role="button"
        tabindex="0"
        [attr.aria-label]="'AUTH.GO_BACK' | translate"
        (keydown.enter)="goBack.emit()"
        (keydown.space)="goBack.emit()"
        style="user-select: none;"
      >
        <app-icon
          [icon]="'ArrowLeft' | themedIcon"
          [width]="32"
          [height]="32"
          class="mr-[32px]"
        ></app-icon>
        <h4>{{ 'AUTH.LOG_IN_TITLE' | translate }}</h4>
      </div>

      <!-- Login form with email and password inputs -->
      <form
        autocomplete="off"
        class="flex flex-col gap-[12px]"
        (ngSubmit)="submitLogin()"
        novalidate
      >
        <!-- Email input field with validation and error display -->
        <div class="flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="{
              'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
              'text-[var(--color-gray-55)]': (currentTheme$ | async) !== 'light'
            }"
          >
            {{ 'AUTH.EMAIL_PROMPT_1' | translate }}
          </span>
          <input
            type="email"
            name="loginEmail"
            [(ngModel)]="email"
            (ngModelChange)="emailChange.emit($event)"
            [placeholder]="'AUTH.EMAIL_PLACEHOLDER' | translate"
            required
            [attr.aria-invalid]="loginError && !email"
            aria-describedby="emailError"
            [class.border-red-600]="loginError && !email"
            [ngClass]="{
              'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
              'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]': (currentTheme$ | async) !== 'light'
            }"
            class="body-font-1 rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 focus:outline-none"
          />
          <div
            *ngIf="loginError && !email"
            id="emailError"
            role="alert"
            class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
          >
            <app-icon [icon]="ICONS.RedClose" />
            {{ 'AUTH.EMAIL_REQUIRED' | translate }}
          </div>
        </div>

        <!-- Password input field with visibility toggle and validation -->
        <div class="relative flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="{
              'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
              'text-[var(--color-gray-55)]': (currentTheme$ | async) !== 'light'
            }"
          >
            {{ 'AUTH.PASSWORD_PROMPT' | translate }}
          </span>
          <div class="relative">
            <input
              [type]="showPassword ? 'text' : 'password'"
              name="loginPassword"
              [(ngModel)]="password"
              (ngModelChange)="passwordChange.emit($event)"
              [placeholder]="'AUTH.PASSWORD_PLACEHOLDER' | translate"
              required
              [attr.aria-invalid]="loginError && !password"
              aria-describedby="passwordError"
              [class.border-red-600]="loginError && !password"
              [ngClass]="{
                'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
                'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]': (currentTheme$ | async) !== 'light'
              }"
              class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 outline-none"
            />
            <!-- Password visibility toggle button -->
            <button
              *ngIf="password"
              type="button"
              (click)="togglePasswordVisibility.emit()"
              tabindex="-1"
              [attr.aria-label]="'AUTH.TOGGLE_PASSWORD_VISIBILITY' | translate"
              class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
            >
              <app-icon
                [icon]="showPassword ? ICONS.EyeSlash : ICONS.Eye"
                class="h-[20px] w-[20px]"
              />
            </button>
          </div>
          <div
            *ngIf="loginError && !password"
            id="passwordError"
            role="alert"
            class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
          >
            <app-icon [icon]="ICONS.RedClose" />
            {{ 'AUTH.PASSWORD_REQUIRED' | translate }}
          </div>
        </div>

        <!-- Submit button with disabled state based on input validation -->
        <button
          type="submit"
          class="button-font button-bg-blue px-[32px] py-[12px]"
          [disabled]="loginError && (!email || !password)"
        >
          {{ 'button.log_in' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class AuthLoginStepComponent {
  /** Icons constants to be used in the template */
  readonly ICONS = ICONS;

  /** User's email input, bound via ngModel */
  @Input() email = '';

  /** User's password input, bound via ngModel */
  @Input() password = '';

  /** Flag to toggle password visibility */
  @Input() showPassword = false;

  /** Flag indicating whether to display validation errors */
  @Input() loginError = false;

  /** Emits when the email input changes */
  @Output() emailChange = new EventEmitter<string>();

  /** Emits when the password input changes */
  @Output() passwordChange = new EventEmitter<string>();

  /** Emits when user toggles password visibility */
  @Output() togglePasswordVisibility = new EventEmitter<void>();

  /** Emits when user submits the login form */
  @Output() loginSubmit = new EventEmitter<void>();

  /** Emits when user clicks the back button */
  @Output() goBack = new EventEmitter<void>();

  /** Observable of current theme ('light' | 'dark'), used for dynamic styling */
  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    // Subscribe to the current theme observable from the theme service
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Emits loginSubmit event to notify parent component of form submission.
   * Validation and actual login logic should be handled by the parent.
   */
  submitLogin(): void {
    this.loginSubmit.emit();
  }
}
