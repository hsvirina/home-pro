import { Component } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/Header/header.component';
import { LoaderComponent } from './shared/components/loader.component';
import { LoaderService } from './core/services/loader.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Theme } from './core/models/theme.type';
import { Observable } from 'rxjs';
import { ThemeService } from './core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
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
      class="flex min-h-screen min-w-[375px] flex-col transition-colors duration-300"
      [ngClass]="{
        'text-[var(--color-gray-100)]': (currentTheme$ | async) === 'light',
        'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark',
      }"
    >
      <app-loader
        *ngIf="(loaderService.isLoading$ | async) && !isHomePage && !isAuthPage"
      ></app-loader>

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

      <main
        class="mt-[48px] w-full flex-grow bg-[var(--color-bg)] pt-[40px] transition-colors duration-300 lg:mt-[72px] lg:pt-[64px] xxl:mt-[80px] xxl:pt-[72px]"
      >
        <router-outlet></router-outlet>
      </main>

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
    </div>
  `,
})
export class AppComponent {
  isHomePage = false;
  isAuthPage = false;
  currentTheme$: Observable<Theme>;

  constructor(
    private router: Router,
    public loaderService: LoaderService,
    private themeService: ThemeService, 
  ) {
    this.currentTheme$ = this.themeService.theme$;
    this.router.events.subscribe((event) => {
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
}
