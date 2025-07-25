import { Component, OnInit } from '@angular/core';
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
        <!-- Абсолютные декоративные изображения -->
        <img
          src="/assets/splash/coffee-beans.png"
          alt="coffee beans"
          class="absolute left-0 top-[8%] z-0 max-w-[184px] object-contain"
        />
        <img
          src="/assets/splash/croissant.png"
          alt="croissant"
          class="absolute left-[32%] top-[13%] z-0 max-w-[152px] object-contain"
        />
        <img
          src="/assets/splash/cake.png"
          alt="cake"
          class="absolute right-[28%] top-[7%] z-0 max-w-[152px] object-contain"
        />
        <img
          src="/assets/splash/turkish-coffee.png"
          alt="turka"
          class="absolute right-0 top-[18%] z-0 max-w-[118px] object-contain"
        />
        <img
          src="/assets/splash/donut.png"
          alt="donut"
          class="absolute right-[17%] top-[68%] z-0 max-w-[142px] object-contain"
        />
        <img
          src="/assets/splash/coffee-cup.png"
          alt="coffee cup"
          class="absolute bottom-[13%] left-[22%] z-0 max-w-[176px] object-contain"
        />

        <!-- Контент по центру -->
        <div
          class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
        >
          <h1
            class="max-w-[1068px] text-[56px] font-bold uppercase leading-tight text-[var(--color-gray-100)] lg:text-[80px] xxl:text-[96px]"
          >
            <span class="text-[var(--color-primary)]">Coffee</span> places
            you’ll <span class="text-[var(--color-primary)]">love</span>, picked
            for you
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
    <ng-container *ngIf="!showSplash; else splash">
      <div
        class="flex flex-col gap-[32px] px-[30px] py-[40px] text-[var(--color-gray-100)]"
      >
        <!-- Обертка для шага аутентификации -->
        <div class="grid grid-cols-8">
          <div
            class="col-span-8 lg:col-span-6 lg:col-start-2 xxl:col-span-4 xxl:col-start-3"
          >
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

        <!-- Социальный логин -->
        <div class="grid grid-cols-8">
          <app-social-login
            (showTemporaryMessage)="showTemporaryMessage()"
            [showMessage]="showMessage"
            class="col-span-8 lg:col-span-6 lg:col-start-2 xxl:col-span-4 xxl:col-start-3"
          ></app-social-login>
        </div>

        <!-- Модальное окно приветствия -->
        <div class="grid grid-cols-8">
          <app-welcome-modal
            *ngIf="showWelcomeModal"
            [isNewUser]="isNewUser"
            (close)="showWelcomeModal = false; goHome()"
            class="col-span-8 lg:col-span-6 lg:col-start-2 xxl:col-span-4 xxl:col-start-3"
          ></app-welcome-modal>
        </div>
      </div>
    </ng-container>
  `,
})
export class AuthPageComponent {
  ICONS = ICONS;
  showSplash = true;
  step = 1;
  email = '';
  password = '';
  repeatPassword = '';
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
  ) {}

  onContinueFromSplash() {
    this.showSplash = false;
  }

  onEmailSubmit(email: string) {
    this.email = email;
    this.step = 2;
    this.password = '';
    this.repeatPassword = '';
    this.passwordTooWeak = false;
    this.passwordMismatch = false;
    this.showPassword = false;
    this.showRepeatPassword = false;
  }

  onSubmitPassword() {
    // Аналогичная логика из твоего компонента
    if (this.password.length < 6) {
      this.passwordTooWeak = true;
      return;
    }
    if (this.password !== this.repeatPassword) {
      this.passwordMismatch = true;
      return;
    }
    // Регистрация и логин
    const fullNameParts = this.email.split('@')[0].split('.');
    const firstName = fullNameParts[0] || 'User';
    const lastName = fullNameParts[1] || '';
    this.authService
      .register(this.email, this.password, firstName, lastName)
      .subscribe({
        next: () => {
          this.authService.login(this.email, this.password).subscribe({
            next: () => {
              this.isNewUser = true;
              this.showWelcomeModal = true;
            },
            error: (err) =>
              alert(
                'Ошибка входа после регистрации: ' +
                  (err.message || err.statusText),
              ),
          });
        },
        error: (err) => {
          if (
            err.status === 400 &&
            err.error?.message?.includes('Email is already taken')
          ) {
            alert(
              'Этот email уже зарегистрирован. Пожалуйста, используйте другой или войдите в систему.',
            );
            // Можно сразу переключить на форму логина
            this.step = 3;
          } else {
            alert('Ошибка регистрации: ' + (err.message || err.statusText));
          }
        },
      });
  }

  onSubmitLogin() {
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
      error: (err) => alert('Ошибка входа: ' + err.message),
    });
  }

  toggleForm() {
    this.step = this.step === 1 ? 3 : 1;
  }

  goBackToEmail() {
    this.step = 1;
    this.password = '';
    this.repeatPassword = '';
  }

  onPasswordChange(password: string) {
    this.password = password;
    this.passwordTooWeak = false;
    this.passwordMismatch = false;
  }

  onRepeatPasswordChange(repeatPassword: string) {
    this.repeatPassword = repeatPassword;
    this.passwordMismatch = false;
  }

  showTemporaryMessage() {
    this.showMessage = true;
    setTimeout(() => (this.showMessage = false), 3000);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
