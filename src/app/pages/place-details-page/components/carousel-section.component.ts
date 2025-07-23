import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative flex h-[550px] items-center justify-center overflow-hidden"
      (touchstart)="onTouchStart($event)"
      (touchend)="onTouchEnd($event)"
    >
      <!-- Prev button -->
      <button
        (click)="handlePrev()"
        class="absolute left-[24px] top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-[40px] bg-[var(--color-bg)] p-[10px] transition hover:scale-110"
      >
        <img src="./icons/arrow-left.svg" alt="Prev" class="h-[32px] w-[32px]" />
      </button>

      <!-- Image display -->
      <div class="relative h-full w-full">
        <div class="absolute right-[24px] top-[24px] z-10 flex gap-[16px]">
          <button
            (click)="onToggleFavorite.emit()"
            class="relative flex h-[44px] w-[44px] items-center justify-center rounded-full p-[10px] transition hover:scale-110"
            [ngClass]="{
              'bg-[var(--color-primary)]': isFavorite,
              'bg-[var(--color-bg)]': !isFavorite
            }"
            title="Add to favorites"
          >
            <img src="./icons/heart.svg" alt="Favorite" class="h-[24px] w-[24px]" />
          </button>

          <button
            (click)="onShare.emit()"
            class="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[var(--color-bg)] p-[10px] transition hover:scale-110"
            title="Share this place"
          >
            <img src="./icons/share.svg" alt="Share" class="h-[24px] w-[24px]" />
          </button>
        </div>

        <img
          *ngIf="prevImageUrl"
          [src]="prevImageUrl"
          class="animate-fade-out absolute inset-0 h-full w-full rounded-[40px] object-cover"
        />
        <img
          *ngIf="currentImageUrl"
          [src]="currentImageUrl"
          class="absolute inset-0 h-full w-full rounded-[40px] object-cover"
          [ngClass]="{ 'animate-fade-in': isAnimating }"
        />
      </div>

      <!-- Next button -->
      <button
        (click)="handleNext()"
        class="absolute right-[24px] top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-[40px] bg-[var(--color-bg)] p-[10px] transition hover:scale-110"
      >
        <img src="./icons/arrow-right.svg" alt="Next" class="h-[32px] w-[32px]" />
      </button>

      <!-- Counter -->
      <div class="button-font absolute bottom-5 right-5 rounded-[40px] bg-black/60 px-3 py-1 text-[var(--color-bg)]">
        {{ currentIndex + 1 }} / {{ photoUrls.length || 0 }}
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: scale(1.02); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fade-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.98); }
    }
    .animate-fade-in { animation: fade-in 0.6s forwards; }
    .animate-fade-out { animation: fade-out 0.6s forwards; }
  `],
})
export class CarouselSectionComponent implements OnDestroy {
  @Input() photoUrls: string[] = [];
  @Input() isFavorite = false;

  @Output() onToggleFavorite = new EventEmitter<void>();
  @Output() onShare = new EventEmitter<void>();

  currentIndex = 0;
  prevIndex: number | null = null;
  isAnimating = false;
  private touchStartX: number | null = null;
  private animationDuration = 600;

  ngOnDestroy() {
    // ничего очищать не нужно
  }

  get currentImageUrl(): string | null {
    return this.photoUrls?.[this.currentIndex] ?? null;
  }

  get prevImageUrl(): string | null {
    return this.prevIndex !== null ? this.photoUrls?.[this.prevIndex] ?? null : null;
  }

  handleNext() {
    if (!this.photoUrls?.length) return;
    const next = (this.currentIndex + 1) % this.photoUrls.length;
    this.triggerChange(next);
  }

  handlePrev() {
    if (!this.photoUrls?.length) return;
    const next = this.currentIndex === 0 ? this.photoUrls.length - 1 : this.currentIndex - 1;
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
}
