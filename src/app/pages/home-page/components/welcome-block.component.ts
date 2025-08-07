import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICONS } from '../../../core/constants/icons.constant';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { Observable } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome-block',
  standalone: true,
  imports: [RouterModule, NgClass, AsyncPipe, TranslateModule],
  template: `
    <div
      class="max-h:[1074px] xxl:max-h:[530px] mx-auto flex max-w-[1170px] flex-col items-center px-5 lg:flex-row lg:justify-center lg:gap-[24px] lg:px-0 xxl:gap-[120px]"
      [ngClass]="{
        'text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
      }"
    >
      <!-- Text Content Section -->
      <div
        class="flex flex-col gap-[32px] pt-[60px] lg:pt-12 xxl:max-w-[590px] xxl:px-0 xxl:pt-0"
      >
        <div class="flex flex-col gap-[32px]">
          <div class="flex flex-col gap-[16px]">
            <!-- Heading with highlighted middle part -->
            <h3 class="text-[32px] xxl:text-[40px]">
              {{ 'WELCOME.TITLE_PART1' | translate }}
              <span class="text-[var(--color-primary)]">
                {{ 'WELCOME.TITLE_PART2' | translate }}
              </span>
              {{ 'WELCOME.TITLE_PART3' | translate }}
            </h3>

            <!-- Description text, color adapts to theme -->
            <span
              class="body-font-1"
              [ngClass]="{
                'text-[var(--color-gray-20)]':
                  (currentTheme$ | async) === 'dark',
              }"
            >
              {{ 'WELCOME.DESCRIPTION' | translate }}
            </span>
          </div>

          <!-- Statistics Section -->
          <div
            class="flex flex-col items-center gap-8 lg:flex-row lg:justify-between"
          >
            <!-- Individual stat block -->
            <div
              class="flex flex-col items-center gap-[8px] p-2 lg:max-w-[163px] lg:items-start"
            >
              <h5>80%</h5>
              <span class="body-font-1">{{
                'WELCOME.STATS.DEEP_WORK' | translate
              }}</span>
            </div>

            <div
              class="flex flex-col items-center gap-[8px] p-2 lg:max-w-[163px] lg:items-start"
            >
              <h5>65%</h5>
              <span class="body-font-1">{{
                'WELCOME.STATS.VIBE' | translate
              }}</span>
            </div>

            <div
              class="flex flex-col items-center gap-[8px] p-2 lg:max-w-[163px] lg:items-start"
            >
              <h5>30%</h5>
              <span class="body-font-1">{{
                'WELCOME.STATS.RETURN' | translate
              }}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Button to Catalog -->
        <a [routerLink]="['/catalog']" class="w-full lg:w-auto">
          <button class="button-bg-blue button-font flex h-[48px] w-full px-8">
            {{ 'WELCOME.BUTTON' | translate }}
          </button>
        </a>
      </div>

      <!-- Image Section -->
      <div
        class="relative flex h-[530px] overflow-hidden pt-[30px] lg:col-span-4"
      >
        <img
          src="./assets/placeholder-image.png"
          alt="Placeholder Image"
          class="h-full w-full object-cover object-top max-lg:w-[calc(100vw-40px)] max-sm:max-w-none xxl:w-[480px]"
          loading="lazy"
        />
      </div>
    </div>
  `,
})
export class WelcomeBlockComponent implements OnInit {
  // Icons constants imported for possible use in the template
  ICONS = ICONS;

  // Observable that tracks the current UI theme ('light' or 'dark')
  currentTheme$: Observable<Theme>;

  // Store current window width for any responsive logic if needed
  windowWidth: number = window.innerWidth;

  constructor(private themeService: ThemeService) {
    // Subscribe to theme changes from the ThemeService
    this.currentTheme$ = this.themeService.theme$;
  }

  // Lifecycle hook to initialize component logic
  ngOnInit(): void {
    this.updateWindowWidth();
  }

  // Listen to window resize event to update windowWidth property dynamically
  @HostListener('window:resize')
  updateWindowWidth(): void {
    this.windowWidth = window.innerWidth;
  }
}
