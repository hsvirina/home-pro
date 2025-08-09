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
import { ThemeService } from '../../../core/services/theme.service';
import { SharedCafesService } from '../../../core/services/shared-cafes.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Carousel component to display images with navigation and share functionality.
 * Allows users to navigate images, mark favorites, and share locations.
 */
@Component({
  selector: 'app-carousel-section',
  standalone: true,
  imports: [CommonModule, IconComponent, ThemedIconPipe, TranslateModule],
  animations: [fadeInOutImage],
  template: `
    <div
      class="relative flex h-[550px] touch-pan-y items-center justify-center overflow-hidden"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
    >
      <!-- Previous button -->
      <button
        (click)="handlePrev()"
        class="absolute left-[24px] top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full p-[10px] backdrop-blur transition"
        [ngClass]="getButtonBgClass()"
        aria-label="Previous image"
      >
        <app-icon
          [icon]="'ArrowLeft' | themedIcon"
          [width]="32"
          [height]="32"
        />
      </button>

      <!-- Carousel Images -->
      <div class="relative h-full w-full">
        <!-- Action buttons: Favorite and Share -->
        <div class="absolute right-[24px] top-[24px] z-10 flex gap-[16px]">
          <button
            (click)="onToggleFavorite.emit()"
            class="relative flex h-[44px] w-[44px] items-center justify-center rounded-full p-[10px] backdrop-blur transition"
            [ngClass]="getButtonBgClass()"
            [title]="'carousel.addToFavorites' | translate"
            aria-label="Toggle favorite"
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
            [ngClass]="getButtonBgClass()"
            [title]="'carousel.shareThisPlace' | translate"
            aria-label="Share this place"
          >
            <app-icon [icon]="'Share' | themedIcon" />
          </button>
        </div>

        <!-- Display current and previous images for smooth fade animation -->
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

      <!-- Next button -->
      <button
        (click)="handleNext()"
        class="absolute right-[24px] top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full p-[10px] backdrop-blur transition"
        [ngClass]="getButtonBgClass()"
        aria-label="Next image"
      >
        <app-icon
          [icon]="'ArrowRight' | themedIcon"
          [width]="32"
          [height]="32"
        />
      </button>

      <!-- Image position indicator -->
      <div
        class="button-font absolute bottom-5 right-5 rounded-[40px] px-3 py-1 backdrop-blur"
        [ngClass]="getIndicatorClass()"
      >
        {{ currentIndex + 1 }} / {{ photoUrls.length || 0 }}
      </div>
    </div>
  `,
})
export class CarouselSectionComponent implements OnDestroy {
  /** Array of image URLs to display in carousel */
  @Input() photoUrls: string[] = [];

  /** Whether the place is marked as favorite */
  @Input() isFavorite = false;

  /** Place object for share functionality */
  @Input() place!: Place;

  /** Event emitted when user toggles favorite */
  @Output() onToggleFavorite = new EventEmitter<void>();

  /** Event emitted when user shares the place */
  @Output() onShare = new EventEmitter<string>();

  currentIndex = 0; // Currently shown image index
  prevIndex: number | null = null; // Previously shown image index for animation
  isAnimating = false;

  ICONS = ICONS;

  private readonly animationDuration = 600; // Animation time in ms
  private touchStartX: number | null = null;
  private touchMoveX: number | null = null;

  constructor(
    private themeService: ThemeService,
    private sharedCafesService: SharedCafesService,
    private userService: AuthApiService,
    private storageService: StorageService,
  ) {}

  /** Navigate to next image, loops to start */
  handleNext(): void {
    if (!this.photoUrls.length) return;
    const next = (this.currentIndex + 1) % this.photoUrls.length;
    this.triggerChange(next);
  }

  /** Navigate to previous image, loops to end */
  handlePrev(): void {
    if (!this.photoUrls.length) return;
    const prev =
      this.currentIndex === 0
        ? this.photoUrls.length - 1
        : this.currentIndex - 1;
    this.triggerChange(prev);
  }

  /** Trigger image change with animation */
  private triggerChange(index: number): void {
    this.prevIndex = this.currentIndex;
    this.currentIndex = index;
    this.isAnimating = true;

    setTimeout(() => {
      this.isAnimating = false;
      this.prevIndex = null;
    }, this.animationDuration);
  }

  /** Images to render for animation: previous + current or current only */
  get imagesToRender(): string[] {
    if (this.isAnimating && this.prevImageUrl && this.currentImageUrl) {
      return [this.prevImageUrl, this.currentImageUrl];
    }
    return this.currentImageUrl ? [this.currentImageUrl] : [];
  }

  /** Current image URL */
  get currentImageUrl(): string | null {
    return this.photoUrls?.[this.currentIndex] ?? null;
  }

  /** Previous image URL */
  get prevImageUrl(): string | null {
    return this.prevIndex !== null
      ? (this.photoUrls?.[this.prevIndex] ?? null)
      : null;
  }

  // Touch event handlers for swipe gestures
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchMoveX = event.touches[0].clientX;
  }

  onTouchEnd(): void {
    if (this.touchStartX !== null && this.touchMoveX !== null) {
      const diff = this.touchStartX - this.touchMoveX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.handleNext() : this.handlePrev();
      }
    }
    this.touchStartX = null;
    this.touchMoveX = null;
  }

  /**
   * Handle share button click:
   * Calls share API, refreshes user profile, then emits onShare event.
   */
  handleShare(): void {
    const shareUrl = `${window.location.origin}/home-pro/catalog/${this.place.id}`;

    if (!this.storageService.isAuthenticated()) {
      this.onShare.emit(shareUrl); // передаём строку, чтобы тип совпадал
      return;
    }

    if (!this.place?.id) return;

    this.sharedCafesService.shareCafe(this.place.id).subscribe({
      next: () => {
        const userId = this.storageService.getUser()?.userId || 0;
        this.userService.getPublicUserProfile(userId).subscribe({
          next: (profile) => {
            this.storageService.setPublicUserProfile(profile);
            this.onShare.emit(shareUrl);
          },
          error: (err) => {
            console.error('Error updating public profile:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error sharing cafe:', err);
      },
    });
  }
  /** Returns button background classes depending on theme */
  getButtonBgClass(): Record<string, boolean> {
    return {
      'bg-[#FFFFFF]/60': this.themeService.currentTheme === 'light',
      'bg-[#0D0D0D]/60': this.themeService.currentTheme === 'dark',
    };
  }

  /** Returns indicator background and text classes depending on theme */
  getIndicatorClass(): Record<string, boolean> {
    return {
      'bg-[#FFFFFF]/60': this.themeService.currentTheme === 'light',
      'bg-[#0D0D0D]/60 text-[var(--color-white)]':
        this.themeService.currentTheme === 'dark',
    };
  }

  ngOnDestroy(): void {
    // Cleanup method, no subscriptions to clean up currently, but kept for future use
  }
}
