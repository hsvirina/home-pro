import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from "./components/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="bg-[var(--color-bg)]">
      <!-- Header: full-width fixed -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]">
        <div class="max-w-[1320px] mx-auto h-full">
          <app-header></app-header>
        </div>
        <div class="absolute bottom-0 left-0 w-full h-px"></div>
      </header>

      <!-- Main: grows to fill space between header and footer -->
      <main class="flex-grow bg-[var(--color-bg)] mt-[48px] xxl:mt-[80px] pt-[40px] xxl:pt-[72px]">
        <div class="max-w-[1320px] mx-auto">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer: sticks to bottom if content short -->
      <footer class="w-full bg-[var(--color-secondary)] mt-[150px]">
        <div class="max-w-[1320px] mx-auto">
          <app-footer></app-footer>
        </div>
      </footer>

    </div>
  `
})
export class AppComponent {}
