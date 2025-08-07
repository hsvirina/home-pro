import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';

import { Review } from '../../../../core/models/review.model';
import { ReviewsService } from '../../../../core/services/reviews.service';
import { Place } from '../../../../core/models/place.model';
import { ICONS } from '../../../../core/constants/icons.constant';
import { ModalComponent } from '../../../../shared/components/modal.component';
import { Theme } from '../../../../core/models/theme.type';
import { ThemeService } from '../../../../core/services/theme.service';
import {
  AuthUser,
  PublicUserProfile,
} from '../../../../core/models/user.model';
import { RouterModule } from '@angular/router';
import {
  BadgeType,
  calculateBadgeType,
} from '../../../../core/utils/badge-utils';
import { ACHIEVEMENTS } from '../../../../core/constants/achievements';
import { getUnlockedAchievements } from '../../../../core/utils/achievement.utils';
import { AuthApiService } from '../../../../core/services/auth-api.service';
import { AppReviewItemComponent } from './components/review-item.component';
import { AppAddReviewFormComponent } from './components/add-review-form.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-rating-reviews-section',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    FormsModule,
    ModalComponent,
    RouterModule,
    AppReviewItemComponent,
    AppAddReviewFormComponent,
    TranslateModule,
  ],
  template: `
    <section>
      <div class="flex flex-col gap-[16px]">
        <div class="flex flex-col gap-2">
          <h4>{{ 'reviews.title' | translate }}</h4>
          <div class="body-font-1 flex justify-between">
            <span>{{ 'reviews.subtitle' | translate }}</span>
            <button
              *ngIf="reviews.length > 2"
              (click)="showMore()"
              [disabled]="visibleCount >= reviews.length"
              class="underline"
              style="text-decoration-style: dotted; text-underline-offset: 4px;"
            >
              {{ 'reviews.showMore' | translate }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <ng-container *ngIf="reviews.length > 0; else noReviews">
            <app-review-item
              *ngFor="let review of reviews.slice(0, visibleCount)"
              [review]="review"
              [badgeType]="userBadgeTypes.get(review.userId) ?? null"
              [currentUserId]="currentUser?.userId ?? null"
              [likesInfo]="getLikesInfo(review.id)"
              (toggleLike)="onToggleLike(review, $event)"
              (delete)="confirmDelete($event)"
              [isLoggedIn]="!!currentUser"
            ></app-review-item>
          </ng-container>
        </div>

        <app-add-review-form
          *ngIf="currentUser"
          [currentUser]="currentUser"
          [currentTheme$]="currentTheme$"
          [userName]="userName"
          [userEmail]="userEmail"
          [newReviewText]="newReviewText"
          [newReviewRating]="newReviewRating"
          [canSubmitReview]="canSubmitReview"
          [alwaysShowFormOnDesktop]="alwaysShowFormOnDesktop"
          [showAddReviewForm]="showAddReviewForm"
          (reviewTextChange)="newReviewText = $event"
          (reviewRatingChange)="newReviewRating = $event"
          (addReview)="addReview()"
        ></app-add-review-form>
      </div>

      <ng-template #noReviews>
        <h5 class="col-span-8 mb-11 text-[var(--color-gray-100)]">
          {{ 'reviews.noReviews' | translate }}
        </h5>
      </ng-template>

      <app-modal [isOpen]="showDeleteModal" (close)="cancelDelete()">
        <h4 class="mb-4 text-center">
          {{ 'reviews.deleteConfirmTitle' | translate }}
        </h4>
        <p class="menu-text-font mb-4 text-center text-[var(--color-gray-75)]">
          {{ 'reviews.deleteConfirmMessage' | translate }}
        </p>
        <div class="flex justify-center gap-4">
          <button
            (click)="deleteConfirmed()"
            class="button-font button-bg-blue px-6 py-2"
          >
            {{ 'reviews.deleteYes' | translate }}
          </button>
          <button
            (click)="cancelDelete()"
            class="button-font button-bg-transparent px-6 py-2"
          >
            {{ 'reviews.deleteCancel' | translate }}
          </button>
        </div>
      </app-modal>
    </section>
  `,
})
export class RatingReviewsSectionComponent implements OnChanges {
  @Input() cafeId: number | null = null;
  @Input() place: Place | null = null;
  @Input() currentUser: AuthUser | null = null;
  @Input() isMobile = false;
  @Input() showAddReviewForm = false;
  @Input() alwaysShowFormOnDesktop = false;
  @Input() publicUserProfile!: PublicUserProfile;

  @Output() reviewAdded = new EventEmitter<void>();

  readonly currentTheme$: Observable<Theme>;
  readonly ICONS = ICONS;

  reviews: Review[] = [];
  reviewLikesMap = new Map<
    number,
    { likedByCurrentUser: boolean; totalLikes: number }
  >();
  userProfiles: Map<number, PublicUserProfile> = new Map();
  userBadgeTypes: Map<number, BadgeType> = new Map();

  visibleCount = 2;
  newReviewText = '';
  newReviewRating = 0;

  reviewToDeleteId: number | null = null;
  showDeleteModal = false;

  userName: string = '';
  userEmail: string = '';
  badgeType: BadgeType = null;

  constructor(
    private reviewsService: ReviewsService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private authApiService: AuthApiService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cafeId'] && this.cafeId !== null) {
      this.visibleCount = 2;
      this.loadReviews(this.cafeId);
    }

    if (changes['currentUser'] && this.currentUser) {
      this.userName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      this.userEmail = this.currentUser.email;
    }

