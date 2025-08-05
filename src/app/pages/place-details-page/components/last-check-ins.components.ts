import { Component, Input, OnInit } from '@angular/core';
import {
  ACHIEVEMENTS,
  AchievementSection,
} from '../../../core/constants/achievements';
import { BadgeType, calculateBadgeType } from '../../../core/utils/badge-utils';
import { CheckInsService } from '../../../core/services/check-ins.service';
import { CheckIn } from '../../../core/models/CheckIn.model';
import { CommonModule } from '@angular/common';
import { BadgeImagePipe } from '../../../core/pipes/badge-image.pipe';
import { RouterModule } from '@angular/router';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { forkJoin } from 'rxjs';
import { getUnlockedAchievements } from '../../../core/utils/achievement.utils';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-last-check-ins',
  standalone: true,
  imports: [CommonModule, BadgeImagePipe, RouterModule],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h4>Last Check-ins</h4>
        <span class="body-font-1">
          See who's recently visited this coffee shop
        </span>
      </div>

      <ng-container *ngIf="checkIns.length > 0; else noCheckins">
        <div class="flex gap-5">
          <div *ngFor="let checkIn of checkIns" class="flex-grow">
            <div class="flex gap-4 rounded-[24px] bg-[var(--color-bg-2)] p-2">
              <a
                [routerLink]="['/users', checkIn.userId]"
                class="relative inline-block bg-transparent"
                style="width: 58px; height: 58px; flex-shrink: 0;"
                title="{{ checkIn.userFirstName }} {{ checkIn.userLastName }}"
              >
                <!-- Рамка бейджа -->
                <img
                  *ngIf="checkIn.badge | badgeImage as badgeImg"
                  [src]="badgeImg"
                  alt="badge"
                  class="absolute left-0 top-0 rounded-full bg-transparent"
                  style="width: 58px; height: 58px; object-fit: cover; pointer-events: none;"
                />

                <!-- Фото пользователя -->
                <img
                  [src]="checkIn.userPhotoUrl"
                  alt="{{ checkIn.userFirstName }} {{ checkIn.userLastName }}"
                  class="absolute left-1/2 top-1/2 rounded-full"
                  style="
                  width: 50px;
                  height: 50px;
                  object-fit: cover;
                  transform: translate(-50%, -50%);
                "
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
        <div class="text-[var(--color-gray-75)]">No recent check-ins</div>
      </ng-template>
    </div>
  `,
})
export class LastCheckInsComponent implements OnInit {
  @Input() cafeId!: number;

  checkIns: (CheckIn & { badge: BadgeType })[] = [];

  constructor(
    private checkInsService: CheckInsService,
    private authApiService: AuthApiService,
    private languageService: LanguageService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    if (!this.cafeId) return;

    this.checkInsService.getCheckInsByCafe(this.cafeId).subscribe({
      next: (checkInsData) => {
        // Сортируем и ограничиваем 4-мя последними
        const sortedCheckIns = checkInsData.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        const recentCheckIns = sortedCheckIns.slice(0, 4);

        const uniqueUserIds = Array.from(
          new Set(recentCheckIns.map((ci) => ci.userId)),
        );

        const userProfilesRequests = uniqueUserIds.map((id) =>
          this.authApiService.getPublicUserProfile(id),
        );

        forkJoin(userProfilesRequests).subscribe({
          next: (userProfiles) => {
            const allAchievements = this.getAllAchievements();
            const userAchievementsMap = new Map<number, AchievementSection[]>();

            userProfiles.forEach((profile) => {
              const unlocked = getUnlockedAchievements(profile);
              userAchievementsMap.set(profile.id, unlocked);
            });

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
          },
          error: (err) => console.error('Failed to load user profiles', err),
        });
      },
      error: (err) => console.error('Failed to load check-ins', err),
    });
  }

  getAllAchievements(): AchievementSection[] {
    return ACHIEVEMENTS;
  }

  formatCheckInDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
    );

    const lang = this.languageService.currentLang === 'uk' ? 'uk-UA' : 'en-US';

    const optionsTime = { hour: '2-digit', minute: '2-digit' } as const;
    const optionsDate = { month: 'long', day: 'numeric' } as const;

    const todayText = this.translate.instant('date.today'); // например 'Today' / 'Сьогодні'
    const yesterdayText = this.translate.instant('date.yesterday'); // 'Yesterday' / 'Вчора'
    const atText = this.translate.instant('date.at'); // 'at' / 'о'

    if (date >= startOfToday) {
      return `${todayText} ${atText} ${date.toLocaleTimeString(lang, optionsTime)}`;
    } else if (date >= startOfYesterday && date < startOfToday) {
      return `${yesterdayText} ${atText} ${date.toLocaleTimeString(lang, optionsTime)}`;
    } else {
      const datePart = date.toLocaleDateString(lang, optionsDate);
      const timePart = date.toLocaleTimeString(lang, optionsTime);
      return `${datePart}, ${timePart}`;
    }
  }
}
