import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { PublicUserProfile, AuthUser } from '../../core/models/user.model';
import { AuthApiService } from '../../core/services/auth-api.service';
import { LoaderService } from '../../core/services/loader.service';
import { PlacesService } from '../../core/services/places.service';

import { ACHIEVEMENTS } from '../../core/constants/achievements';
import { getUnlockedAchievements } from '../../core/utils/achievement.utils';
import { BadgeType, calculateBadgeType } from '../../core/utils/badge-utils';

import { InfoSectorComponent } from '../profile-page/components/info-sector.component';
import { AchievementSectorComponent } from '../profile-page/components/achievement-sector.component';
import { FavoritesVisitedSectorComponent } from '../profile-page/components/favorites-visited-sector.component';
import { MyReviewsComponent } from '../profile-page/components/my-reviews.component';

import { Place } from '../../core/models/place.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    InfoSectorComponent,
    AchievementSectorComponent,
    FavoritesVisitedSectorComponent,
    MyReviewsComponent,
  ],
  template: `
    <div *ngIf="authUserProfile" class="mx-auto flex max-w-[1320px] flex-col gap-8 pb-[78px]">
      <app-info-sector
        [editableUser]="authUserProfile"
        [isEditing]="false"
        [badgeType]="badgeType"
        [public]="true"
      ></app-info-sector>

      <app-achievement-sector
        [achievements]="achievements"
        [unlockedTitles]="unlockedAchievementTitles"
        [public]="true"
      ></app-achievement-sector>

      <app-favorites-visited-sector
        [favoritePlaces]="favoritePlaces"
        [visitedPlaces]="visitedPlaces"
        [isPublic] = "true"
      ></app-favorites-visited-sector>

      <app-my-reviews
        [userId]="authUserProfile.userId"
        [places]="allPlaces"
        [badgeType]="badgeType"
        [userPhotoUrl]="authUserProfile.photoUrl"
      ></app-my-reviews>
    </div>
  `,
})
export class PublicUserProfileComponent implements OnInit {
  profile: PublicUserProfile | null = null;
  authUserProfile: AuthUser | null = null;

  achievements = ACHIEVEMENTS;
  unlockedAchievementTitles = new Set<string>();

  favoritePlaces: Place[] = [];
  visitedPlaces: Place[] = [];
  allPlaces: Place[] = [];

  badgeType: BadgeType = null;

  constructor(
    private route: ActivatedRoute,
    private authApiService: AuthApiService,
    private loaderService: LoaderService,
    private placesService: PlacesService
  ) {}

  ngOnInit() {
    const userId = this.getUserIdFromRoute();

    if (userId !== null) {
      this.loadUserProfile(userId);
    }
  }

  /** Extracts and parses user ID from the current route parameters */
  private getUserIdFromRoute(): number | null {
    const userIdParam = this.route.snapshot.paramMap.get('id');
    const userId = userIdParam ? Number(userIdParam) : NaN;
    return isNaN(userId) ? null : userId;
  }

  /**
   * Loads user profile and related data, handles loading indicator,
   * and updates component state accordingly
   */
  private loadUserProfile(userId: number): void {
    this.loaderService.show();

    // Load all places first, then user profile
    this.placesService.getPlaces().subscribe({
      next: (places) => {
        this.allPlaces = places;
        this.fetchUserProfile(userId);
      },
      error: () => {
        this.loaderService.hide();
        // Could add error handling here (e.g. notification)
      },
    });
  }

  /** Fetches the public user profile and updates state */
  private fetchUserProfile(userId: number): void {
    this.authApiService.getPublicUserProfile(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.authUserProfile = this.mapPublicProfileToAuthUser(profile);

        this.updateAchievements(profile);
        this.updatePlaces(profile);

        this.loaderService.hide();
      },
      error: () => {
        this.resetProfileData();
        this.loaderService.hide();
      },
    });
  }

  /** Maps PublicUserProfile to AuthUser model for internal use */
  private mapPublicProfileToAuthUser(profile: PublicUserProfile): AuthUser {
    return {
      userId: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      photoUrl: profile.photoUrl,
      status: profile.statusText ?? null,
      defaultCity: profile.city,
      favoriteCafeIds: profile.favoriteCafes.map((cafe) => cafe.id),
      theme: 'light', // default theme, consider making dynamic if needed
      emailNotifications: false,
      pushNotifications: false,
      reviewNotifications: false,
      locationSharing: false,
    };
  }

  /** Updates unlocked achievements and badge type based on profile data */
  private updateAchievements(profile: PublicUserProfile): void {
    const unlocked = getUnlockedAchievements(profile);
    this.unlockedAchievementTitles = new Set(
      unlocked.flatMap((section) => section.achievements.map((a) => a.key))
    );
    this.badgeType = calculateBadgeType(unlocked, ACHIEVEMENTS);
  }

  /** Filters favorite and visited places based on profile */
  private updatePlaces(profile: PublicUserProfile): void {
    this.favoritePlaces = this.allPlaces.filter((place) =>
      profile.favoriteCafes.some((cafe) => cafe.id === place.id)
    );
    this.visitedPlaces = this.allPlaces.filter((place) =>
      profile.checkInCafes.some((cafe) => cafe.id === place.id)
    );
  }

  /** Resets profile-related data on error or invalid user ID */
  private resetProfileData(): void {
    this.profile = null;
    this.authUserProfile = null;
    this.favoritePlaces = [];
    this.visitedPlaces = [];
  }
}
