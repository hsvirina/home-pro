import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthStateService } from '../../state/auth/auth-state.service';
import { SocialLoginPlaceholderComponent } from './components/social-login.component';
import { AuthEmailStepComponent } from './components/auth-email-step.component';
import { AuthPasswordStepComponent } from './components/auth-password-step.component';
import { AuthLoginStepComponent } from './components/auth-login-step.component';
import { WelcomeModalComponent } from './components/welcome-modal.component';

import { ICONS } from '../../core/constants/icons.constant';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SocialLoginPlaceholderComponent,
    AuthEmailStepComponent,
    AuthPasswordStepComponent,
    AuthLoginStepComponent,
    WelcomeModalComponent,
    IconComponent,
  ],
  template: `
    <ng-template #splash>
      <div
        class="fixed left-0 top-[52px] z-[9999] h-[calc(100vh-52px)] w-full overflow-hidden bg-[var(--color-bg)] lg:top-[76px] lg:h-[calc(100vh-76px)] xxl:top-[86px] xxl:h-[calc(100vh-86px)]"
        title="Click to skip splash"
      >
        <!-- Decorative images with absolute positioning -->
        <img src="/assets/splash/coffee-beans.png" alt="coffee beans" class="absolute left-0 top-[8%] z-0 max-w-[184px] object-contain" />
        <img src="/assets/splash/croissant.png" alt="croissant" class="absolute left-[32%] top-[13%] z-0 max-w-[152px] object-contain" />
        <img src="/assets/splash/cake.png" alt="cake" class="absolute right-[28%] top-[7%] z-0 max-w-[152px] object-contain" />
        <img src="/assets/splash/turkish-coffee.png" alt="turka" class="absolute right-0 top-[18%] z-0 max-w-[118px] object-contain" />
        <img src="/assets/splash/donut.png" alt="donut" class="absolute right-[17%] top-[68%] z-0 max-w-[142px] object-contain" />
        <img src="/assets/splash/coffee-cup.png" alt="coffee cup" class="absolute bottom-[13%] left-[22%] z-0 max-w-[176px] object-contain" />

        <!-- Centered splash content -->
        <div class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 class="max-w-[1068px] text-[56px] font-bold uppercase leading-tight text-[var(--color-gray-100)] lg:text-[80px] xxl:text-[96px]">
            <span class="text-[var(--color-primary)]">Coffee</span> places you’ll
            <span class="text-[var(--color-primary)]">love</span>, picked for you
          </h1>

          <button
            (click)="onContinueFromSplash()"
            class="button-font button-bg-blue mt-[60px] flex h-[84px] w-[315px] gap-[12px] px-[32px] py-[12px]"
          >
            Explore now
            <app-icon [icon]="ICONS.ArrowDownRightWhite" />
          </button>
        </div>
      </div>
    </ng-template>

    <!-- Main auth content -->
    <ng-container *ngIf="!showSplash; else splash">
      <div class="flex flex-col gap-[32px] px-[30px] py-[40px] text-[var(--color-gray-100)]">

        <!-- Authentication steps container -->
        <div class="grid grid-cols-8">
          <div class="col-span-8 lg:col-span-6 lg:col-start-2 xxl:col-span-4 xxl:col-start-3">
            <ng-container [ngSwitch]="step">
              <app-auth-email-step
                *ngSwitchCase="1"
                [email]="email"
                (emailSubmit)="onEmailSubmit($event)"
                (toggleForm)="toggleForm()"
                class="w-full"
              ></app-auth-email-step>

              <app-auth-password-step
                *ngSwitchCase="2"
                [email]="email"
                [password]="password"
                [repeatPassword]="repeatPassword"
                [showPassword]="showPassword"
                [showRepeatPassword]="showRepeatPassword"
                [passwordTooWeak]="passwordTooWeak"
                [passwordMismatch]="passwordMismatch"
                (passwordChange)="onPasswordChange($event)"
                (repeatPasswordChange)="onRepeatPasswordChange($event)"
                (passwordSubmit)="onSubmitPassword()"
                (goBack)="goBackToEmail()"
                class="w-full"
              ></app-auth-password-step>

              <app-auth-login-step
                *ngSwitchCase="3"
                [email]="email"
                [password]="password"
                [showPassword]="showPassword"
                [loginError]="loginError"
                (loginSubmit)="onSubmitLogin()"
                (goBack)="goBackToEmail()"
                (emailChange)="email = $event"
                (passwordChange)="password = $event"
                (togglePasswordVisibility)="showPassword = !showPassword"
                class="w-full"
              ></app-auth-login-step>
            </ng-container>
          </div>
        </div>

        <!-- Social login section -->
        <div class="grid grid-cols-8">
          <app-social-login
            (showTemporaryMessage)="showTemporaryMessage()"
            [showMessage]="showMessage"
            class="col-span-8 lg:col-span-6 lg:col-start-2 xxl:col-span-4 xxl:col-start-3"
          ></app-social-login>
        </div>

        <!-- Welcome modal -->
        <div class="grid grid-cols-8">
          <app-welcome-modal
            *ngIf="showWelcomeModal"
            [isNewUser]="isNewUser"
            (close)="closeWelcomeModal()"
            class="col-span-8 lg:col-span-6 lg:col-start-2 xxl:col-span-4 xxl:col-start-3"
          ></app-welcome-modal>
        </div>

      </div>
    </ng-container>
  `,
})
export class AuthPageComponent {
  ICONS = ICONS;