    if (changes['publicUserProfile'] && this.publicUserProfile) {
      this.updateBadgeType();
    }
  }

  private loadReviews(cafeId: number): void {
    this.reviewsService.getReviewsByCafeId(cafeId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loadLikesForReviews(reviews);
        this.loadProfilesForReviews();
      },
      error: () => {
        this.reviews = [];
      },
    });
  }

  private loadLikesForReviews(reviews: Review[]): void {
    const likesObservables = reviews.map((review) =>
      this.authApiService.getReviewLikesInfo(review.id),
    );

    forkJoin(likesObservables).subscribe({
      next: (likesArray) => {
        const newMap = new Map<
          number,
          { likedByCurrentUser: boolean; totalLikes: number }
        >();
        reviews.forEach((review, index) => {
          newMap.set(review.id, likesArray[index]);
        });
        this.reviewLikesMap = newMap;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Failed to load likes info for some reviews', err);
      },
    });
  }

  private updateLikesLocal(
    reviewId: number,
    likedByCurrentUser: boolean,
  ): void {
    const likes = this.reviewLikesMap.get(reviewId);
    if (!likes) return;

    const totalLikes = likedByCurrentUser
      ? likes.totalLikes + 1
      : likes.totalLikes - 1;
    const newMap = new Map(this.reviewLikesMap);
    newMap.set(reviewId, {
      likedByCurrentUser,
      totalLikes: Math.max(0, totalLikes),
    });
    this.reviewLikesMap = newMap;
    this.cdr.detectChanges();
  }

  private loadProfilesForReviews(): void {
    this.reviews.forEach((review) => {
      const userId = review.userId;

      if (!this.userProfiles.has(userId)) {
        this.authApiService.getPublicUserProfile(userId).subscribe({
          next: (profile) => {
            this.userProfiles.set(userId, profile);
            this.calculateAndSetBadge(userId, profile);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.warn(`Failed to load profile for user ${userId}`, err);
          },
        });
      }
    });
  }

  private calculateAndSetBadge(
    userId: number,
    profile: PublicUserProfile,
  ): void {
    const unlocked = getUnlockedAchievements(profile);
    const badge = calculateBadgeType(unlocked, ACHIEVEMENTS);
    this.userBadgeTypes.set(userId, badge);
  }

  updateBadgeType(): void {
    const unlocked = getUnlockedAchievements(this.publicUserProfile);
    this.badgeType = calculateBadgeType(unlocked, ACHIEVEMENTS);
  }

  get canSubmitReview(): boolean {
    return this.newReviewRating > 0;
  }

  addReview(): void {
    if (!this.cafeId || this.newReviewRating === 0) return;

    const trimmedText = this.newReviewText.trim();
    const reviewData: { cafeId: number; rating: number; text?: string } = {
      cafeId: this.cafeId,
      rating: this.newReviewRating,
      ...(trimmedText && { text: trimmedText }),
    };

    this.reviewsService.addReview(reviewData).subscribe({
      next: (createdReview) => {
        const reviewToShow: Review = {
          ...createdReview,
          userName: this.currentUser?.firstName ?? 'Anonymous',
          userSurname: this.currentUser?.lastName ?? '',
          userPhotoUrl: this.currentUser?.photoUrl || '',
        };
        this.reviews.unshift(reviewToShow);
        this.newReviewText = '';
        this.newReviewRating = 0;
        this.visibleCount++;
        this.cdr.detectChanges();
        this.reviewAdded.emit();

        if (this.place) {
          this.place.reviewCount = (this.place.reviewCount || 0) + 1;
        }

        setTimeout(() => {
          const textarea = document.querySelector('textarea');
          if (textarea) textarea.style.height = 'auto';
        });
      },
      error: (err) => {
        console.error('Failed to add review:', err);
      },
    });
  }

  confirmDelete(reviewId: number): void {
    this.reviewToDeleteId = reviewId;
    this.showDeleteModal = true;
  }

  deleteConfirmed(): void {
    if (this.reviewToDeleteId !== null) {
      this.deleteReview(this.reviewToDeleteId);
      this.cancelDelete();
    }
  }

  deleteReview(reviewId: number): void {
    this.reviewsService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r) => r.id !== reviewId);
        this.visibleCount = Math.min(this.visibleCount, this.reviews.length);

        if (this.place) {
          this.place.reviewCount = Math.max(
            (this.place.reviewCount || 1) - 1,
            0,
          );
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to delete review:', err);
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.reviewToDeleteId = null;
  }

  showMore(): void {
    if (this.visibleCount < this.reviews.length) {
      this.visibleCount += 2;
    }
  }

  getLikesInfo(reviewId: number): {
    likedByCurrentUser: boolean;
    totalLikes: number;
  } {
    const likesInfo = this.reviewLikesMap.get(reviewId);
    return likesInfo ?? { likedByCurrentUser: false, totalLikes: 0 };
  }

  // Handles the toggling of likes for reviews.
  onToggleLike(review: Review, liked: boolean): void {
    // Call the appropriate API for liking or unliking a review
    const likeAction = liked
      ? this.authApiService.likeReview(review.id)
      : this.authApiService.unlikeReview(review.id);

    // Handle the result of the like/unlike action
    likeAction.subscribe({
      next: () => {
        this.updateLikesLocal(review.id, liked); // Update local likes data
      },
      error: (err) => {
        console.error(
          `Server like action failed for reviewId=${review.id}`,
          err,
        ); // Error handling
      },
    });
  }
}
