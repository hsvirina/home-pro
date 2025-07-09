import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="bg-[var(--color-bg)]">
      <!-- Header: full-width fixed -->
      <header
        class="fixed left-0 right-0 top-0 z-50 bg-[var(--color-bg)] shadow-md"
      >
        <div class="mx-auto h-full max-w-[1320px]">
          <app-header></app-header>
        </div>
        <div class="absolute bottom-0 left-0 h-px w-full"></div>
      </header>

      <!-- Main: grows to fill space between header and footer -->
      <main
        class="mt-[48px] flex-grow bg-[var(--color-bg)] pt-[40px] lg:mt-[72px] lg:pt-[64px] xxl:mt-[80px] xxl:pt-[72px]"
      >
        <div class="mx-auto max-w-[1320px]">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer: sticks to bottom if content short -->
      <footer class="mt-[150px] w-full bg-[var(--color-secondary)]">
        <div class="mx-auto max-w-[1320px]">
          <app-footer></app-footer>
        </div>
      </footer>
    </div>
  `,
})
export class AppComponent {}
