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
import { AuthUser, PublicUserProfile } from '../../../../core/models/user.model';
import { RouterModule } from '@angular/router';
import { BadgeType, calculateBadgeType } from '../../../../core/utils/badge-utils';
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
      <!-- Header Section -->
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

        <!-- Reviews List -->
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

        <!-- Add Review Form -->
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

      <!-- No Reviews Template -->
      <ng-template #noReviews>
        <h5 class="col-span-8 mb-11">{{ 'reviews.noReviews' | translate }}</h5>
      </ng-template>

      <!-- Delete Confirmation Modal -->
      <app-modal [isOpen]="showDeleteModal" (close)="cancelDelete()">
        <h4 class="mb-4 text-center">{{ 'reviews.deleteConfirmTitle' | translate }}</h4>
        <p class="menu-text-font mb-4 text-center text-[var(--color-gray-75)]">
          {{ 'reviews.deleteConfirmMessage' | translate }}
        </p>
        <div class="flex justify-center gap-4">
          <button (click)="deleteConfirmed()" class="button-font button-bg-blue px-6 py-2">
            {{ 'reviews.deleteYes' | translate }}
          </button>
          <button (click)="cancelDelete()" class="button-font button-bg-transparent px-6 py-2">
            {{ 'reviews.deleteCancel' | translate }}
          </button>
        </div>
      </app-modal>
    </section>
  `,
})
export class RatingReviewsSectionComponent implements OnChanges {
  // ================== Inputs & Outputs ==================
  @Input() cafeId: number | null = null;
  @Input() place: Place | null = null;
  @Input() currentUser: AuthUser | null = null;
  @Input() isMobile = false;
  @Input() showAddReviewForm = false;
  @Input() alwaysShowFormOnDesktop = false;
  @Input() publicUserProfile!: PublicUserProfile;

  @Output() reviewAdded = new EventEmitter<void>();

  // ================== Observables & Constants ==================
  readonly currentTheme$: Observable<Theme>;
  readonly ICONS = ICONS;

  // ================== State ==================
  reviews: Review[] = [];
  reviewLikesMap = new Map<number, { likedByCurrentUser: boolean; totalLikes: number }>();
  userProfiles: Map<number, PublicUserProfile> = new Map();
  userBadgeTypes: Map<number, BadgeType> = new Map();

  visibleCount = 2;
  newReviewText = '';
  newReviewRating = 0;

  reviewToDeleteId: number | null = null;
  showDeleteModal = false;

  userName = '';
  userEmail = '';
  badgeType: BadgeType = null;

  constructor(
    private reviewsService: ReviewsService,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private authApiService: AuthApiService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  // ================== Lifecycle Hooks ==================
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

  // ================== Private Methods ==================

  /** Load reviews for the current cafe */
  private loadReviews(cafeId: number): void {
    this.reviewsService.getReviewsByCafeId(cafeId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loadLikesForReviews(reviews);
        this.loadProfilesForReviews();
      },
      error: () => (this.reviews = []),
    });
  }

  /** Load likes info for all reviews */
  private loadLikesForReviews(reviews: Review[]): void {
    const likesObservables = reviews.map((r) => this.authApiService.getReviewLikesInfo(r.id));

    forkJoin(likesObservables).subscribe({
      next: (likesArray) => {
        const newMap = new Map<number, { likedByCurrentUser: boolean; totalLikes: number }>();
        reviews.forEach((review, index) => newMap.set(review.id, likesArray[index]));
        this.reviewLikesMap = newMap;
        this.cdr.detectChanges();
      },
      error: (err) => console.warn('Failed to load likes info', err),
    });
  }

  /** Load user profiles and calculate badge types */
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
          error: (err) => console.warn(`Failed to load profile for user ${userId}`, err),
        });
      }
    });
  }

  /** Calculate badge type for a user */
  private calculateAndSetBadge(userId: number, profile: PublicUserProfile): void {
    const unlocked = getUnlockedAchievements(profile);
    const badge = calculateBadgeType(unlocked, ACHIEVEMENTS);
    this.userBadgeTypes.set(userId, badge);
  }

  /** Update badge type for public user profile input */
  updateBadgeType(): void {
    const unlocked = getUnlockedAchievements(this.publicUserProfile);
    this.badgeType = calculateBadgeType(unlocked, ACHIEVEMENTS);
  }

  /** Update local likes map after toggling like */
  private updateLikesLocal(reviewId: number, likedByCurrentUser: boolean): void {
    const likes = this.reviewLikesMap.get(reviewId);
    if (!likes) return;

    const totalLikes = likedByCurrentUser ? likes.totalLikes + 1 : likes.totalLikes - 1;
    this.reviewLikesMap.set(reviewId, { likedByCurrentUser, totalLikes: Math.max(0, totalLikes) });
    this.cdr.detectChanges();
  }

  // ================== Public Methods ==================

  /** Whether the review form can be submitted */
  get canSubmitReview(): boolean {
    return this.newReviewRating > 0;
  }

  /** Add a new review */
  addReview(): void {
    if (!this.cafeId || this.newReviewRating === 0) return;

    const trimmedText = this.newReviewText.trim();
    const reviewData = { cafeId: this.cafeId, rating: this.newReviewRating, ...(trimmedText && { text: trimmedText }) };

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

        if (this.place) this.place.reviewCount = (this.place.reviewCount || 0) + 1;

        setTimeout(() => {
          const textarea = document.querySelector('textarea');
          if (textarea) textarea.style.height = 'auto';
        });
      },
      error: (err) => console.error('Failed to add review:', err),
    });
  }

  /** Open delete confirmation modal */
  confirmDelete(reviewId: number): void {
    this.reviewToDeleteId = reviewId;
    this.showDeleteModal = true;
  }

  /** Delete confirmed review */
  deleteConfirmed(): void {
    if (this.reviewToDeleteId !== null) {
      this.deleteReview(this.reviewToDeleteId);
      this.cancelDelete();
    }
  }

  /** Delete review from backend and local state */
  deleteReview(reviewId: number): void {
    this.reviewsService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r) => r.id !== reviewId);
        this.visibleCount = Math.min(this.visibleCount, this.reviews.length);

        if (this.place) this.place.reviewCount = Math.max((this.place.reviewCount || 1) - 1, 0);

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to delete review:', err),
    });
  }

  /** Cancel deletion modal */
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.reviewToDeleteId = null;
  }

  /** Show more reviews in the list */
  showMore(): void {
    if (this.visibleCount < this.reviews.length) this.visibleCount += 2;
  }

  /** Get likes info for a review */
  getLikesInfo(reviewId: number): { likedByCurrentUser: boolean; totalLikes: number } {
    return this.reviewLikesMap.get(reviewId) ?? { likedByCurrentUser: false, totalLikes: 0 };
  }

  /** Handle like/unlike toggle for a review */
  onToggleLike(review: Review, liked: boolean): void {
    const likeAction = liked ? this.authApiService.likeReview(review.id) : this.authApiService.unlikeReview(review.id);

    likeAction.subscribe({
      next: () => this.updateLikesLocal(review.id, liked),
      error: (err) => console.error(`Server like action failed for reviewId=${review.id}`, err),
    });
  }
}
