import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
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
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';
import { Theme } from '../../../core/models/theme.type';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    BadgeImagePipe,
    TranslateModule,
    ThemedIconPipe,
  ],
  providers: [DatePipe],
  template: `
    <div class="mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-5 lg:px-10 xxl:px-0">
      <!-- Title -->
      <header class="flex flex-col gap-2">
        <h5>{{ 'myReviews.title' | translate }}</h5>
        <span class="body-font-1">{{ 'myReviews.description' | translate }}</span>
      </header>

      <!-- Mobile reviews list -->
      <section *ngIf="isMobile" class="flex flex-col gap-4">
        <ng-container *ngIf="reviews.length > 0; else noReviews">
          <div class="flex flex-col gap-4">
            <div *ngFor="let review of reviews.slice(0, visibleCount)" class="flex gap-4 px-[18px] py-[15px]">
              <!-- User photo with badge -->
              <div class="relative inline-block h-[50px] w-[50px] flex-shrink-0">
                <img *ngIf="badgeType | badgeImage as badgeImg" [src]="badgeImg" alt="badge" class="absolute left-0 top-0 h-full w-full rounded-full object-cover pointer-events-none" />
                <img *ngIf="userPhotoUrl" [src]="userPhotoUrl" [alt]="fullName" class="absolute left-1/2 top-1/2 h-[44px] w-[44px] rounded-full object-cover" style="transform: translate(-50%, -50%)" />
              </div>

              <!-- Review content -->
              <div class="flex flex-1 flex-col gap-2 lg:flex-row lg:gap-0">
                <div class="flex flex-1 flex-col gap-2">
                  <span class="menu-text-font">{{ fullName }}</span>
                  <span class="body-font-1">{{ review.text }}</span>
                  <div class="flex gap-[2px]">
                    <ng-container *ngFor="let star of getStarsArray(review.rating)">
                      <app-icon [icon]="ICONS.Star" />
                    </ng-container>
                  </div>
                </div>
                <div class="w-22 relative flex flex-shrink-0 items-end justify-between lg:h-[113px] lg:flex-col lg:items-center">
                  <span class="body-font-2">{{ formatDate(review.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <button *ngIf="reviews.length > visibleCount" (click)="showMore()" class="underline" style="text-decoration-style: dotted; text-underline-offset: 4px;">
            {{ 'reviews.showMore' | translate }}
          </button>
        </ng-container>

        <ng-template #noReviews>
          <div class="mt-4 text-gray-500">{{ 'myReviews.noReviews' | translate }}</div>
        </ng-template>
      </section>

      <!-- Desktop carousel -->
      <section *ngIf="!isMobile && reviews.length > 0" class="flex flex-col items-center">
        <div class="flex w-full max-w-[1320px] items-center gap-5">
          <!-- Prev button -->
          <button
            class="flex h-[52px] w-[52px] items-center justify-center rounded-full p-2 text-2xl transition"
            (click)="prevSlide()"
            [attr.aria-label]="'myReviews.ariaPrev' | translate"
            [ngClass]="themeButtonClass"
          >
            <app-icon [icon]="'ArrowLeft' | themedIcon" [width]="32" [height]="32"></app-icon>
          </button>

          <!-- Slides container -->
          <div class="flex w-full overflow-hidden">
            <div class="flex gap-[20px] transition-transform duration-300 ease-in-out will-change-transform" [style.transform]="transformStyle" [style.width.px]="slidesContainerWidthPx">
              <div *ngFor="let review of reviews" class="box-border flex-shrink-0 px-2" #slideRef [style.width.px]="slideWidthPx - 20" style="max-width: 578px;">
                <div class="flex h-full flex-col justify-between gap-4 rounded-2xl border border-gray-300 p-4">
                  <!-- User info -->
                  <div class="flex items-center gap-3">
                    <div class="relative mr-2 h-[50px] w-[50px]">
                      <img *ngIf="badgeType" [src]="badgeType | badgeImage" alt="{{ badgeType }} badge" class="absolute left-0 top-0 h-[50px] w-[50px] object-contain" />
                      <img [src]="userPhotoUrl" alt="User photo" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[44px] w-[44px] rounded-full object-cover" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <span>{{ fullName }}</span>
                      <div class="flex gap-0.5" [attr.aria-label]="'myReviews.ratingStars' | translate">
                        <ng-container *ngFor="let star of getStarsArray(review.rating)">
                          <app-icon [icon]="ICONS.Star" />
                        </ng-container>
                      </div>
                    </div>
                  </div>

                  <!-- Review text -->
                  <div *ngIf="review.text; else noText" class="body-font-1 overflow-hidden text-ellipsis" style="display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; word-break: break-word; height: 144px;">
                    {{ review.text }}
                  </div>

                  <!-- Place info -->
                  <ng-container *ngIf="getPlaceById(review.cafeId) as cafe">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                      <div class="flex items-center gap-3">
                        <img [src]="cafe.photoUrls[0]" alt="{{ cafe.name }}" class="h-12 w-12 rounded-full object-cover" />
                        <div class="flex flex-col gap-1">
                          <div class="menu-text-font">{{ cafe.name }}</div>
                          <div class="flex items-center gap-2">
                            <app-icon [icon]="ICONS.Location" />
                            <span class="body-font-1 underline">{{ cafe.address }}</span>
                          </div>
                        </div>
                      </div>
                      <button class="button-bg-transparent flex w-full items-center gap-2 whitespace-nowrap px-4 py-2 lg:w-auto" (click)="goToCafe(cafe.id)">
                        {{ 'myReviews.goToCafe' | translate }}
                        <app-icon [icon]="ICONS.ArrowDownRightPrimary" />
                      </button>
                    </div>
                  </ng-container>

                  <ng-template #noText>
                    <div class="flex flex-1 items-center justify-center text-center">
                      <em class="text-gray-400">{{ 'myReviews.noReviewText' | translate }}</em>
                    </div>
                  </ng-template>
                </div>
              </div>
            </div>
          </div>

          <!-- Next button -->
          <button
            class="flex h-[52px] w-[52px] items-center justify-center rounded-full p-2 text-2xl transition"
            (click)="nextSlide()"
            [attr.aria-label]="'myReviews.ariaNext' | translate"
            [ngClass]="themeButtonClass"
          >
            <app-icon [icon]="'ArrowRight' | themedIcon" [width]="32" [height]="32"></app-icon>
          </button>
        </div>
      </section>

      <!-- No reviews -->
      <ng-template #noReviews>
        <div class="mt-4 w-full text-gray-500">{{ 'myReviews.noReviews' | translate }}</div>
      </ng-template>
    </div>
  `,
})
export class MyReviewsComponent implements OnInit, AfterViewInit {
  // ================== Inputs ==================
  @Input() userId!: number | null;
  @Input() userPhotoUrl: string | null = null;
  @Input() places: Place[] = [];
  @Input() badgeType: BadgeType | null = null;

