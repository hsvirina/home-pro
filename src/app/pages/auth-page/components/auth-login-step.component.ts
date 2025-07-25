import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';

@Component({
  selector: 'app-auth-login-step',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div
      class="flex cursor-pointer select-none items-center justify-center"
      (click)="goBack.emit()"
      style="user-select: none;"
    >
      <app-icon [icon]="ICONS.ArrowLeft" class="mr-[32px]" />
      <h4 class="text-center">Welcome back! Log in to your Beanly account</h4>
    </div>

    <form
      autocomplete="off"
      class="flex flex-col gap-[12px]"
      (ngSubmit)="submitLogin()"
    >
      <div class="flex flex-col gap-[4px]">
        <span class="body-font-2 text-[var(--color-gray-75)]">Email</span>
        <input
          type="email"
          placeholder="email@gmail.com"
          [(ngModel)]="email"
          (ngModelChange)="emailChange.emit($event)"
          name="loginEmail"
          [class.border-red-600]="loginError && !email"
          [ngClass]="{
            'text-[var(--color-gray-55)]': !email,
            'text-[var(--color-gray-100)]': email,
          }"
          class="body-font-1 rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 focus:border-[var(--color-gray-20)] focus:outline-none"
          required
        />
        <div
          *ngIf="loginError && !email"
          class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
        >
          <app-icon [icon]="ICONS.RedClose" />
          Email is required
        </div>
      </div>

      <div class="relative flex flex-col gap-[4px]">
        <span class="body-font-2 text-[var(--color-gray-75)]">Password</span>
        <div class="relative">
          <input
            [type]="showPassword ? 'text' : 'password'"
            placeholder="Enter password"
            [(ngModel)]="password"
            (ngModelChange)="passwordChange.emit($event)"
            name="loginPassword"
            [class.border-red-600]="loginError && !password"
            [ngClass]="{
              'text-[var(--color-gray-55)]': !password,
              'text-[var(--color-gray-100)]': password,
            }"
            class="body-font-1 w-full rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 outline-none focus:border-[var(--color-gray-20)]"
            required
          />
          <button
            *ngIf="password"
            type="button"
            (click)="togglePasswordVisibility.emit()"
            tabindex="-1"
            aria-label="Toggle password visibility"
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
          Password is required
        </div>
      </div>

      <button
        type="submit"
        class="button-font button-bg-blue px-[32px] py-[12px]"
      >
        Log In
      </button>
    </form>
  `,
})
export class AuthLoginStepComponent {
  ICONS = ICONS;
  @Input() email = '';
  @Input() password = '';
  @Input() showPassword = false;
  @Input() loginError = false;

  @Output() emailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() togglePasswordVisibility = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  submitLogin() {
    this.loginSubmit.emit();
  }
}
