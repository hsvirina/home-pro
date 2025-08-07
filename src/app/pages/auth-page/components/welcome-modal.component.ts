import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div
      class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-[24px] backdrop-blur"
      [ngClass]="{
        'bg-[#141414]/60': (currentTheme$ | async) === 'light',
        'bg-[#8C8C8E]/50': (currentTheme$ | async) === 'dark'
      }"
    >
      <div
        class="modal-content flex w-auto flex-col items-center justify-between gap-[32px] rounded-[40px] p-[24px]"
        [ngClass]="{
          'bg-[var(--color-bg-2)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark'
        }"
        style="max-height: 90vh; overflow-y: auto;"
      >
        <!-- Welcome image and introduction text -->
        <section
          class="mx-auto max-w-[640px] flex flex-col items-center justify-center gap-5 px-4 text-center"
        >
          <img
            [src]="
              (currentTheme$ | async) === 'dark'
                ? './assets/WelcomeDarkTheme.svg'
                : './assets/Welcome.svg'
            "
            alt="Welcome"
          />

          <h4>{{ 'WELCOME_MODAL.TITLE' | translate }}</h4>
          <p class="body-font-1">{{ 'WELCOME_MODAL.DESCRIPTION' | translate }}</p>
        </section>

        <!-- Feature steps displayed on large screens -->
        <section class="hidden lg:flex gap-8" aria-label="Feature Highlights">
          <article
            class="flex max-w-[316px] flex-col gap-4"
            *ngFor="let feature of features"
          >
            <header class="flex items-center gap-2">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                [ngClass]="{
                  'bg-[var(--color-secondary)]':
                    (currentTheme$ | async) === 'light',
                  'bg-[var(--color-gray-100)] text-[var(--color-white)]':
                    (currentTheme$ | async) === 'dark'
                }"
                aria-hidden="true"
              >
                {{ feature.number }}
              </div>
              <h5>{{ feature.title | translate }}</h5>
            </header>
            <p class="body-font-1 text-left">{{ feature.description | translate }}</p>
          </article>
        </section>

        <!-- Action buttons -->
        <nav class="flex gap-8" aria-label="Welcome modal actions">
          <button
            (click)="goToCatalog()"
            class="button-font button-bg-blue h-[48px] w-full whitespace-nowrap px-[32px] py-[12px]"
            type="button"
          >
            {{ 'WELCOME_MODAL.BUTTON.EXPLORE_CATALOG' | translate }}
          </button>
          <button
            (click)="goToProfile()"
            class="button-font button-bg-transparent h-[48px] w-full px-[32px] py-[12px]"
            type="button"
          >
            {{ 'WELCOME_MODAL.BUTTON.SKIP' | translate }}
          </button>
        </nav>
      </div>
    </div>
  `,
})
export class WelcomeModalComponent implements OnInit, OnDestroy {
  /**
   * List of features to be displayed in the welcome modal.
   * Each feature includes a number, title translation key, and description translation key.
   */
  features = [
    {
      number: 1,
      title: 'WELCOME_MODAL.FEATURES.FIND_CAFES.TITLE',
      description: 'WELCOME_MODAL.FEATURES.FIND_CAFES.DESCRIPTION',
    },
    {
      number: 2,
      title: 'WELCOME_MODAL.FEATURES.SAVE_FAVORITES.TITLE',
      description: 'WELCOME_MODAL.FEATURES.SAVE_FAVORITES.DESCRIPTION',
    },
    {
      number: 3,
      title: 'WELCOME_MODAL.FEATURES.COLLECT_ACHIEVEMENTS.TITLE',
      description: 'WELCOME_MODAL.FEATURES.COLLECT_ACHIEVEMENTS.DESCRIPTION',
    },
  ];

  /** Observable to track current theme ('light' or 'dark') */
  readonly currentTheme$: Observable<Theme>;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private themeService: ThemeService,
  ) {
    // Subscribe to theme changes from the ThemeService
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Lifecycle hook called on component initialization.
   * Disables body scroll when modal is open.
   */
  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  /**
   * Lifecycle hook called before component destruction.
   * Restores body scroll.
   */
  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  /**
   * Navigate user to the catalog page.
   */
  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  /**
   * Navigate user to their profile page.
   */
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
