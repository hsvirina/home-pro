import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthStateService } from '../../state/auth/auth-state.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { StorageService } from '../../core/services/storage.service';

import { ICONS } from '../../core/constants/icons.constant';

// Auth step components
import { AuthEmailStepComponent } from './components/auth-email-step.component';
import { AuthPasswordStepComponent } from './components/auth-password-step.component';
import { AuthLoginStepComponent } from './components/auth-login-step.component';
import { WelcomeModalComponent } from './components/welcome-modal.component';
import { SocialLoginPlaceholderComponent } from './components/social-login.component';

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
  ],
  template: `
    <!-- Main authentication container -->
    <div class="mx-auto flex max-w-[1320px] flex-col gap-[32px] px-5 lg:px-10 xxl:px-0">

      <!-- Step components: Email, Password/Registration, Login -->
      <div class="grid grid-cols-8">
        <div class="col-span-8 lg:col-span-6 lg:col-start-2 xxl:col-span-4 xxl:col-start-3">
          <ng-container [ngSwitch]="step">
            <!-- Step 1: Email entry -->
            <app-auth-email-step
              *ngSwitchCase="1"
              [email]="email"
              (emailSubmit)="onEmailSubmit($event)"
              (toggleForm)="toggleForm()"
              class="w-full"
            ></app-auth-email-step>

            <!-- Step 2: Password creation/registration -->
            <app-auth-password-step
              *ngSwitchCase="2"
              [email]="email"
              [password]="password"
              [repeatPassword]="repeatPassword"
              [firstName]="firstName"
              [lastName]="lastName"
              (passwordChange)="onPasswordChange($event)"
              (repeatPasswordChange)="onRepeatPasswordChange($event)"
              (firstNameChange)="firstName = $event"
              (lastNameChange)="lastName = $event"
              (passwordSubmit)="onSubmitPassword()"
              (goBack)="goBackToEmail()"
            ></app-auth-password-step>

            <!-- Step 3: Login -->
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

      <!-- Social login buttons -->
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
          (close)="closeWelcomeModal()"
        ></app-welcome-modal>
      </div>
    </div>
  `,
})
export class AuthPageComponent {
  /** Icon constants for child components */
  readonly ICONS = ICONS;

  /** Current step in the authentication flow */
  step = 1;

  /** User input fields */
  email = '';
  password = '';
  repeatPassword = '';
  firstName = '';
  lastName = '';

  /** UI state flags */
  showPassword = false;
  showRepeatPassword = false;
  passwordTooWeak = false;
  passwordMismatch = false;
  loginError = false;
  showMessage = false;
  showWelcomeModal = false;
  isNewUser = false;

  constructor(
    private router: Router,
    private authService: AuthStateService,
    private storageService: StorageService,
    private userApi: AuthApiService,
  ) {}

  // =========================
  // STEP NAVIGATION METHODS
  // =========================

  /** Called when email is submitted. Moves to password step. */
  onEmailSubmit(email: string): void {
    this.email = email;
    this.step = 2;

    // Reset password fields and validation
    this.password = '';
    this.repeatPassword = '';
    this.passwordTooWeak = false;
    this.passwordMismatch = false;
    this.showPassword = false;
    this.showRepeatPassword = false;
  }

  /** Toggle between email (step 1) and login (step 3) forms */
  toggleForm(): void {
    this.step = this.step === 1 ? 3 : 1;
  }

  /** Returns to the email entry step */
  goBackToEmail(): void {
    this.step = 1;
    this.password = '';
    this.repeatPassword = '';
  }

  // =========================
  // PASSWORD / REGISTRATION
  // =========================

  /** Handles registration with password validation */
  onSubmitPassword(): void {
    this.passwordTooWeak = false;
    this.passwordMismatch = false;

    if (this.password.length < 6) {
      this.passwordTooWeak = true;
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.authService
      .register(this.email, this.password, this.firstName.trim(), this.lastName.trim())
      .subscribe({
        next: () => this.loginAfterRegistration(),
        error: (err) => this.handleRegistrationError(err),
      });
  }

  /** Performs login immediately after successful registration */
  private loginAfterRegistration(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.loadUserProfile(true),
      error: (err) => alert('Login error after registration: ' + (err.message || err.statusText)),
    });
  }

  /** Handles registration errors */
  private handleRegistrationError(err: any): void {
    if (err.status === 400 && err.error?.message?.includes('Email is already taken')) {
      alert('This email is already registered. Please login.');
      this.step = 3;
    } else {
      alert('Registration error: ' + (err.message || err.statusText));
    }
  }

  /** Handles password input change */
  onPasswordChange(password: string): void {
    this.password = password;
    this.passwordTooWeak = this.password.length > 0 && this.password.length < 6;
    this.passwordMismatch = false;
  }

  /** Handles confirm password input change */
  onRepeatPasswordChange(repeatPassword: string): void {
    this.repeatPassword = repeatPassword;
    this.passwordMismatch = false;
  }

  // =========================
  // LOGIN
  // =========================

  /** Handles login form submission */
  onSubmitLogin(): void {
    this.loginError = false;

    if (!this.email || !this.password) {
      this.loginError = true;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.loadUserProfile(false),
      error: (err) => alert('Login error: ' + err.message),
    });
  }

  /** Loads public user profile and shows welcome modal */
  private loadUserProfile(isNewUser: boolean): void {
    const userId = this.storageService.getUser()?.userId;

    if (!userId) return;

    this.userApi.getPublicUserProfile(userId).subscribe({
      next: (profile) => {
        this.storageService.setPublicUserProfile(profile);
        this.isNewUser = isNewUser;
        this.showWelcomeModal = true;
      },
      error: (err) => {
        alert('Failed to load profile: ' + err.message);
        this.showWelcomeModal = true;
      },
    });
  }

  // =========================
  // UI HELPERS
  // =========================

  /** Displays a temporary message (e.g., for social login) */
  showTemporaryMessage(): void {
    this.showMessage = true;
    setTimeout(() => (this.showMessage = false), 3000);
  }

  /** Closes the welcome modal and navigates to the intended route */
  closeWelcomeModal(): void {
    this.showWelcomeModal = false;

    const returnUrl = localStorage.getItem('returnUrl') || '/';
    localStorage.removeItem('returnUrl');
    this.router.navigateByUrl(returnUrl);
  }

  /** Navigate to homepage directly */
  goHome(): void {
    this.router.navigate(['/']);
  }
}
