import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon.component';
import { Review } from '../../../../../core/models/review.model';
import { BadgeType } from '../../../../../core/utils/badge-utils';
import { ICONS } from '../../../../../core/constants/icons.constant';
import { BadgeImagePipe } from '../../../../../core/pipes/badge-image.pipe';
import { FlipNumberComponent } from './flip-number.component';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IconComponent,
    BadgeImagePipe,
    FlipNumberComponent,
  ],
  providers: [DatePipe],
  template: `
    <div class="flex gap-4 px-[18px] py-[15px]">
      <!-- Ссылка на профиль пользователя с фото и бейджем -->
      <a
        [routerLink]="['/users', review.userId]"
        class="relative inline-block bg-transparent"
        style="width: 113px; height: 113px; flex-shrink: 0;"
      >
        <!-- Отображение бейджа пользователя (если есть) -->
        <img
          *ngIf="badgeType | badgeImage as badgeImg"
          [src]="badgeImg"
          alt="badge"
          class="absolute left-0 top-0 rounded-full bg-transparent"
          style="width: 113px; height: 113px; object-fit: cover; pointer-events: none;"
        />

        <!-- Фото пользователя (если есть) -->
        <img
          *ngIf="review.userPhotoUrl"
          [src]="review.userPhotoUrl"
          alt="{{ review.userName }} {{ review.userSurname }}"
          class="absolute left-1/2 top-1/2 rounded-full"
          style="
        width: 100px;
        height: 100px;
        object-fit: cover;
        transform: translate(-50%, -50%);
      "
        />
      </a>

      <!-- Блок с именем пользователя, текстом отзыва и рейтингом -->
      <div class="flex flex-col gap-2 flex-1">
        <!-- Имя и фамилия пользователя -->
        <span class="menu-text-font">
          {{ review.userName }} {{ review.userSurname }}
        </span>

        <!-- Текст отзыва -->
        <span class="body-font-1">{{ review.text }}</span>

        <!-- Отрисовка звезд рейтинга -->
        <div class="flex gap-[2px]">
          <ng-container *ngFor="let star of getStarsArray(review.rating)">
            <app-icon [icon]="ICONS.Star" />
          </ng-container>
        </div>
      </div>

      <!-- Блок справа с датой, кнопками удаления и лайка -->
      <div
        class="relative flex h-[113px] w-22 flex-shrink-0 flex-col justify-between"
      >
        <!-- Дата создания отзыва -->
        <span class="body-font-2">
          {{ formatDate(review.createdAt) }}
        </span>

        <div class="flex justify-between">
          <!-- Кнопка удаления отзыва (показывается только автору) -->
          <button
            *ngIf="currentUserId === review.userId"
            (click)="onDeleteClick()"
            class="cursor-pointer border-none bg-none"
            aria-label="Delete review"
          >
            <app-icon [icon]="ICONS.Close" />
          </button>

          <!-- Блок лайка с иконкой и анимированным счетчиком -->
         <div class="body-font-2 flex items-end gap-1 ml-auto">
            <app-flip-number [value]="roundedLikesCount"></app-flip-number>

            <button
              (click)="onToggleLike()"
              aria-label="Like review"
              class="flex cursor-pointer items-end border-none"
            >
              <app-icon [icon]="getLikeIcon()" />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .liked app-icon {
        color: red; /* или другой стиль для выделенного лайка */
      }
    `,
  ],
})
export class AppReviewItemComponent implements AfterViewInit, OnDestroy {
  @Input() review!: Review;
  @Input() badgeType: BadgeType = 'neutral';
  @Input() currentUserId: number | null = null;
  @Input() likesInfo: { likedByCurrentUser: boolean; totalLikes: number } = {
    likedByCurrentUser: false,
    totalLikes: 0,
  };
  @Input() isLoggedIn: boolean = false;

  @Output() delete = new EventEmitter<number>();
  @Output() toggleLike = new EventEmitter<boolean>();

  animatedLikesCount = 0;
  ICONS = ICONS;

  private observer!: IntersectionObserver;
  private hasAnimated = false;

  constructor(
    private datePipe: DatePipe,
    private elRef: ElementRef,
  ) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateLikesCount(this.likesInfo.totalLikes);
          this.observer.disconnect();
        }
      },
      {
        threshold: 1,
      },
    );

    this.observer.observe(this.elRef.nativeElement);
  }

  get roundedLikesCount(): number {
    return Math.round(this.animatedLikesCount);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  onToggleLike() {
    this.toggleLike.emit(!this.likesInfo.likedByCurrentUser);
  }

  onDeleteClick() {
    this.delete.emit(this.review.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    const likesChange = changes['likesInfo'];
    if (likesChange && likesChange.currentValue && likesChange.previousValue) {
      const prevLikes = likesChange.previousValue.totalLikes;
      const currLikes = likesChange.currentValue.totalLikes;

      if (prevLikes !== currLikes) {
        this.animateLikesCount(currLikes);
      }
    } else if (likesChange && likesChange.currentValue && !this.hasAnimated) {
      // Первичная анимация при появлении компонента
      this.animateLikesCount(this.likesInfo.totalLikes);
    }
  }
  formatDate(dateString: string): string | null {
    return this.datePipe.transform(dateString, 'MMM dd, yyyy');
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i + 1);
  }

  getLikeIcon() {
    if (!this.isLoggedIn) {
      return this.likesInfo.totalLikes > 0
        ? this.ICONS.LikeFill
        : this.ICONS.Like;
    }

    return this.likesInfo.likedByCurrentUser
      ? this.ICONS.LikeFill
      : this.ICONS.Like;
  }

  private animationInterval: any = null;

  animateLikesCount(target: number) {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    if (target === 0) {
      this.animatedLikesCount = 0;
      return;
    }

    const duration = 500;
    const fps = 60;
    const steps = Math.ceil((duration / 1000) * fps);
    const start = this.animatedLikesCount;
    const increment = (target - start) / steps;

    let step = 0;

    this.animationInterval = setInterval(() => {
      step++;
      this.animatedLikesCount += increment;

      if (step >= steps) {
        this.animatedLikesCount = target;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
      }
    }, 1000 / fps);
  }
}
