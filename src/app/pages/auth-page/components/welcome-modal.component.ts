import { Component } from '@angular/core';
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
        'bg-[#8C8C8E]/50': (currentTheme$ | async) === 'dark',
      }"
    >
      <div
        class="modal-content flex w-auto flex-col items-center justify-between gap-[32px] rounded-[40px] p-[24px]"
        [ngClass]="{
          'bg-[var(--color-bg-2)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark',
        }"
        style="max-height: 90vh; overflow-y: auto;"
      >
        <!-- Welcome image and intro -->
        <div
          class="mx-auto flex max-w-[640px] flex-col items-center justify-center gap-5 px-4 text-center"
        >
          <img
            [src]="
              (currentTheme$ | async) === 'dark'
                ? './assets/WelcomeDarkThema.svg'
                : './assets/Welcome.svg'
            "
            alt="Welcome"
          />

          <h4>{{ 'WELCOME_MODAL.TITLE' | translate }}</h4>
          <p class="body-font-1">
            {{ 'WELCOME_MODAL.DESCRIPTION' | translate }}
          </p>
        </div>

        <!-- Feature steps -->
        <div class="flex gap-8">
          <div
            class="flex max-w-[316px] flex-col gap-4"
            *ngFor="let feature of features"
          >
            <div class="flex items-center gap-2">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                [ngClass]="{
          'bg-[var(--color-secondary)]': (currentTheme$ | async) === 'light',
          'bg-[var(--color-gray-100)] text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
        }"
              >
                {{ feature.number }}
              </div>
              <h5>{{ feature.title | translate }}</h5>
            </div>
            <span class="body-font-1 text-left">
              {{ feature.description | translate }}
            </span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-8">
          <button
            (click)="goToCatalog()"
            class="button-font button-bg-blue h-[48px] w-full whitespace-nowrap px-[32px] py-[12px]"
          >
            {{ 'WELCOME_MODAL.BUTTON.EXPLORE_CATALOG' | translate }}
          </button>
          <button
            (click)="goToProfile()"
            class="button-font button-bg-transparent h-[48px] w-full px-[32px] py-[12px]"
          >
            {{ 'WELCOME_MODAL.BUTTON.SKIP' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class WelcomeModalComponent {
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

  readonly currentTheme$: Observable<Theme>;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private themeService: ThemeService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  goToCatalog() {
    this.router.navigate(['/catalog']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
