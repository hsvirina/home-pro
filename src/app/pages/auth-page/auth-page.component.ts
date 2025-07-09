import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mx-auto flex max-w-5xl flex-col gap-8 p-8 md:flex-row">
      <!-- Регистрация -->
      <section class="flex-1 rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-6 text-center text-2xl font-bold">Регистрация</h2>
        <form (ngSubmit)="onRegister()" #registerForm="ngForm" novalidate>
          <input
            type="text"
            placeholder="Имя"
            class="mb-4 w-full rounded border p-2"
            name="firstName"
            [(ngModel)]="firstName"
            required
          />
          <input
            type="text"
            placeholder="Фамилия"
            class="mb-4 w-full rounded border p-2"
            name="lastName"
            [(ngModel)]="lastName"
            required
          />
          <input
            type="email"
            placeholder="Email"
            class="mb-4 w-full rounded border p-2"
            name="registerEmail"
            [(ngModel)]="registerEmail"
            required
            email
          />
          <input
            type="password"
            placeholder="Пароль"
            class="mb-4 w-full rounded border p-2"
            name="registerPassword"
            [(ngModel)]="registerPassword"
            required
            minlength="6"
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            class="mb-4 w-full rounded border p-2"
            name="confirmPassword"
            [(ngModel)]="confirmPassword"
            required
          />
          <button
            type="submit"
            class="w-full rounded bg-gray-200 py-2 font-semibold hover:bg-gray-300"
            [disabled]="registerLoading"
          >
            {{ registerLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
          <p *ngIf="registerError" class="mt-2 text-center text-red-600">
            {{ registerError }}
          </p>
          <p *ngIf="registerSuccess" class="mt-2 text-center text-green-600">
            {{ registerSuccess }}
          </p>
        </form>
      </section>

      <!-- Вход -->
      <section class="flex-1 rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-6 text-center text-2xl font-bold">Вход</h2>
        <form (ngSubmit)="onLogin()" #loginForm="ngForm" novalidate>
          <input
            type="email"
            placeholder="Email"
            class="mb-4 w-full rounded border p-2"
            name="loginEmail"
            [(ngModel)]="loginEmail"
            required
            email
          />
          <input
            type="password"
            placeholder="Пароль"
            class="mb-4 w-full rounded border p-2"
            name="loginPassword"
            [(ngModel)]="loginPassword"
            required
          />
          <button
            type="submit"
            class="w-full rounded bg-indigo-500 py-2 font-semibold text-white hover:bg-indigo-600"
            [disabled]="loginLoading"
          >
            {{ loginLoading ? 'Вход...' : 'Войти' }}
          </button>
          <p *ngIf="loginError" class="mt-2 text-center text-red-600">
            {{ loginError }}
          </p>
        </form>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        background-color: #f9fafb;
        min-height: 100vh;
        display: block;
      }
    `,
  ],
})
export class AuthPageComponent implements OnInit, OnDestroy {
  // Login
  loginEmail = '';
  loginPassword = '';
  loginError: string | null = null;
  loginLoading = false;

  // Register
  registerEmail = '';
  registerPassword = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  registerError: string | null = null;
  registerSuccess: string | null = null;
  registerLoading = false;

  private tokenSub?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.tokenSub = this.authService.token$.subscribe(token => {
      if (token) {
        this.router.navigate(['/profile']);
      }
    });
  }

  ngOnDestroy() {
    this.tokenSub?.unsubscribe();
  }

  onLogin() {
    this.loginError = null;
    if (!this.loginEmail || !this.loginPassword) {
      this.loginError = 'Заполните все поля';
      return;
    }
    this.loginLoading = true;

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.loginLoading = false;
        // Навигация происходит в подписке на token$
      },
      error: (err) => {
        this.loginLoading = false;
        this.loginError = err.message;
      },
    });
  }

  onRegister() {
    this.registerError = null;
    this.registerSuccess = null;

    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.registerError = 'Введите имя и фамилию';
      return;
    }
    if (
      !this.registerEmail.trim() ||
      !this.registerPassword.trim() ||
      !this.confirmPassword.trim()
    ) {
      this.registerError = 'Заполните все поля';
      return;
    }
    if (this.registerPassword !== this.confirmPassword) {
      this.registerError = 'Пароли не совпадают';
      return;
    }

    this.registerLoading = true;

    this.authService
      .register(this.registerEmail, this.registerPassword, this.firstName, this.lastName)
      .subscribe({
        next: () => {
          // После успешной регистрации — сразу логинимся
          this.authService.login(this.registerEmail, this.registerPassword).subscribe({
            next: () => {
              this.registerLoading = false;
              this.registerSuccess = 'Ура, вы успешно зарегистрировались и вошли!';
              // Навигация произойдет автоматически через подписку на token$
            },
            error: (err) => {
              this.registerLoading = false;
              this.registerError =
                'Регистрация прошла, но не удалось войти автоматически. Войдите вручную.';
            },
          });
        },
        error: (err) => {
          this.registerLoading = false;
          this.registerError = err.message;
        },
      });
  }
}