  // Splash screen visibility
  showSplash = true;

  // Auth step control: 1 = email, 2 = password, 3 = login
  step = 1;

  // Form data and state flags
  email = '';
  password = '';
  repeatPassword = '';
  showPassword = false;
  showRepeatPassword = false;
  passwordTooWeak = false;
  passwordMismatch = false;
  loginError = false;
  showMessage = false;

  // Welcome modal control
  showWelcomeModal = false;
  isNewUser = false;

  constructor(
    private router: Router,
    private authService: AuthStateService,
  ) {}

  // Hide splash screen and show auth forms
  onContinueFromSplash(): void {
    this.showSplash = false;
  }

  // Handle email submission, move to password step
  onEmailSubmit(email: string): void {
    this.email = email;
    this.step = 2;

    // Reset password-related fields and flags
    this.password = '';
    this.repeatPassword = '';
    this.passwordTooWeak = false;
    this.passwordMismatch = false;
    this.showPassword = false;
    this.showRepeatPassword = false;
  }

  // Handle password submission and registration flow
  onSubmitPassword(): void {
    if (this.password.length < 6) {
      this.passwordTooWeak = true;
      return;
    }
    if (this.password !== this.repeatPassword) {
      this.passwordMismatch = true;
      return;
    }

    // Extract first and last name from email for registration
    const fullNameParts = this.email.split('@')[0].split('.');
    const firstName = fullNameParts[0] || 'User';
    const lastName = fullNameParts[1] || '';

    this.authService.register(this.email, this.password, firstName, lastName).subscribe({
      next: () => {
        // After successful registration, log the user in
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            this.isNewUser = true;
            this.showWelcomeModal = true;
          },
          error: (err) =>
            alert('Login error after registration: ' + (err.message || err.statusText)),
        });
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message?.includes('Email is already taken')) {
          alert('This email is already registered. Please use another or login.');
          this.step = 3; // Switch to login step if email taken
        } else {
          alert('Registration error: ' + (err.message || err.statusText));
        }
      },
    });
  }

  // Handle login submission
  onSubmitLogin(): void {
    this.loginError = false;

    if (!this.email || !this.password) {
      this.loginError = true;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isNewUser = false;
        this.showWelcomeModal = true;
      },
      error: (err) => alert('Login error: ' + err.message),
    });
  }

  // Toggle between email form and login form
  toggleForm(): void {
    this.step = this.step === 1 ? 3 : 1;
  }

  // Return to email step and reset passwords
  goBackToEmail(): void {
    this.step = 1;
    this.password = '';
    this.repeatPassword = '';
  }

  // Reset password-related errors on password input change
  onPasswordChange(password: string): void {
    this.password = password;
    this.passwordTooWeak = false;
    this.passwordMismatch = false;
  }

  onRepeatPasswordChange(repeatPassword: string): void {
    this.repeatPassword = repeatPassword;
    this.passwordMismatch = false;
  }

  // Show temporary message for social login notifications
  showTemporaryMessage(): void {
    this.showMessage = true;
    setTimeout(() => (this.showMessage = false), 3000);
  }

  // Close welcome modal and navigate home
  closeWelcomeModal(): void {
    this.showWelcomeModal = false;
    this.goHome();
  }

  // Navigate to home page
  goHome(): void {
    this.router.navigate(['/']);
  }
}
