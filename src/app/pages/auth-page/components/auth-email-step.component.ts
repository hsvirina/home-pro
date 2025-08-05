import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-email-step',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header and toggle to login form -->
      <div class="flex flex-col gap-5">
        <h4 class="text-center">{{ 'AUTH.REGISTER_TITLE' | translate }}</h4>
        <span class="body-font-1 text-center">
           {{ 'AUTH.ALREADY_HAVE_ACCOUNT' | translate }}
          <button class="underline" (click)="toggleForm.emit()">
            <h6>{{ 'BUTTON.LOG_IN' | translate }}</h6>
          </button>
        </span>
      </div>

      <!-- Email input form -->
      <form class="flex flex-col gap-[12px]" (ngSubmit)="submitEmail()">
        <div class="flex flex-col gap-[4px]">
          <span class="body-font-2 "
          [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'text-[var(--color-gray-75)]'
                : 'text-[var(--color-gray-55)]',
            ]">
            {{ 'AUTH.EMAIL_PROMPT_1' | translate }}
          </span>
          <input
            type="email"
            [placeholder]="'AUTH.EMAIL_PLACEHOLDER' | translate"
            [(ngModel)]="email"
            name="email"
            [ngClass]="[
              (currentTheme$ | async) === 'light'
                ? 'border-[var(--color-gray-20)] placeholder-[var(--color-gray-75)]'
                : 'border-[var(--color-gray-100)] placeholder-[var(--color-gray-55)]',
            ]"
            class="body-font-1 rounded-[40px] border bg-[var(--color-bg)] px-6 py-3  focus:outline-none"
            required
            email
          />
        </div>

        <!-- Submit button is enabled only if email is valid -->
        <button
          type="submit"
          [disabled]="!isValidEmail"
          [ngClass]="[
            'rounded-[40px]',
            'px-[32px]',
            'py-[12px]',
            'button-font',
            isValidEmail ? 'button-bg-blue' : 'text-[var(--color-gray-55)]',
            (currentTheme$ | async) === 'light' && !isValidEmail
              ? 'bg-[var(--color-gray-20)]'
              : '',
            (currentTheme$ | async) === 'dark' && !isValidEmail
              ? 'bg-[var(--color-gray-100)]'
              : '',
          ]"
        >
          {{ 'AUTH.NEXT' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class AuthEmailStepComponent {
  @Input() email = '';
  @Output() emailSubmit = new EventEmitter<string>();
  @Output() toggleForm = new EventEmitter<void>();

  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  get isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  submitEmail() {
    if (this.isValidEmail) {
      this.emailSubmit.emit(this.email);
    }
  }
}
