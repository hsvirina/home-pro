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

@Component({
  selector: 'app-carousel-section',
  standalone: true,
  imports: [CommonModule, IconComponent],
  animations: [fadeInOutImage],
  template: `
    <div
      class="relative flex h-[550px] items-center justify-center overflow-hidden"
      (touchstart)="onTouchStart($event)"
      (touchend)="onTouchEnd($event)"
    >
      <!-- Previous image button -->
      <button
        (click)="handlePrev()"
        class="absolute left-[24px] top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-[40px] bg-[var(--color-bg)] p-[10px] transition hover:scale-110"
      >
        <app-icon [icon]="ICONS.ArrowLeft" class="h-[32px] w-[32px]" />
      </button>

      <!-- Image display -->
      <div class="relative h-full w-full">
        <!-- Top right action buttons -->
        <div class="absolute right-[24px] top-[24px] z-10 flex gap-[16px]">
          <button
            (click)="onToggleFavorite.emit()"
            class="relative flex h-[44px] w-[44px] items-center justify-center rounded-full p-[10px] transition hover:scale-110"
            [ngClass]="{
              'button-bg-blue': isFavorite,
              'bg-[var(--color-bg)] text-[var(--color-gray-80)]': !isFavorite
            }"
            title="Add to favorites"
          >
            <app-icon [icon]="ICONS.Heart" />
          </button>

          <button
            (click)="onShare.emit()"
            class="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[var(--color-bg)] p-[10px] transition hover:scale-110"
            title="Share this place"
          >
            <app-icon [icon]="ICONS.Share" />
          </button>
        </div>

        <!-- Image container with animation -->
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

      <!-- Next image button -->
      <button
        (click)="handleNext()"
        class="absolute right-[24px] top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-[40px] bg-[var(--color-bg)] p-[10px] transition hover:scale-110"
      >
        <app-icon [icon]="ICONS.ArrowRight" class="h-[32px] w-[32px]" />
      </button>

      <!-- Slide counter -->
      <div
        class="button-font absolute bottom-5 right-5 rounded-[40px] bg-black/60 px-3 py-1 text-[var(--color-bg)]"
      >
        {{ currentIndex + 1 }} / {{ photoUrls.length || 0 }}
      </div>
    </div>
  `,
})
export class CarouselSectionComponent implements OnDestroy {
  @Input() photoUrls: string[] = [];
  @Input() isFavorite = false;

  @Output() onToggleFavorite = new EventEmitter<void>();
  @Output() onShare = new EventEmitter<void>();

  ICONS = ICONS;

  currentIndex = 0;
  prevIndex: number | null = null;
  isAnimating = false;

  private touchStartX: number | null = null;
  private readonly animationDuration = 600;

  // Returns the current image for display
  get currentImageUrl(): string | null {
    return this.photoUrls?.[this.currentIndex] ?? null;
  }

  // Returns the previously displayed image (used for fade-out)
  get prevImageUrl(): string | null {
    return this.prevIndex !== null
      ? this.photoUrls?.[this.prevIndex] ?? null
      : null;
  }

  // Returns the images to be rendered based on animation state
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

  // Changes the slide with animation
  triggerChange(index: number) {
    this.prevIndex = this.currentIndex;
    this.currentIndex = index;
    this.isAnimating = true;

    setTimeout(() => {
      this.isAnimating = false;
      this.prevIndex = null;
    }, this.animationDuration);
  }

  // Touch support for swipe navigation
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

  // No cleanup needed for this component
  ngOnDestroy() {}
}
