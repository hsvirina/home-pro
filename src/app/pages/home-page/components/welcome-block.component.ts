import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon.component';
import { ICONS } from '../../../core/constants/icons.constant';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { Observable } from 'rxjs';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome-block',
  standalone: true,
  imports: [RouterModule, NgClass, AsyncPipe, NgStyle, TranslateModule],
  template: `
    <div
      class="max-h:[1160px] grid grid-cols-8 items-center gap-[24px] xxl:gap-[20px]"
      [ngClass]="{
        'text-[var(--color-white)]': (currentTheme$ | async) === 'dark',
      }"
    >
      <!-- Text Content -->
      <div
        class="col-span-8 flex flex-col gap-[32px] px-[20px] pt-12 lg:col-span-4 xxl:max-w-[590px] xxl:px-[0px] xxl:pt-0"
      >
        <div class="flex flex-col gap-[32px]">
          <div class="flex flex-col gap-[16px]">
            <h3 class="text-[32px] xxl:text-[40px]">
              {{ 'WELCOME.TITLE_PART1' | translate }}
              <span class="text-[var(--color-primary)]">{{
                'WELCOME.TITLE_PART2' | translate
              }}</span>
              {{ 'WELCOME.TITLE_PART3' | translate }}
            </h3>
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

          <!-- Statistics -->
          <div
            class="flex flex-col items-center gap-8 lg:flex-row lg:justify-between"
          >
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

        <!-- Catalog Button (Desktop) -->
        <a [routerLink]="['/catalog']">
          <button
            class="button-bg-blue menu-text-font flex h-[48px] w-full px-8 lg:w-auto"
          >
            {{ 'WELCOME.BUTTON' | translate }}
          </button>
        </a>
      </div>

      <!-- Image Block -->
      <div
        class="relative col-span-8 h-[530px] overflow-hidden rounded-[40px] lg:col-span-4"
      >
        <img
          src="./assets/placeholder-image.png"
          alt="Placeholder Image"
          class="absolute max-h-[856px] w-[318px] object-cover"
          [ngStyle]="{
            top: '20px',
            left: '50%',
            transform:
              windowWidth >= 1024
                ? 'translateX(-50%) rotate(26.98deg)'
                : 'translateX(-50%) rotate(36.51deg)',
          }"
          loading="eager"
        />
      </div>
    </div>
  `,
})
export class WelcomeBlockComponent implements OnInit {
  ICONS = ICONS;
  currentTheme$: Observable<Theme>;
  windowWidth: number = window.innerWidth;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    this.updateWindowWidth(); // обновить при инициализации
  }

  @HostListener('window:resize')
  updateWindowWidth(): void {
    this.windowWidth = window.innerWidth;
  }
}
