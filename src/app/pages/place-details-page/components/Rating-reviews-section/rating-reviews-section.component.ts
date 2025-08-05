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

import { Review } from '../../../../core/models/review.model';
import { ReviewsService } from '../../../../core/services/reviews.service';
import { Place } from '../../../../core/models/place.model';
import { ICONS } from '../../../../core/constants/icons.constant';
import { IconComponent } from '../../../../shared/components/icon.component';
import { ModalComponent } from '../../../../shared/components/modal.component';
import { Observable } from 'rxjs';
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
              [badgeType]="userBadgeTypes.get(review.userId) ?? 'neutral'"
              [currentUserId]="currentUser?.userId ?? null"
              [likesInfo]="
                reviewLikesMap.get(review.id) ?? {
                  likedByCurrentUser: false,
                  totalLikes: 0,
                }
              "
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

      <!-- No reviews placeholder -->
      <ng-template #noReviews>
        <h5 class="text-[var(--color-gray-100)]' col-span-8 mb-11">
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
  // Inputs
  @Input() cafeId: number | null = null;
  @Input() place: Place | null = null;
  @Input() currentUser: AuthUser | null = null;
  @Input() isMobile = false;
  @Input() showAddReviewForm = false;
  @Input() alwaysShowFormOnDesktop = false;

  readonly currentTheme$: Observable<Theme>;
  reviewLikesMap = new Map<
    number,
    { likedByCurrentUser: boolean; totalLikes: number }
  >();

  ICONS = ICONS;

  userProfiles: Map<number, PublicUserProfile> = new Map();
  userBadgeTypes: Map<number, BadgeType> = new Map();

  // Local state
  reviews: Review[] = [];
  visibleCount = 2;
  newReviewText = '';
  newReviewRating = 0;

  @Input() publicUserProfile!: PublicUserProfile;

  reviewToDeleteId: number | null = null;
  showDeleteModal = false;

  userName: string = '';
  userEmail: string = '';

  showRatingWarning = false;
  badgeType: BadgeType = 'neutral';

  constructor(
    private reviewsService: ReviewsService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private authApiService: AuthApiService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  /** Detect input changes, reload reviews if cafeId changes */
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

  private loadReviews(cafeId: number) {
    this.reviewsService.getReviewsByCafeId(cafeId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;

        // Загружаем лайки для каждого отзыва
        this.loadLikesForReviews(reviews);

        this.loadProfilesForReviews();
      },
      error: () => {
        this.reviews = [];
      },
    });
  }

  private loadLikesForReviews(reviews: Review[]) {
    reviews.forEach((review) => {
      this.authApiService.getReviewLikesInfo(review.id).subscribe({
        next: (likesInfo) => {
          this.reviewLikesMap.set(review.id, likesInfo);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.warn(
            `Failed to load likes info for review ${review.id}`,
            err,
          );
        },
      });
    });
  }

  /** Обработчик лайка/удаления лайка от AppReviewItemComponent */
  onToggleLike(review: Review, liked: boolean) {
    if (liked) {
      this.authApiService.likeReview(review.id).subscribe({
        next: () => {
          this.updateLikesLocal(review.id, true);
        },
      });
    } else {
      this.authApiService.unlikeReview(review.id).subscribe({
        next: () => {
          this.updateLikesLocal(review.id, false);
        },
      });
    }
  }

  private updateLikesLocal(reviewId: number, likedByCurrentUser: boolean) {
    const likes = this.reviewLikesMap.get(reviewId);
    if (!likes) return;

    const totalLikes = likedByCurrentUser
      ? likes.totalLikes + 1
      : likes.totalLikes - 1;
    this.reviewLikesMap.set(reviewId, {
      likedByCurrentUser,
      totalLikes: Math.max(0, totalLikes),
    });
    this.cdr.detectChanges();
  }

  private loadProfilesForReviews() {
    this.reviews.forEach((review) => {
      const userId = review.userId;

      // Проверяем, есть ли профиль уже в кеше
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

  private calculateAndSetBadge(userId: number, profile: PublicUserProfile) {
    const unlocked = getUnlockedAchievements(profile);
    const badge = calculateBadgeType(unlocked, ACHIEVEMENTS);
    this.userBadgeTypes.set(userId, badge);
  }

  getBadgeImage(review: Review): string | null {
    const badgeType = this.userBadgeTypes.get(review.userId) ?? 'neutral';

    switch (badgeType) {
      case 'gold':
        return './assets/badges/GoldRate.png';
      case 'silver':
        return './assets/badges/SilverRate.png';
      case 'bronze':
        return './assets/badges/BronzeRate.png';
      default:
        return null;
    }
  }

  /** Check if review can be submitted */
  get canSubmitReview(): boolean {
    return this.newReviewRating > 0;
  }

  updateBadgeType() {
    const unlocked = getUnlockedAchievements(this.publicUserProfile);
    this.badgeType = calculateBadgeType(unlocked, ACHIEVEMENTS);
  }

  /** Submit a new review */
  addReview() {
    if (!this.cafeId) return;

    if (this.newReviewRating === 0) {
      this.showRatingWarning = true; // Если хочешь, чтобы пользователь знал
      return;
    }
    this.showRatingWarning = false;

    const reviewData: { cafeId: number; rating: number; text?: string } = {
      cafeId: this.cafeId,
      rating: this.newReviewRating,
    };

    const trimmedText = this.newReviewText.trim();
    if (trimmedText.length > 0) {
      reviewData.text = trimmedText;
    }

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

        if (this.place) {
          this.place.reviewCount = (this.place.reviewCount || 0) + 1;
        }

        // Reset textarea height after clearing content
        setTimeout(() => {
          const textarea = document.querySelector('textarea');
          if (textarea) textarea.style.height = 'auto';
        });
      },
      error: (err) => {
        console.error('Failed to add review:', err);
        if (err.status === 403) {
          alert('Error 403: Access denied. Please check your authorization.');
        }
      },
    });
  }

  /** Delete review by id */
  deleteReview(reviewId: number) {
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
        alert('Failed to delete review');
      },
    });
  }

  /** Open delete confirmation modal */
  confirmDelete(reviewId: number) {
    this.reviewToDeleteId = reviewId;
    this.showDeleteModal = true;
  }

  /** Confirm deletion and delete review */
  deleteConfirmed() {
    if (this.reviewToDeleteId !== null) {
      this.deleteReview(this.reviewToDeleteId);
      this.cancelDelete();
    }
  }

  /** Cancel delete action and close modal */
  cancelDelete() {
    this.showDeleteModal = false;
    this.reviewToDeleteId = null;
  }

  /** Show more reviews by increasing visible count */
  showMore() {
    if (this.visibleCount < this.reviews.length) {
      this.visibleCount += 2;
    }
  }
}
