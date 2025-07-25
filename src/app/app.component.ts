import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/Header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    HeaderComponent,
    FooterComponent,
  ],
  template: `
    <div class="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <header class="fixed left-0 right-0 top-0 z-20 bg-[var(--color-bg)] shadow-md">
        <div class="mx-auto h-full max-w-[1320px]">
          <app-header></app-header>
        </div>
        <div class="absolute bottom-0 left-0 h-px w-full"></div>
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
export class AppComponent {}
