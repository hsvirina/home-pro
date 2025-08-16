import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ACHIEVEMENTS,
  AchievementSection,
} from '../../../core/constants/achievements';
import { BadgeType, calculateBadgeType } from '../../../core/utils/badge-utils';
import { CheckInsService } from '../../../core/services/check-ins.service';
import { CommonModule } from '@angular/common';
import { BadgeImagePipe } from '../../../core/pipes/badge-image.pipe';
import { RouterModule } from '@angular/router';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { getUnlockedAchievements } from '../../../core/utils/achievement.utils';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CheckIn } from '../../../core/models/CheckIn.model';
import { Theme } from '../../../core/models/theme.type';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-last-check-ins',
  standalone: true,
  imports: [CommonModule, BadgeImagePipe, RouterModule, TranslateModule],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h4>{{ 'checkIns.title' | translate }}</h4>
        <span class="body-font-1">
          {{ 'checkIns.subtitle' | translate }}
        </span>
      </div>

      <ng-container *ngIf="checkIns.length > 0; else noCheckins">
        <div class="flex flex-col gap-2 lg:flex-row lg:gap-5">
          <div *ngFor="let checkIn of checkIns" class="flex-grow">
            <div
              class="flex gap-4 rounded-[24px] p-2"
              [ngClass]="{
                'bg-[var(--color-bg-2)]': (currentTheme$ | async) === 'light',
                'bg-[var(--color-bg-card)]': (currentTheme$ | async) === 'dark',
              }"
            >
              <a
                [routerLink]="['/users', checkIn.userId]"
                class="relative inline-block bg-transparent"
                [ngClass]="{
                  'h-[44px] w-[50px]': true,
                  'lg:h-[58px] lg:w-[58px]': true,
                }"
                [title]="checkIn.userFirstName + ' ' + checkIn.userLastName"
              >
                <img
                  *ngIf="checkIn.badge | badgeImage as badgeImg"
                  [src]="badgeImg"
                  alt="badge"
                  class="absolute left-0 top-0 rounded-full bg-transparent"
                  [ngClass]="{
                    'h-[44px] w-[50px]': true,
                    'lg:h-[58px] lg:w-[58px]': true,
                  }"
                  style="object-fit: cover; pointer-events: none;"
                />
                <img
                  [src]="checkIn.userPhotoUrl"
                  [alt]="checkIn.userFirstName + ' ' + checkIn.userLastName"
                  class="absolute left-1/2 top-1/2 rounded-full"
                  [ngClass]="{
                    'h-[44px] w-[44px]': true,
                    'lg:h-[50px] lg:w-[50px]': true,
                  }"
                  style="object-fit: cover; transform: translate(-50%, -50%);"
                />
              </a>

              <div class="flex flex-col gap-2">
                <div class="menu-text-font">
                  {{ checkIn.userFirstName }} {{ checkIn.userLastName }}
                </div>
                <div class="body-font-2">
                  {{ formatCheckInDate(checkIn.timestamp) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #noCheckins>
        <div class="text-[var(--color-gray-75)]">
          {{ 'checkIns.noRecent' | translate }}
        </div>
      </ng-template>
    </div>
  `,
})
export class LastCheckInsComponent implements OnInit, OnDestroy {
  @Input() cafeId!: number;

  // Array holding recent check-ins enriched with badge type
  checkIns: (CheckIn & { badge: BadgeType })[] = [];

  // Track the current theme
  currentTheme$: Observable<Theme>;

  // Composite subscription to manage multiple subscriptions and avoid memory leaks
  private subscription = new Subscription();

  constructor(
    private checkInsService: CheckInsService,
    private authApiService: AuthApiService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /**
   * Lifecycle hook called once after component initialization.
   * Starts loading check-ins and subscribes to updates.
   */
  ngOnInit(): void {
    if (!this.cafeId) return;

    this.loadCheckIns();

    // Subscribe to check-ins updates to refresh data accordingly
    const updateSub = this.checkInsService.checkInsUpdated$.subscribe(() => {
      this.loadCheckIns();
    });

    this.subscription.add(updateSub);
  }

  /**
   * Lifecycle hook called once before component is destroyed.
   * Used to unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Loads the latest check-ins for the given cafe.
   * Sorts them by timestamp, limits to 4 latest,
   * fetches corresponding user profiles,
   * computes badges, and updates local state.
   */
  private loadCheckIns(): void {
    this.checkInsService.getCheckInsByCafe(this.cafeId).subscribe({
      next: (checkInsData) => {
        // Sort check-ins descending by timestamp
        const sortedCheckIns = checkInsData.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        // Take the most recent 4 check-ins
        const recentCheckIns = sortedCheckIns.slice(0, 4);

        // Extract unique user IDs from recent check-ins
        const uniqueUserIds = Array.from(
          new Set(recentCheckIns.map((ci) => ci.userId)),
        );

        // Prepare requests to fetch user profiles
        const userProfilesRequests = uniqueUserIds.map((id) =>
          this.authApiService.getPublicUserProfile(id),
        );

        // Fetch all user profiles in parallel
        forkJoin(userProfilesRequests).subscribe({
          next: (userProfiles) => {
            const allAchievements = this.getAllAchievements();
            const userAchievementsMap = new Map<number, AchievementSection[]>();

            // Map user profiles to their unlocked achievements
            userProfiles.forEach((profile) => {
              const unlocked = getUnlockedAchievements(profile);
              userAchievementsMap.set(profile.id, unlocked);
            });

            // Combine check-ins with calculated badge type
            this.checkIns = recentCheckIns.map((checkIn) => {
              const unlockedAchievements =
                userAchievementsMap.get(checkIn.userId) || [];
              const badge = calculateBadgeType(
                unlockedAchievements,
                allAchievements,
              );

              return {
                ...checkIn,
                badge,
              };
            });

            // Manually trigger change detection to update the view
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Failed to load user profiles', err),
        });
      },
      error: (err) => console.error('Failed to load check-ins', err),
    });
  }

  /**
   * Returns all achievements defined in the system.
   */
  getAllAchievements(): AchievementSection[] {
    return ACHIEVEMENTS;
  }

  /**
   * Formats the check-in date string into a user-friendly format,
   * supporting "Today", "Yesterday", and full date formats,
   * adjusted for 'Europe/Kiev' timezone and localization.
   * @param dateStr - ISO date string of the check-in
   * @returns formatted date string
   */
  formatCheckInDate(dateStr: string): string {
    const checkInDateUTC = this.parseDateInTimeZone(dateStr, 'Europe/Kiev');

    const now = new Date();
    const lang = this.languageService.currentLang === 'uk' ? 'uk-UA' : 'en-US';

    const todayStr = now.toLocaleDateString(lang, { timeZone: 'Europe/Kiev' });
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString(lang, {
      timeZone: 'Europe/Kiev',
    });
    const checkInDateStrKiev = checkInDateUTC.toLocaleDateString(lang, {
      timeZone: 'Europe/Kiev',
    });

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Kiev',
    };

    const optionsDate: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Kiev',
    };

    const todayText = this.translate.instant('date.today');
    const yesterdayText = this.translate.instant('date.yesterday');
    const atText = this.translate.instant('date.at');

    if (checkInDateStrKiev === todayStr) {
      return `${todayText} ${atText} ${checkInDateUTC.toLocaleTimeString(lang, optionsTime)}`;
    } else if (checkInDateStrKiev === yesterdayStr) {
      return `${yesterdayText} ${atText} ${checkInDateUTC.toLocaleTimeString(lang, optionsTime)}`;
    } else {
      return `${checkInDateUTC.toLocaleDateString(lang, optionsDate)}, ${checkInDateUTC.toLocaleTimeString(lang, optionsTime)}`;
    }
  }

  /**
   * Parses a date string and converts it to a Date object
   * adjusted to the specified timezone, using Intl API.
   * @param dateStr - ISO date string to parse
   * @param timeZone - IANA timezone identifier (e.g. 'Europe/Kiev')
   * @returns Date object in UTC corresponding to local time in given timezone
   */
  private parseDateInTimeZone(dateStr: string, timeZone: string): Date {
    const date = new Date(dateStr);
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = dtf.formatToParts(date);

    const year = Number(parts.find((p) => p.type === 'year')?.value);
    const month = Number(parts.find((p) => p.type === 'month')?.value) - 1;
    const day = Number(parts.find((p) => p.type === 'day')?.value);
    const hour = Number(parts.find((p) => p.type === 'hour')?.value);
    const minute = Number(parts.find((p) => p.type === 'minute')?.value);
    const second = Number(parts.find((p) => p.type === 'second')?.value);

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
}
