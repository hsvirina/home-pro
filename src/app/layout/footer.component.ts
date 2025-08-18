import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LogoComponent } from '../shared/components/logo.component';
import { ModalComponent } from '../shared/components/modal.component';
import { ClickOutsideDirective } from '../shared/directives/click-outside.directive';
import { ThemeService } from '../core/services/theme.service';
import { Theme } from '../core/models/theme.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    LogoComponent,
    ModalComponent,
    ClickOutsideDirective,
  ],
  template: `
    <!-- Footer wrapper -->
    <footer
      class="flex flex-col gap-10 px-5 py-12 lg:flex-row lg:gap-0 lg:px-[40px] lg:py-[60px] xxl:px-0"
      [ngClass]="{
        'text-[var(--color-gray-75)]': (currentTheme$ | async) === 'light',
        'text-[var(--color-gray-20)]': (currentTheme$ | async) === 'dark'
      }"
    >
      <!-- Left section: Logo + Navigation -->
      <div class="flex flex-col gap-10 lg:w-full lg:flex-row lg:justify-between lg:gap-0">
        <app-logo [sizeXxl]="true"></app-logo>

        <div class="flex flex-row gap-4 lg:gap-[80px] xxl:gap-[192px]">
          <!-- Loop through footer navigation sections -->
          <div
            class="body-font-2 flex w-1/2 flex-col gap-1"
            *ngFor="let section of navigationLinks"
          >
            <a
              *ngFor="let link of section.links"
              [routerLink]="link.route"
              class="relative inline-block w-max whitespace-nowrap py-2 leading-none
                     after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full
                     after:origin-left after:scale-x-0 after:bg-[var(--color-primary)]
                     after:transition-transform after:duration-300 after:ease-in-out
                     after:content-[''] hover:after:scale-x-100"
              [ngClass]="{
                'hover:text-[var(--color-gray-100)]': (currentTheme$ | async) === 'light',
                'hover:text-[var(--color-white)]': (currentTheme$ | async) === 'dark'
              }"
            >
              {{ link.label | translate }}
            </a>
          </div>
        </div>
      </div>

      <!-- Right section: Subscription form -->
      <div
        class="flex w-full flex-col gap-[16px] lg:ml-[80px] xxl:ml-[192px] lg:w-[400px] lg:shrink-0"
        appClickOutside
        (appClickOutside)="showError = false"
      >
        <!-- Section header -->
        <div class="flex flex-col gap-2">
          <h5 [ngClass]="{
                'text-[var(--color-gray-100)]': (currentTheme$ | async) === 'light',
                'text-[var(--color-white)]': (currentTheme$ | async) === 'dark'
              }"
          >
            {{ 'footer.subscribe_title' | translate }}
          </h5>
          <span class="body-font-1">
            {{ 'footer.subscribe_description' | translate }}.
          </span>
        </div>

        <!-- Email input -->
        <input
          [(ngModel)]="email"
          name="email"
          type="email"
          [placeholder]="'footer.email_placeholder' | translate"
          required
          email
          #emailInput="ngModel"
          (blur)="onBlur()"
          [ngClass]="{
            'border-[var(--color-gray-20)] bg-[var(--color-secondary)] focus:text-[var(--color-gray-100)]': (currentTheme$ | async) === 'light',
            'border-[var(--color-gray-100)] bg-transparent focus:text-[var(--color-white)]': (currentTheme$ | async) === 'dark'
          }"
          class="body-font-1 rounded-[40px] border px-6 py-3 focus:outline-none lg:w-auto lg:flex-1"
        />

        <!-- Validation error message -->
        <div *ngIf="showError" class="body-font-2 text-[var(--color-primary)]">
          {{ 'footer.email_error' | translate }}
        </div>

        <!-- Submit button and privacy notice -->
        <div class="flex flex-col gap-3">
          <button
            type="submit"
            (click)="onSubmit()"
            class="button-bg-transparent px-[24px] py-[12px] text-center lg:w-full lg:px-[24px]"
          >
            {{ 'button.send' | translate }}
          </button>

          <span class="body-font-2">{{ 'footer.privace_notice' | translate }}</span>
        </div>
      </div>
    </footer>

    <!-- Subscription success modal -->
    <app-modal [isOpen]="showModal" (close)="closeModal()" width="650px">
      <div
        class="flex w-full flex-col items-center justify-between gap-[32px] text-center text-[var(--color-gray-100)]"
      >
        <div class="flex flex-col gap-[20px]">
          <h4>{{ 'MODAL.MODAL_TITLE' | translate }}</h4>
          <p class="body-font-1">{{ 'MODAL.MODAL_TEXT' | translate }}</p>
        </div>
        <button
          (click)="closeModal()"
          class="button-font h-[48px] w-full rounded-[40px] bg-[var(--color-primary)] px-[32px] py-[12px] text-[var(--color-white)]"
        >
          {{ 'button.close' | translate }}
        </button>
      </div>
    </app-modal>
  `,
})
export class FooterComponent {
  /** User email input */
  email = '';

  /** Display subscription success modal */
  showModal = false;

  /** Email validation error flag */
  showError = false;

  /** Current theme (light/dark) observable */
  currentTheme$: Observable<Theme>;

  /** Footer navigation links */
  navigationLinks = [
    {
      title: 'footer.links.title_company',
      links: [
        { label: 'footer.links.about_us', route: '/' },
        { label: 'footer.links.faqs', route: '/' },
        { label: 'footer.links.contact_us', route: '/' },
        { label: 'footer.links.social_media', route: '/' },
        { label: 'footer.links.feedback', route: '/' },
      ],
    },
    {
      title: 'footer.links.title_resources',
      links: [
        { label: 'footer.links.newsletter', route: '/' },
        { label: 'footer.links.updates', route: '/' },
        { label: 'footer.links.events', route: '/' },
        { label: 'footer.links.blog_posts', route: '/' },
        { label: 'footer.links.community', route: '/' },
      ],
    },
  ];

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /** Handle send button click */
  onSubmit(): void {
    if (!this.validateEmail(this.email)) {
      this.showError = true;
      return;
    }
    this.showModal = true;
    this.email = '';
    this.showError = false;
  }

  /** Validate email on blur */
  onBlur(): void {
    this.showError = !!this.email && !this.validateEmail(this.email);
  }

  /** Close the subscription modal */
  closeModal(): void {
    this.showModal = false;
  }

  /** Simple regex email validation */
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return re.test(email.toLowerCase());
  }
}
