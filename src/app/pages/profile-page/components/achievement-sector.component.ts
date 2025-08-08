import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/models/theme.type';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Interface representing a single achievement.
 */
export interface Achievement {
  key: string;
  iconPath: string;
  alt: string;
  ariaLabel: string;
}

/**
 * Interface representing a section of achievements.
 */
export interface AchievementSection {
  sectionKey: string;
  achievements: Achievement[];
}

@Component({
  selector: 'app-achievement-sector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex min-w-[335px] px-5 lg:px-0 flex-col gap-6">
      <!-- Header Section -->
      <div class="flex flex-col gap-2">
        <h4>{{ 'achievements.title' | translate }}</h4>
        <span *ngIf="!public">{{ 'achievements.subtitle' | translate }}</span>
      </div>

      <!-- Achievement Sections Wrapper -->
      <div
        class="flex flex-wrap gap-x-[54px] gap-y-[32px] rounded-[40px] border p-6 lg:gap-y-[80px]"
        [ngClass]="{
          'border-[var(--color-gray-20)] bg-[var(--color-white)]':
            (currentTheme$ | async) === 'light',
          'border-[var(--color-gray-75)] bg-[var(--color-bg-card)] text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        <!-- Single Section -->
        <section
          *ngFor="let section of achievements"
          [attr.aria-labelledby]="getIdFromTitle(section.sectionKey)"
          class="flex w-full flex-col gap-6 xxl:max-w-[600px]"
        >
          <!-- Section Title -->
          <div class="flex flex-col gap-1 lg:gap-4">
            <h5 [attr.id]="getIdFromTitle(section.sectionKey)">
              {{ 'achievements.sections.' + section.sectionKey | translate }}
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

          <!-- Achievements Grid -->
          <div class="flex justify-around gap-3 lg:gap-[54px]">
            <!-- Single Achievement -->
            <article
              *ngFor="let achievement of section.achievements"
              class="flex min-w-[83px] flex-col items-center gap-4 text-center lg:w-[167px] lg:justify-between"
              role="group"
              [attr.aria-label]="achievement.ariaLabel"
            >
              <!-- Icon Wrapper -->
              <div
                class="relative flex h-[60px] w-[60px] items-center justify-center rounded-full lg:h-[100px] lg:w-[100px]"
                [ngClass]="{
                  'bg-gray-300': (currentTheme$ | async) === 'light',
                  'bg-[var(--color-gray-100)]':
                    (currentTheme$ | async) === 'dark',
                }"
              >
                <!-- Unlocked Achievement -->
                <ng-container
                  *ngIf="unlockedTitles.has(achievement.key); else locked"
                >
                  <img
                    [src]="achievement.iconPath"
                    [alt]="achievement.alt"
                    class="lg:h-25 lg:w-25 h-[100px] w-[100px] object-contain"
                    loading="eager"
                  />
                </ng-container>

                <!-- Locked Achievement Placeholder -->
                <ng-template #locked>
                  <div
                    class="h-[60px] w-[60px] lg:h-[100px] lg:w-[100px] rounded-full border border-[var(--color-gray-20)] "
                    [ngClass]="{
                  'bg-[var(--color-bg-2)]': (currentTheme$ | async) === 'light',
                  'bg-[var(--color-gray-75)]':
                    (currentTheme$ | async) === 'dark',
                }"
                  ></div>
                </ng-template>
              </div>

              <!-- Achievement Texts -->
              <div class="flex flex-col gap-2">
                <h6
                  class="menu-text-font"
                  [ngClass]="{
                    'text-[var(--color-gray-55)]': !unlockedTitles.has(
                      achievement.key
                    ),
                  }"
                >
                  {{
                    'achievements.list.' + achievement.key + '.title'
                      | translate
                  }}
                </h6>
                <p
                  class="body-font-1"
                  [ngClass]="{
                    'text-[var(--color-gray-55)]': !unlockedTitles.has(
                      achievement.key
                    ),
                  }"
                >
                  {{
                    'achievements.list.' + achievement.key + '.description'
                      | translate
                  }}
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
  /** List of achievement sections to render */
  @Input() achievements: AchievementSection[] = [];

  /** Set of unlocked achievement keys */
  @Input() unlockedTitles = new Set<string>();

  /** Whether the achievements are displayed publicly */
  @Input() public: boolean = false;

  /** Observable theme for dynamic styling */
  readonly currentTheme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Generate an HTML-friendly ID from a section title.
   * @param title Achievement section title
   * @returns Formatted string ID
   */
  getIdFromTitle(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }
}
