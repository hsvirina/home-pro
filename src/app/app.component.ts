import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterOutlet,
} from '@angular/router';
import { CommonModule, AsyncPipe, NgIf } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/Header/header.component';
import { LoaderComponent } from './shared/components/loader.component';

import { LoaderService } from './core/services/loader.service';
import { ThemeService } from './core/services/theme.service';
import { Theme } from './core/models/theme.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    AsyncPipe,
    NgIf,
    TranslateModule,
  ],
  template: `
    <div
      class="flex min-h-screen min-w-[375px] w-full flex-col transition-colors duration-300"
      [ngClass]="{
        'text-[var(--color-gray-100)]': (currentTheme$ | async) === 'light',
        'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark',
      }"
    >
      <!-- Global loader shown on all pages except home and auth -->
      <app-loader
        *ngIf="(loaderService.isLoading$ | async) && !isHomePage && !isAuthPage"
      ></app-loader>

      <!-- Fixed header with dynamic border and background based on theme -->
      <header
        class="fixed left-0 right-0 top-0 z-20 border-b bg-[var(--color-bg)] transition-colors duration-300"
        [ngClass]="{
          'border-[var(--color-gray-20)]': (currentTheme$ | async) === 'light',
          'border-[var(--color-border)]': (currentTheme$ | async) === 'dark',
        }"
      >
        <div class="mx-auto h-full max-w-[1320px]">
          <app-header></app-header>
        </div>
      </header>

      <!-- Main content with padding and theme-dependent background -->
      <main
        class="mt-[48px] w-full flex-grow bg-[var(--color-bg)] pt-[40px] transition-colors duration-300 lg:mt-[72px] lg:pt-[64px] xxl:mt-[80px] xxl:pt-[72px]"
      >
        <router-outlet></router-outlet>
      </main>

      <!-- Footer with theme-dependent background -->
      <footer
        class="w-full transition-colors duration-300"
        [ngClass]="{
          'bg-[var(--color-secondary)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-bg-footer)]': (currentTheme$ | async) === 'dark',
        }"
      >
        <div class="mx-auto max-w-[1320px]">
          <app-footer></app-footer>
        </div>
      </footer>

      <!-- Bottom padding block for mobile screens -->
      <div
        class="block h-[34px] w-full pt-[20px] lg:hidden"
        style="max-width: 1320px; margin: 0 auto; padding-left: 120px; padding-right: 120px;"
        [ngClass]="{
          'bg-[var(--color-secondary)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-bg-footer)]': (currentTheme$ | async) === 'dark',
        }"
      >
        <div class="h-[5px] w-full rounded-[100px] bg-black"></div>
      </div>
    </div>
  `,
})
export class AppComponent implements OnDestroy {
  // Flags to identify current page for loader display logic
  isHomePage = false;
  isAuthPage = false;

  // Observable for current theme (light/dark)
  currentTheme$: Observable<Theme>;

  // Subject used to unsubscribe from observables automatically on component destroy
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    public loaderService: LoaderService,
    private themeService: ThemeService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
    this.initRouterEvents();
  }

  /**
   * Subscribes to Angular Router events to:
   * - Determine if current route is home or auth page
   * - Show loader on navigation start (except on home/auth)
   * - Hide loader on navigation end/cancel/error (only for home/auth)
   * Uses takeUntil for automatic unsubscription.
   */
  private initRouterEvents(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isHomePage = event.url === '/';
        this.isAuthPage = event.url.startsWith('/auth');

        if (!this.isHomePage && !this.isAuthPage) {
          this.loaderService.show();
        }
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        if (this.isHomePage || this.isAuthPage) {
          this.loaderService.hide();
        }
      }
    });
  }

  /** Clean up subscriptions when component is destroyed */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
