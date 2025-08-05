import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicReview } from '../../../core/models/review.model';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { Place } from '../../../core/models/place.model';
import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { BadgeImagePipe } from '../../../core/pipes/badge-image.pipe';
import { BadgeType } from '../../../core/utils/badge-utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BadgeImagePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="mx-auto flex w-full max-w-[1320px] flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h5>Your Reviews</h5>
        <span class="body-font-1"
          >Here’s what you’ve shared about your favorite coffee spots</span
        >
      </div>
      <div class="flex w-full items-center">
        <!-- Левая кастомная стрелка -->
        <button
          class="custom-prev custom-arrow mr-4 h-10 w-10 flex-shrink-0"
          aria-label="Previous slide"
        ></button>

        <!-- Слайдер -->
        <swiper-container
          slides-per-view="2"
          space-between="20"
          navigation="true"
          navigation-prev-el=".custom-prev"
          navigation-next-el=".custom-next"
          class="min-w-0 flex-1"
        >
          <swiper-slide *ngFor="let review of reviews">
            <div
              #reviewCard
              class="flex h-full flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-gray-20)] p-4"
            >
              <!-- ВЕРХ: фото, имя, звёзды -->
              <div class="flex items-center gap-3">
                <div
                  *ngIf="userPhotoUrl"
                  class="relative mr-2"
                  style="width: 50px; height: 50px;"
                >
                  <img
                    *ngIf="badgeType && badgeType !== 'neutral'"
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
                  <div class="flex gap-[2px]" aria-label="Rating stars">
                    <ng-container
                      *ngFor="let star of createStarsArray(review.rating)"
                    >
                      <app-icon [icon]="ICONS.Star" />
                    </ng-container>
                  </div>
                </div>
              </div>

              <!-- ЦЕНТР: текст отзыва с фиксированной высотой и обрезкой -->
              <div
                class="body-font-1 review-text"
                *ngIf="review.text; else noText"
              >
                {{ review.text }}
              </div>

              <!-- НИЗ: инфо о кафе -->
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
                        <span class="body-font-1 underline">{{
                          cafe.address
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    class="button-bg-transparent gap-2 whitespace-nowrap px-4 py-2"
                    (click)="goToCafe(cafe.id)"
                  >
                    Go to the cafe
                    <app-icon [icon]="ICONS.ArrowDownRightPrimary" />
                  </button>
                </div>
              </ng-container>

              <!-- Заглушка если нет текста -->
              <ng-template #noText>
                <div
                  class="flex flex-1 items-center justify-center text-center"
                >
                  <em class="text-gray-400">No review text provided.</em>
                </div>
              </ng-template>
            </div>
          </swiper-slide>
        </swiper-container>

        <!-- Правая кастомная стрелка -->
        <button
          class="custom-next custom-arrow ml-4 h-10 w-10 flex-shrink-0"
          aria-label="Next slide"
        ></button>
      </div>

      <ng-template [ngIf]="reviews.length === 0">
        <div class="mt-4 text-gray-500">You have not left any reviews yet.</div>
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
        width: 52px;
        height: 52px;
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

      /* Класс для текста с ограничением высоты и обрезкой */
      .review-text {
        height: 144px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        word-break: break-word;
      }

      .review-top {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .review-middle {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .review-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class MyReviewsComponent implements OnInit, AfterViewInit {
  @Input() userId!: number | null;
  @Input() userPhotoUrl: string | null = null;
  @Input() places: Place[] = [];
  @Input() badgeType: BadgeType | null = null;

  reviews: PublicReview[] = [];
  userFirstName: string | null = null;
  userLastName: string | null = null;

  ICONS = ICONS;

  private needUpdateSlideHeight = false;

  constructor(
    private authApiService: AuthApiService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authApiService.getPublicUserProfile(this.userId!).subscribe({
      next: (profile) => {
        this.reviews = profile.reviews || [];
        this.userFirstName = profile.firstName;
        this.userLastName = profile.lastName;

        this.needUpdateSlideHeight = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load user profile reviews:', err);
      },
    });
  }

  ngAfterViewChecked() {
    // Можно убрать логику с высотой, т.к. фиксируем текст
  }

  ngAfterViewInit(): void {
    // Можно оставить пустым
  }

  createStarsArray(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }

  getPlaceById(id: number): Place | undefined {
    return this.places.find((place) => place.id === id);
  }

  goToCafe(cafeId: number) {
    this.router.navigate(['/catalog', cafeId]);
  }
}
