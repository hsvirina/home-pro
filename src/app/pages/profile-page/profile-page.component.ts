import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { PlacesService } from '../../core/services/places.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthStateService } from '../../state/auth/auth-state.service';
import { LoaderService } from '../../core/services/loader.service';
import { ThemeService } from '../../core/services/theme.service';

import { InfoSectorComponent } from './components/info-sector.component';
import { SettingsSectorComponent } from './components/settings-sector.component';
import { AchievementSectorComponent } from './components/achievement-sector.component';
import { FavoritesVisitedSectorComponent } from './components/favorites-visited-sector.component';
import { MyReviewsComponent } from './components/my-reviews.component';
import { ModalComponent } from '../../shared/components/modal.component';

import { Place } from '../../core/models/place.model';
import { AuthUser, PublicUserProfile } from '../../core/models/user.model';
import { Theme } from '../../core/models/theme.type';
import { ACHIEVEMENTS } from '../../core/constants/achievements';
import { PlaceCardType } from '../../core/constants/place-card-type.enum';

import { getUnlockedAchievements } from '../../core/utils/achievement.utils';
import { BadgeType, calculateBadgeType } from '../../core/utils/badge-utils';

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
    TranslateModule,
    ModalComponent,
  ],
  template: `
    <div
      *ngIf="user"
      class="mx-auto max-w-[1320px] px-[20px] lg:px-[40px] xxl:px-0"
    >
      <div class="flex flex-col gap-[60px] xxl:gap-[80px]">
        <!-- User Info Section -->
        <app-info-sector
          [editableUser]="editedUser || user"
          [isEditing]="isEditing"
          (onToggleEdit)="handleToggleEdit()"
          (fieldChange)="onFieldChange($event.field, $event.value)"
          [hasPendingChanges]="hasPendingChanges"
          [badgeType]="badgeType"
        ></app-info-sector>

        <!-- Achievements Section -->
        <app-achievement-sector
          [achievements]="achievements"
          [unlockedTitles]="unlockedAchievementTitles"
        />

        <!-- Favorites & Visited Places Section -->
        <!-- <app-favorites-visited-sector
          [favoritePlaces]="favorites"
          [visitedPlaces]="visited"
        /> -->
        <app-favorites-visited-sector
          [favoritePlaces]="favorites"
          [visitedPlaces]="visited"
          (favoritePlacesChanged)="onFavoritePlacesChanged($event)"
          (visitedPlacesChanged)="onVisitedPlacesChanged($event)"
        ></app-favorites-visited-sector>

        <!-- My Reviews Section -->
        <app-my-reviews
          [userId]="currentUserId"
          [userPhotoUrl]="publicProfile?.photoUrl ?? null"
          [places]="allPlaces"
          [badgeType]="badgeType"
        ></app-my-reviews>

        <!-- User Settings Section -->
        <app-settings-sector
          *ngIf="editedUser"
          class="col-span-4 lg:col-span-8"
          [user]="editedUser"
          [places]="allPlaces"
          (settingsChanged)="onSettingsChanged()"
        ></app-settings-sector>

        <!-- Save Changes Button -->
        <div
          class="col-span-4 mb-[144px] mt-[32px] flex justify-center lg:col-span-8"
        >
          <button
            class="button-font button-bg-blue h-[48px] w-full lg:w-[482px]"
            [disabled]="!hasPendingChanges"
            (click)="saveChanges()"
          >
            {{ 'profile.saveButton' | translate }}
          </button>
        </div>

        <!-- Save Success Modal -->
        <div
          *ngIf="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            class="flex w-full max-w-[650px] flex-col items-center justify-between gap-[32px] rounded-[40px] bg-[var(--color-bg-2)] p-[24px] text-center text-[var(--color-gray-100)]"
          >
            <div class="flex flex-col gap-[20px]">
              <h4>{{ 'profile.modal.title' | translate }}</h4>
              <p class="body-font-1 text-[var(--color-gray-100)]">
                {{ 'profile.modal.message' | translate }}
              </p>
            </div>
            <button
              (click)="closeModal()"
              class="button-font button-bg-blue h-[48px] w-full px-[32px] py-[12px]"
            >
              {{ 'profile.modal.close' | translate }}
            </button>
          </div>
        </div>
      </div>

      <!-- New Achievement Modal -->
      <app-modal
        [isOpen]="showNewAchievementModal"
        (close)="closeNewAchievementModal()"
        [width]="'80vh'"
      >
        <div class="flex flex-col items-center p-4 text-center">
          <h3 class="mb-4">
            {{ 'profile.achievementModal.congrats' | translate }}
          </h3>
          <p class="body-font-1 mb-4">
            {{ 'profile.achievementModal.unlocked' | translate }}
          </p>

          <div class="mb-6 flex justify-center">
            <p
              class="rounded-2xl border border-[var(--color-gray-20)] bg-[var(--color-white)] p-4"
            >
              {{ newAchievementToShow }}
            </p>
          </div>

          <img
            *ngIf="newAchievementData?.iconPath"
            [src]="newAchievementData?.iconPath"
            [alt]="newAchievementToShow"
            class="mx-auto mb-6 h-40 object-contain"
          />

          <button class="btn btn-primary" (click)="closeNewAchievementModal()">
            {{ 'profile.achievementModal.close' | translate }}
          </button>
        </div>
      </app-modal>
    </div>
  `,
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  readonly PlaceCardType = PlaceCardType;

  achievements = ACHIEVEMENTS;
  publicProfile: PublicUserProfile | null = null;

  favorites: Place[] = [];
  visited: Place[] = [];
  allPlaces: Place[] = [];

  user: AuthUser | null = null;
  editedUser: AuthUser | null = null;

  badgeType: BadgeType = null;
  unlockedAchievementTitles = new Set<string>();

  isEditing = false;
  hasPendingChanges = false;

  showModal = false;
  showNewAchievementModal = false;
  newAchievementToShow: string | null = null;

  private subs = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthStateService,
    private placesService: PlacesService,
    private loaderService: LoaderService,
    private themeService: ThemeService,
    private authApiService: AuthApiService
  ) {}

  /** Lifecycle hook - Initialize component data */
  ngOnInit(): void {
    this.loaderService.show();
    this.loadPlaces();
    this.subscribeToAuthUser();
  }

  /** Lifecycle hook - Cleanup subscriptions */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Returns current logged-in user ID */
  get currentUserId(): number | null {
    return this.user?.userId ?? null;
  }

  /** Returns full achievement data for currently unlocked achievement */
  get newAchievementData() {
    if (!this.newAchievementToShow) return null;
    for (const section of this.achievements) {
      const achievement = section.achievements.find(a => a.key === this.newAchievementToShow);
      if (achievement) return achievement;
    }
    return null;
  }

  /** Handler: Favorites changed in child component */
  onFavoritePlacesChanged(updatedFavorites: Place[]): void {
    this.favorites = updatedFavorites;
    // TODO: Persist updated favorites to backend or state store
  }

  /** Handler: Visited places changed in child component */
  onVisitedPlacesChanged(updatedVisited: Place[]): void {
    this.visited = updatedVisited;
    // TODO: Persist updated visited list to backend or state store
  }

  /** Toggles editing mode for user info */
  handleToggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  /** Handler: Field change in edit mode */
  onFieldChange(field: keyof AuthUser, value: AuthUser[keyof AuthUser]): void {
    if (!this.editedUser) return;
    (this.editedUser as any)[field] = value;
    this.hasPendingChanges = true;
  }

  /** Handler: Settings changed in child settings component */
  onSettingsChanged(): void {
    this.hasPendingChanges = true;
  }

  /** Save changes to user profile */
  saveChanges(): void {
    if (!this.user || !this.editedUser) return;

    const payload: Partial<AuthUser> = {
      ...this.editedUser,
      email: this.user.email, // Prevent overwriting email
    };

    this.authService.updateUserProfile(payload).subscribe({
      next: updatedUser => {
        this.user = updatedUser;
        this.editedUser = { ...updatedUser };
        this.isEditing = false;
        this.hasPendingChanges = false;
        this.showModal = true;
      },
      error: err => console.error('❌ Failed to update profile:', err),
    });
  }

  /** Closes profile save confirmation modal */
  closeModal(): void {
    this.showModal = false;
  }

  /** Logs out current user */
  onLogout(): void {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  /** Closes new achievement modal */
  closeNewAchievementModal(): void {
    this.showNewAchievementModal = false;
    this.newAchievementToShow = null;
  }

  // ------------------- PRIVATE METHODS -------------------

  /** Loads all places from backend */
  private loadPlaces(): void {
    this.placesService.getPlaces().subscribe({
      next: places => {
        this.allPlaces = places;
        this.updateFavoritesAndVisited();
        this.loaderService.hide();
      },
      error: err => {
        console.error('❌ Failed to load places:', err);
        this.loaderService.hide();
      },
    });
  }

  /** Subscribes to authentication state changes */
  private subscribeToAuthUser(): void {
    this.subs.add(
      this.authService.user$.subscribe(user => {
        this.user = user;
        this.editedUser = user ? { ...user } : null;

        if (user) {
          this.themeService.setTheme((user.theme ?? 'light').toLowerCase() as Theme);
          this.loadPublicUserProfile(user.userId);
        } else {
          this.resetProfileData();
        }
      })
    );
  }

  /** Loads public profile for the authenticated user */
  private loadPublicUserProfile(userId: number): void {
    this.subs.add(
      this.authApiService.getPublicUserProfile(userId).subscribe({
        next: profile => {
          this.publicProfile = profile;
          this.updateUnlockedAchievements(profile);
          this.updateFavoritesAndVisited();
          this.calculateUserBadge(profile);
        },
        error: err => console.error('❌ Failed to load profile:', err),
      })
    );
  }

  /** Updates favorites and visited places based on user profile */
  private updateFavoritesAndVisited(): void {
    if (!this.user || !this.allPlaces.length) {
      this.favorites = [];
      this.visited = [];
      return;
    }

    const favoritePlaceIds = new Set(this.user.favoriteCafeIds);
    const visitedPlaceIds = new Set(this.publicProfile?.checkInCafes.map(c => c.id) || []);

    this.favorites = this.allPlaces.filter(place => favoritePlaceIds.has(place.id));
    this.visited = this.allPlaces.filter(place => visitedPlaceIds.has(place.id));
  }

  /** Updates unlocked achievements and detects new ones */
  private updateUnlockedAchievements(profile: PublicUserProfile): void {
    const unlocked = getUnlockedAchievements(profile);
    const current = new Set(unlocked.flatMap(s => s.achievements.map(a => a.key)));

    const prev = localStorage.getItem('unlockedAchievements');
    const prevSet = prev ? new Set(JSON.parse(prev)) : null;

    const newAchievements = prevSet
      ? Array.from(current).filter(key => !prevSet.has(key))
      : [];

    localStorage.setItem('unlockedAchievements', JSON.stringify(Array.from(current)));
    this.unlockedAchievementTitles = current;
    this.achievements = ACHIEVEMENTS;

    if (prevSet && newAchievements.length > 0) {
      this.newAchievementToShow = newAchievements[0];
      this.showNewAchievementModal = true;
    }
  }

  /** Calculates the user's badge type */
  private calculateUserBadge(profile: PublicUserProfile): void {
    const unlocked = getUnlockedAchievements(profile);
    this.badgeType = calculateBadgeType(unlocked, ACHIEVEMENTS);
  }

  /** Resets profile-related data */
  private resetProfileData(): void {
    this.publicProfile = null;
    this.favorites = [];
    this.visited = [];
    this.badgeType = null;
  }
}
