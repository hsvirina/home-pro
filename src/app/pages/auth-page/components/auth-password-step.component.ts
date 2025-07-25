import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from "../../../shared/components/icon.component";

@Component({
  selector: 'app-auth-password-step',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-5">
        <div
          class="flex cursor-pointer select-none items-center"
          (click)="goBack.emit()"
          style="user-select: none;"
        >
          <app-icon [icon]="ICONS.ArrowLeft" class="mr-[32px]" />
          <h4 class="m-0">Create your Beanly account</h4>
        </div>
        <span class="body-font-1 text-center">
          Come up with a password for the email
          <span class="font-semibold">{{ email }}</span>
        </span>
      </div>

      <form
        autocomplete="off"
        class="flex flex-col gap-[12px]"
        (ngSubmit)="submitPassword()"
      >
        <div class="relative flex flex-col gap-[4px]">
          <span class="body-font-2 text-[var(--color-gray-75)]">Password</span>
          <div class="relative">
            <input
              [type]="showPassword ? 'text' : 'password'"
              placeholder="Enter password"
              [(ngModel)]="password"
              name="password"
              (ngModelChange)="passwordChange.emit($event)"
              [class.border-red-600]="passwordTooWeak"
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
              (click)="toggleShowPassword()"
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
            *ngIf="passwordTooWeak"
            class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
          >
            <app-icon [icon]="ICONS.RedClose" />
            Password too weak
          </div>
        </div>

        <div class="relative flex flex-col gap-[4px]">
          <span class="body-font-2 text-[var(--color-gray-75)]"
            >Confirm Password</span
          >
          <div class="relative">
            <input
              autocomplete="new-password"
              [type]="showRepeatPassword ? 'text' : 'password'"
              placeholder="Enter the password again"
              [(ngModel)]="repeatPassword"
              (ngModelChange)="repeatPasswordChange.emit($event)"
              name="confirmPass"
              [class.border-red-600]="passwordMismatch"
              [ngClass]="{
                'text-[var(--color-gray-55)]': !repeatPassword,
                'text-[var(--color-gray-100)]': repeatPassword,
              }"
              class="body-font-1 w-full rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 outline-none focus:border-[var(--color-gray-20)]"
              required
            />
            <button
              *ngIf="repeatPassword"
              type="button"
              (click)="toggleShowRepeatPassword()"
              tabindex="-1"
              aria-label="Toggle repeat password visibility"
              class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
            >
              <app-icon
  [icon]="showRepeatPassword ? ICONS.EyeSlash : ICONS.Eye"
  class="h-[20px] w-[20px]"
/>
            </button>
          </div>
          <div
            *ngIf="passwordMismatch"
            class="body-font-2 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
          >
            <app-icon [icon]="ICONS.RedClose" />
            Confirm password mismatch
          </div>
        </div>

        <button
          type="submit"
          class="button-font button-bg-blue px-[32px] py-[12px]"
        >
          Create account
        </button>
      </form>
    </div>
  `,
})
export class AuthPasswordStepComponent {
  ICONS = ICONS
  @Input() email = '';
  @Input() password = '';
  @Input() repeatPassword = '';
  @Input() showPassword = false;
  @Input() showRepeatPassword = false;
  @Input() passwordTooWeak = false;
  @Input() passwordMismatch = false;

  @Output() passwordChange = new EventEmitter<string>();
  @Output() repeatPasswordChange = new EventEmitter<string>();
  @Output() passwordSubmit = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowRepeatPassword() {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  submitPassword() {
    this.passwordSubmit.emit();
  }
}