  // ================== State ==================
  reviews: PublicReview[] = [];
  userFirstName: string | null = null;
  userLastName: string | null = null;

  ICONS = ICONS;
  isMobile = false;
  visibleCount = 2;

  // Carousel state
  currentSlide = 0;
  slidesToShow = 2;
  @ViewChildren('slideRef') slideRefs!: QueryList<ElementRef<HTMLDivElement>>;
  slideWidthPx = 0;
  slidesContainerWidthPx = 0;
  currentTheme$: Observable<Theme>;

  constructor(
    private authApiService: AuthApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private datePipe: DatePipe,
    private themeService: ThemeService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    this.updateViewport();
    if (!this.userId) return console.error('userId is not provided');

    // Fetch user profile and reviews
    this.authApiService.getPublicUserProfile(this.userId).subscribe({
      next: (profile) => {
        this.userFirstName = profile.firstName;
        this.userLastName = profile.lastName;
        this.reviews = (profile.reviews || []).map((review) => ({
          ...review,
          userId: this.userId!,
          userName: this.userFirstName ?? '',
          userSurname: this.userLastName ?? '',
          userPhotoUrl: this.userPhotoUrl ?? '',
        }));
        this.cdr.detectChanges();
        this.calculateSlideWidth();
      },
      error: (err) => console.error('Failed to load user profile reviews:', err),
    });
  }

  ngAfterViewInit(): void {
    this.calculateSlideWidth();
    window.addEventListener('resize', () => this.calculateSlideWidth());
  }

  // ================== Computed Properties ==================
  get fullName(): string {
    return `${this.userFirstName ?? ''} ${this.userLastName ?? ''}`.trim();
  }

  get transformStyle(): string {
    return `translateX(-${this.currentSlide * this.slideWidthPx}px)`;
  }

  get themeButtonClass(): string {
    return this.themeService.currentTheme === 'dark' ? 'bg-[var(--color-gray-100)]' : 'bg-[var(--color-white)]';
  }

  // ================== Host Listeners ==================
  @HostListener('window:resize')
  updateViewport(): void {
    const prevMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1440;
    if (prevMobile !== this.isMobile) this.cdr.detectChanges();
  }

  // ================== Methods ==================
  showMore(): void {
    if (this.visibleCount < this.reviews.length) this.visibleCount += 2;
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: rating });
  }

  formatDate(dateString: string): string | null {
    return this.datePipe.transform(dateString, 'MMM dd, yyyy');
  }

  getPlaceById(id: number): Place | undefined {
    return this.places.find((p) => p.id === id);
  }

  goToCafe(cafeId: number): void {
    this.router.navigate(['/catalog', cafeId]);
  }

  calculateSlideWidth(): void {
    const containerWidth = Math.min(window.innerWidth, 1320);
    const slideWidth = Math.min(containerWidth / this.slidesToShow - 20, 578);
    this.slideWidthPx = slideWidth + 20;
    this.slidesContainerWidthPx = (slideWidth + 20) * this.reviews.length;
    this.cdr.detectChanges();
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? Math.max(this.reviews.length - this.slidesToShow, 0) : this.currentSlide - 1;
  }

  nextSlide(): void {
    this.currentSlide = this.currentSlide >= this.reviews.length - this.slidesToShow ? 0 : this.currentSlide + 1;
  }
}
