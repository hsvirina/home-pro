import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PublicUserProfile, AuthUser } from '../../core/models/user.model';
import { AuthApiService } from '../../core/services/auth-api.service';
import { LoaderService } from '../../core/services/loader.service';

import { ACHIEVEMENTS } from '../../core/constants/achievements';
import { getUnlockedAchievements } from '../../core/utils/achievement.utils';
import { BadgeType, calculateBadgeType } from '../../core/utils/badge-utils';

import { InfoSectorComponent } from '../profile-page/components/info-sector.component';
import { AchievementSectorComponent } from '../profile-page/components/achievement-sector.component';
import { FavoritesVisitedSectorComponent } from '../profile-page/components/favorites-visited-sector.component';
import { Place } from '../../core/models/place.model';
import { PlacesService } from '../../core/services/places.service';
import { MyReviewsComponent } from '../profile-page/components/my-reviews.component';

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
    <div
      *ngIf="authUserProfile"
      class="mx-auto flex max-w-[1320px] flex-col gap-8 pb-[78px]"
    >
      <app-info-sector
        [editableUser]="authUserProfile"
        [isEditing]="false"
        [badgeType]="badgeType"
      ></app-info-sector>

      <app-achievement-sector
        [achievements]="achievements"
        [unlockedTitles]="unlockedAchievementTitles"
      ></app-achievement-sector>

      <app-favorites-visited-sector
        [favoritePlaces]="favoritePlaces"
        [visitedPlaces]="visitedPlaces"
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

  badgeType: BadgeType = 'neutral';

  constructor(
    private route: ActivatedRoute,
    private authApiService: AuthApiService,
    private loaderService: LoaderService,
    private placesService: PlacesService,
  ) {}

  ngOnInit() {
    const userIdParam = this.route.snapshot.paramMap.get('id');
    const userId = userIdParam ? Number(userIdParam) : NaN;

    if (!isNaN(userId)) {
      this.loaderService.show();

      this.placesService.getPlaces().subscribe({
        next: (places) => {
          this.allPlaces = places;

          this.authApiService.getPublicUserProfile(userId).subscribe({
            next: (profile) => {
              this.profile = profile;
              this.authUserProfile = this.mapPublicProfileToAuthUser(profile);
              this.updateUnlockedAchievements(profile);
              this.calculateBadge(profile);

              this.favoritePlaces = this.allPlaces.filter((place) =>
                profile.favoriteCafes.some((cafe) => cafe.id === place.id),
              );
              this.visitedPlaces = this.allPlaces.filter((place) =>
                profile.checkInCafes.some((cafe) => cafe.id === place.id),
              );

              this.loaderService.hide();
            },
            error: () => {
              this.profile = null;
              this.authUserProfile = null;
              this.favoritePlaces = [];
              this.visitedPlaces = [];
              this.loaderService.hide();
            },
          });
        },
        error: () => {
          this.loaderService.hide();
        },
      });
    }
  }

  private mapPublicProfileToAuthUser(profile: PublicUserProfile): AuthUser {
    return {
      userId: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      photoUrl: profile.photoUrl,
      status: profile.statusText ?? null,
      defaultCity: '',
      favoriteCafeIds: profile.favoriteCafes.map((cafe) => cafe.id),
      theme: 'light',
      emailNotifications: false,
      pushNotifications: false,
      reviewNotifications: false,
      locationSharing: false,
    };
  }

  private updateUnlockedAchievements(profile: PublicUserProfile) {
    const unlockedSections = getUnlockedAchievements(profile);
    const titles = new Set(
      unlockedSections.flatMap((section) =>
        section.achievements.map((a) => a.title),
      ),
    );
    this.unlockedAchievementTitles = titles;
  }

  private calculateBadge(profile: PublicUserProfile) {
    const unlocked = getUnlockedAchievements(profile);
    this.badgeType = calculateBadgeType(unlocked, ACHIEVEMENTS);
  }
}
