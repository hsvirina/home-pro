import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Review } from '../../../models/review.model';
import { ReviewsService } from '../../../services/reviews.service';
import { Place } from '../../../models/place.model';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  template: `
    <section class="reviews-section grid grid-cols-8 gap-[20px]">
      <!-- Заголовок -->
      <div class="col-span-8 flex items-center justify-between">
        <h5>
          Reviews
          <ng-container *ngIf="reviews.length > 0"
            >({{ reviews.length }})</ng-container
          >
        </h5>

        <div
          class="body-font-1 flex items-center gap-2 text-[var(--color-gray-75)]"
          *ngIf="reviews.length > 0"
        >
          <div class="flex items-center gap-1">
            <span>{{ place?.rating }}</span>
            <img src="/icons/star.png" alt="Star icon" class="h-4 w-4" />
          </div>
          <span>({{ place?.reviewCount }})</span>
          <button
            (click)="showMore()"
            [disabled]="visibleCount >= reviews.length"
            class="underline disabled:cursor-not-allowed disabled:opacity-50"
            style="text-decoration-style: dotted; text-underline-offset: 4px;"
          >
            click to see more reviews
          </button>
        </div>
      </div>

      <!-- Форма добавления отзыва -->
      <div
        *ngIf="currentUser"
        class="col-span-8 flex items-center gap-4 rounded-[40px] bg-[var(--color-bg-2)] p-4"
      >
        <img
          *ngIf="currentUser?.photoUrl"
          [src]="currentUser.photoUrl"
          alt="{{ currentUser.firstName }}"
          class="h-[50px] min-h-[50px] w-[50px] min-w-[50px] flex-shrink-0 rounded-full object-cover"
        />

        <!-- Звезды -->
        <div class="flex items-center gap-1">
          <ng-container *ngFor="let star of [1, 2, 3, 4, 5]">
            <img
              (mouseenter)="hoveredRating = star"
              (mouseleave)="hoveredRating = 0"
              (click)="newReviewRating = star"
              src="/icons/star.png"
              alt="Star"
              class="h-6 w-6 cursor-pointer transition duration-200"
              [style.opacity]="
                star <= (hoveredRating || newReviewRating) ? '1' : '0.3'
              "
            />
          </ng-container>
        </div>

        <textarea
          [(ngModel)]="newReviewText"
          placeholder="write what you think about this cafe..."
          rows="1"
          class="body-font-1 min-w-[200px] flex-grow resize-none overflow-hidden whitespace-normal break-words rounded-[40px] border border-[var(--color-gray-20)] px-8 py-3 focus:border-[var(--color-gray-20)] focus:shadow-none focus:outline-none"
          (input)="autoGrow($event)"
        ></textarea>

        <button
          (click)="addReview()"
          [disabled]="!canSubmitReview"
          [ngClass]="{
            'cursor-pointer bg-blue-500 text-white hover:bg-blue-700':
              canSubmitReview,
            'cursor-not-allowed bg-[var(--color-gray-20)] text-[var(--color-gray-55)]':
              !canSubmitReview,
          }"
          class="button-font h-[48px] w-[215px] flex-shrink-0 rounded-[40px] px-8 py-3"
        >
          Leave a Review
        </button>
      </div>

      <small
        class="col-span-8 text-[var(--color-primary)]"
        *ngIf="currentUser && newReviewRating === 0"
      >
        Please select a rating before submitting.
      </small>

      <!-- Список отзывов -->
      <ng-container *ngIf="reviews.length > 0; else noReviews">
        <div
          *ngFor="let review of reviews.slice(0, visibleCount)"
          class="review col-span-4 mb-11 flex flex-col gap-4 rounded-[40px] bg-[var(--color-bg-2)] p-4 shadow-hover"
        >
          <div class="flex items-start justify-between gap-3 ">
            <div class="flex gap-3 ">
              <img
                *ngIf="review.userPhotoUrl"
                [src]="review.userPhotoUrl"
                alt="{{ review.userName }} {{ review.userSurname }}"
                class="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <span class="menu-text-font">{{ review.userName }}</span>
                <div class="mt-1 flex gap-1">
                  <ng-container
                    *ngFor="let star of getStarsArray(review.rating)"
                  >
                    <img
                      src="/icons/star.png"
                      alt="Star icon"
                      class="h-4 w-4"
                    />
                  </ng-container>
                </div>
              </div>
            </div>

            <button
              *ngIf="
                review.userName === currentUser?.firstName &&
                review.userSurname === currentUser?.lastName
              "
              (click)="deleteReview(review.id)"
              class="font-bold text-red-500 hover:text-red-700"
              aria-label="Delete review"
              style="cursor: pointer; background: none; border: none; font-size: 1.2rem;"
            >
              <img src="/icons/close.svg" alt="Delete icon" />
            </button>
          </div>

          <span class="body-font-1">{{ review.text }}</span>
        </div>
      </ng-container>

      <ng-template #noReviews>
        <h5 class="col-span-8 mb-11 text-center text-[var(--color-gray-75)]">
          No reviews yet for this cafe
        </h5>
      </ng-template>
    </section>
  `,
})
export class ReviewsSectionComponent implements OnChanges {
  @Input() cafeId: number | null = null;
  @Input() place: Place | null = null;
  @Input() currentUser: User | null = null;

