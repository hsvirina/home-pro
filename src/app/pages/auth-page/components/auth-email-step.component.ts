import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-email-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header and toggle to login form -->
      <div class="flex flex-col gap-5">
        <h4 class="text-center">Create your Beanly account</h4>
        <span class="body-font-1 text-center">
          Already have an account?
          <button class="shadow-hover underline" (click)="toggleForm.emit()">
            <h6>Log In</h6>
          </button>
        </span>
      </div>

      <!-- Email input form -->
      <form class="flex flex-col gap-[12px]" (ngSubmit)="submitEmail()">
        <div class="flex flex-col gap-[4px]">
          <span class="body-font-2 text-[var(--color-gray-75)]">
            First, enter your email address
          </span>
          <input
            type="email"
            placeholder="email@gmail.com"
            [(ngModel)]="email"
            name="email"
            [ngClass]="{
              'text-[var(--color-gray-55)]': !email,
              'text-[var(--color-gray-100)]': email
            }"
            class="body-font-1 rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 focus:border-[var(--color-gray-20)] focus:outline-none"
            required
            email
          />
        </div>

        <!-- Submit button is enabled only if email is valid -->
        <button
          type="submit"
          [disabled]="!isValidEmail"
          [ngClass]="{
            'button-bg-blue': isValidEmail,
            'bg-[var(--color-gray-20)] text-[var(--color-gray-55)]': !isValidEmail
          }"
          class="button-font rounded-[40px] px-[32px] py-[12px]"
        >
          Next
        </button>
      </form>
    </div>
  `,
})
export class AuthEmailStepComponent {
  @Input() email = '';
  @Output() emailSubmit = new EventEmitter<string>();
  @Output() toggleForm = new EventEmitter<void>();

  /**
   * Validates the email using a simple regex pattern
   */
  get isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  /**
   * Emits the emailSubmit event only if the email is valid
   */
  submitEmail() {
    if (this.isValidEmail) {
      this.emailSubmit.emit(this.email);
    }
  }
}
