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
  ],
  template: `
    <div class="flex min-h-screen flex-col bg-[var(--color-bg)] min-w-[375px]">
      <app-loader
        *ngIf="(loaderService.isLoading$ | async) && !isHomePage && !isAuthPage"
      ></app-loader>

      <header
        class="fixed left-0 right-0 top-0 z-20 bg-[var(--color-bg)] shadow-md"
      >
        <div class="mx-auto h-full max-w-[1320px]">
          <app-header></app-header>
        </div>
      </header>

      <main
        class="mt-[48px] flex-grow bg-[var(--color-bg)] pt-[40px] lg:mt-[72px] lg:pt-[64px] xxl:mt-[80px] xxl:pt-[72px]"
      >
        <div class="mx-auto max-w-[1320px]">
          <router-outlet></router-outlet>
        </div>
      </main>

      <footer class="w-full bg-[var(--color-secondary)]">
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

  constructor(
    private router: Router,
    public loaderService: LoaderService,
  ) {
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