  reviews: Review[] = [];
  visibleCount = 2;
  newReviewText = '';
  newReviewRating = 0;
  hoveredRating = 0;

  constructor(private reviewsService: ReviewsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cafeId'] && this.cafeId !== null) {
      this.visibleCount = 2;
      this.loadReviews(this.cafeId);
    }
  }

  loadReviews(cafeId: number) {
    this.reviewsService.getReviewsByCafeId(cafeId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: () => {
        this.reviews = [];
      },
    });
  }

  addReview() {
    if (
      !this.newReviewText.trim() ||
      !this.cafeId ||
      this.newReviewRating === 0
    )
      return;

    const reviewData = {
      cafeId: this.cafeId,
      rating: this.newReviewRating,
      text: this.newReviewText.trim(),
    };

    this.reviewsService.addReview(reviewData).subscribe({
      next: (createdReview) => {
        const reviewToShow: Review = {
          ...createdReview,
          userId: (this.currentUser as any)?.id ?? 0,
          userName: this.currentUser?.firstName ?? 'Anonymous',
          userSurname: this.currentUser?.lastName ?? '',
          userPhotoUrl: this.currentUser?.photoUrl || '',
        };

        this.reviews.unshift(reviewToShow);
        this.newReviewText = '';
        this.newReviewRating = 0;
        this.visibleCount++;

        // Обновляем счётчик отзывов
        if (this.place) {
          this.place.reviewCount = (this.place.reviewCount || 0) + 1;
        }

        setTimeout(() => {
          const textarea = document.querySelector('textarea');
          if (textarea) {
            textarea.style.height = 'auto';
          }
        });
      },
      error: (err) => {
        console.error('Ошибка при добавлении отзыва:', err);
        if (err.status === 403) {
          alert('Ошибка 403: Доступ запрещён. Проверьте авторизацию.');
        }
      },
    });
  }

  deleteReview(reviewId: number) {
    this.reviewsService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r) => r.id !== reviewId);
        this.visibleCount = Math.min(this.visibleCount, this.reviews.length);

        // Уменьшаем счётчик отзывов, если объект place существует
        if (this.place) {
          this.place.reviewCount = Math.max(
            (this.place.reviewCount || 1) - 1,
            0,
          );
        }
      },
      error: (err) => {
        console.error('Ошибка при удалении отзыва:', err);
        alert('Не удалось удалить отзыв');
      },
    });
  }

  showMore() {
    if (this.visibleCount < this.reviews.length) {
      this.visibleCount += 2;
    }
  }

  autoGrow(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i + 1);
  }

  get canSubmitReview(): boolean {
    return this.newReviewText.trim().length > 0 && this.newReviewRating > 0;
  }
}
