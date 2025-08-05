import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { Observable } from 'rxjs';
import { Theme } from '../../../core/models/theme.type';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';
import { TranslateModule } from '@ngx-translate/core';

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
      <!-- Header with back button and title -->
      <div
        class="flex cursor-pointer select-none"
        (click)="goBack.emit()"
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

      <!-- Login form -->
      <form
        autocomplete="off"
        class="flex flex-col gap-[12px]"
        (ngSubmit)="submitLogin()"
      >
        <!-- Email input with validation -->
        <div class="flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'text-[var(--color-gray-75)]'
                : 'text-[var(--color-gray-55)]',
            ]"
            >{{ 'AUTH.EMAIL_PROMPT_1' | translate }}</span
          >
          <input
            type="email"
            [placeholder]="'AUTH.EMAIL_PLACEHOLDER' | translate"
            [(ngModel)]="email"
            (ngModelChange)="emailChange.emit($event)"
            name="loginEmail"
            [class.border-red-600]="loginError && !email"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]'
                : 'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]',
            ]"
            class="body-font-1 rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 focus:outline-none"
            required
          />
          <div
            *ngIf="loginError && !email"
            class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
          >
            <app-icon [icon]="ICONS.RedClose" />
            {{ 'AUTH.EMAIL_REQUIRED' | translate }}
          </div>
        </div>

        <!-- Password input with toggle visibility and validation -->
        <div class="relative flex flex-col gap-[4px]">
          <span
            class="body-font-2"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'text-[var(--color-gray-75)]'
                : 'text-[var(--color-gray-55)]',
            ]"
          >
            {{ 'AUTH.PASSWORD_PROMPT' | translate }}</span
          >
          <div class="relative">
            <input
              [type]="showPassword ? 'text' : 'password'"
              [placeholder]="'AUTH.PASSWORD_PLACEHOLDER' | translate"
              [(ngModel)]="password"
              (ngModelChange)="passwordChange.emit($event)"
              name="loginPassword"
              [class.border-red-600]="loginError && !password"
              [ngClass]="[
                (currentTheme$ | async) === 'light'
                  ? 'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]'
                  : 'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]',
              ]"
              class="body-font-1 w-full rounded-[40px] border bg-[var(--color-bg)] px-6 py-3 outline-none"
              required
            />
            <button
              *ngIf="password"
              type="button"
              (click)="togglePasswordVisibility.emit()"
              tabindex="-1"
              attr.aria-label="{{
                'AUTH.TOGGLE_PASSWORD_VISIBILITY' | translate
              }}"
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
            class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
          >
            <app-icon [icon]="ICONS.RedClose" />
            {{ 'AUTH.PASSWORD_REQUIRED' | translate }}
          </div>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          class="button-font button-bg-blue px-[32px] py-[12px]"
        >
          {{ 'BUTTON.LOG_IN' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class AuthLoginStepComponent {
  ICONS = ICONS;

  // Input properties for login form state and error flag
  @Input() email = '';
  @Input() password = '';
  @Input() showPassword = false;
  @Input() loginError = false;

  // Output events to notify parent about changes and actions
  @Output() emailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() togglePasswordVisibility = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Emits the login submit event when form is submitted
   */
  submitLogin() {
    this.loginSubmit.emit();
  }
}
