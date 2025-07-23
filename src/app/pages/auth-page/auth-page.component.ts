import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-template #splash>
      <div
        class="fixed left-0 top-[52px] z-[9999] h-[calc(100vh-52px)] w-full overflow-hidden bg-[var(--color-bg)] lg:top-[76px] lg:h-[calc(100vh-76px)] xxl:top-[86px] xxl:h-[calc(100vh-86px)]"
        title="Click to skip splash"
      >
        <!-- Абсолютные декоративные изображения -->
        <img
          src="/splash/coffee-beans.png"
          alt="coffee beans"
          class="absolute left-0 top-[8%] z-0 max-w-[184px] object-contain"
        />
        <img
          src="/splash/croissant.png"
          alt="croissant"
          class="absolute left-[32%] top-[13%] z-0 max-w-[152px] object-contain"
        />
        <img
          src="/splash/cake.png"
          alt="cake"
          class="absolute right-[37%] top-[7%] z-0 max-w-[152px] object-contain"
        />
        <img
          src="/splash/turkish-coffee.png"
          alt="turka"
          class="absolute right-0 top-[18%] z-0 max-w-[118px] object-contain"
        />
        <img
          src="/splash/donut.png"
          alt="donut"
          class="absolute right-[17%] top-[64%] z-0 max-w-[142px] object-contain"
        />
        <img
          src="/splash/coffee-cup.png"
          alt="coffee cup"
          class="absolute bottom-[13%] left-[22%] z-0 max-w-[176px] object-contain"
        />

        <!-- Контент по центру -->
        <div
          class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
        >
          <h1
            class="max-w-[1068px] font-bold uppercase leading-tight text-[var(--color-gray-100)] lg:text-[80px] xxl:text-[96px]"
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
            <img src="/icons/arrow-down-right-white.svg" alt="Icon arrow" />
          </button>
        </div>
      </div>
    </ng-template>
    <ng-container *ngIf="!showSplash; else splash">
      <div
        class="grid grid-cols-8 gap-[32px] px-[20px] py-[40px] text-[var(--color-gray-100)]"
      >
        <!-- === Заголовок (шаги регистрации/логина) === -->
        <div class="col-span-4 col-start-3 flex flex-col gap-[20px]">
          <!-- STEP 1 - Ввод email для регистрации -->
          <ng-container *ngIf="step === 1">
            <h4 class="text-center">Create your Beanly account</h4>
            <span class="body-font-1 text-center">
              Already have an account?
              <button class="shadow-hover underline" (click)="toggleForm()">
                <h6>Log In</h6>
              </button>
            </span>
          </ng-container>

          <!-- STEP 2 - Ввод пароля после ввода email -->
          <ng-container *ngIf="step === 2">
            <div
              class="flex cursor-pointer select-none items-center"
              (click)="goBackToEmail()"
              style="user-select: none;"
            >
              <img
                src="/icons/arrow-left.svg"
                alt="Arrow back"
                class="mr-[32px]"
              />
              <h4 class="m-0">Create your Beanly account</h4>
            </div>
            <span class="body-font-1 text-center">
              Come up with a password for the email
              <span class="font-semibold">{{ email }}</span>
            </span>
          </ng-container>

          <!-- STEP 3 - Форма входа (логина) -->
          <ng-container *ngIf="step === 3">
            <div
              class="flex cursor-pointer select-none items-center justify-center"
              (click)="goBackToEmail()"
              style="user-select: none;"
            >
              <img
                src="/icons/arrow-left.svg"
                alt="Arrow back"
                class="mr-[32px]"
              />
              <h4 class="text-center">
                Welcome back! Log in to your Beanly account
              </h4>
            </div>
          </ng-container>
        </div>

        <!-- === STEP 1: Форма ввода email === -->
        <div *ngIf="step === 1" class="col-span-4 col-start-3">
          <form class="flex flex-col gap-[12px]" (ngSubmit)="onSubmitEmail()">
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
                  'text-[var(--color-gray-100)]': email,
                }"
                class="body-font-1 rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 focus:border-[var(--color-gray-20)] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              [disabled]="!isValidEmail"
              [ngClass]="{
                'button-bg-blue': isValidEmail,
                'bg-[var(--color-gray-20)] text-[var(--color-gray-55)]':
                  !isValidEmail,
              }"
              class="button-font rounded-[40px] px-[32px] py-[12px]"
            >
              Next
            </button>
          </form>
        </div>

        <!-- === STEP 2: Форма ввода пароля и подтверждения пароля === -->
        <div *ngIf="step === 2" class="col-span-4 col-start-3">
          <form
            autocomplete="off"
            class="flex flex-col gap-[12px]"
            (ngSubmit)="onSubmitPassword()"
          >
            <!-- Поле Password -->
            <div class="relative flex flex-col gap-[4px]">
              <span class="body-font-2 text-[var(--color-gray-75)]"
                >Password</span
              >
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                  [(ngModel)]="password"
                  name="password"
                  (ngModelChange)="onPasswordChange()"
                  [class.border-red-600]="passwordTooWeak"
                  [ngClass]="{
                    'text-[var(--color-gray-55)]': !password,
                    'text-[var(--color-gray-100)]': password,
                  }"
                  class="body-font-1 w-full rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 outline-none focus:border-[var(--color-gray-20)]"
                />
                <button
                  *ngIf="password"
                  type="button"
                  (click)="showPassword = !showPassword"
                  tabindex="-1"
                  aria-label="Toggle password visibility"
                  class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
                >
                  <img
                    [src]="
                      showPassword ? '/icons/eye-slash.svg' : '/icons/eye.svg'
                    "
                    alt="Toggle visibility"
                    class="h-[20px] w-[20px]"
                  />
                </button>
              </div>
              <!-- Ошибка слабого пароля -->
              <div
                *ngIf="passwordTooWeak"
                class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
              >
                <img src="/icons/red-close.svg" alt="Error icon" />
                Password too weak
              </div>
            </div>

            <!-- Поле Confirm Password -->
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
                  (ngModelChange)="onRepeatPasswordChange()"
                  name="confirmPass"
                  [class.border-red-600]="passwordMismatch"
                  [ngClass]="{
                    'text-[var(--color-gray-55)]': !repeatPassword,
                    'text-[var(--color-gray-100)]': repeatPassword,
                  }"
                  class="body-font-1 w-full rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 outline-none focus:border-[var(--color-gray-20)]"
                />
                <button
                  *ngIf="repeatPassword"
                  type="button"
                  (click)="showRepeatPassword = !showRepeatPassword"
                  tabindex="-1"
                  aria-label="Toggle repeat password visibility"
                  class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
                >
                  <img
                    [src]="
                      showRepeatPassword
                        ? '/icons/eye-slash.svg'
                        : '/icons/eye.svg'
                    "
                    alt="Toggle visibility"
                    class="h-[20px] w-[20px]"
                  />
                </button>
              </div>
              <!-- Ошибка несовпадения паролей -->
              <div
                *ngIf="passwordMismatch"
                class="body-font-2 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
              >
                <img src="/icons/red-close.svg" alt="Error icon" />
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

        <!-- === STEP 3: Форма входа (логина) === -->
        <div *ngIf="step === 3" class="col-span-4 col-start-3">
          <form
            autocomplete="off"
            class="flex flex-col gap-[12px]"
            (ngSubmit)="onSubmitLogin()"
          >
            <!-- Email -->
            <div class="flex flex-col gap-[4px]">
              <span class="body-font-2 text-[var(--color-gray-75)]">Email</span>
              <input
                type="email"
                placeholder="email@gmail.com"
                [(ngModel)]="email"
                name="loginEmail"
                [class.border-red-600]="loginError && !email"
                [ngClass]="{
                  'text-[var(--color-gray-55)]': !email,
                  'text-[var(--color-gray-100)]': email,
                }"
                class="body-font-1 rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 focus:border-[var(--color-gray-20)] focus:outline-none"
              />
              <div
                *ngIf="loginError && !email"
                class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
              >
                <img src="/icons/red-close.svg" alt="Error icon" />
                Email is required
              </div>
            </div>

            <!-- Password -->
            <div class="relative flex flex-col gap-[4px]">
              <span class="body-font-2 text-[var(--color-gray-75)]"
                >Password</span
              >
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                  [(ngModel)]="password"
                  name="loginPassword"
                  [class.border-red-600]="loginError && !password"
                  [ngClass]="{
                    'text-[var(--color-gray-55)]': !password,
                    'text-[var(--color-gray-100)]': password,
                  }"
                  class="body-font-1 w-full rounded-[40px] border border-[var(--color-gray-20)] bg-[var(--color-bg)] px-6 py-3 outline-none focus:border-[var(--color-gray-20)]"
                />
                <button
                  *ngIf="password"
                  type="button"
                  (click)="showPassword = !showPassword"
                  tabindex="-1"
                  aria-label="Toggle password visibility"
                  class="absolute right-0 top-0 flex h-full w-[60px] items-center justify-center"
                >
                  <img
                    [src]="
                      showPassword ? '/icons/eye-slash.svg' : '/icons/eye.svg'
                    "
                    alt="Toggle visibility"
                    class="h-[20px] w-[20px]"
                  />
                </button>
              </div>
              <div
                *ngIf="loginError && !password"
                class="body-font-2 mt-1 flex select-none items-center gap-[4px] text-[var(--color-button-error)]"
              >
                <img src="/icons/red-close.svg" alt="Error icon" />
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
        </div>

        <!-- === Социальный вход (заглушка, выводит сообщение) === -->
        <div
          class="col-span-4 col-start-3 flex flex-col gap-[20px] text-center"
        >
          <span class="body-font-1">Or log in with</span>
          <div class="flex gap-[10px]">
            <button
              (click)="showTemporaryMessage()"
              class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-green)] px-[24px] py-[12px]"
            >
              <img
                src="/icons/google.svg"
                alt="Google"
                class="h-[24px] w-[24px]"
              />
              <span class="button-font text-[var(--color-button-green)]"
                >Google</span
              >
            </button>
            <button
              (click)="showTemporaryMessage()"
              class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-button-blue)] px-[24px] py-[12px]"
            >
              <img
                src="/icons/facebook.svg"
                alt="Facebook"
                class="h-[24px] w-[24px]"
              />
              <span class="button-font text-[var(--color-button-blue)]"
                >Facebook</span
              >
            </button>
            <button
              (click)="showTemporaryMessage()"
              class="flex flex-1 items-center justify-center gap-[8px] rounded-[40px] border border-[var(--color-gray-100)] px-[24px] py-[12px]"
            >
              <img
                src="/icons/apple.svg"
                alt="Apple"
                class="h-[24px] w-[24px]"
              />
              <span class="button-font text-[var(--color-gray-100)]"
                >Apple</span
              >
            </button>
          </div>

          <span class="body-font-1">
            By registering, you accept our
            <a
              (click)="goHome()"
              class="cursor-pointer text-[var(--color-primary)] underline"
              >Terms of use</a
            >
            and
            <a
              (click)="goHome()"
              class="cursor-pointer text-[var(--color-primary)] underline"
              >Privacy Policy</a
            >
          </span>

          <div *ngIf="showMessage" class="mt-4 text-[var(--color-primary)]">
            Please use your email
          </div>
        </div>

        <!-- === Модальное окно после успешной регистрации/входа === -->
        <div
          *ngIf="showWelcomeModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)] shadow-xl"
          >
            <div class="flex flex-col gap-[20px]">
              <h4>Welcome to Beanly!</h4>

              <!-- Текст только для новых пользователей (при регистрации) -->
              <p
                *ngIf="isNewUser"
                class="body-font-1 text-[var(--color-gray-100)]"
              >
                From cozy corners perfect for reading to stylish spots for your
                next coffee date — explore places that feel just right for you.
              </p>
            </div>
            <button
              (click)="goHome()"
              class="button-font button-bg-blue h-[48px] w-full px-[32px] py-[12px]"
            >
              Explore Catalog
            </button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class AuthPageComponent implements OnInit {
  showSplash = true; // Показывать ли сплэш-экран
  step = 1; // Текущий шаг: 1 - email, 2 - регистрация (пароль), 3 - вход
  email = '';
  password = '';
  repeatPassword = '';
  showPassword = false; // Показать/скрыть пароль
  showRepeatPassword = false; // Показать/скрыть подтверждение пароля
  showMessage = false; // Временное сообщение при клике на соц. кнопки

  showWelcomeModal = false; // Показывать ли модальное окно приветствия после успеха
  isNewUser = false; // Новый пользователь (регистрация) или старый (вход)

  passwordMismatch = false; // Ошибка несовпадения паролей
  passwordTooWeak = false; // Ошибка слабого пароля

  loginError = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Если нужно, сюда можно добавить логику при инициализации компонента
  }

  onContinueFromSplash() {
    // Пользователь нажал кнопку "Продолжить" — скрываем сплэш, показываем форму регистрации (шаг 1)
    this.showSplash = false;
  }

  get isValidEmail(): boolean {
    // Валидация email по регулярному выражению
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  onSubmitEmail() {
    // При отправке email - переходим к шагу 2 (пароль)
    if (this.isValidEmail) {
      this.step = 2;

      // Сброс состояния полей и ошибок пароля
      this.password = '';
      this.repeatPassword = '';
      this.passwordTooWeak = false;
      this.passwordMismatch = false;
      this.showPassword = false;
      this.showRepeatPassword = false;
    }
  }

  onSubmitLogin() {
    // Сброс ошибки
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
      error: (err) => {
        alert('Ошибка входа: ' + err.message);
      },
    });
  }

  onPasswordChange() {
    // При изменении пароля убираем ошибки, если они были
    if (this.passwordTooWeak) this.passwordTooWeak = false;
    if (this.passwordMismatch) this.passwordMismatch = false;
  }

  onRepeatPasswordChange() {
    // При изменении подтверждения пароля убираем ошибку несовпадения
    if (this.passwordMismatch) this.passwordMismatch = false;
  }

  onSubmitPassword() {
    // Проверяем пароль при регистрации

    this.passwordMismatch = false;
    this.passwordTooWeak = false;

    if (this.password.length < 6) {
      // Слишком слабый пароль
      this.passwordTooWeak = true;
      return;
    }

    if (this.password !== this.repeatPassword) {
      // Несовпадение паролей
      this.passwordMismatch = true;
      return;
    }

    // Формируем имя пользователя из email (до @)
    const fullNameParts = this.email.split('@')[0].split('.');
    const firstName = fullNameParts[0] || 'User';
    const lastName = fullNameParts[1] || '';

    // Регистрируем пользователя
    this.authService
      .register(this.email, this.password, firstName, lastName)
      .subscribe({
        next: (res) => {
          // После успешной регистрации — сразу логиним пользователя
          this.authService.login(this.email, this.password).subscribe({
            next: () => {
              this.isNewUser = true; // Новый пользователь
              this.showWelcomeModal = true; // Показать модальное окно
            },
            error: (err) => {
              alert('Ошибка входа после регистрации: ' + err.message);
            },
          });
        },
        error: (err) => {
          alert('Ошибка регистрации: ' + err.message);
        },
      });
  }

  toggleForm() {
    // Переключение между регистрацией и логином
    if (this.step === 1) {
      this.step = 3; // Переходим к логину
    } else {
      this.step = 1; // Переходим к регистрации (ввод email)
    }
  }

  goBackToEmail() {
    // Вернуться к шагу ввода email (шаг 1)
    this.step = 1;
    this.password = '';
    this.repeatPassword = '';
  }

  showTemporaryMessage() {
    // Показать временное сообщение при клике на соц. кнопки
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  goHome() {
    // Переход на домашнюю страницу (например, после успешного входа/регистрации)
    this.router.navigate(['/']);
  }
}
