import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PlacesService } from '../../core/services/places.service';

import { SettingsSectorComponent } from './components/settings-sector.component';

import { Place } from '../../core/models/place.model';
import { PlaceCardType } from '../../core/constants/place-card-type.enum';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthStateService } from '../../state/auth/auth-state.service';
import { LoaderService } from '../../core/services/loader.service';
import { AchievementSectorComponent } from './components/achievement-sector.component';
import { InfoSectorComponent } from './components/info-sector.component';
import { FavoritesVisitedSectorComponent } from './components/favorites-visited-sector.component';
import { Theme } from '../../core/models/theme.type';
import { ThemeService } from '../../core/services/theme.service';
import { ACHIEVEMENTS } from '../../core/constants/achievements';
import { AuthUser, PublicUserProfile } from '../../core/models/user.model';
import { getUnlockedAchievements } from '../../core/utils/achievement.utils';
import { Subscription } from 'rxjs';
import { BadgeType, calculateBadgeType } from '../../core/utils/badge-utils';
import { MyReviewsComponent } from './components/my-reviews.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    InfoSectorComponent,
    SettingsSectorComponent,
    AchievementSectorComponent,
    FavoritesVisitedSectorComponent,
    MyReviewsComponent,
  ],
  template: `
    <div
      *ngIf="user"
      class="mx-auto max-w-[1320px] px-[20px] lg:px-[40px] xxl:px-0"
    >
      <div class="flex flex-col gap-[32px] xxl:gap-[80px]">
        <!-- Info Section -->
        <app-info-sector
          [editableUser]="editedUser || user"
          [isEditing]="isEditing"
          (onToggleEdit)="handleToggleEdit()"
          (fieldChange)="onFieldChange($event.field, $event.value)"
          [hasPendingChanges]="hasPendingChanges"
          [badgeType]="badgeType"
        ></app-info-sector>

        <app-achievement-sector
          [achievements]="achievements"
          [unlockedTitles]="unlockedAchievementTitles"
        />

        <app-favorites-visited-sector
          [favoritePlaces]="favorites"
          [visitedPlaces]="visited"
        />

        <app-my-reviews
          [userId]="currentUserId"
          [userPhotoUrl]="publicProfile?.photoUrl ?? null"
          [places]="allPlaces"
          [badgeType]="badgeType"
        ></app-my-reviews>

        <!-- Settings Section -->
        <app-settings-sector
          *ngIf="editedUser"
          class="col-span-4 lg:col-span-8"
          [user]="editedUser"
          [places]="allPlaces"
          (settingsChanged)="onSettingsChanged()"
        ></app-settings-sector>

        <!-- Save Button -->
        <div
          class="col-span-4 mb-[144px] mt-[32px] flex justify-center lg:col-span-8"
        >
          <button
            class="button-font button-bg-blue h-[48px] w-full lg:w-[482px]"
            [disabled]="!hasPendingChanges"
            (click)="saveChanges()"
          >
            Save All Changes
          </button>
        </div>

        <!-- Success Modal -->
        <div
          *ngIf="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)]"
          >
            <div class="flex flex-col gap-[20px]">
              <h4>Changes saved successfully</h4>
              <p class="body-font-1 text-[var(--color-gray-100)]">
                Your profile has been updated. Thank you!
              </p>
            </div>
            <button
              (click)="closeModal()"
              class="button-font button-bg-blue h-[48px] w-full px-[32px] py-[12px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <!-- Модалка приветствия для новой ачивки -->
      <div
        *ngIf="showNewAchievementModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div
          class="max-w-sm rounded-xl bg-white p-8 text-center dark:bg-gray-800"
        >
          <h3 class="mb-4 text-xl font-bold">Поздравляем!</h3>
          <p class="mb-4">Вы открыли новую ачивку:</p>
          <p class="mb-6 font-semibold">{{ newAchievementToShow }}</p>

          <!-- Картинка ачивки -->
          <img
            *ngIf="newAchievementData?.iconPath"
            [src]="newAchievementData?.iconPath"
            [alt]="newAchievementToShow"
            class="mx-auto mb-6 max-h-40 object-contain"
          />

          <button class="btn btn-primary" (click)="closeNewAchievementModal()">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  public readonly PlaceCardType = PlaceCardType;
  public achievements = ACHIEVEMENTS;
  public publicProfile: PublicUserProfile | null = null;

  favorites: Place[] = [];
  user: AuthUser | null = null;
  editedUser: AuthUser | null = null;
  badgeType: BadgeType = 'neutral';

  isEditing = false;
  hasPendingChanges = false;

  showModal = false;
  allPlaces: Place[] = [];

  unlockedAchievementTitles = new Set<string>();

  showNewAchievementModal = false;
  newAchievementToShow: string | null = null;

  visited: Place[] = [];

  private subs = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthStateService,
    private placesService: PlacesService,
    private loaderService: LoaderService,
    private themeService: ThemeService,
    private authApiService: AuthApiService,
  ) {}

  ngOnInit(): void {
    this.loaderService.show();

    // Загружаем все места сразу
    this.placesService.getPlaces().subscribe({
      next: (places: Place[]) => {
        this.allPlaces = places;
        this.updateFavoritesAndVisited();
        this.loaderService.hide();
      },
      error: (err) => {
        console.error('❌ Failed to load places:', err);
        this.loaderService.hide();
      },
    });

    // Подписка на пользователя из AuthStateService — теперь UI обновится при любом изменении пользователя!
    this.subs.add(
      this.authService.user$.subscribe((userFromService) => {
        this.user = userFromService;
        this.editedUser = userFromService ? { ...userFromService } : null;

        if (userFromService) {
          const userTheme = (
            userFromService.theme ?? 'light'
          ).toLowerCase() as Theme;
          this.themeService.setTheme(userTheme);

          // Загружаем публичный профиль при смене пользователя
          this.subs.add(
            this.authService.user$.subscribe((userFromService) => {
              this.user = userFromService;
              this.editedUser = userFromService ? { ...userFromService } : null;

              if (userFromService) {
                const userTheme = (
                  userFromService.theme ?? 'light'
                ).toLowerCase() as Theme;
                this.themeService.setTheme(userTheme);

                // Загружаем публичный профиль при смене пользователя
                this.subs.add(
                  this.authApiService
                    .getPublicUserProfile(userFromService.userId)
                    .subscribe({
                      next: (profile) => {
                        this.publicProfile = profile;
                        this.updateUnlockedAchievements(profile);
                        this.updateFavoritesAndVisited();

                        // Вычисляем бейдж
                        this.calculateUserBadge(profile);
                      },
                      error: (err) => {
                        console.error('❌ Failed to load public profile:', err);
                      },
                    }),
                );
              } else {
                this.publicProfile = null;
                this.favorites = [];
                this.visited = [];
                this.badgeType = 'neutral';
              }

              this.updateFavoritesAndVisited();
            }),
          );
        } else {
          this.publicProfile = null;
          this.favorites = [];
          this.visited = [];
        }

        this.updateFavoritesAndVisited();
      }),
    );
  }
  private setVisitedPlaces(): void {
    if (!this.publicProfile || !this.allPlaces.length) {
      this.visited = [];
      return;
    }

    const checkInCafeIds = this.publicProfile.checkInCafes.map(
      (cafe) => cafe.id,
    );
    this.visited = this.allPlaces.filter((place) =>
      checkInCafeIds.includes(place.id),
    );
  }

  private calculateUserBadge(profile: PublicUserProfile) {
    const unlocked = getUnlockedAchievements(profile);
    this.badgeType = calculateBadgeType(unlocked, ACHIEVEMENTS);
  }

  get currentUserId(): number | null {
    return this.user ? this.user.userId : null;
  }

  updateAchievements(): void {
    // Логика для обновления this.achievements, исходя из this.publicProfile и/или this.user
    // Например, фильтрация ACHIEVEMENTS по выполненным условиям

    // Пример простой логики:
    if (!this.publicProfile) {
      this.achievements = [];
      return;
    }

    // TODO: реализовать условия для показа ачивок, например:
    // - Сколько кафе посещено
    // - Сколько отзывов написано
    // - Сколько кафе в избранном и т.д.

    // Пока просто установим все ачивки:
    this.achievements = ACHIEVEMENTS;
  }

  private updateUnlockedAchievements(profile: PublicUserProfile) {
    const unlocked = getUnlockedAchievements(profile);
    const currentUnlockedTitles = new Set(
      unlocked.flatMap((section) => section.achievements.map((a) => a.title)),
    );

    const stored = localStorage.getItem('unlockedAchievements');
    const prevUnlockedTitles = stored ? new Set(JSON.parse(stored)) : null;

    let newAchievements: string[] = [];
    if (prevUnlockedTitles) {
      newAchievements = Array.from(currentUnlockedTitles).filter(
        (title) => !prevUnlockedTitles.has(title),
      );
    }

    localStorage.setItem(
      'unlockedAchievements',
      JSON.stringify(Array.from(currentUnlockedTitles)),
    );

    this.unlockedAchievementTitles = currentUnlockedTitles;
    this.achievements = ACHIEVEMENTS;

    if (prevUnlockedTitles && newAchievements.length > 0) {
      this.newAchievementToShow = newAchievements[0];
      this.showNewAchievementModal = true;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get newAchievementData() {
    if (!this.newAchievementToShow) return null;

    // Ищем ачивку по title во всех секциях ACHIEVEMENTS
    for (const section of this.achievements) {
      const achievement = section.achievements.find(
        (a) => a.title === this.newAchievementToShow,
      );
      if (achievement) {
        return achievement;
      }
    }

    return null;
  }

  // Toggle editing mode
  handleToggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // Handle form field change from child component
  onFieldChange(field: keyof AuthUser, value: AuthUser[keyof AuthUser]) {
    if (!this.editedUser) return;
    // @ts-ignore – suppress type-checking for dynamic assignment
    this.editedUser[field] = value;
    this.hasPendingChanges = true;
  }

  // Mark form as dirty when any setting is changed
  onSettingsChanged() {
    this.hasPendingChanges = true;
  }

  private updateFavoritesAndVisited(): void {
    if (!this.user || !this.allPlaces.length) {
      this.favorites = [];
      this.visited = [];
      return;
    }

    this.favorites = this.allPlaces.filter((place) =>
      this.user!.favoriteCafeIds.includes(place.id),
    );

    if (this.publicProfile) {
      const visitedIds = this.publicProfile.checkInCafes.map((cafe) => cafe.id);
      this.visited = this.allPlaces.filter((place) =>
        visitedIds.includes(place.id),
      );
    } else {
      this.visited = [];
    }
  }

  // Submit updated user profile to backend
  saveChanges() {
    if (!this.user || !this.editedUser) return;

    const payload: Partial<AuthUser> = {
      ...this.editedUser,
      email: this.user.email,
    };

    this.authService.updateUserProfile(payload).subscribe({
      next: (updated: AuthUser) => {
        this.user = updated;
        this.editedUser = { ...updated };
        this.isEditing = false;
        this.hasPendingChanges = false;
        this.showModal = true;
      },
      error: (err: any) => console.error('❌ Failed to update profile:', err),
    });
  }

  // Close success modal
  closeModal() {
    this.showModal = false;
  }

  // Logout and navigate to auth page
  onLogout(): void {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  closeNewAchievementModal() {
    this.showNewAchievementModal = false;
    this.newAchievementToShow = null;
  }
}
