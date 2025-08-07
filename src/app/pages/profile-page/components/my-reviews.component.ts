import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicReview } from '../../../core/models/review.model';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { Place } from '../../../core/models/place.model';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { BadgeImagePipe } from '../../../core/pipes/badge-image.pipe';
import { BadgeType } from '../../../core/utils/badge-utils';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    BadgeImagePipe,
    TranslateModule,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="mx-auto flex w-full max-w-[1320px] flex-col gap-6">
      <!-- Title and description -->
      <header class="flex flex-col gap-2">
        <h5>{{ 'myReviews.title' | translate }}</h5>
        <span class="body-font-1">{{ 'myReviews.description' | translate }}</span>
      </header>

      <!-- Mobile view -->
      <section *ngIf="isMobile" class="flex flex-col gap-4">
        <ng-container *ngIf="reviews.length > 0; else noReviews">
          <div class="flex flex-col gap-4">
            <!-- Show limited reviews on mobile -->
            <div
              *ngFor="let review of reviews.slice(0, visibleCount)"
              class="flex gap-4 px-[18px] py-[15px]"
            >
              <!-- User photo with badge -->
              <div
                class="relative inline-block flex-shrink-0"
                [ngClass]="{ 'h-[50px] w-[50px] lg:h-[113px] lg:w-[113px]': true }"
              >
                <img
                  *ngIf="badgeType | badgeImage as badgeImg"
                  [src]="badgeImg"
                  alt="badge"
                  class="absolute left-0 top-0 h-full w-full rounded-full object-cover pointer-events-none"
                />
                <img
                  *ngIf="userPhotoUrl"
                  [src]="userPhotoUrl"
                  [alt]="userFirstName + ' ' + userLastName"
                  class="absolute left-1/2 top-1/2 h-[44px] w-[44px] lg:h-[100px] lg:w-[100px] rounded-full object-cover"
                  style="transform: translate(-50%, -50%)"
                />
              </div>

              <!-- Review content -->
              <div class="flex flex-col gap-2 lg:flex-row lg:gap-0 flex-1">
                <div class="flex flex-col gap-2 flex-1">
                  <span class="menu-text-font">{{ userFirstName }} {{ userLastName }}</span>
                  <span class="body-font-1">{{ review.text }}</span>
                  <div class="flex gap-[2px]">
                    <ng-container *ngFor="let star of getStarsArray(review.rating)">
                      <app-icon [icon]="ICONS.Star" />
                    </ng-container>
                  </div>
                </div>

                <div class="w-22 relative flex flex-shrink-0 justify-between lg:h-[113px] lg:flex-col items-end lg:items-center">
                  <span class="body-font-2">{{ formatDate(review.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Show More button for mobile -->
          <button
            *ngIf="reviews.length > visibleCount"
            (click)="showMore()"
            class="underline"
            style="text-decoration-style: dotted; text-underline-offset: 4px;"
          >
            {{ 'reviews.showMore' | translate }}
          </button>
        </ng-container>

        <!-- No reviews message -->
        <ng-template #noReviews>
          <div class="mt-4 text-gray-500">{{ 'myReviews.noReviews' | translate }}</div>
        </ng-template>
      </section>

      <!-- Desktop view -->
      <section *ngIf="!isMobile" class="flex w-full items-center">
        <!-- Navigation buttons -->
        <button
          class="custom-prev custom-arrow lg:h-13 lg:w-13 mr-4 h-10 w-10 flex-shrink-0"
          [attr.aria-label]="'myReviews.ariaPrev' | translate"
        ></button>

        <!-- Swiper slider -->
        <swiper-container
          [breakpoints]="swiperBreakpoints"
          navigation="true"
          navigation-prev-el=".custom-prev"
          navigation-next-el=".custom-next"
          class="min-w-0 flex-1"
        >
          <swiper-slide *ngFor="let review of reviews">
            <div
              class="flex h-full flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-gray-20)] p-4"
            >
              <!-- User info with badge and photo -->
              <div class="flex items-center gap-3">
                <div *ngIf="userPhotoUrl" class="relative mr-2" style="width: 50px; height: 50px;">
                  <img
                    *ngIf="badgeType"
                    [src]="badgeType | badgeImage"
                    alt="{{ badgeType }} badge"
                    class="absolute left-0 top-0 h-[50px] w-[50px] object-contain"
                  />
                  <img
                    [src]="userPhotoUrl"
                    alt="User photo"
                    class="rounded-full"
                    style="width: 44px; height: 44px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <span>{{ userFirstName }} {{ userLastName }}</span>
                  <div
                    class="flex gap-[2px]"
                    [attr.aria-label]="'myReviews.ratingStars' | translate"
                  >
                    <ng-container *ngFor="let star of createStarsArray(review.rating)">
                      <app-icon [icon]="ICONS.Star" />
                    </ng-container>
                  </div>
                </div>
              </div>

              <!-- Review text with ellipsis -->
              <div class="body-font-1 review-text" *ngIf="review.text; else noText">
                {{ review.text }}
              </div>

              <!-- Place info and navigation -->
              <ng-container *ngIf="getPlaceById(review.cafeId) as cafe">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <img
                      [src]="cafe.photoUrls[0]"
                      alt="{{ cafe.name }}"
                      class="h-12 w-12 rounded-full object-cover"
                    />
                    <div class="flex flex-col gap-1">
                      <div class="menu-text-font">{{ cafe.name }}</div>
                      <div class="flex items-center gap-2">
                        <app-icon [icon]="ICONS.Location" />
                        <span class="body-font-1 underline">{{ cafe.address }}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    class="button-bg-transparent w-full gap-2 whitespace-nowrap px-4 py-2 lg:w-auto"
                    (click)="goToCafe(cafe.id)"
                  >
                    {{ 'myReviews.goToCafe' | translate }}
                    <app-icon [icon]="ICONS.ArrowDownRightPrimary" />
                  </button>
                </div>
              </ng-container>

              <!-- No review text fallback -->
              <ng-template #noText>
                <div class="flex flex-1 items-center justify-center text-center">
                  <em class="text-gray-400">{{ 'myReviews.noReviewText' | translate }}</em>
                </div>
              </ng-template>
            </div>
          </swiper-slide>
        </swiper-container>

        <!-- Next button -->
        <button
          class="custom-next custom-arrow ml-4 h-10 w-10 flex-shrink-0"
          [attr.aria-label]="'myReviews.ariaNext' | translate"
        ></button>
      </section>

      <!-- No reviews message for desktop -->
      <ng-template [ngIf]="reviews.length === 0">
        <div class="mt-4 text-gray-500">{{ 'myReviews.noReviews' | translate }}</div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      swiper-container {
        width: 100%;
      }

      .custom-arrow {
        background-repeat: no-repeat;
        background-position: center;
        background-size: 24px 24px;
        cursor: pointer;
        border: none;
        background-color: var(--color-white);
        border-radius: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
      }

      .custom-arrow:hover {
        background-color: #f0f0f0;
      }

      .custom-prev.custom-arrow {
        background-image: url('/assets/icons/arrow-left.svg');
      }

      .custom-next.custom-arrow {
        background-image: url('/assets/icons/arrow-right.svg');
      }

      swiper-container,
      swiper-slide {
        height: 100% !important;
      }

      swiper-slide > div {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      /* Review text truncation with ellipsis */
      .review-text {
        height: 144px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        word-break: break-word;
      }
    `,
  ],
})
export class MyReviewsComponent implements OnInit, AfterViewInit {
  /** User ID to fetch reviews for */
  @Input() userId!: number | null;

  /** User photo URL for displaying in reviews */
  @Input() userPhotoUrl: string | null = null;

  /** List of places to cross-reference with reviews */
  @Input() places: Place[] = [];

  /** Badge type to display on user photo */
  @Input() badgeType: BadgeType | null = null;

  /** List of reviews loaded */
  reviews: PublicReview[] = [];

  /** User first name from profile */
  userFirstName: string | null = null;

  /** User last name from profile */
  userLastName: string | null = null;

  /** Icon constants for UI */
  ICONS = ICONS;

  /** Flag indicating if current viewport is mobile */
  isMobile = false;

  /** Number of visible reviews on mobile */
  visibleCount = 2;

  /** Swiper breakpoints for responsive slider */
  swiperBreakpoints = {
    0: { slidesPerView: 1, spaceBetween: 10 },
    1024: { slidesPerView: 2, spaceBetween: 20 },
  };

  constructor(
    private authApiService: AuthApiService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private datePipe: DatePipe,
  ) {}

  /**
   * Lifecycle hook: Initialization.
   * Loads user profile and reviews, sets up initial mobile detection.
   */
  ngOnInit(): void {
    this.onResize();

    if (!this.userId) {
      console.error('userId is not provided');
      return;
    }

    this.authApiService.getPublicUserProfile(this.userId).subscribe({
      next: (profile) => {
        this.userFirstName = profile.firstName;
        this.userLastName = profile.lastName;

        // Map reviews and attach user info for UI display
        this.reviews = (profile.reviews || []).map((review) => ({
          ...review,
          userId: this.userId!,
          userName: this.userFirstName ?? '',
          userSurname: this.userLastName ?? '',
          userPhotoUrl: this.userPhotoUrl ?? '',
        }));

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user profile reviews:', err);
      },
    });
  }

  /** Lifecycle hook after the view initializes; no-op here */
  ngAfterViewInit(): void {}

  /**
   * Format date string to readable format
   * @param dateString ISO date string
   * @returns formatted date string or null
   */
  formatDate(dateString: string): string | null {
    return this.datePipe.transform(dateString, 'MMM dd, yyyy');
  }

  /**
   * Creates an array for rendering star icons based on rating
   * @param rating number of stars
   * @returns array with length equal to rating
   */
  createStarsArray(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }

  /** Alias for createStarsArray for mobile */
  getStarsArray(rating: number): number[] {
    return this.createStarsArray(rating);
  }

  /**
   * Find a place by its ID
   * @param id place ID
   * @returns Place object or undefined
   */
  getPlaceById(id: number): Place | undefined {
    return this.places.find((place) => place.id === id);
  }

  /**
   * Navigate to cafe details page by ID
   * @param cafeId ID of the cafe/place
   */
  goToCafe(cafeId: number): void {
    this.router.navigate(['/catalog', cafeId]);
  }

  /**
   * Show more reviews on mobile by increasing visibleCount
   */
  showMore(): void {
    if (this.visibleCount < this.reviews.length) {
      this.visibleCount += 2;
    }
  }

  /**
   * Detect viewport changes and update isMobile flag
   */
  @HostListener('window:resize')
  onResize(): void {
    const prevMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1024;
    if (prevMobile !== this.isMobile) {
      this.cdr.detectChanges();
    }
  }
}
