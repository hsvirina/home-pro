import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';

export interface Achievement {
  title: string;
  description: string;
  iconPath: string;
  alt: string;
  ariaLabel: string;
}

export interface AchievementSection {
  sectionTitle: string;
  achievements: Achievement[];
}

@Component({
  selector: 'app-achievement-sector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h4>Achievements</h4>
        <span
          >Discover, explore, and unlock badges as you sip your way through the
          city</span
        >
      </div>

      <div
        class="flex flex-wrap gap-x-[54px] gap-y-[80px] rounded-[40px] border p-6"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <section
          *ngFor="let section of achievements"
          [attr.aria-labelledby]="getIdFromTitle(section.sectionTitle)"
          class="flex w-full max-w-[600px] flex-col gap-6"
        >
          <div class="flex flex-col gap-4">
            <h5 [attr.id]="getIdFromTitle(section.sectionTitle)">
              {{ section.sectionTitle }}
            </h5>
            <div
              class="w-full border-b"
              [ngClass]="{
                'border-[var(--color-gray-20)]':
                  (currentTheme$ | async) === 'light',
                'border-[var(--color-gray-75)]':
                  (currentTheme$ | async) === 'dark',
              }"
            ></div>
          </div>
          <div class="flex gap-[54px]">
            <article
              *ngFor="let achievement of section.achievements"
              class="flex w-[167px] flex-col items-center gap-4 text-center"
              role="group"
              [attr.aria-label]="achievement.ariaLabel"
            >
              <div
  class="relative flex items-center justify-center rounded-full"
  [ngClass]="{
    'bg-gray-300': (currentTheme$ | async) === 'light',
    'bg-[var(--color-gray-100)]': (currentTheme$ | async) === 'dark'
  }"
  style="width: 100px; height: 100px"
>
                <ng-container
                  *ngIf="unlockedTitles.has(achievement.title); else locked"
                >
                  <img
                    [src]="achievement.iconPath"
                    [alt]="achievement.alt"
                    class="h-25 w-25 object-contain"
               loading="eager"
                  />
                </ng-container>
                <ng-template #locked>
                  <!-- серый кружок остаётся пустым -->
                </ng-template>
              </div>

              <div class="flex flex-col gap-2">
                <h6
                  class="menu-text-font"
                  [ngClass]="{
                    'text-[var(--color-gray-55)]': !unlockedTitles.has(
                      achievement.title
                    ),
                  }"
                >
                  {{ achievement.title }}
                </h6>
                <p
                  class="body-font-1"
                  [ngClass]="{
                    'text-[var(--color-gray-55)]': !unlockedTitles.has(
                      achievement.title
                    ),
                  }"
                >
                  {{ achievement.description }}
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class AchievementSectorComponent {
  @Input() achievements: AchievementSection[] = [];
  @Input() unlockedTitles = new Set<string>();

  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  getIdFromTitle(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }
}
