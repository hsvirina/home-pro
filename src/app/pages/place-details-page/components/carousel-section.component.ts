import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ICONS } from '../../../core/constants/icons.constant';
import { IconComponent } from '../../../shared/components/icon.component';
import { fadeInOutImage } from '../../../../styles/animations/animations';
import { Place } from '../../../core/models/place.model';
import { ThemedIconPipe } from '../../../core/pipes/themed-icon.pipe';
import { Observable } from 'rxjs';
import { Theme } from '../../../core/models/theme.type';
import { ThemeService } from '../../../core/services/theme.service';

import { SharedCafesService } from '../../../core/services/shared-cafes.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-carousel-section',
  standalone: true,
  imports: [CommonModule, IconComponent, ThemedIconPipe, TranslateModule],
  animations: [fadeInOutImage],
  template: `
    <div
      class="relative flex h-[550px] items-center justify-center overflow-hidden"
      (touchstart)="onTouchStart($event)"
      (touchend)="onTouchEnd($event)"
    >
      <!-- Previous slide button -->
      <button
        (click)="handlePrev()"
        class="absolute left-[24px] top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-[40px] p-[10px] transition"
        [ngClass]="{
          'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
          'bg-[#0D0D0D]/60': (currentTheme$ | async) === 'dark',
        }"
      >
        <app-icon
          [icon]="'ArrowLeft' | themedIcon"
          [width]="32"
          [height]="32"
        />
      </button>

      <!-- Image container -->
      <div class="relative h-full w-full">
        <!-- Action buttons (favorite and share) -->
        <div class="absolute right-[24px] top-[24px] z-10 flex gap-[16px]">
          <button
  (click)="onToggleFavorite.emit()"
  class="relative flex h-[44px] w-[44px] items-center justify-center rounded-full p-[10px] transition"
  [ngClass]="{
    'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
    'bg-[#0D0D0D]/60': (currentTheme$ | async) === 'dark'
  }"
  [title]="'carousel.addToFavorites' | translate"
>
  <app-icon
    [icon]="
      isFavorite ? ICONS.HeartBlueFill : ('HeartBlue' | themedIcon)
    "
  />
</button>

<button
  (click)="handleShare()"
  class="flex h-[44px] w-[44px] items-center justify-center rounded-full p-[10px] backdrop-blur transition"
  [title]="'carousel.shareThisPlace' | translate"
  [ngClass]="{
    'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
    'bg-[#0D0D0D]/60': (currentTheme$ | async) === 'dark'
  }"
>
  <app-icon [icon]="'Share' | themedIcon" />
</button>
        </div>

        <!-- Display current and previous images with fade animation -->
        <ng-container *ngFor="let image of imagesToRender">
          <img
            *ngIf="image"
            [@fadeInOutImage]
            [src]="image"
            class="absolute inset-0 h-full w-full rounded-[40px] object-cover"
            alt="Carousel image"
          />
        </ng-container>
      </div>

      <!-- Next slide button -->
      <button
        (click)="handleNext()"
        class="absolute right-[24px] top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-[40px] p-[10px] backdrop-blur transition"
        [ngClass]="{
          'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
          'bg-[#0D0D0D]/60': (currentTheme$ | async) === 'dark',
        }"
      >
        <app-icon
          [icon]="'ArrowRight' | themedIcon"
          [width]="32"
          [height]="32"
        />
      </button>

      <!-- Slide position indicator -->
      <div
        class="button-font absolute bottom-5 right-5 rounded-[40px] px-3 py-1 backdrop-blur"
        [ngClass]="{
          'bg-[#FFFFFF]/60': (currentTheme$ | async) === 'light',
          'bg-[#0D0D0D]/60 text-[var(--color-white)]':
            (currentTheme$ | async) === 'dark',
        }"
      >
        {{ currentIndex + 1 }} / {{ photoUrls.length || 0 }}
      </div>
    </div>
  `,
})
export class CarouselSectionComponent implements OnDestroy {
  @Input() photoUrls: string[] = [];
  @Input() isFavorite = false;
  @Input() place!: Place;

  @Output() onToggleFavorite = new EventEmitter<void>();
  @Output() onShare = new EventEmitter<void>(); // по желанию

  currentTheme$: Observable<Theme>;

  ICONS = ICONS;

  currentIndex = 0;
  prevIndex: number | null = null;
  isAnimating = false;

  private touchStartX: number | null = null;
  private readonly animationDuration = 600;

  constructor(
    private themeService: ThemeService,
    private sharedCafesService: SharedCafesService,
      private userService: AuthApiService,      // добавить сюда
  private storageService: StorageService,   // добавить сюда
  ) {
    this.currentTheme$ = this.themeService.theme$;
  }

  handleShare() {
  if (!this.place?.id) return;

  this.sharedCafesService.shareCafe(this.place.id).subscribe({
    next: () => {
      // После успешного шеринга обновляем публичный профиль
      this.userService.getPublicUserProfile(this.storageService.getUser()?.userId || 0).subscribe({
        next: (profile) => {
          this.storageService.setPublicUserProfile(profile);
          this.onShare.emit(); // если нужно уведомить родителя
        },
        error: (error) => {
          console.error('Ошибка при обновлении публичного профиля после шеринга:', error);
        },
      });
    },
    error: (error) => {
      console.error('Error sharing cafe:', error);
      // Можно обработать ошибку UI, например показать уведомление
    },
  });
}

  // Остальной код из твоего компонента без изменений...

  get currentImageUrl(): string | null {
    return this.photoUrls?.[this.currentIndex] ?? null;
  }

  get prevImageUrl(): string | null {
    return this.prevIndex !== null
      ? (this.photoUrls?.[this.prevIndex] ?? null)
      : null;
  }

  get imagesToRender(): string[] {
    if (this.isAnimating && this.prevImageUrl && this.currentImageUrl) {
      return [this.prevImageUrl, this.currentImageUrl];
    }
    return this.currentImageUrl ? [this.currentImageUrl] : [];
  }

  handleNext() {
    if (!this.photoUrls?.length) return;
    const next = (this.currentIndex + 1) % this.photoUrls.length;
    this.triggerChange(next);
  }

  handlePrev() {
    if (!this.photoUrls?.length) return;
    const next =
      this.currentIndex === 0
        ? this.photoUrls.length - 1
        : this.currentIndex - 1;
    this.triggerChange(next);
  }

  triggerChange(index: number) {
    this.prevIndex = this.currentIndex;
    this.currentIndex = index;
    this.isAnimating = true;

    setTimeout(() => {
      this.isAnimating = false;
      this.prevIndex = null;
    }, this.animationDuration);
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].clientX;
  }

  onTouchEnd(e: TouchEvent) {
    const endX = e.changedTouches[0].clientX;
    if (this.touchStartX !== null && Math.abs(this.touchStartX - endX) > 50) {
      this.touchStartX > endX ? this.handleNext() : this.handlePrev();
    }
    this.touchStartX = null;
  }

  ngOnDestroy() {}
}
